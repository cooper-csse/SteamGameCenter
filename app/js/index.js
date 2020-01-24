const remote = require("electron").remote;
const $ = require("jquery");
require("bootstrap");
require("popper.js");

$("button#signup").on("click", (e) => {
	e.preventDefault();
	window.location = "signup.html";
});

$("button#login").on("click", (e) => {
	e.preventDefault();
	window.location = "login.html";
});

$("button#close").on("click", (e) => {
	e.preventDefault();
	remote.getCurrentWindow().close();
});
