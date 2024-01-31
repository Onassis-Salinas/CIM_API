import { Response } from "express";

interface ErrorModel {
    message: string;
}

function sendError(res: Response, status: number, err?: any) {
    console.log(err);

    let error: ErrorModel = {
        message: err,
    };

    if (status === 403) error.message = "No cuentas con los permisos necesarios";
    if (status === 500) error.message = "Error en el servidor";

    return res.status(status).send(error);
}
export default sendError;
