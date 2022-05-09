import { PropertyVisibility } from "../types/property.interface";

export default function (visibility?: string) {
    switch (visibility) {
        case "#":
            return PropertyVisibility.PROTECTED;
        case "+":
            return PropertyVisibility.PUBLIC;
        case "-":
            return PropertyVisibility.PRIVATE;
        default:
            return PropertyVisibility.PUBLIC;
    }
}
