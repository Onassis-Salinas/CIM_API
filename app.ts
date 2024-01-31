import express from "express";
import { Response, Request } from "express";
const cookieParser = require("cookie-parser");
const cors = require("cors");
import db from "./src/utilities/db";
require("dotenv").config();

const app = express();
const port = process.env.API_PORT || 3000;

import generalRoute from "./src/General/mainRouter";
import employeeRoute from "./src/Empleados/mainRouter";
import validateToken from "./src/middleware/validateToken";

app.use("/test", (req: Request, res: Response) => {
    db.query("select version()", (err: any, rows: any, fields: any) => {
        if (err) return res.send(err);
        res.send(rows);
    });
});

app.use((req: any, res: any, next: any) => {
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
