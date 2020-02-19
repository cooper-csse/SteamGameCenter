// const remote = require("electron").remote;
$ = require("jquery");
require("jquery-validation");
db = require(__dirname + "/js/routines");
require("bootstrap");
require("popper.js");

gameList = $("#game-list");
gameModal = $("#game-modal");

browseMode = true;

gameData = {
	title: $("#game-title"),
	date: $("#game-date"),
	description: $("#game-description"),
	price: $("#game-price"),
	sale: $("#game-sale")
};

searchData = {
	modal: $("#search-modal"),
	tabs: {
		basic: $("#tabs-search-basic"),
		advanced: $("#tabs-search-advanced")
	},
	title: $("#search-title"),
	tags: $("#search-tags"),
	date: {
		from: $("#search-date-from"),
		to: $("#search-date-to")
	},
	price: {
		from: $("#search-price-from"),
		to: $("#search-price-to")
	},
	rating: {
		positive: $("#search-rating-positive"),
		good: $("#search-rating-good"),
		mixed: $("#search-rating-mixed"),
		bad: $("#search-rating-bad"),
		negative: $("#search-rating-negative")
	},
	developers: $("#search-developers"),
	publishers: $("#search-publishers")
};

function displayGames(games) {
	db.getFollowing().then(result => {
		let following = [];
		for (let game of result.recordset) following.push(game.ID);

		gameList.empty();
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
					<td>
						<button onclick="showModal('${game.ID}')" class="action-info game-action btn btn-sm btn-outline-info"><i class="fas fa-info"></i></button>
						${(following.includes(game.ID)) ?
							`<button onclick="removeFollowing('${game.ID}')" class="action-remove game-action btn btn-sm btn-outline-danger"><i class="fas fa-xs fa-minus"></i></button>` :
							`<button onclick="addFollowing('${game.ID}')" class="action-add game-action btn btn-sm btn-outline-success"><i class="fas fa-xs fa-plus"></i></button>`
						}
					</td>
				</tr>
			`);
		}
	});
}

function populateTags(tags) {
	searchData.tags.empty();
	for (let tag of tags) {
		searchData.tags.append(`
			<button id="tag-${tag.ID}" class="tag btn btn-sm btn-outline-secondary shadow-none" onclick="clickTag('${tag.ID}')">${tag.Name}</button>
		`);
	}
}

function populateDevelopers(developers) {
	searchData.developers.empty();
	for (let developer of developers) {
		searchData.developers.append(`
			<div class="custom-control custom-checkbox mr-sm-2">
				<input type="checkbox" class="custom-control-input" id="developer-${developer.ID}">
				<label class="custom-control-label" for="developer-${developer.ID}">${developer.Name}</label>
			</div>
		`);
	}
}

function populatePublishers(publishers) {
	searchData.publishers.empty();
	for (let publisher of publishers) {
		searchData.publishers.append(`
			<div class="custom-control custom-checkbox mr-sm-2">
				<input type="checkbox" class="custom-control-input" id="developer-${publisher.ID}">
				<label class="custom-control-label" for="developer-${publisher.ID}">${publisher.Name}</label>
			</div>
		`);
	}
}

function clickTag(id) {
	let tag = $(`#tag-${id}`);
	tag.blur();
	if (tag.hasClass("btn-outline-secondary")) {
		tag.removeClass("btn-outline-secondary");
		tag.addClass("btn-secondary");
	} else {
		tag.removeClass("btn-secondary");
		tag.addClass("btn-outline-secondary");
	}
}

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
	console.log(db.getUsername());
}

function reload() {
	(browseMode ? db.getGames() : db.getFollowing()).then(result => {
		displayGames(result.recordset);
	});
}

function addFollowing(id="") {
	db.addFollowing(id).then(result => {
		reload();
	});
}

function removeFollowing(id="") {
	db.removeFollowing(id).then(result => {
		reload();
	});
}

// gameList.on("click", e => {
// 	let g = $(e.target.parentElement);
// 	console.log(g);
// 	console.log(g.attr("id").substr(12));
// 	if (g.hasClass("action-info")) {
// 		showModal(g.attr("id").substr(12));
// 	}
// });

$("#reload").on("click", e => {
	reload();
});

$("#mode-game-browse").on("click", e => {
	$("#wrapper").toggleClass("toggled");
	browseMode = true;
	reload();
});

$("#mode-game-following").on("click", e => {
	$("#wrapper").toggleClass("toggled");
	browseMode = false;
	reload();
});

$("#logout").on("click", e => {
	db.setUsername(undefined);
	window.location = "index.html";
});

$("#search-tag-clear").on("click", e => {
	for (let child of searchData.tags.children()) {
		let tag = $(child);
		if (tag.hasClass("btn-secondary")) {
			tag.removeClass("btn-secondary");
			tag.addClass("btn-outline-secondary");
		}
	}
});

$("#search-submit").on("click", e => {
	searchData.modal.modal("hide");
	if (searchData.tabs.basic.hasClass("active")) {
		db.basicSearch(searchData.title.val()).then(result => {
			displayGames(result.recordset);
		});
		return;
	}
	let getCheckedList = function(list) {
		let active = [];
		for (let child of list.children()) {
			let checkbox = $($(child).children()[0]);
			let label = $($(child).children()[1]);
			if (checkbox.is(":checked")) active.push(label.html());
		}
		return active;
	};
	let data = {
		tags: (() => {
			let active = [];
			for (let child of searchData.tags.children()) {
				let tag = $(child);
				if (tag.hasClass("btn-secondary")) active.push(tag.html());
			}
			return active;
		})(),
		date: {
			from: searchData.date.from.val(),
			to: searchData.date.to.val(),
		},
		price: {
			from: searchData.price.from.val(),
			to: searchData.price.to.val(),
		},
		rating: {
			positive: searchData.rating.positive.is(":checked"),
			good: searchData.rating.good.is(":checked"),
			mixed: searchData.rating.mixed.is(":checked"),
			bad: searchData.rating.bad.is(":checked"),
			negative: searchData.rating.negative.is(":checked"),
		},
		developers: getCheckedList(searchData.developers),
		publishers: getCheckedList(searchData.publishers)
	};
	for (let str of [data.date.from, data.date.to]) {
		let seg = str.split('-');
		if (seg.length !== 3) return;
		if (seg[0].length !== 4 || seg[1].length !== 2 || seg[2].length !== 2) return;
		if (isNaN(seg[0]) || isNaN(seg[1]) || isNaN(seg[2])) return;
		if (Number(seg[0]) < 0 || Number(seg[0]) > 9999) return;
		if (Number(seg[1]) < 0 || Number(seg[1]) > 12) return;
		if (Number(seg[2]) < 0 || Number(seg[2]) > 31) return;
	}
	db.advancedSearch(data).then(result => {
		displayGames(result.recordset);
	})
});

reload();
db.getTags().then(result => {
	populateTags(result.recordset);
});
db.getDevelopers().then(result => {
	populateDevelopers(result.recordset);
});
db.getPublishers().then(result => {
	populatePublishers(result.recordset);
});
