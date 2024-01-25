const jwt = require("jsonwebtoken");
const sendError = require("../utilities/sendError");

const validateToken = (req, res, next) => {
    if (req.path === "/general/users/login") return next();

    const token = req.cookies.jwt || req.header("Authorization");
    if (!token) return sendError(res, 401, "No se encontraron credenciales");

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return sendError(res, 401, "Token invalido")

        req.user = decoded;
        next();
    });
};

module.exports = validateToken;
