import { readFile } from "fs";

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
