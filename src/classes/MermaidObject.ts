// Contains data for a Mermaid object.
import {Name} from "../../src-old/name.schema";
import {ObjectPurpose} from "../types/objectPurpose";
import {Property} from "../types/property";
import {Method} from "../types/method";

export default class MermaidObject {
  name: Name
  type: "class" | "abstract class" | "interface";
  objectPurpose: ObjectPurpose
  superClasses: MermaidObject[]
  realizedFromInterfaces: MermaidObject[]
  genericTypes: string[]
  primaryDependencies: MermaidObject[]
  foreignDependencies: MermaidObject[]
  properties: Property[]
  methods: Method[]
  module: string

  constructor(object) {
    this.name = object.name
    this.type = object.type
    this.genericTypes = object.genericTypes
    this.primaryDependencies = object.primaryDependencies
    this.foreignDependencies = object.foreignDependencies
    this.properties = object.properties
    this.methods = object.methods
    this.objectPurpose = object.objectPurpose
    this.superClasses = object.superClasses
    this.realizedFromInterfaces = object.realizedFromInterfaces
  }
}
