import { Name } from "./name.schema";
import { MermaidNestModule } from "./nest-module.schema";
import { NodeFileImport } from "./node-file-import.schema";
import { Property } from "./property.schema";
import { Method } from "./method.schema";
import { ObjectPurpose } from "./types/object-purpose";

export interface MermaidNestObject {
    name: Name;
    type: "class" | "abstract class" | "interface";
    scope: "DEFAULT" | "PROTOTYPE" | "REQUEST";
    purpose:
        | "controller"
        | "service"
        | "factory"
        | "generic"
        | "repository"
        | "entity";
    superClass?: MermaidNestObject;
    realizedFromInterfaces?: MermaidNestObject[];
    module: MermaidParserModule;
    genericTypes: string[];
    fileImports: NodeFileImport[];
    primaryDependencies?: MermaidNestObject[];
    foreignDependencies?: MermaidNestObject[];
    properties: Property[];
    methods: Method[];
}

export interface MermaidNestObjectTree {
    [key: string]: MermaidNestObject;
}

export interface MermaidParserModule {
    name: Name;
    objects: MermaidParserObject[];
}

export interface MermaidParserObject {
    name: Name;
    type: "class" | "abstract class" | "interface";
    purpose: ObjectPurpose;
    superClasses?: MermaidParserObject[];
    realizedFromInterfaces?: MermaidParserObject[];
    module?: MermaidParserModule;
    genericTypes: string[];
    primaryDependencies: MermaidParserObject[];
    foreignDependencies: MermaidParserObject[];
    properties: Property[];
    methods: Method[];
}

export interface MermaidParserObjectTree {
    [key: string]: MermaidParserObject;
}
