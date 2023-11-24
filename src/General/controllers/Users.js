const db = require("../../utilities/db");
const sendError = require("../../utilities/sendError");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
    const hash = await bcrypt.hash(req.body.Password, 10);

    db.query("insert into Users (UserName, Password) values (?, ?)", [req.body.UserName, hash], async (err, rows) => {
        if (err) return sendError(res, err);

        res.send(`${req.body.UserName} Registrado`);
    });
};

const loginUser = async (req, res) => {
    if (!req.body.Password) return res.send("Falta contraseña");

    db.query("select UserName, Password from users where UserName = ?", [req.body.UserName], async (err, rows) => {
        if (err) return sendError(res, err);
        if (rows.length === 0) return res.send("Usuario invalido");

        const dbPassword = rows[0].Password;

        try {
            const match = await bcrypt.compare(req.body.Password, dbPassword);
            if (match) {
                const user = { UserName: rows[0].UserName };
                const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "24h" });
                res.send({ token });
            } else {
                res.send("Contraseña incorrecta");
            }
        } catch (err) {
            console.log(err);
        }
    });
};

module.exports = { loginUser, registerUser };
