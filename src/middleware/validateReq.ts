import sendError from "../utilities/sendError";
import { Response, Request, NextFunction } from "express";

const traduction: any = {
    Password: "Contraseña",
    UserName: "Nombre de usuario",
};

const validateReq = (data: any) => (req: Request, res: Response, next: NextFunction) => {
    const dataMissing = data.some((required: any) => {
        if (!req.body[required]) sendError(res, 400, `Falta el siguiente dato: ${traduction[required] || required}`);
        return !req.body[required];
    });

    if (!dataMissing) next();
};

export default validateReq;
