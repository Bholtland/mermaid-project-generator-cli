import { FileReader } from "./file-reader";
import { MermaidObjectParser } from "./mermaid-object-parser";
import { MermaidParser } from "./mermaid-parser";
import { MermaidRelationsParser } from "./mermaid-relations-parser";

const main = async () => {
    const mermaidParser = new MermaidParser(
        MermaidObjectParser,
        MermaidRelationsParser,
        new FileReader()
    );

    const mermaidTree = await mermaidParser.parse();
    return mermaidTree;
};

(async () => await main())();
