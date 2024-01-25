const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const db = require("./src/utilities/db");
require("dotenv").config();

const app = express();
const port = process.env.API_PORT || 3000;

const generalRoute = require("./src/General/mainRouter");
const employeeRoute = require("./src/Empleados/mainRouter");
const validateToken = require("./src/middleware/validateToken");

app.use("/test", (req, res) => {
    db.query("select version()", (err, rows, fields) => {
        if (err) return res.send(err);
        res.send(rows);
    });
});

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});
app.use(
    cors({
        origin: "http://localhost:5173",
    })
);
app.use(cookieParser());
app.use(express.json());
app.use(validateToken);
app.use("/employees", employeeRoute);
app.use("/general", generalRoute);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
