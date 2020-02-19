// const sql = require("mssql");
const pool = require("electron").remote.require("./pool");

function verify(params=[]) {
	for (let param of params) {
		if (param.includes(';') && (param.includes("'") || param.includes('"'))) {
			window.location = "catch.html";
			return true;
		}
	}
	return false;
}

module.exports = {
	getUsername: function() {
		return pool.user;
	},
	setUsername: function(username) {
		if (username !== undefined && verify([username])) throw new Error("SQL injection");
		pool.user = username;
	},
	doesUserExist: async function(username) {
		if (verify([username])) throw new Error("SQL injection");
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
		if (verify([username, password])) throw new Error("SQL injection");
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
		if (verify([username, password])) throw new Error("SQL injection");
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
	getGames: async function() {
		await pool.constructor;
		try {
			const request = pool.request();
			const result = request.query(`SELECT * FROM GamesAlphabetical`);
			// return await result.then(res => {
			// 	return res;
			// });
			return await result;
		} catch (e) {
			console.error('SQL error', e);
		}
	},
	getGameDetails: async function(id) {
		if (verify([id])) throw new Error("SQL injection");
		await pool.constructor;
		try {
			const request = pool.request();
			const result = request.query(`SELECT * FROM Game WHERE ID='${id}'`);
			return await result.then(res => {
				return res;
			});
		} catch (e) {
			console.error('SQL error', e);
		}
	},
	getFollowing: async function() {
		let user = pool.user;
		await pool.constructor;
		try {
			const request = pool.request();
			const result = request.query(`
				SELECT g.ID, g.Title, G.Price, G.Sale, G.Release, G.Description
					FROM Game g
					JOIN FollowingGame f on g.ID = f.GameID
					WHERE f.Username='${user}'
			`);
			return await result;
		} catch (e) {
			console.error('SQL error', e);
		}
	},
	addFollowing: async function(id) {
		let user = pool.user;
		if (verify([user, id])) throw new Error("SQL injection");
		await pool.constructor;
		try {
			const request = pool.request();
			const result = request.query(`INSERT INTO FollowingGame VALUES('${user}', '${id}')`);
			return await result.then(res => {
				return res;
			});
		} catch (e) {
			console.error('SQL error', e);
		}
	},
	removeFollowing: async function(id) {
		let user = pool.user;
		if (verify([user, id])) throw new Error("SQL injection");
		await pool.constructor;
		try {
			const request = pool.request();
			const result = request.query(`DELETE FollowingGame WHERE Username='${user}' AND GameID='${id}'`);
			return await result.then(res => {
				return res;
			});
		} catch (e) {
			console.error('SQL error', e);
		}
	},
	getTags: async function() {
		await pool.constructor;
		try {
			const request = pool.request();
			const result = request.query(`SELECT * FROM TagsAlphabetical`);
			return await result.then(res => {
				return res;
			});
		} catch (e) {
			console.error('SQL error', e);
		}
	},
	getDevelopers: async function() {
		await pool.constructor;
		try {
			const request = pool.request();
			const result = request.query(`SELECT * FROM DevelopersAlphabetical`);
			return await result.then(res => {
				return res;
			});
		} catch (e) {
			console.error('SQL error', e);
		}
	},
	getPublishers: async function() {
		await pool.constructor;
		try {
			const request = pool.request();
			const result = request.query(`SELECT * FROM PublishersAlphabetical`);
			return await result.then(res => {
				return res;
			});
		} catch (e) {
			console.error('SQL error', e);
		}
	},
	basicSearch: async function(name) {
		if (verify([name])) throw new Error("SQL injection");
		await pool.constructor;
		try {
			const request = pool.request();
			const result = request.query(`SELECT * FROM GamesAlphabetical WHERE Title LIKE '%${name}%'`);
			return await result.then(res => {
				return res;
			});
		} catch (e) {
			console.error('SQL error', e);
		}
	},
	advancedSearch: async function(data) {
		if (verify(data.tags.concat(data.developers).concat(data.publishers).concat([data.date.from, data.date.to]))) throw new Error("SQL injection");
		let query = `
			SELECT g.ID, g.Title, g.Price, g.Sale, g.Release, g.Description
				FROM Game g
				JOIN Developer d ON g.Developer = d.ID
				JOIN Publisher p on g.Publisher = p.ID
		`;
		let c = [];
		// if (data.tags.length > 0) {
		// 	let tagString = "";
		// 	for (let i = 0; i < data.tags.length; i++) {
		//
		// 	}
		// }
		if (data.date.from !== "") c.push(`g.Release >= '${data.date.from}'`);
		if (data.date.to !== "") c.push(`g.Release <= '${data.date.to}'`);
		if (data.price.from !== "") c.push(`g.Price >= '${data.price.from}'`);
		if (data.price.to !== "") c.push(`g.Price <= '${data.price.to}'`);
		if (data.developers.length > 0) {
			let developers = [];
			for (let developer of data.developers) developers.push(`d.Name = '${developer}'`);
			c.push('(' + developers.join(" OR ") + ')');
		}
		if (data.publishers.length > 0) {
			let publishers = [];
			for (let publisher of data.publishers) publishers.push(`p.Name = '${publisher}'`);
			c.push('(' + publishers.join(" OR ") + ')');
		}
		if (c.length !== 0) query += ` WHERE ${c.join(" AND ")}`;
		console.log(query);
		await pool.constructor;
		try {
			const request = pool.request();
			const result = request.query(query);
			return await result.then(res => {
				return res;
			});
		} catch (e) {
			console.error('SQL error', e);
		}
	}
};
