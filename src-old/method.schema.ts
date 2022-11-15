import { Member } from "./member.schema";
import { Argument } from "./argument.schema";

export interface Method extends Member {
    generics?: string[];
    arguments?: Argument[];
}
