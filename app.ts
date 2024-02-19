import express, { Application, NextFunction, Response, Request } from "express";
import generalRoute from "./src/General/mainRouter";
import employeeRoute from "./src/Empleados/mainRouter";
import inventoriesRoute from "./src/Inventarios/mainRouter";
import validateToken from "./src/middleware/validateToken";
import ImportData from "./src/utilities/ImportData";

const cookieParser = require("cookie-parser");
const cors = require("cors");

require("dotenv").config();

const app: Application = express();
const port = process.env.API_PORT || 3000;

app.get("/import", ImportData);

app.use((req: Request, res: Response, next: NextFunction) => {
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});
app.use(
    cors({
        origin: process.env.FRONT_URL || "http://localhost:5173",
    })
);
app.use(cookieParser());
app.use(express.json());
app.use(validateToken);
app.use("/employees", employeeRoute);
app.use("/inventories", inventoriesRoute);
app.use("/general", generalRoute);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
