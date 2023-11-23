function sendError(res, err, info = undefined) {
    let listOfErrors = {
        1064: "Error de sql",
        1048: "Dato Invalido",
        1054: "Dato Invalido",
        1146: "Error de codigo: Tabla inexistente",
        1292: "Fecha incorrecta",
        1406: "Dato muy largo",
        1062: "Dato duplicado",
        1366: "Dato numerico invalido",
        1265: "Dato invalido",
    };
    console.log("--------------------------------------------------------");
    console.log(err);
    console.log("--------------------------------------------------------")
    console.log({
        number: err.errno,
        code: err.code,
        sqlMessage: err.sqlMessage,
    });
    console.log("--------------------------------------------------------")

    res.status(500).send({ error: listOfErrors[err.errno], info: info });
}

module.exports = sendError;
