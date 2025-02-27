import CodeBlockWriter from "code-block-writer";
import * as _ from "lodash";
import { toCamelCase } from "../to-camel-case";
import MermaidObject from "./MermaidObject";
import { MermaidNestObject } from "../../src-old/nest-object.schema";
import { CacheComputed } from "../cache-computed.decorator";

export interface NodeFileImportVar {
  name: string;
  isDefault: boolean;
}

export interface NodeFileImport {
  vars: NodeFileImportVar[];
  source: string;
}

export default class NestObjectBuilder {
  constructor(private mermaidObject: MermaidObject, private writer: CodeBlockWriter) {}

  get isInterface() {
    return this.mermaidObject.type === "interface";
  }

  private get importsStrings() {
    const nestImports: NodeFileImport = {
      source: "@nestjs/common",
      vars: [{ isDefault: false, name: "Injectable" }],
    };

    const relationImports: NodeFileImport[] = [
      ...this.mermaidObject.foreignDependencies,
      ...this.mermaidObject.primaryDependencies,
      ...(this.mermaidObject.realizedFromInterfaces || []),
      ...(this.mermaidObject.superClasses || []),
    ].map((relation) => {
      // const sameModule =
      //   this.mermaidObject.module?.name.default ===
      //   relation.module?.name.default;

      const fileString = `${relation.name.kebab}/${relation.name.kebab}.ts`;
      const moduleString =
        // sameModule        ?
        "../";
      // : `../../${relation.module?.name.kebab}/`;

      return {
        source: moduleString + fileString,
        vars: [{ isDefault: false, name: relation.name.default }],
      };
    });

    const fileImports = [...relationImports, nestImports];

    return fileImports.map((fileImport) => {
      const partition = _.partition(fileImport.vars, "isDefault");
      const format = partition.map((part) => part.map((par) => par.name));

      const defaultString = format[0].length ? format[0] : undefined;
      const nonDefaultString = format[1].length ? `{${format[1].join(",")}}` : undefined;

      return `import ${[defaultString, nonDefaultString].filter((i) => i).join()} from '${fileImport.source}'`;
    });
  }

  // Returns a string of class decorators, usually '@Inject'
  private get classDecoratorString() {
    if (!this.isInterface) {
      return `@Injectable(${
        // this.mermaidObject.scope
        //   ? `{scope: Scope.${this.mermaidObject.scope}}`
        //   : ""
        ""
      })`;
    }

    return null;
  }

  // Returns a string for the object definition, like: export abstract class Animal implements IAnimal
  private get objectDefinitionString() {
    let inheritanceString = "";

    if (this.mermaidObject.superClasses?.length) {
      const superClassConcat = this.mermaidObject.superClasses.reduce<string>((acc, val) => {
        if (acc === "") {
          acc += `${val.name.default}`;
        } else {
          acc += `,${val.name.default}`;
        }
        return acc;
      }, "");

      inheritanceString += ` extends ${superClassConcat}`;
    }
    if (this.mermaidObject.realizedFromInterfaces?.length) {
      inheritanceString += ` implements ${this.mermaidObject.realizedFromInterfaces
        .map((realization) => realization.name.default)
        .join(",")}`;
    }

    // REQUIREMENTS: Super class and realizationInterface
    return `export ${this.mermaidObject.type} ${this.mermaidObject.name.default}${inheritanceString}`;
  }

  // Returns all properties as strings, like private name: string
  private get objectPropertiesStrings() {
    if (this.mermaidObject.properties?.length) {
      return this.mermaidObject.properties.map((property) => {
        return `${`${property.visibility} ` || ""}${property.name}: ${property.type}`;
      });
    }
    return null;
  }

  // Returns constructor if present and corresponding arguments / super call.
  private get constructorString() {
    const constructorArgumentsString = [
      ...(this.mermaidObject.foreignDependencies || []),
      ...(this.mermaidObject.primaryDependencies || []),
    ].reduce((accumulator, relation) => {
      if (accumulator) {
        return (accumulator += `, protected readonly ${toCamelCase(relation.name.default)}: ${relation.name.default}`);
      }
      return `protected readonly ${toCamelCase(relation.name.default)}: ${relation.name.default}`;
    }, "");

    // REQUIREMENTS: Primary dependencies & Foreign dependencies

    if (!this.isInterface) {
      return `constructor(${constructorArgumentsString})`;
    }

    return null;
  }

  private get constructorSuperString() {
    // REQUIREMENTS: Foreign dependencies

    if (this.mermaidObject.foreignDependencies?.length) {
      return this.mermaidObject.foreignDependencies.map((dependency) => toCamelCase(dependency.name.default)).join(",");
    }
    return null;
  }

  // Returns all methods as strings
  private get methodsStrings() {
    return (
      this.mermaidObject.methods?.map((method) => {
        const visibility = !this.isInterface && method.visibility ? `${method.visibility} ` : "";

        const methodArguments =
          method.arguments?.reduce((accumulator, argument) => {
            if (accumulator) {
              return (accumulator += `, ${argument.name}: ${argument.type}`);
            }
            return `${argument.name}: ${argument.type}`;
          }, "") || "";

        return `${visibility}${method.name}(${methodArguments})${method.type ? `: ${method.type}` : ""}`;
      }) || null
    );
  }

  public build() {
    this.importsStrings.map((importsString) => {
      return this.writer.writeLine(importsString);
    });

    if (this.importsStrings.length) {
      this.writer.blankLine();
    }

    this.classDecoratorString && this.writer.writeLine(this.classDecoratorString);

    this.writer.write(this.objectDefinitionString).block(() => {
      if (this.objectPropertiesStrings?.length) {
        for (const propertyString of this.objectPropertiesStrings) {
          this.writer.writeLine(propertyString);
          this.writer.blankLine();
        }
      }

      if (this.constructorString) {
        const writerConstructorString = this.writer.write(this.constructorString);

        if (this.constructorSuperString) {
          writerConstructorString.block(() => {
            this.writer.writeLine(`super(${this.constructorSuperString})`);
          });
        } else {
          writerConstructorString.inlineBlock();
        }
        this.writer.blankLine();
      }

      if (this.methodsStrings?.length) {
        for (const methodString of this.methodsStrings) {
          const writerMethodsString = this.writer.write(methodString);

          if (!this.isInterface) {
            writerMethodsString.block(() => {
              this.writer.writeLine("throw new Error('Method not yet implemented.')");
            });
          }
          this.writer.blankLine();
        }
      }
    });

    return this.writer.toString();
  }
}
