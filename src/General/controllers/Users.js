const sql = require("../../utilities/db2");
const sendError = require("../../utilities/sendError");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
    const hash = await bcrypt.hash(req.body.Password, 10);

    try {
        const [rows, fields] = await sql.query("insert into Users (UserName, Password) values (?, ?)", [req.body.UserName, hash]);
        res.send(`${req.body.UserName} Registrado`);
    } catch (err) {
        return sendError(res, err);
    }
};

const loginUser = async (req, res) => {
    if (!req.body.Password) return res.send("Falta contraseña");
    if (!req.body.UserName) return res.send("Falta usuario");

    try {
        const [[user]] = await sql.query("select * from users where UserName = ?", [req.body.UserName]);
        if (!user) return res.send("Usuario invalido");

        const match = await bcrypt.compare(req.body.Password, user.Password);
        if (!match) return res.send("Contraseña incorrecta");

        delete user.Password;
        delete user.Id;
        const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "24h" });

        res.cookie("jwt", token, { sameSite: "strict", httpOnly: true }).send("logged in");
    } catch (err) {
        return sendError(res, err);
    }
};

module.exports = { loginUser, registerUser };
