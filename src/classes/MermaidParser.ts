import regexMap from "../regex-map";
import {MermaidParserObjectPlain, MermaidParserObjectPlainTree} from "../../src-old/mermaid-object-parser";
import visibilityMapper from "../visibility-mapper";
import {toKebabCase} from "../to-kebab-case";
import {toCamelCase} from "../to-camel-case";
import objectTypeMapper from "../object-type-mapper";
import {getObjectPurpose} from "../get-object-purpose";
import relationsMapper from "../relations-mapper";
import MermaidObject from "./MermaidObject";
import {DepGraph} from 'dependency-graph'
import MermaidDoc from "./MermaidDoc";
import {Property} from "../types/property";
import {Method} from "../types/method";

export class MermaidParser {
  objects: {[key: string]: MermaidObject}

  constructor(
    private mmdFile: string
  ) {}


  private parseObjects() {}
  private parseModules() {}

  public parse() {

    const objectMatches = [...this.mmdFile.matchAll(regexMap.objects)];

    const mermaidObjectTree: MermaidParserObjectPlainTree =
      objectMatches.reduce((masterObject, object) => {
        const parts = [...object[0].matchAll(regexMap.objectParts)];

        const propertyMatches = [
          ...parts[0][7].matchAll(regexMap.members),
        ];

        const properties: Property[] = [];
        const methods: Method[] = [];

        for (let propertyMatch of propertyMatches) {
          if (propertyMatch[3]) {
            const args = [
              ...(propertyMatch[4]?.matchAll(
                regexMap.methodArgs
              ) || []),
            ];

            methods.push({
              name: propertyMatch[2],
              type: propertyMatch[6],
              visibility: visibilityMapper(
                propertyMatch[1] as string | undefined
              ),
              arguments: args.length
                ? args.map((arg) => {
                  return {
                    name: arg[1],
                    type: arg[2],
                  };
                })
                : undefined,
              generics: undefined,
            });
          } else {
            properties.push({
              name: propertyMatch[2],
              type: propertyMatch[6],
              visibility: visibilityMapper(
                propertyMatch[1] as string | undefined
              ),
            });
          }
        }

        const genericMatches = [
          ...(parts[0][2]?.matchAll(regexMap.objectGenerics) || []),
        ];


        const kebabObjectName = toKebabCase(parts[0][1]);
        const camelObjectName = toCamelCase(parts[0][1]);
        const pascalCaseName = parts[0][1]

        const plainObject: MermaidParserObjectPlain = {
          name: {
            default: pascalCaseName,
            kebab: kebabObjectName,
            pascalCase: pascalCaseName,
            camelCase: camelObjectName,
          },
          properties: properties,
          methods: methods,
          relations: [],
          type: objectTypeMapper(parts[0][6]),
          genericTypes: genericMatches.length
            ? genericMatches.map((generic) => generic[0])
            : undefined,
          purpose: getObjectPurpose(parts[0][1]),
        };

        return {
          ...masterObject,
          [pascalCaseName]: plainObject,
        };
      }, {});

    // Transform to objects structure instead of arrays
    const relationMatches = [
      ...this.mmdFile.matchAll(regexMap.objectRelations),
    ];

    for (let regexResult of relationMatches) {
      const mappedRelation = relationsMapper(regexResult);
      mermaidObjectTree[mappedRelation.primarySideName].relations.push(mappedRelation)
    }

    const dependencyGraph = new DepGraph()
    for (let object of Object.values(mermaidObjectTree)) {
      dependencyGraph.addNode(object.name.default, object)
    }

    for (let object of Object.values(mermaidObjectTree)) {
      if (!object.relations) {
        continue
      }

      for (let relation of object.relations) {
        dependencyGraph.addDependency(object.name.default, relation.foreignSideName)
      }
    }

    const graphOrder = dependencyGraph.overallOrder()

    const findInheritedDependencies = (
      object: MermaidObject
    ): MermaidObject[] => {
      const dependencies = object.primaryDependencies;
      if (object?.superClasses) {
        const inheritedDependencies = object.superClasses.flatMap(
          (superClass) => findInheritedDependencies(superClass)
        );
        if (inheritedDependencies) {
          return dependencies.concat(inheritedDependencies);
        }
      }
      return dependencies;
    };

    const mermaidDocData = graphOrder.reduce((masterObject, key): {[key: string]: MermaidObject}=> {
      const object = dependencyGraph.getNodeData(key) as MermaidParserObjectPlain

      const relations: {
        realizedFromInterfaces: MermaidObject[] ,
        superClasses: MermaidObject[],
        primaryDependencies: MermaidObject[],
        foreignDependencies: MermaidObject[]} = {realizedFromInterfaces: [], superClasses: [], primaryDependencies: [], foreignDependencies: []}

      for (let relation of object.relations) {
        const depObject = masterObject[relation.foreignSideName] as MermaidObject

        if (['realization'].includes(relation.type)) {
          relations.realizedFromInterfaces.push(depObject)
        }

        if (['inheritance'].includes(relation.type)) {
          relations.superClasses.push(depObject)
        }

        if (['dependency'].includes(relation.type)) {
          relations.primaryDependencies.push(depObject)
        }
      }

      if (relations.superClasses?.length) {
        relations.foreignDependencies = relations.superClasses.map(superClass => findInheritedDependencies(superClass)).flat()
      }

      masterObject[key] = new MermaidObject({
        ...object,
        relations: undefined,
        ...relations
      })

      return masterObject
    }, {})

    return new MermaidDoc(mermaidDocData)
  }

}
