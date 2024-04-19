import db from "../../utilities/db";
import { Response, Request } from "express";
import sql from "../../utilities/db2";

export const putMovement = (req: Request, res: Response) => {
    db.query("UPDATE relations SET Active = ? WHERE MovementId=(select Id from movements where job = ?) and MaterialId=(select Id from materials where Code = ?)", [req.body.Active, req.body.Job, req.body.Code], (err: any, rows: any) => {
        if (err) return res.send({ error: "Error al cambiar el estado" });
        req.body.Amount = req.body.Amount > 0 ? -req.body.Amount : req.body.Amount;
        req.body.Amount = req.body.Active ? req.body.Amount : -req.body.Amount;
        console.log(req.body.Amount);

        if (rows.affectedRows !== 0) {
            db.query("update inventory set amount = amount + ? where MaterialId = (select Id from materials where Code = ?)", [req.body.Amount, req.body.Code], (err: any, rows: any) => {
                if (err) return res.send({ error: "Error al hacer la suma" });

                res.send(rows);
            });
        }
    });
};

export const getExpo = (req: Request, res: Response) => {
    db.query("Select movements.Due,  movements.Job,	materials.Code,  materials.Description, relations.Amount, relations.RealAmount, materials.Measurement, relations.Active From relations join materials on materials.Id = relations.MaterialId join movements on movements.Id = relations.MovementId where movements.Export = ? ORDER BY movements.Due DESC;", [req.body.expo], (err: any, rows: any) => {
        if (err) return res.send({ error: "No se encontraron datos para la exportacion" });
        res.send(rows);
    });
};

export const getMaterial = (req: Request, res: Response) => {
    db.query("Select movements.Due, movements.Export, movements.Job, relations.Amount, relations.RealAmount, relations.Active From relations join materials on materials.Id = relations.MaterialId join movements on movements.Id = relations.MovementId where materials.Code = ? ORDER BY movements.Due DESC, movements.Job DESC", [req.body.material], (err: any, rows: any) => {
        if (err) return res.send({ error: "No se encontraron datos para el material" });
        res.send(rows);
    });
};

export const updateAmount = (req: Request, res: Response) => {
    req.body.RealAmount = req.body.RealAmount > 0 ? -req.body.RealAmount : req.body.RealAmount;
    req.body.lastValue = req.body.lastValue > 0 ? -req.body.lastValue : req.body.lastValue;

    if (req.body.Active) {
        db.query("SELECT inventory.Id FROM inventory JOIN materials ON inventory.MaterialId = materials.Id where materials.Code = ?", [req.body.Code], (err: any, rows: any) => {
            if (err) return res.send({ error: "Error al encontrar el material" });

            if (req.body.RealAmount) {
                db.query("UPDATE inventory SET Amount = (Amount - ?)+? WHERE ID = ?", [req.body.lastValue, req.body.RealAmount, rows[0]["Id"]], (err: any, rows: any) => {
                    if (err) return res.send({ error: "Error al actualizar el inventario 2x" });

                    db.query("UPDATE relations SET RealAmount = ? WHERE movementId = (select Id from movements where job = ?)  and MaterialId=(select Id from materials where Code = ?)", [req.body.RealAmount, req.body.Job, req.body.Code], (err: any, rows: any) => {
                        if (err) return res.send({ error: "Error al actualizar el inventario 3x" });
                        return res.send(rows);
                    });
                });
            } else {
                return res.send({ error: "No puede dejar el campo vacio" });
            }
        });
    } else {
        if (req.body.RealAmount) {
            db.query("UPDATE relations SET RealAmount = ? WHERE movementId = (select Id from movements where job = ?)  and MaterialId=(select Id from materials where Code = ?)", [req.body.RealAmount, req.body.Job, req.body.Code], (err: any, rows: any) => {
                if (err) return res.send({ error: "Error al actualizar el inventario 4x" });
                return res.send(rows);
            });
        } else {
            return res.send({ error: "No puede dejar el campo vacio" });
        }
    }
};

export const postInput = async (req: Request, res: Response) => {
    let materials = req.body.movement.textboxes.map((item: any) => item.Material);
    try {
        const [materialRows] = await sql.query("Select Id from materials where Code in (?)", [materials]);
        if (materialRows.length !== materials.length) return res.send({ error: "Uno o varios de los materiales incorrectos" });

        const [importRows] = await sql.query("Select Id from movements where Import=?", [req.body.movement.import]);
        if (importRows.length !== 0) return res.send({ error: "Ya se registro esa importacion" });

        const [rows] = await sql.query("Insert into movements (Import, Due) values (?,?)", [req.body.movement.import, req.body.movement.date]);

        for (const values of req.body.movement.textboxes) {
            await sql.query("insert into relations (MaterialId, MovementId, Amount, RealAmount) values ((select Id from materials where Code = ?),(select Id from movements where Import = ?),?,?)", [values.Material, req.body.movement.import, values.Amount, values.Amount]);
            await sql.query("UPDATE inventory SET Amount = Amount + ? WHERE MaterialId = (SELECT Id FROM materials WHERE Code = ?)", [values.Amount, values.Material]);
        }

        res.send(rows);
    } catch (err) {
        console.log(err);
        return res.send({ error: "error" });
    }
};

export const postOutput = (req: Request, res: Response) => {
    let materials = req.body.movement.textboxes.map((item: any) => item.Material);

    console.log(materials);
    console.log(req.body.movement.textboxes);
    db.query("Select Id from materials where Code in (?)", [materials], async (err: any, materialrows: any) => {
        if (err || materialrows.length !== materials.length) return res.send({ error: "Uno o varios de los materiales incorrectos" });

        try {
            await sql.query("Insert into movements (job, Export, Due) values (?,?,?)", [req.body.movement.job, req.body.movement.export, req.body.movement.date]);
            if (err) {
                if (err.errno === 1062) return res.send({ error: "Job repetido" });
                return res.send({ error: "job, exportacion o fecha incorrectos" });
            }

            for (const values of req.body.movement.textboxes) {
                await sql.query("insert into relations (MaterialId, MovementId, Amount, RealAmount) values ((select Id from materials where Code = ?),(select Id from movements where Job = ?),?,?)", [values.Material, req.body.movement.job, values.Amount, values.Amount]);
            }
            res.send();
        } catch (err) {
            console.log(err);
            return res.send(err);
        }
    });
};
