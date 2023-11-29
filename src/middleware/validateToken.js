const jwt = require("jsonwebtoken");

const validateToken = (req, res, next) => {
    if (req.path === "/general/users/login") return next();

    const token = req.cookies.jwt || req.header("Authorization");
    if (!token) return res.status(401).json({ mensaje: "Acceso denegado" });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ mensaje: "Token inválido" });

        req.user = decoded;
        next();
    });
};

module.exports = validateToken;
