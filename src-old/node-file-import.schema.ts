export interface NodeFileImportVar {
    name: string;
    isDefault: boolean;
}

export interface NodeFileImport {
    vars: NodeFileImportVar[];
    source: string;
}
