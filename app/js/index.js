const remote = require("electron").remote;
const $ = require("jquery");
const db = require(__dirname + "/js/routines");
require("bootstrap");
require("popper.js");

let signupError = $("#signup-error");
let loginError = $("#login-error");

db.setUsername(undefined);

$("button#signup").on("click", (e) => {
	e.preventDefault();
	signupError.html("");
	$("#signup-username").val("");
	$("#signup-password").val("");
});

$("button#signup-submit").on("click", (e) => {
	e.preventDefault();
	let username = $("#signup-username").val();
	let password = $("#signup-password").val();
	if (username === "" || password === "") {
		signupError.removeClass(["badge-danger", "badge-warning"]);
		signupError.addClass("badge-warning");
		signupError.html("Fields cannot be left blank");
		return;
	}

	db.doesUserExist(username).then(success => {
		if (success) {
			signupError.removeClass(["badge-danger", "badge-warning"]);
			signupError.addClass("badge-danger");
			signupError.html(`User '${username}' could not be created`);
		} else {
			db.addUser(username, password).then(res => {
				db.setUsername(username);
				window.location = "games.html";
			});
		}
	});
});

$("button#login").on("click", (e) => {
	e.preventDefault();
	loginError.html("");
	$("#login-username").val("");
	$("#login-password").val("");
});

$("button#login-submit").on("click", (e) => {
	e.preventDefault();
	let username = $("#login-username").val();
	let password = $("#login-password").val();
	if (username === "" || password === "") {
		loginError.removeClass(["badge-danger", "badge-warning"]);
		loginError.addClass("badge-warning");
		loginError.html("Fields cannot be left blank");
		return;
	}

	db.doesPasswordMatch(username, password).then(res => {
		if (!res) {
			loginError.removeClass(["badge-danger", "badge-warning"]);
			loginError.addClass("badge-danger");
			loginError.html("Incorrect username or password entered");
		} else {
			db.setUsername(username);
			window.location = "games.html";
		}
	});
});

$("button#close").on("click", (e) => {
	e.preventDefault();
	remote.getCurrentWindow().close();
});
