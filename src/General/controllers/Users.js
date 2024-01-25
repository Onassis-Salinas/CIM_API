const sql = require("../../utilities/db2");
const sendError = require("../../utilities/sendError");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
    const validatePermissionFormat = (res, permission) => {
        if (!permission) return "n";
        if (permission === "r" || permission === "w") return permission;
        sendError(res, 400, "Permiso no valido");
    };

    if (!req.body.Password) return sendError(res, 400, "Falta contraseña");
    if (!req.body.UserName) return sendError(res, 400, "Falta usuario");
    req.body.Perm_assistance = validatePermissionFormat(res, req.body.Perm_assistance);
    req.body.Perm_employees = validatePermissionFormat(res, req.body.Perm_employees);
    req.body.Perm_productivity = validatePermissionFormat(res, req.body.Perm_productivity);

    const hash = await bcrypt.hash(req.body.Password, 10);

    try {
        await sql.query("insert into Users (UserName, Password, Perm_assistance, Perm_employees, Perm_productivity) values (?, ?, ?, ?, ?)", [req.body.UserName, hash, req.body.Perm_assistance, req.body.Perm_employees, req.body.Perm_productivity]);

        res.send(`${req.body.UserName} Registrado`);
    } catch (err) {
        sendError(res, 500, err);
    }
};

const editUser = async (req, res) => {
    try {
        sql.query("update users set Perm_assistance=?, Perm_employees=?, Perm_productivity=?, Perm_users=?, UserName=? where UserName=?", [req.body.Perm_assistance, req.body.Perm_employees, req.body.Perm_productivity, req.body.Perm_productivity, req.body.UserName, req.body.LastUserName]);
        res.send("completed");
    } catch (err) {}
};

const loginUser = async (req, res) => {
    try {
        const [[user]] = await sql.query("select * from users where UserName = ?", [req.body.UserName]);
        if (!user) return sendError(res, 400, "Usuario invalido");

        const match = await bcrypt.compare(req.body.Password, user.Password);
        if (!match) return sendError(res, 400, "Contraseña incorrecta");

        delete user.Password;
        delete user.Id;
        console.log("0000" + Object.keys(user));
        const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "24h" });

        res.cookie("jwt", token, { sameSite: "strict", httpOnly: true }).send("logged in");
        console.log("User logged in");
    } catch (err) {
        return sendError(res, 500);
    }
};

const getUsers = async (req, res) => {
    try {
        const [users] = await sql.query("Select Id, UserName, Perm_assistance,Perm_users,Perm_productivity,Perm_employees from users ");
        res.send(users);
    } catch (err) {
        sendError(res, 500, err);
    }
};
module.exports = { loginUser, registerUser, getUsers, editUser };
