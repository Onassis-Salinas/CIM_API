const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

const inventoryRoute = require("./src/Inventarios/mainRouter.js");
const employeeRoute = require("./src/Empleados/mainRouter.js");


app.use((req, res, next) => {
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});
app.use(
    cors({
        origin: "http://192.168.0.42:5000",
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
