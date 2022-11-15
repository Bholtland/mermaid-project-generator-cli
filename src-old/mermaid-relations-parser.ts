import regexMap from "../src/regex-map";
import relationsMapper, { Relation } from "../src/relations-mapper";

export class MermaidRelationsParser {
    constructor(private mmdFile: string) {}

    getRelations(): Relation[] {
        // Transform to objects structure instead of arrays
        const relationMatches = [
            ...this.mmdFile.matchAll(regexMap.objectRelations),
        ];

        return relationMatches.map((regexResult) => {
            return relationsMapper(regexResult);
        });
    }
}
