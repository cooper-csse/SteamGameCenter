const crypto = require("crypto");

module.exports = {
	generateSalt: function () {
		return crypto.randomBytes(16).toString("hex").slice(0, 32);
	},
	hashPassword: function (password, salt) {
		let hash = crypto.createHmac("sha256", salt);
		hash.update(password);
		return hash.digest("hex");
	}
};
