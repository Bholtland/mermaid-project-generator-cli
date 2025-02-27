import { MermaidNestObject } from "./nest-object.schema";
import CodeBlockWriter from "code-block-writer";
import lodash from "lodash";
import { toCamelCase } from "../src/to-camel-case";
import { IMermaidObjectBuilder } from "./mermaid-object-builder.class";

export class MermaidNestObjectBuilder implements IMermaidObjectBuilder {
    constructor(
        private mermaidNestObject: MermaidNestObject,
        private writer: CodeBlockWriter
    ) {}

    get isInterface() {
        return this.mermaidNestObject.type === "interface";
    }

    @CacheComputed()
    private get importsStrings() {
        return this.mermaidNestObject.fileImports.map((fileImport) => {
            const partition = lodash.partition(fileImport.vars, "isDefault");
            const defaultString = partition[0].length && partition[0];
            const nonDefaultString =
                partition[1].length && `{${partition[1].join(",")}}`;

            return `import ${[defaultString, nonDefaultString].join()} from ${
                fileImport.source
            }`;
        });
    }

    // Returns a string of class decorators, usually '@Inject'
    @CacheComputed()
    private get classDecoratorString() {
        if (!this.isInterface) {
            return `@Injectable(${
                this.mermaidNestObject.scope
                    ? `{scope: Scope.${this.mermaidNestObject.scope}}`
                    : ""
            })`;
        }

        return null;
    }

    // Returns a string for the object definition, like: export abstract class Animal implements IAnimal
    @CacheComputed()
    private get objectDefinitionString() {
        let inheritanceString = "";

        if (this.mermaidNestObject.superClass) {
            inheritanceString += ` extends ${this.mermaidNestObject.superClass.name}`;
        }
        if (this.mermaidNestObject.realizedFromInterfaces?.length) {
            inheritanceString += ` implements ${this.mermaidNestObject.realizedFromInterfaces
                .map((realization) => realization.name.default)
                .join(",")}`;
        }

        // REQUIREMENTS: Super class and realizationInterface
        return `export ${this.mermaidNestObject.type} ${this.mermaidNestObject.name.default}${inheritanceString}`;
    }

    // Returns all properties as strings, like private name: string
    @CacheComputed()
    private get objectPropertiesStrings() {
        if (this.mermaidNestObject.properties?.length) {
            return this.mermaidNestObject.properties.map((property) => {
                return `${`${property.visibility} ` || ""}${property.name}: ${
                    property.type
                }`;
            });
        }
        return null;
    }

    // Returns constructor if present and corresponding arguments / super call.
    @CacheComputed()
    private get constructorString() {
        const constructorArgumentsString = [
            ...(this.mermaidNestObject.foreignDependencies || []),
            ...(this.mermaidNestObject.primaryDependencies || []),
        ].reduce((accumulator, relation) => {
            if (accumulator) {
                return (accumulator += `, protected readonly ${toCamelCase(
                    relation.name.default
                )}: ${relation.name.default}`);
            }
            return `protected readonly ${toCamelCase(relation.name.default)}: ${
                relation.name.default
            }`;
        }, "");

        // REQUIREMENTS: Primary dependencies & Foreign dependencies

        if (!this.isInterface) {
            return `constructor(${constructorArgumentsString})`;
        }

        return null;
    }

    @CacheComputed()
    private get constructorSuperString() {
        // REQUIREMENTS: Foreign dependencies

        if (this.mermaidNestObject.foreignDependencies?.length) {
            return this.mermaidNestObject.foreignDependencies
                .map((dependency) => toCamelCase(dependency.name.default))
                .join(",");
        }
        return null;
    }

    // Returns all methods as strings
    @CacheComputed()
    private get methodsStrings() {
        return (
            this.mermaidNestObject.methods?.map((method) => {
                const visibility =
                    !this.isInterface && method.visibility
                        ? `${method.visibility} `
                        : "";

                const methodArguments =
                    method.arguments?.reduce((accumulator, argument) => {
                        if (accumulator) {
                            return (accumulator += `, ${argument.name}: ${argument.type}`);
                        }
                        return `${argument.name}: ${argument.type}`;
                    }, "") || "";

                return `${visibility}${method.name}(${methodArguments})${
                    method.type ? `: ${method.type}` : ""
                }`;
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

        this.classDecoratorString &&
            this.writer.writeLine(this.classDecoratorString);

        this.writer.write(this.objectDefinitionString).block(() => {
            if (this.objectPropertiesStrings?.length) {
                for (const propertyString of this.objectPropertiesStrings) {
                    this.writer.writeLine(propertyString);
                    this.writer.blankLine();
                }
            }

            if (this.constructorString) {
                const writerConstructorString = this.writer.write(
                    this.constructorString
                );

                if (this.constructorSuperString) {
                    writerConstructorString.block(() => {
                        this.writer.writeLine(
                            `super(${this.constructorSuperString})`
                        );
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
                            this.writer.writeLine(
                                "throw new Error('Method not yet implemented.')"
                            );
                        });
                    }
                    this.writer.blankLine();
                }
            }
        });

        return this.writer.toString();
    }
}
