const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.API_PORT || 3000;

const inventoryRoute = require("./src/Inventarios/mainRouter");
const generalRoute = require("./src/General/mainRouter");
const employeeRoute = require("./src/Empleados/mainRouter");
const validateToken = require("./src/middleware/validateToken");

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(validateToken);
app.use("/inventory", inventoryRoute);
app.use("/employees", employeeRoute);
app.use("/general", generalRoute);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
