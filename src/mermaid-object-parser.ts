import { getObjectPurpose } from "./helpers/get-object-purpose";
import objectTypeMapper from "./helpers/object-type-mapper";
import regexMap from "./helpers/regex-map";
import { toCamelCase } from "./helpers/to-camel-case";
import { toKebabCase } from "./helpers/to-kebab-case";
import visibilityMapper from "./helpers/visibility-mapper";
import { Method } from "./method.schema";
import { Name } from "./name.schema";
import { MermaidParserModule, MermaidParserObject } from "./nest-object.schema";
import { Property } from "./property.schema";
import { ObjectPurpose } from "./types/object-purpose";

export interface MermaidParserObjectPlain {
    name: Name;
    type: "class" | "abstract class" | "interface";
    purpose: ObjectPurpose;
    superClasses?: string[] | MermaidParserObject[];
    realizedFromInterfaces?: string[] | MermaidParserObject[];
    module?: string | MermaidParserModule;
    genericTypes?: string[];
    primaryDependencies?: string[] | MermaidParserObject[];
    foreignDependencies?: string[] | MermaidParserObject[];
    properties: Property[];
    methods: Method[];
}

export interface MermaidParserObjectPlainTree {
    [key: string]: MermaidParserObjectPlain;
}

export class MermaidObjectParser {
    constructor(private mmdFile: string) {}

    getObjects() {
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

                const plainObject: MermaidParserObjectPlain = {
                    name: {
                        default: parts[0][1],
                        kebab: kebabObjectName,
                        pascalCase: parts[0][1],
                        camelCase: camelObjectName,
                    },
                    module: parts[0][4],
                    properties: properties,
                    methods: methods,
                    type: objectTypeMapper(parts[0][6]),
                    genericTypes: genericMatches.length
                        ? genericMatches.map((generic) => generic[0])
                        : undefined,
                    purpose: getObjectPurpose(parts[0][1]),
                };

                return {
                    ...masterObject,
                    [parts[0][1]]: plainObject,
                };
            }, {});

        return mermaidObjectTree;
    }
}
