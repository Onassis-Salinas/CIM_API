import db from "../../utilities/db";
import { Response, Request } from "express";
const exceljs = require("exceljs");

export const exportInventory = async (req: Request, res: Response) => {
    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet("Inventario");

    db.query("select materials.Code, materials.Description, inventory.Amount from materials JOIN inventory ON materials.Id = inventory.MaterialId;", [req.body.Material], async (err: any, rows: any) => {
        if (err) return res.send({ error: "No se encontro material" });

        worksheet.columns = [
            { header: "Material", key: "Code", width: 20 },
            { header: "Descripcion", key: "Description", width: 100 },
            { header: "Cantidad", key: "Amount", width: 15 },
        ];
        worksheet.getRow(1).style = { font: { bold: true } };

        worksheet.addRows(rows);

        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", "attachment; filename=Inventario.xlsx");
        await workbook.xlsx.write(res);

        res.end();
    });
};
