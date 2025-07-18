import fs from "fs";

export const writeMeAJson = (fileName: string, data: any) => {
    const filePath = `${fileName}.json`;
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        console.log("done!");
    } catch (err) {
        console.error(err);
    }
};
