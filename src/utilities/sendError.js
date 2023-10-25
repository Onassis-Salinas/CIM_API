function sendError(res, err, info=undefined) {
    let listOfErrors = {
        1064: "Error de sql",
        1048: "Dato Invalido",
        1054: "Dato Invalido",
        1146: "Error de codigo: Tabla inexistente",
        1292: "Fecha incorrecta",
        1406: "Dato muy largo",
        1062: "Dato duplicado"
    };

    console.log(err.errno);
    console.log(err.code);
    console.log(err.sqlMessage);
    res.status(500).send({ error: listOfErrors[err.errno], info: info });
}

module.exports = sendError;
