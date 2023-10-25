const db = require("../../utilities/db");

const getInventory = (req, res) => {
    db.query("SELECT materials.Code, materials.Description, inventory.Amount, materials.Measurement FROM inventory JOIN materials ON inventory.MaterialId = materials.Id", (err, rows, fields) => {
        if (err) return res.send({ error: "No se encontraron datos de inventario" });
        res.send(rows);
    });
};

const updateInventory = (req, res) => {
    db.query("UPDATE inventory SET Amount = Amount + ? WHERE ID = ?", [req.body.Amount, req.body.Id], (err, result) => {
        if (err) return res.send({ error: "No se pudo modificar en inventario" });
        res.send(result);
    });
};

const postInventory = (req, res) => {
    db.query("INSERT INTO Inventory (Amount, MaterialId) VALUES (0, ?)", [req.body.MaterialId], (err, result) => {
        if (err) return res.send({ error: "No se pudo registrar en inventario" });
        res.send(result);
    });
};

module.exports = {
    getInventory,
    updateInventory,
    postInventory,
};
