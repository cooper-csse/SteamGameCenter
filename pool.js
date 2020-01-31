const sql = require("mssql");
const config = require("./database.json");

const pool = new sql.ConnectionPool(config);
const connection = pool.connect();
pool.on('error', err => {});

pool.connection = connection;
module.exports = pool;
