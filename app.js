const express = require("express");
const cors = require('cors');  
const app = express();
const port = 3000;

const inventoryRoute = require("./src/routes/InventoryRoute");
const materialsRoute = require("./src/routes/materialsRoute");
const movementsRoute = require("./src/routes/movementsRoute");
const functionsRoute = require("./src/routes/FunctionsRoute");
const exportsRoute = require("./src/routes/exportsRoute");

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
app.use(cors({
    origin: 'http://192.168.0.42:5000', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
  }));

app.use(express.json());
app.use("/movements", movementsRoute);
app.use("/inventory", inventoryRoute);
app.use("/materials", materialsRoute);
app.use("/functions", functionsRoute);
app.use("/exports", exportsRoute);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
