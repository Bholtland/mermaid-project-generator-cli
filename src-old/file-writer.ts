import { lstat, mkdir, mkdirSync, writeFile } from "fs";

export class FileWriter {
    async write(dirs: string[], fileName: string, fileContents: string) {
        await new Promise((resolve) => {
            lstat(dirs.join("/"), (err, stats) => {
                if (!stats?.isDirectory()) {
                    mkdir(dirs.join("/"), { recursive: true }, () => {
                        resolve("done");
                    });
                }
            });
        });

        return await new Promise((resolve) => {
            writeFile(`${dirs.join("/")}/${fileName}`, fileContents, (err) => {
                if (err) throw err;
                resolve("done");
            });
        });
    }
}
