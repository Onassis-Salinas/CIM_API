const res = require("express/lib/response");
const { contentType } = require("express/lib/response");
const mysql = require("mysql2");

const dbConfig = {
    host: process.env.DB_HOST || "127.0.0.1",
    user: process.env.DB_USER || "root",
    database: process.env.DB_NAME || "cim",
    password: process.env.DB_PASSWORD || "123",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
};

const pool = mysql.createPool(dbConfig);
console.log("Conected to DB");

module.exports = pool;
