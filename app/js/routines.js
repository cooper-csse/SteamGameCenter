// const sql = require("mssql");
const pool = require("electron").remote.require("./pool");

module.exports = {
	doesUserExist: async function(username) {
		await pool.constructor;
		try {
			const request = pool.request();
			const result = request.query(`SELECT * FROM Login WHERE Username='${username}'`);
			return await result.then(res => {
				return res.recordset.length !== 0;
			});
		} catch (e) {
			console.error('SQL error', e);
		}
	},
	doesPasswordMatch: async function(username, password) {
		await pool.constructor;
		try {
			const request = pool.request();
			const result = request.query(`SELECT * FROM Login WHERE Username='${username}' AND Password='${password}'`);
			return await result.then(res => {
				return res.recordset.length !== 0;
			});
		} catch (e) {
			console.error('SQL error', e);
		}
	},
	addUser: async function(username, password) {
		await pool.constructor;
		try {
			const request = pool.request();
			const result = request.query(`INSERT INTO Login VALUES('${username}', '${password}', '')`);
			return await result.then(res => {
				return res;
			});
		} catch (e) {
			console.error('SQL error', e);
		}
	},
};
