// const remote = require("electron").remote;
$ = require("jquery");
db = require(__dirname + "/js/routines");
require("bootstrap");
require("popper.js");

gameList = $("#game-list");
gameModal = $("#game-modal");

gameData = {
	title: $("#game-title"),
	date: $("#game-date"),
	description: $("#game-description"),
	price: $("#game-price"),
	sale: $("#game-sale")
};

function showModal(id="") {
	db.getGameDetails(id).then(result => {
		let game = result.recordset[0];
		let date = new Date(game.Release);
		gameData.title.html(game.Title);
		gameData.date.html(date.toISOString().substr(0, 10));
		gameData.description.html(game.Description);
		gameData.price.html('$' + game.Price);
		gameData.sale.html(game.Sale == 0 ? "" : (game.Sale * 100).toFixed(0) + '%');
		gameModal.modal();
	});
}

gameList.on("click", e => {
	let g = $(e.target.parentElement);
	if (g.hasClass("game")) showModal(g.attr("id").substr(5));
});

db.getGames().then(result => {
	let games = result.recordset;
	let i = 0;
	for (let game of games) {
		i++;
		let date = new Date(game.Release);
		gameList.append(`
			<tr class="game" id="game-${game.ID}">
				<td>${game.Title}</td>
				<td>${game.Price}</td>
				<td>${Number(game.Sale).toFixed(2)}</td>
				<td>${date.toISOString().substr(0, 10)}</td>
			</tr>
		`);
	}
});