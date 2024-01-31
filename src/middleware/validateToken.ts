const jwt = require("jsonwebtoken");
import sendError from "../utilities/sendError";
import { Response, Request, NextFunction } from "express";

interface CustomRequest extends Request {
    user?: any;
}

const validateToken = (req: CustomRequest, res: Response, next: NextFunction) => {
    if (req.path === "/general/users/login") return next();

    const token = req.cookies.jwt || req.header("Authorization");
    if (!token) return sendError(res, 401, "No se encontraron credenciales");

    jwt.verify(token, process.env.JWT_SECRET, (err: any, decoded: any) => {
        if (err) return sendError(res, 401, "Token invalido");

        req.user = decoded;
        next();
    });
};

export default validateToken;
