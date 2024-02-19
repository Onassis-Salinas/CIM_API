import db from "../../utilities/db";
import { Response, Request } from "express";

export const getMaterial = (req: Request, res: Response) => {
    db.query("SELECT Code, Description, Measurement FROM materials WHERE Code = ?", [req.body.Material], (err: any, rows: any) => {
        if (err) return res.send({ error: "No se encontro material" });
        res.send(rows);
    });
};
export const getMaterials = (req: Request, res: Response) => {
    db.query("SELECT Code, Description, Measurement FROM materials", (err: any, rows: any) => {
        console.log(err)
        if (err) return res.send({ error: "No se encontraron materiales" });
        res.send(rows);
    });
};
export const postMaterials = (req: Request, res: Response) => {
    db.query("INSERT INTO materials (Code, Description, Measurement) Values (?,?,?)", [req.body.Code, req.body.Description, req.body.Measurement], (err: any, rows: any) => {
        if (err) {
            if (err.errno === 3819) return res.send({ error: "No puede haber espacios en blanco" });
            if (err.errno === 1062) return res.send({ error: "Material repetido" });
            return;
        }
        db.query("INSERT INTO inventory (MaterialId) Values (?)", [rows.insertId], (err: any, rows: any) => {
            if (err) return res.send({ error: "Error al generar inventario para el material" });
            res.send(rows);
        });
    });
};
