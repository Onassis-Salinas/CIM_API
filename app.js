const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.API_PORT || 3000;

const inventoryRoute = require("./src/Inventarios/mainRouter");
const employeeRoute = require("./src/Empleados/mainRouter");

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});

app.use(
    cors({
        origin: ["http://192.168.0.42:5000", "http://192.168.0.42:5173"],
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true,
    })
);

app.use(express.json());
app.use("/inventory", inventoryRoute);
app.use("/employees", employeeRoute);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
