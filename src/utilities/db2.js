const pool = require("./db");
const sql = pool.promise();

module.exports = sql;
