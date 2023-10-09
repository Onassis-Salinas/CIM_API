const pdfjsLib = require("pdfjs-dist");

const ConvertPdf = async (req, res) => {
    const pdfBuffer = req.file.buffer;

    const pdfData = new Uint8Array(pdfBuffer);

    const loadingTask = pdfjsLib.getDocument({ data: pdfData });
    loadingTask.promise
        .then(async (pdfDocument) => {
            const numPages = pdfDocument.numPages;

            const pageTexts = [];

            for (let pageNum = 1; pageNum <= numPages; pageNum++) {
                const page = await pdfDocument.getPage(pageNum);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map((item) => item.str).join(" ");
                pageTexts.push(pageText);
            }
            const pdfText = pageTexts.join("\n");
            processPdfText(pdfText, res);
        })
        .catch((err) => {
            console.error(err);
            res.send({ error: "Error al procesar el pdf" });
        });
};

function processPdfText(text, res) {
    let job = "";
    let linesArray = text.split(/\s{3,}| {2}/);

    const index = linesArray.findIndex((line) => line.includes("RAW MATERIAL COMPONENTS:"));
    const endIndex = linesArray.findIndex((line) => line.includes("OPERATIONS"));
    job = linesArray[linesArray.findIndex((line) => line.includes("Job:")) + 1];

    dateStr = linesArray[linesArray.findIndex((line) => line.includes("Due Date:")) + 1];
    const [month, day, year] = dateStr.split("/");
    let date = new Date();
    date.setFullYear(year);
    date.setMonth(month - 1);
    date.setDate(day);
    date = date.toISOString().split('T')[0];

    linesArray = linesArray.slice(index, endIndex);
    const materials = [];

    let materialNumber = 10;
    linesArray.forEach((element, i) => {
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

module.exports = {
    ConvertPdf,
};
