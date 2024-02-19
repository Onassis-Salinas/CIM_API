import db from "../../utilities/db";
import { Response, Request } from "express";

export const getInventory = (req: Request, res: Response) => {
    db.query("SELECT materials.Code, materials.Description, inventory.Amount, materials.Measurement FROM inventory JOIN materials ON inventory.MaterialId = materials.Id", (err: any, rows: any) => {
        if (err) return res.send({ error: "No se encontraron datos de inventario" });
        res.send(rows);
    });
};

export const updateInventory = (req: Request, res: Response) => {
    db.query("UPDATE inventory SET Amount = Amount + ? WHERE ID = ?", [req.body.Amount, req.body.Id], (err: any, rows: any) => {
        if (err) return res.send({ error: "No se pudo modificar en inventario" });
        res.send(rows);
    });
};

export const postInventory = (req: Request, res: Response) => {
    db.query("INSERT INTO Inventory (Amount, MaterialId) VALUES (0, ?)", [req.body.MaterialId], (err: any, rows: any) => {
        if (err) return res.send({ error: "No se pudo registrar en inventario" });
        res.send(rows);
    });
};
