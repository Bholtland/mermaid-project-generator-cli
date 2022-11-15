import {Argument} from "./argument";
import {Member} from "./member";

export interface Method extends Member {
  generics?: string[];
  arguments?: Argument[];
}
