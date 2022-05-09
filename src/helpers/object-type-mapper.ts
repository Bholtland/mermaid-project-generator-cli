import { ObjectType } from "../types/object-type";

export default function (type?: string) {
    switch (type) {
        case "<<Interface>>":
            return ObjectType.INTERFACE;
        case "<<Abstract>>":
            return ObjectType.ABSTRACT_CLASS;
        default:
            return ObjectType.CLASS;
    }
}
