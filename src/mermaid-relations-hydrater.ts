import * as lodash from "lodash";
import { Relation } from "./helpers/relations-mapper";
import { MermaidParserObjectPlainTree } from "./mermaid-object-parser";
import {
    MermaidParserObject,
    MermaidParserObjectTree,
} from "./nest-object.schema";

export class MermaidRelationsHydrater {
    constructor(
        private mermaidParserObjectPlainTree: MermaidParserObjectPlainTree,
        private relations: Relation[]
    ) {}

    hydrate() {
        const mermaidParserObjectTree: MermaidParserObjectPlainTree =
            this.mermaidParserObjectPlainTree;

        for (const mermaidObjectKey of Object.keys(mermaidParserObjectTree)) {
            const mermaidObject = mermaidParserObjectTree[mermaidObjectKey];
            const primaryRelations = this.relations.filter(
                (relation) =>
                    relation.primarySideName === mermaidObject.name.default
            );

            const sortedRelations = lodash.groupBy(primaryRelations, "type");

            mermaidObject.superClasses = sortedRelations["inheritance"]?.map(
                (relation) => mermaidParserObjectTree[relation.foreignSideName]
            ) as MermaidParserObject[];

            mermaidObject.realizedFromInterfaces = sortedRelations[
                "realization"
            ]?.map(
                (relation) => mermaidParserObjectTree[relation.foreignSideName]
            ) as MermaidParserObject[];

            mermaidObject.primaryDependencies = sortedRelations[
                "dependency"
            ]?.map(
                (relation) => mermaidParserObjectTree[relation.foreignSideName]
            ) as MermaidParserObject[];
        }

        for (const mermaidObjectKey of Object.keys(mermaidParserObjectTree)) {
            const mermaidObject = mermaidParserObjectTree[mermaidObjectKey];

            const findInheritedDependencies = (
                object: MermaidParserObject
            ): MermaidParserObject[] => {
                const dependencies = object.primaryDependencies || [];
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

            mermaidObject.foreignDependencies = mermaidObject?.superClasses
                ?.length
                ? mermaidObject.superClasses.flatMap(
                      (superClass) =>
                          findInheritedDependencies(superClass) || []
                  )
                : [];
        }

        return mermaidParserObjectTree as MermaidParserObjectTree;
    }
}
