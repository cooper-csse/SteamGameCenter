const pool = require("electron").remote.require("./pool");
const hashing = require("./hashing");

function verify(params=[]) {
	for (let param of params) {
		//if (param.includes(';') && (param.includes("'") || param.includes('"'))) {
		if (param.includes("'")) {
			window.location = "catch.html";
			return true;
		}
	}
	return false;
}

getExportGames = async function() {
	await pool.constructor;
	try {
		const request = pool.request();
		const result = request.query(`SELECT * From ExportGamesView`);
		return await result.then(res => {
			return res;
		});
	} catch (e) {
		throw new Error(e.message);
	}
};

getExportLogin = async function() {
	await pool.constructor;
	try {
		const request = pool.request();
		const result = request.query(`SELECT * From ExportLoginView`);
		return await result.then(res => {
			return res;
		});
	} catch (e) {
		throw new Error(e.message);
	}
};

module.exports = {
	isConnected: function() {
		return pool.connected;
	},
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
			throw new Error(e.message);
		}
	},
	isUserAdmin: async function(username) {
		if (verify([username])) throw new Error("SQL injection");
		await pool.constructor;
		try {
			const request = pool.request();
			const result = request.query(`SELECT * FROM Login WHERE Username='${username}'`);
			return await result.then(res => {
				return res.recordset[0].Admin === 1;
			});
		} catch (e) {
			throw new Error(e.message);
		}
	},
	doesPasswordMatch: async function(username, password) {
		if (verify([username, password])) throw new Error("SQL injection");
		await pool.constructor;
		try {
			const request = pool.request();
			const result = request.query(`SELECT * FROM Login WHERE Username='${username}'`);
			return await result.then(res => {
				if (res.recordset.length === 0) return false;
				return res.recordset[0].Password === hashing.hashPassword(password, res.recordset[0].Salt);
			});
		} catch (e) {
			throw new Error(e.message);
		}
	},
	addUser: async function(username, password) {
		if (verify([username, password])) throw new Error("SQL injection");
		let salt = hashing.generateSalt();
		let hash = hashing.hashPassword(password, salt);
		await pool.constructor;
		try {
			const request = pool.request();
			const result = request.query(`INSERT INTO Login VALUES('${username}', '${hash}', '${salt}', 0)`);
			return await result.then(res => {
				return res;
			});
		} catch (e) {
			throw new Error(e.message);
		}
	},
	getGames: async function() {
		await pool.constructor;
		try {
			const request = pool.request();
			const result = request.query(`SELECT * FROM GamesAlphabetical`);
			return await result;
		} catch (e) {
			throw new Error(e.message);
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
			throw new Error(e.message);
		}
	},
	getDevelopers: async function() {
		await pool.constructor;
		try {
			const request = pool.request();
			const result = request.query(`SELECT * FROM DeveloperData`);
			return await result;
		} catch (e) {
			throw new Error(e.message);
		}
	},
	getDeveloperDetails: async function(id) {
		if (verify([id])) throw new Error("SQL injection");
		await pool.constructor;
		try {
			const request = pool.request();
			const result = request.query(`SELECT * FROM DeveloperData WHERE ID='${id}'`);
			return await result.then(res => {
				return res;
			});
		} catch (e) {
			throw new Error(e.message);
		}
	},
	getFollowingGame: async function() {
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
			throw new Error(e.message);
		}
	},
	addFollowingGame: async function(id) {
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
			throw new Error(e.message);
		}
	},
	removeFollowingGame: async function(id) {
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
			throw new Error(e.message);
		}
	},
	getFollowingDev: async function() {
		let user = pool.user;
		await pool.constructor;
		try {
			const request = pool.request();
			const result = request.query(`
				SELECT d.ID, d.Name, d.Address, d.Games
					FROM DeveloperData d
					JOIN FollowingDev f on d.ID = f.DevID
					WHERE f.Username='${user}'
			`);
			return await result;
		} catch (e) {
			throw new Error(e.message);
		}
	},
	addFollowingDev: async function(id) {
		let user = pool.user;
		if (verify([user, id])) throw new Error("SQL injection");
		await pool.constructor;
		try {
			const request = pool.request();
			const result = request.query(`INSERT INTO FollowingDev VALUES('${user}', '${id}')`);
			return await result.then(res => {
				return res;
			});
		} catch (e) {
			throw new Error(e.message);
		}
	},
	removeFollowingDev: async function(id) {
		let user = pool.user;
		if (verify([user, id])) throw new Error("SQL injection");
		await pool.constructor;
		try {
			const request = pool.request();
			const result = request.query(`DELETE FollowingDev WHERE Username='${user}' AND DevID='${id}'`);
			return await result.then(res => {
				return res;
			});
		} catch (e) {
			throw new Error(e.message);
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
			throw new Error(e.message);
		}
	},
	getDevelopersAlphabetical: async function() {
		await pool.constructor;
		try {
			const request = pool.request();
			const result = request.query(`SELECT * FROM DevelopersAlphabetical`);
			return await result.then(res => {
				return res;
			});
		} catch (e) {
			throw new Error(e.message);
		}
	},
	getPublishersAlphabetical: async function() {
		await pool.constructor;
		try {
			const request = pool.request();
			const result = request.query(`SELECT * FROM PublishersAlphabetical`);
			return await result.then(res => {
				return res;
			});
		} catch (e) {
			throw new Error(e.message);
		}
	},
	getGameDeveloperPublisherLicense: async function(id) {
		await pool.constructor;
		try {
			const request = pool.request();
			const result = request.query(`
				SELECT d.Name as [Developer], p.Name as [Publisher], l.StartDate as [Start], l.EndDate as [End]
					FROM Game g
					JOIN Developer d on g.Developer = d.ID
					JOIN Publisher p on g.Publisher = p.ID
					JOIN License l on p.LicenseID = l.ID
					WHERE g.ID = '${id}'
			`);
			return await result.then(res => {
				return res;
			});
		} catch (e) {
			throw new Error(e.message);
		}
	},
	basicSearchGames: async function(title) {
		if (verify([title])) throw new Error("SQL injection");
		await pool.constructor;
		try {
			const request = pool.request();
			const result = request.query(`SELECT * FROM GamesAlphabetical WHERE Title LIKE '%${title}%'`);
			return await result.then(res => {
				return res;
			});
		} catch (e) {
			throw new Error(e.message);
		}
	},
	advancedSearchGames: async function(data) {
		if (verify(data.developers.concat(data.publishers).concat([data.date.from, data.date.to, data.tag]))) throw new Error("SQL injection");
		let query = `
			SELECT g.ID, g.Title, g.Price, g.Sale, g.Release, g.Description
				FROM Game g
				${data.developers.length > 0 ? "JOIN Developer d ON g.Developer = d.ID" : ""}
				${data.publishers.length > 0 ? "JOIN Publisher p on g.Publisher = p.ID" : ""}
				${data.tag !== "" ? "JOIN HasTag ht on g.ID = ht.GameID" : ""}
				${data.tag !== "" ? "JOIN Tag t on ht.TagID = t.ID" : ""}
				${(data.rating.positive || data.rating.good || data.rating.mixed || data.rating.bad || data.rating.negative) ? "JOIN GamesWithRatings r ON g.ID = r.Game" : ""}
		`;
		let c = [];
		if (data.tag !== "") c.push(`t.Name = '${data.tag}'`);
		if (data.date.from !== "") c.push(`g.Release >= '${data.date.from}'`);
		if (data.date.to !== "") c.push(`g.Release <= '${data.date.to}'`);
		if (data.price.from !== "") c.push(`g.Price >= '${data.price.from}'`);
		if (data.price.to !== "") c.push(`g.Price <= '${data.price.to}'`);
		if (data.sale.from !== "") c.push(`g.Sale >= ${data.sale.from / 100.0}`);
		if (data.sale.to !== "") c.push(`g.Sale <= ${data.sale.to / 100.0}`);
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
		let rating = [];
		if (data.rating.positive) rating.push("r.Score > 80 AND r.Score <= 100");
		if (data.rating.good) rating.push("r.Score > 60 AND r.Score <= 80");
		if (data.rating.mixed) rating.push("r.Score > 40 AND r.Score <= 60");
		if (data.rating.bad) rating.push("r.Score > 20 AND r.Score <= 40");
		if (data.rating.negative) rating.push("r.Score >= 0 AND r.Score <= 20");
		if (rating.length !== 0) c.push('(' + rating.join(" OR ") + ')');
		if (c.length !== 0) query += ` WHERE ${c.join(" AND ")}`;
		query += " ORDER BY g.Title ASC";
		await pool.constructor;
		try {
			const request = pool.request();
			const result = request.query(query);
			return await result.then(res => {
				return res;
			});
		} catch (e) {
			throw new Error(e.message);
		}
	},
	basicSearchDev: async function(name) {
		if (verify([name])) throw new Error("SQL injection");
		await pool.constructor;
		try {
			const request = pool.request();
			const result = request.query(`SELECT * FROM DeveloperData WHERE Name LIKE '%${name}%' ORDER BY Name ASC`);
			return await result.then(res => {
				return res;
			});
		} catch (e) {
			throw new Error(e.message);
		}
	},
	advancedSearchDev: async function(data) {
		if (verify([data.address])) throw new Error("SQL injection");
		let query = `SELECT * FROM DeveloperData`;
		let c = [];
		if (data.address !== "") c.push(`Address LIKE '%${data.address}%'`);
		if (data.games.from !== "") c.push(`Games >= '${data.games.from}'`);
		if (data.games.to !== "") c.push(`Games <= '${data.games.to}'`);
		if (c.length !== 0) query += ` WHERE ${c.join(" AND ")}`;
		query += " ORDER BY Name ASC";
		await pool.constructor;
		try {
			const request = pool.request();
			const result = request.query(query);
			return await result.then(res => {
				return res;
			});
		} catch (e) {
			throw new Error(e.message);
		}
	},
	getReviews: async function(id) {
		if (verify([id])) throw new Error("SQL injection");
		await pool.constructor;
		try {
			const request = pool.request();
			const result = request.query(`SELECT * FROM Review WHERE Game='${id}'`);
			return await result.then(res => {
				return res;
			});
		} catch (e) {
			throw new Error(e.message);
		}
	},
	getReviewRate: async function(id) {
		if (verify([id])) throw new Error("SQL injection");
		await pool.constructor;
		try {
			const request = pool.request();
			const result = request.query(`SELECT * From GamesWithRatings WHERE Game='${id}'`);
			return await result.then(res => {
				return res;
			});
		} catch (e) {
			throw new Error(e.message);
		}
	},
	getExport: async function() {
		let result = {};
		await getExportGames().then(async resultGames => {
			await getExportLogin().then(resultLogin => {
				result.games = resultGames.recordset;
				result.login = resultLogin.recordset;
			});
		});
		return result;
	},
	importGame: async function (game) {
		// if (verify([game.GameTitle, game.GamePrice, game.GameSale, game.GameRelease, game.GameDescription, game.DevName, game.DevAddress, game.PubName, game.LicenseStart, game.LicenseEnd, game.Tag, game.ReviewScore, game.ReviewDate, game.ReviewContent])) throw new Error("SQL injection");
		await pool.constructor;
		try {
			const request = pool.request();
			const result = request.query(`EXEC importGameData '${game.GameTitle}', '${game.GamePrice}', '${game.GameSale}', '${game.GameRelease}', '${game.GameDescription}', '${game.DevName}', '${game.DevAddress}', '${game.PubName}', '${game.LicenseStart}', '${game.LicenseEnd}', '${game.Tag}', '${game.ReviewScore}', '${game.ReviewDate}', '${game.ReviewContent}'`);
			return await result.then(res => {
				return res;
			});
		} catch (e) {
			throw new Error(e.message);
		}
	},
	importLogin: async function(login) {
		// if (verify([login.Username, login.Password, login.Salt, login.Admin, login.FollowDev, login.FollowGame])) throw new Error("SQL injection");
		await pool.constructor;
		try {
			const request = pool.request();
			const result = request.query(`EXEC importLoginData '${login.Username}', '${login.Password}', '${login.Salt}', '${login.Admin}', '${login.FollowDev}', '${login.FollowGame}'`);
			return await result.then(res => {
				return res;
			});
		} catch (e) {
			throw new Error(e.message);
		}
	}
};
