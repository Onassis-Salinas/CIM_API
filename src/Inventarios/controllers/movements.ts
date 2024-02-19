import db from "../../utilities/db";
import { Response, Request } from "express";

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
    db.query(
        "Select movements.Due,  movements.Job,	materials.Code,  materials.Description, relations.Amount, relations.RealAmount, materials.Measurement, relations.Active From relations join materials on materials.Id = relations.MaterialId join movements on movements.Id = relations.MovementId where movements.Export = ? ORDER BY movements.Due DESC;",
        [req.body.expo],
        (err: any, rows: any) => {
            if (err) return res.send({ error: "No se encontraron datos para la exportacion" });
            res.send(rows);
        }
    );
};

export const getMaterial = (req: Request, res: Response) => {
    db.query(
        "Select movements.Due, movements.Export, movements.Job, relations.Amount, relations.RealAmount, relations.Active From relations join materials on materials.Id = relations.MaterialId join movements on movements.Id = relations.MovementId where materials.Code = ? ORDER BY movements.Due DESC, movements.Job DESC",
        [req.body.material],
        (err: any, rows: any) => {
            if (err) return res.send({ error: "No se encontraron datos para el material" });
            res.send(rows);
        }
    );
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

export const postInput = (req: Request, res: Response) => {
    db.query("SELECT * FROM materials WHERE materials.Code = ?", [req.body.Material], (err: any, rows: any) => {
        if (err) return res.send({ error: "Error al buscar material" });
        if (!rows[0]) return res.send({ error: "No se encontró el material" });

        db.query("Select * from relations Join materials on relations.MaterialId = materials.Id join movements on relations.MovementId = movements.Id where materials.Code = ? and  movements.Job is null and movements.Due = ?", [req.body.Material, req.body.Date], (err: any, rows: any) => {
            console.log(rows);
            if (err) return res.send({ error: "Error al consultar movimientos" });
            if (rows.length > 0) return res.send({ error: "Movimiento duplicado" });

            db.query("Select * from movements where Job is Null and Due = ?", [req.body.Date], (err: any, rows: any) => {
                console.log(err);

                if (err) return res.send({ error: "Error al registrar el movimiento 1x" });
                if (rows.length === 0) {
                    db.query("INSERT INTO movements ( Due) VALUES (?)", [req.body.Date], (err: any, rows: any) => {
                        if (err) return res.send({ error: "Error al registrar el movimiento 2x" });

                        db.query(
                            "INSERT INTO relations (MaterialId, MovementId, Amount, RealAmount, Active) SELECT materials.Id, movements.Id, ?, ?,? FROM materials, movements WHERE materials.Code = ? AND movements.Job IS NULL AND movements.Due = ?",
                            [req.body.Amount, req.body.Amount, req.body.Active, req.body.Material, req.body.Date],
                            (err: any, rows: any) => {
                                if (err) return res.send({ error: "Error al registrar la relación 1x" });

                                db.query("UPDATE inventory SET Amount = Amount + ? WHERE MaterialId = (SELECT Id FROM materials WHERE Code = ?)", [req.body.Amount, req.body.Material], (err: any, rows: any) => {
                                    if (err) return res.send({ error: "Error al actualizar el inventario 1x" });

                                    res.send("succes");
                                });
                            }
                        );
                    });
                } else {
                    db.query(
                        "INSERT INTO relations (MaterialId, MovementId, Amount, RealAmount, Active) SELECT materials.Id, movements.Id, ?, ?,? FROM materials, movements WHERE materials.Code = ? AND movements.Job IS NULL AND movements.Due = ?",
                        [req.body.Amount, req.body.Amount, req.body.Active, req.body.Material, req.body.Date],
                        (err: any, rows: any) => {
                            console.log(err);
                            if (err) return res.send({ error: "Error al registrar la relación 2x" });

                            db.query("UPDATE inventory SET Amount = Amount + ? WHERE MaterialId = (SELECT Id FROM materials WHERE Code = ?)", [req.body.Amount, req.body.Material], (err: any, rows: any) => {
                                if (err) return res.send({ error: "Error al actualizar el inventario 1x" });

                                res.send("succes");
                            });
                        }
                    );
                }
            });
        });
    });
};

export const postOutput = (req: Request, res: Response) => {
    let materials = req.body.textboxes.map((item: any) => item.Material);

    db.query("Select Id from materials where Code in (?)", [materials], (err: any, materialrows: any) => {
        if (err || materialrows.length !== materials.length) return res.send({ error: "Uno o varios de los materiales incorrectos" });

        db.query("Insert into movements (job, Export, Due) values (?,?,?)", [req.body.data.Job, req.body.data.Export, req.body.data.Date], (err: any, rows: any) => {
            if (err) {
                if (err.errno === 1062) return res.send({ error: "Job repetido" });
                return res.send({ error: "job, exportacion o fecha incorrectos" });
            }

            for (const values of req.body.textboxes) {
                db.query("insert into relations (MaterialId, MovementId, Amount, RealAmount) values ((select Id from materials where Code = ?),(select Id from movements where Job = ?),?,?)", [values.Material, req.body.data.Job, values.Amount, values.Amount], (err: any, relationrows: any) => {
                    if (err) return res.send({ error: "Error al registar la relacion" });
                    return res.send(rows);
                });
            }
        });
    });
};
