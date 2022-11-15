import {
    MermaidNestObject,
    MermaidParserObjectTree,
} from "./nest-object.schema";
import { NodeFileImport } from "./node-file-import.schema";

export class MermaidNestObjectConverter {
    convert(mermaidParserObjectTree: MermaidParserObjectTree) {
        const nestObjectTree = mermaidParserObjectTree;

        for (const key of Object.keys(nestObjectTree)) {
            let nestObject = nestObjectTree[key];

            const nestImports: NodeFileImport = {
                source: "@nestjs/common",
                vars: [{ isDefault: false, name: "Injectable" }],
            };
            const relationImports: NodeFileImport[] = [
                ...nestObject.foreignDependencies,
                ...nestObject.primaryDependencies,
                ...(nestObject.realizedFromInterfaces || []),
                ...(nestObject.superClasses || []),
            ].map((relation) => {
                const sameModule =
                    nestObject.module?.name.default ===
                    relation.module?.name.default;

                const fileString = `${relation.name.kebab}/${relation.name.kebab}.ts`;
                const moduleString = sameModule
                    ? "../"
                    : `../../${relation.module?.name.kebab}/`;

                return {
                    source: relation.name.kebab,
                    vars: [
                        { isDefault: false, name: moduleString + fileString },
                    ],
                };
            });

            nestObjectTree[key] = {
                ...nestObject,
                scope: "DEFAULT",
                fileImports: [...relationImports, nestImports],
            } as MermaidNestObject;
        }
    }
}
