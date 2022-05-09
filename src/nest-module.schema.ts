import { Name } from "./name.schema";
import { NodeFileImport } from "./node-file-import.schema";
import { MermaidNestObject } from "./nest-object.schema";

export interface MermaidNestModule {
    name: Name;
    imports: MermaidNestObject[];
    exports: MermaidNestObject[];
    providers: MermaidNestObject[];
    fileImports: NodeFileImport[];
}
