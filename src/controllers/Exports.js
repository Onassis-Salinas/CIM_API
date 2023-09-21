const db = require("../database/db");
const exceljs = require("exceljs");

const exportInventory = async (req, res) => {
    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet("Inventario");

    db.query("select Materials.Code, Materials.Description, Inventory.Amount from materials JOIN Inventory ON Materials.Id = Inventory.MaterialId;", [req.body.Material], async (err, rows, fields) => {
        if (err) return res.send({ error: "No se encontro material" });

        worksheet.columns = [
            { header: "Material", key: "Code", width: 20 },
            { header: "Descripcion", key: "Description", width: 100 },
            { header: "Cantidad", key: "Amount", width: 15 },
        ];
        worksheet.getRow(1).style = { font: { bold: true }, };

        worksheet.addRows(rows);

        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", "attachment; filename=Inventario.xlsx");
        await workbook.xlsx.write(res);

        res.end();
    });
};

module.exports = {
    exportInventory,
};
