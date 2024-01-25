const sendError = require("../utilities/sendError");

const traduction = {
    Password: "Contraseña",
    UserName: "Nombre de usuario",
};

const validateReq = (data) => (req, res, next) => {
    const dataMissing = data.some((required) => {
        if (!req.body[required]) sendError(res, 400, `Falta el siguiente dato: ${traduction[required] || required}`);
        return !req.body[required];
    });

    if (!dataMissing) next();
};

module.exports = validateReq;
