import { readFile, writeFile } from "fs";
import { MermaidParser } from "./classes/MermaidParser";
import NestObjectBuilder from "./classes/NestObjectBuilder";
import CodeBlockWriter from "code-block-writer";

// Takes a MermaidObject and converts it into a Nest object
class MermaidNestObjectBuilder {}

// Takes a MermaidDoc and converts it into files
// class MermaidNestProjectBuilder {
// 	constructor(object: MermaidDoc) {}
// }

// type MermaidParserType = {
// 	objects: MermaidParserObject[];
// 	modules: MermaidParserModule[];
// };

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

(async () => {
	const fileReader = new FileReader();

	const mmdFile = await fileReader.readFile("./mmdTest.mmd");

	const mermaidParser = new MermaidParser(mmdFile);
	const mermaidDoc = mermaidParser.parse();

	Object.values(mermaidDoc.classes).map((mermaidObject) => {
		const nestObjectBuilder = new NestObjectBuilder(
			mermaidObject,
			new CodeBlockWriter()
		);
		const fileString = nestObjectBuilder.build();

		writeFile(`test/${mermaidObject.name.kebab}`, fileString, (err) => {
			console.error(err);
		});
	});
})();
