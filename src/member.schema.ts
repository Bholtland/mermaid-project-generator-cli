export interface Member {
    name: string;
    visibility: "private" | "public" | "protected";
    // Is return type for method
    type: string;
}
