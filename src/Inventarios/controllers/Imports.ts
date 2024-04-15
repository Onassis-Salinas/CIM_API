import { Response, Request } from "express";
import Exceljs from "exceljs";
import sql from "../../utilities/db2";

interface customReq extends Request {
    file: any;
}

export const importMaterials = async (req: any, res: Response) => {
    const workbook = new Exceljs.Workbook();
    await workbook.xlsx.load(req.file.buffer);
    const worksheet = workbook.worksheets[0];

    const errors = [];
    const [[movement]] = await sql.query("insert into movements (Job, Due) values ('111111', ?) returning id", [new Date("2024-01-01")]);
    for (let i = 2; i < 10000; i++) {
        const row = worksheet.getRow(i);
        const code = row.getCell(1).value;
        const description = row.getCell(2).value;
        const measure = row.getCell(3).value;
        const amount = row.getCell(4).value;
        
        if (!code) break;
        try {
            const [[material]] = await sql.query("insert into materials (Code, Description, Measurement) values (?,?,?) returning id", [code, description, measure]);
            await sql.query("insert into inventory (Amount, MaterialId) values (?,?)", [100000, material.id]);
            await sql.query("insert into relations (MaterialId, MovementId, Amount, Active, RealAmount) values (?,?,?,?,?)", [material.id, movement.id, 100000, 1, 100000]);
        } catch (err: any) {
            errors.push(err.message);
        }
    }
    res.send(errors);
};
