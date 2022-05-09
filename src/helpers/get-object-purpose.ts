import { ObjectPurpose } from "../types/object-purpose";
import regexMap from "./regex-map";

export function getObjectPurpose(name: string) {
    const purposeRegex = [...name.matchAll(regexMap.objectNamePatterns)];

    if (purposeRegex[0][2]) {
        return "interface";
    } else if (
        purposeRegex[0][7] &&
        ObjectPurpose.includes(purposeRegex[0][7] as ObjectPurpose)
    ) {
        return purposeRegex[0][7].toLowerCase() as ObjectPurpose;
    }
    return "generic";
}
