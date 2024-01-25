function sendError(res, status, err) {
    console.log(err);

    let errMessage = err;

    if (status === 403) errMessage = "No cuentas con los permisos necesarios";
    if (status === 500) errMessage = "Error en el servidor";

    return res.status(status).send({ message: errMessage });
}
module.exports = sendError;
