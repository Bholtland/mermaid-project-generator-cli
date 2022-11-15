import { FileReader } from "./file-reader";
import { MermaidObjectParser } from "./mermaid-object-parser";
import { MermaidRelationsHydrater } from "./mermaid-relations-hydrater";
import { MermaidRelationsParser } from "./mermaid-relations-parser";
import { MermaidParserModule, MermaidParserObject } from "./nest-object.schema";

type MermaidParserType = {
    objects: MermaidParserObject[];
    modules: MermaidParserModule[];
};

export class MermaidParser {
    constructor(
        private mermaidObjectParser: typeof MermaidObjectParser,
        private mermaidRelationsParser: typeof MermaidRelationsParser,
        private fileReader: FileReader
    ) {}

    private hydrateRelations() {}
    private parseObjects() {}
    private parseModules() {}

    public async parse() {
        const mmdFile = await this.fileReader.readFile("mmdTest.mmd");

        const mermaidObjectParser = new this.mermaidObjectParser(mmdFile);
        const mermaidRelationsParser = new this.mermaidRelationsParser(mmdFile);

        const objectTree = mermaidObjectParser.getObjects();
        const relations = mermaidRelationsParser.getRelations();

        const mermaidRelationsHydrater = new MermaidRelationsHydrater(
            objectTree,
            relations
        );

        return mermaidRelationsHydrater.hydrate();
    }
}
