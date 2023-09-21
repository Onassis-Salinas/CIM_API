const mysql = require('mysql2');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    database: 'mydb',
    password: 'admin',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};
const pool = mysql.createPool(dbConfig);
console.log("Conected to DB");

module.exports = pool;
