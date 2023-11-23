const mysql = require("mysql2");

const dbConfig = {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    database: process.env.DB_NAME || "mydb",
    password: process.env.DB_PASSWORD || "admin",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
};
const pool = mysql.createPool(dbConfig);
console.log("Conected to DB");

module.exports = pool;
