const db = require("../database/db");

const getMaterial = (req, res) => {
    db.query("SELECT Code, Description, Measurement FROM Materials WHERE Code = ?", [req.body.Material], (err, rows, fields) => {
        if (err) return res.send({ error: "No se encontro material" });
        res.send(rows);
    });
};
const getMaterials = (req, res) => {
    db.query("SELECT Code, Description, Measurement FROM Materials", (err, rows, fields) => {
        if (err) return res.send({ error: "No se encontraron materiales" });
        res.send(rows);
    });
};
const postMaterials = (req, res) => {
    db.query("INSERT INTO Materials (Code, Description, Measurement) Values (?,?,?)", [req.body.Code, req.body.Description, req.body.Measurement], (err, result) => {
        if (err) {
            if (err.errno === 3819) return res.send({ error: "No puede haber espacios en blanco" });
            if (err.errno === 1062) return res.send({ error: "Material repetido" });
            return;
        }
        db.query("INSERT INTO Inventory (MaterialId) Values (?)", [result.insertId], (err, result) => {
            if (err) return res.send({ error: "Error al generar inventario para el material" });
            res.send(result);
        });
    });
};

module.exports = {
    getMaterial,
    getMaterials,
    postMaterials,
};
