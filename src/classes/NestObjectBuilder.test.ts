import CodeBlockWriter from "code-block-writer";
import MermaidDoc from "./MermaidDoc";
import NestObjectBuilder from "./NestObjectBuilder";

describe("", () => {
  it("Should build a nest object from a MermaidObject", async () => {
    const mermaidDoc = new MermaidDoc({
      Dog: {
        name: {
          default: "Dog",
          kebab: "dog",
          pascalCase: "Dog",
          camelCase: "dog",
        },
        type: "class",
        genericTypes: [],
        primaryDependencies: [
          {
            name: {
              default: "Barn",
              kebab: "barn",
              pascalCase: "Barn",
              camelCase: "barn",
            },
            type: "class",
            genericTypes: [],
            primaryDependencies: [],
            foreignDependencies: [],
            properties: [],
            module: "main",
            methods: [
              {
                name: "stackHay",
                type: "HayStack",
                visibility: "public",
                arguments: [
                  {
                    name: "hay",
                    type: "string",
                  },
                ],
                generics: undefined,
              },
            ],
            objectPurpose: "interface",
            superClasses: [],
            realizedFromInterfaces: [
              {
                name: {
                  default: "IHouse",
                  kebab: "ihouse",
                  pascalCase: "IHouse",
                  camelCase: "ihouse",
                },
                type: "interface",
                genericTypes: [],
                primaryDependencies: [],
                foreignDependencies: [],
                properties: [],
                methods: [
                  {
                    name: "live",
                    type: "void",
                    visibility: "public",
                    arguments: undefined,
                    generics: undefined,
                  },
                ],
                objectPurpose: "interface",
                superClasses: [],
                realizedFromInterfaces: [],
                module: "main",
              },
            ],
          },
        ],
        foreignDependencies: [],
        properties: [],
        methods: [
          {
            name: "bark",
            type: "string",
            visibility: "public",
            arguments: undefined,
            generics: undefined,
          },
          {
            name: "feed",
            type: "void",
            visibility: "public",
            arguments: undefined,
            generics: undefined,
          },
        ],
        superClasses: [
          {
            name: {
              default: "Animal",
              kebab: "animal",
              pascalCase: "Animal",
              camelCase: "animal",
            },
            type: "abstract class",
            genericTypes: [],
            primaryDependencies: [],
            foreignDependencies: [],
            objectPurpose: "service",
            module: "main",
            properties: [
              {
                name: "name",
                type: "string",
                visibility: "private",
              },
            ],
            methods: [
              {
                name: "getName",
                type: "string",
                visibility: "public",
                arguments: undefined,
                generics: undefined,
              },
              {
                name: "pet",
                type: "class",
                visibility: "public",
                arguments: [
                  {
                    name: "food",
                    type: "string",
                  },
                ],
                generics: undefined,
              },
            ],
            superClasses: [],
            realizedFromInterfaces: [
              {
                name: {
                  default: "IAnimal",
                  kebab: "ianimal",
                  pascalCase: "IAnimal",
                  camelCase: "ianimal",
                },
                type: "interface",
                genericTypes: [],
                primaryDependencies: [],
                foreignDependencies: [],
                properties: [],
                methods: [
                  {
                    name: "getName",
                    type: "string",
                    visibility: "public",
                    arguments: undefined,
                    generics: undefined,
                  },
                  {
                    name: "pet",
                    type: "void",
                    visibility: "public",
                    arguments: [
                      {
                        name: "food",
                        type: "string",
                      },
                    ],
                    generics: undefined,
                  },
                ],
                objectPurpose: "service",
                module: "main",
                superClasses: [],
                realizedFromInterfaces: [],
              },
            ],
          },
        ],
        realizedFromInterfaces: [],
        module: "main",
        objectPurpose: "service",
      },
    });

    const nestObjectBuilder = new NestObjectBuilder(mermaidDoc.classes["Dog"], new CodeBlockWriter());

    const nestObject = nestObjectBuilder.build();

    expect(nestObject).toBeDefined();
  });
});
