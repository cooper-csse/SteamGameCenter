const sql = require("mssql");
const config = require("./database.json");

const pool = new sql.ConnectionPool(config);
const connection = pool.connect();
pool.on('error', err => {
	if (err !== undefined) pool.connected = true;
});

pool.connection = connection;
pool.user = undefined;
pool.connected = false;
module.exports = pool;
