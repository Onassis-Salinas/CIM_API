import sql from "../../utilities/db2";
import sendError from "../../utilities/sendError";
import bcrypt from "bcrypt";
import jwt, { Secret } from "jsonwebtoken";
import { Response, Request } from "express";

export const registerUser = async (req: Request, res: Response) => {
    const validatePermissionFormat = (res: Response, permission: string) => {
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
        await sql.query("insert into users (UserName, Password, Perm_assistance, Perm_employees, Perm_productivity) values (?, ?, ?, ?, ?)", [req.body.UserName, hash, req.body.Perm_assistance, req.body.Perm_employees, req.body.Perm_productivity]);

        res.send(`${req.body.UserName} Registrado`);
    } catch (err) {
        sendError(res, 500, err);
    }
};

export const editUser = async (req: Request, res: Response) => {
    try {
        sql.query("update users set Perm_assistance=?, Perm_employees=?, Perm_productivity=?, Perm_users=?, UserName=? where UserName=?", [req.body.Perm_assistance, req.body.Perm_employees, req.body.Perm_productivity, req.body.Perm_productivity, req.body.UserName, req.body.LastUserName]);
        res.send("completed");
    } catch (err) {}
};

export const loginUser = async (req: Request, res: Response) => {
    try {
        const [[user]] = await sql.query("select * from users where UserName = ?", [req.body.UserName]);
        if (!user) return sendError(res, 400, "Usuario invalido");

        const match = await bcrypt.compare(req.body.Password, user.Password);
        if (!match) return sendError(res, 400, "Contraseña incorrecta");

        delete user.Password;
        delete user.Id;
        const secret: Secret = process.env.JWT_SECRET || "sin secreto";
        const token = jwt.sign(user, secret, { expiresIn: "24h" });

        res.cookie("jwt", token, { sameSite: "strict", httpOnly: true }).send("logged in");
        console.log("User logged in");
    } catch (err) {
        sendError(res, 500, err);
    }
};

export const getUsers = async (req: Request, res: Response) => {
    try {
        const [users] = await sql.query("Select Id, UserName, Perm_assistance,Perm_users,Perm_productivity,Perm_employees from users ");
        res.send(users);
    } catch (err) {
        sendError(res, 500, err);
    }
};
