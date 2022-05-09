export const ObjectPurpose = [
    "controller",
    "service",
    "factory",
    "generic",
    "repository",
    "entity",
    "interface",
] as const;
export type ObjectPurpose = typeof ObjectPurpose[number];
