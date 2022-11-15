import MermaidObject from "./MermaidObject";

export default class MermaidDoc {
  constructor(public classes: {[key: string]: MermaidObject}) {
  }
}
