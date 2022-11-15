import {MermaidParserModule, MermaidParserObject} from "../src-old/nest-object.schema";
import {
  MermaidObjectParser,
  MermaidParserObjectPlain,
  MermaidParserObjectPlainTree
} from "../src-old/mermaid-object-parser";
import {MermaidRelationsParser} from "../src-old/mermaid-relations-parser";
import { readFile } from "fs";
import {MermaidRelationsHydrater} from "../src-old/mermaid-relations-hydrater";
import regexMap from "./regex-map";
import visibilityMapper from "./visibility-mapper";
import {toKebabCase} from "./to-kebab-case";
import {toCamelCase} from "./to-camel-case";
import objectTypeMapper from "./object-type-mapper";
import {getObjectPurpose} from "./get-object-purpose";
import relationsMapper, {Relation} from "./relations-mapper";

import {Name} from "../src-old/name.schema";

// Takes a MermaidObject and converts it into a Nest object
class MermaidNestObjectBuilder {

}

// Takes a MermaidDoc and converts it into files
class MermaidNestProjectBuilder {
  constructor(object: MermaidDoc) {
  }
}

type MermaidParserType = {
  objects: MermaidParserObject[];
  modules: MermaidParserModule[];
};

export class FileReader {
  constructor() {}

  async readFile(path: string): Promise<string> {
    return await new Promise((resolve) => {
      readFile(path, (err, data) => {
        if (err) throw err;
        resolve(Buffer.from(data).toString());
      });
    });
  }
}

