export enum PropertyVisibility {
    PUBLIC = "public",
    PRIVATE = "private",
    PROTECTED = "protected",
}

export interface Property {
    name: string;
    visibility: PropertyVisibility;
    type: string;
}
