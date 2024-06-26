import { Request, Response } from "express";

const pdfjsLib = require("pdfjs-dist");

export const ConvertJobPdf = async (req: any, res: Response) => {
    const pdfBuffer = req.file.buffer;

    const pdfData = new Uint8Array(pdfBuffer);

    const loadingTask = pdfjsLib.getDocument({ data: pdfData });
    loadingTask.promise
        .then(async (pdfDocument: any) => {
            const numPages = pdfDocument.numPages;

            const pageTexts = [];

            for (let pageNum = 1; pageNum <= numPages; pageNum++) {
                const page = await pdfDocument.getPage(pageNum);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map((item: any) => item.str).join(" ");
                pageTexts.push(pageText);
            }
            const pdfText = pageTexts.join("\n");
            processJob(pdfText, res);
        })
        .catch((err: any) => {
            console.error(err);
            res.send({ error: "Error al procesar el pdf" });
        });
};

export function processJob(text: any, res: Response) {
    let job = "";
    let linesArray = text.split(/\s{3,}| {2}/);

    const index = linesArray.findIndex((line: any) => line.includes("RAW MATERIAL COMPONENTS:"));
    const endIndex = linesArray.findIndex((line: any) => line.includes("OPERATIONS"));
    job = linesArray[linesArray.findIndex((line: any) => line.includes("Job:")) + 1];

    const dateStr = linesArray[linesArray.findIndex((line: any) => line.includes("Due Date:")) + 1];
    const [month, day, year] = dateStr.split("/");
    let date: any = new Date();
    date.setFullYear(year);
    date.setMonth(month - 1);
    date.setDate(day);
    date = date.toISOString().split("T")[0];

    linesArray = linesArray.slice(index, endIndex);
    const materials: Array<any> = [];

    let materialNumber = 10;
    linesArray.forEach((element: any, i: number) => {
        // Materiales
        if (element === String(materialNumber)) {
            materialNumber += 10;
            const excludedValues = ["PATTERN", "IS2002WR", "ISMARMTRCV", "FREIGHTINMXTOTNPWC"];
            const excludedValues2 = ["PATTERN", "SAMPLE"];
            if (!excludedValues2.includes(linesArray[i + 1].split("-")[0]) && !excludedValues.includes(linesArray[i + 1])) {
                if (!isNaN(parseFloat(linesArray[i + 3])) && linesArray[i + 3][0] != "0") {
                    linesArray[i + 3] = linesArray[i + 3].replace(/,/g, "");
                    materials.push({
                        material: linesArray[i + 1],
                        description: linesArray[i + 2],
                        amount: linesArray[i + 3],
                        measurement: linesArray[i + 4],
                    });
                } else {
                    linesArray[i + 4] = linesArray[i + 4].replace(/,/g, "");
                    materials.push({
                        material: linesArray[i + 1],
                        description: linesArray[i + 2] + linesArray[i + 3],
                        amount: linesArray[i + 4],
                        measurement: linesArray[i + 5],
                    });
                }
            }
        }
    });

    res.send({ materials, job, date });
}

export const ConvertImportPdf = async (req: any, res: Response) => {
    const pdfBuffer = req.file.buffer;

    const pdfData = new Uint8Array(pdfBuffer);

    const loadingTask = pdfjsLib.getDocument({ data: pdfData });
    loadingTask.promise
        .then(async (pdfDocument: any) => {
            const numPages = pdfDocument.numPages;
            console.log(numPages);

            const pageTexts = [];

            for (let pageNum = 1; pageNum <= numPages; pageNum++) {
                const page = await pdfDocument.getPage(pageNum);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map((item: any) => item.str).join(" ");
                pageTexts.push(pageText);
            }
            const pdfText = pageTexts.join("\n");
            processImport(pdfText, res);
        })
        .catch((err: any) => {
            console.error(err);
            res.send({ error: "Error al procesar el pdf" });
        });
};

export function processImport(text: any, res: Response) {
    let linesArray: string[] = text.split(/\s{3,}| {2}/);

    const ImportNum = linesArray[linesArray.findIndex((line: string) => line.includes("Tracking :")) + 1];
    const ImportDate = linesArray[linesArray.findIndex((line: string) => line === ":") + 1];

    const Materials: Array<object> = [];
    linesArray.forEach((element: string, i: number) => {
        if (element.includes("•")) {
            const code = linesArray[i + 1].replaceAll(" ", "");

            let quantity: number;
            for (let j = i; j < i + 20; j++) {
                if (!linesArray[j].includes("•") && !isNaN(parseFloat(linesArray[j]))) {
                    quantity = parseFloat(linesArray[j].split(" ")[0].replaceAll(",", ""));
                    Materials.push({ code, quantity });
                    break;
                }
            }
        }
    });

    return res.send({ ImportDate, ImportNum, Materials });
}
