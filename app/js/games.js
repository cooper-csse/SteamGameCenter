$ = require("jquery");
require("jquery-validation");
db = require(__dirname + "/js/routines");
download = require(__dirname + "/js/download");
require("bootstrap");
require("popper.js");

gameList = $("#game-list");
gameModal = $("#game-modal");

browseMode = true;

gameData = {
	title: $("#game-title"),
	date: $("#game-date"),
	description: $("#game-description"),
	tags: $("#game-tags"),
	price: $("#game-price"),
	sale: $("#game-sale"),
	publisher: $("#game-publisher"),
	developer: $("#game-developer"),
	license: {
		from: $("#game-license-from"),
		to: $("#game-license-to")
	},
	rating: $("#game-rating"),
	reviews: $("#game-reviews")
};

searchData = {
	modal: $("#search-modal"),
	progressBar: $("#progress-bar"),
	progressContainer: $("#progress-container"),
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
	sale: {
		from: $("#search-sale-from"),
		to: $("#search-sale-to")
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

oldGames = [];
selectedDeveloper = "";

function displayGames(games) {
	if (games === undefined) games = oldGames;
	else oldGames = games;
	db.getFollowingGame().then(result => {
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

function clearTags() {
	for (let child of searchData.tags.children()) {
		let tag = $(child);
		if (tag.hasClass("btn-secondary")) {
			tag.removeClass("btn-secondary");
			tag.addClass("btn-outline-secondary");
		}
	}
}

function clickTag(id) {
	let tag = $(`#tag-${id}`);
	tag.blur();
	clearTags();
	searchData.tags.trigger("click");
	if (tag.hasClass("btn-outline-secondary")) {
		tag.removeClass("btn-outline-secondary");
		tag.addClass("btn-secondary");
	} else {
		tag.removeClass("btn-secondary");
		tag.addClass("btn-outline-secondary");
	}
}

function clickGameTag(tag) {
	let data = {
		tag: tag,
		date: {
			from: "",
			to: "",
		},
		price: {
			from: "",
			to: "",
		},
		sale: {
			from: "",
			to: "",
		},
		rating: {
			positive: false,
			good: false,
			mixed: false,
			bad: false,
			negative: false,
		},
		developers: [],
		publishers: []
	};
	db.advancedSearchGames(data).then(result => {
		gameModal.modal("hide");
		displayGames(result.recordset);
	});
}

function showModal(id="") {
	db.getGameDetails(id).then(result => {
		let game = result.recordset[0];
		let date = new Date(game.Release);
		gameData.title.html(game.Title);
		gameData.date.html(date.toISOString().substr(0, 10));
		gameData.description.html(game.Description);
		gameData.price.html('$' + game.Price);
		gameData.sale.html(game.Sale === 0 ? "" : (game.Sale * 100).toFixed(0) + '%');
		gameData.reviews.empty();
		db.getReviews(id).then(result => {
			for (let review of result.recordset) {
				gameData.reviews.append(`
					<tr class="game" id="game-${game.ID}">
						<td class="thumb text-${review.Score ? "success" : "danger"}"><i class="fas fa-thumbs-${review.Score ? "up" : "down"}"></i></td>
						<td>${new Date(review.Date).toISOString().substr(0, 10)}</td>
						<td>${review.Content}</td>
					</tr>
				`);
			}
			db.getGameDeveloperPublisherLicense(id).then(result => {
				let data = result.recordset[0];
				selectedDeveloper = data.Developer;
				gameData.publisher.html(data.Publisher);
				gameData.developer.html(data.Developer);
				gameData.license.from.html(new Date(data.Start).toISOString().substr(0, 10));
				gameData.license.to.html(new Date(data.End).toISOString().substr(0, 10));
				db.getReviewRate(game.ID).then(result => {
					let rating = result.recordset[0].Score;
					if (rating > 80 && rating <= 100) gameData.rating.html("Positive");
					else if (rating > 60 && rating <= 80) gameData.rating.html("Good");
					else if (rating > 40 && rating <= 60) gameData.rating.html("Mixed");
					else if (rating > 20 && rating <= 40) gameData.rating.html("Bad");
					else if (rating >= 0 && rating <= 20) gameData.rating.html("Negative");
					db.getTagsForGame(game.ID).then(result => {
						gameData.tags.empty();
						for (let tag of result.recordset) {
							gameData.tags.append(`
								<button id="game-tag-${tag.ID}" type="button" class="tag btn btn-sm btn-outline-secondary shadow-none" onclick="clickGameTag('${tag.Name}')">${tag.Name}</button>
							`);
						}
						gameModal.modal();
					});
				});
			});
		});
	});
}

function reload() {
	(browseMode ? db.getGames() : db.getFollowingGame()).then(result => {
		displayGames(result.recordset);
	});
}

function addFollowing(id="") {
	db.addFollowingGame(id).then(result => {
		displayGames();
	});
}

function removeFollowing(id="") {
	db.removeFollowingGame(id).then(result => {
		displayGames();
	});
}

function clear() {
	clearTags();
	searchData.title.val("");
	searchData.date.from.val("");
	searchData.date.to.val("");
	searchData.price.from.val("");
	searchData.price.to.val("");
	searchData.sale.from.val("");
	searchData.sale.to.val("");
	searchData.rating.positive.prop("checked", false);
	searchData.rating.good.prop("checked", false);
	searchData.rating.mixed.prop("checked", false);
	searchData.rating.bad.prop("checked", false);
	searchData.rating.negative.prop("checked", false);
	for (let list of [searchData.developers, searchData.publishers]) {
		for (let child of list.children()) {
			$($(child).children()[0]).prop("checked", false);
		}
	}
	reload();
}

$("#reload").on("click", e => {
	clear();
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

$("#mode-developer-browse").on("click", e => {
	$("#wrapper").toggleClass("toggled");
	window.location = "developers.html";
});

$("#mode-developer-following").on("click", e => {
	$("#wrapper").toggleClass("toggled");
	window.location = "developers.html?following=true";
});

$("#logout").on("click", e => {
	db.setUsername(undefined);
	window.location = "index.html";
});

$("#search-tag-clear").on("click", e => {
	clearTags();
});

$("#search-submit").on("click", e => {
	searchData.modal.modal("hide");
	if (searchData.tabs.basic.hasClass("active")) {
		db.basicSearchGames(searchData.title.val()).then(result => {
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
		tag: (() => {
			for (let child of searchData.tags.children()) {
				let tag = $(child);
				if (tag.hasClass("btn-secondary")) {
					return tag.html();
				}
			}
			return "";
		})(),
		date: {
			from: searchData.date.from.val(),
			to: searchData.date.to.val(),
		},
		price: {
			from: searchData.price.from.val(),
			to: searchData.price.to.val(),
		},
		sale: {
			from: searchData.sale.from.val(),
			to: searchData.sale.to.val(),
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
		if (str === "") continue;
		let seg = str.split('-');
		if (seg.length !== 3) return;
		if (seg[0].length !== 4 || seg[1].length !== 2 || seg[2].length !== 2) return;
		if (isNaN(seg[0]) || isNaN(seg[1]) || isNaN(seg[2])) return;
		if (Number(seg[0]) < 0 || Number(seg[0]) > 9999) return;
		if (Number(seg[1]) < 0 || Number(seg[1]) > 12) return;
		if (Number(seg[2]) < 0 || Number(seg[2]) > 31) return;
	}
	db.advancedSearchGames(data).then(result => {
		displayGames(result.recordset);
	})
});

gameData.developer.on("click", e => {
	e.preventDefault();
	window.location = `developers.html?developer=${selectedDeveloper}`;
});

db.isUserAdmin(db.getUsername()).then(result => {
	if (!result) return;
	$("#admin-tools").empty().append(`	
		<a href="#" class="list-group-item list-group-item-action bg-dark">
			<h4>Data</h4>
			<div class="btn-group" role="group" aria-label="Basic example">
				<button id="mode-data-import" type="button" class="btn btn-sm btn-secondary">Import</button>
				<button id="mode-data-export" type="button" class="btn btn-sm btn-secondary">Export</button>
			</div>
		</a>
	`);

	$("#mode-data-import").on("click", e=> {
		download.import().then(async result => {
			let data = JSON.parse(result);
			try {
				searchData.progressBar.removeClass("bg-danger");
				searchData.progressBar.removeClass("bg-success");
				searchData.progressBar.addClass("bg-primary");
				searchData.progressBar.addClass("progress-bar-animated");
				searchData.progressContainer.fadeIn();
				searchData.progressBar.width("0%");
				let count = data.games.length + data.login.length;
				let i = 0.0;
				for (let game of data.games) {
					i++;
					searchData.progressBar.width(100 * i / count + "%");
					await db.importGame(game);
				}
				for (let login of data.login) {
					i++;
					searchData.progressBar.width(100 * i / count + "%");
					await db.importLogin(login);
				}
				searchData.progressBar.width("100%");
				searchData.progressBar.removeClass("bg-primary");
				searchData.progressBar.removeClass("progress-bar-animated");
				searchData.progressBar.addClass("bg-success");
				setTimeout(() => {
					searchData.progressContainer.fadeOut();
				}, 500);
				clear();
			} catch (e) {
				searchData.progressBar.removeClass("bg-primary");
				searchData.progressBar.removeClass("progress-bar-animated");
				searchData.progressBar.addClass("bg-danger");
				throw new Error(e.message);
			}
		});
	});

	$("#mode-data-export").on("click", e => {
		db.getExport().then(result => {
			download.export(JSON.stringify(result));
		});
	});
});

loc = window.location.href.split('?');
tags = {};
if (loc.length !== 1) {
	let getList = loc[1].split('&');
	for (let get of getList) {
		let split = get.split('=');
		tags[split[0]] = decodeURI(split[1]);
	}
}

if ("following" in tags) browseMode = false;
if ("developer" in tags) {
	let data = {
		tag: "",
		date: {
			from: "",
			to: "",
		},
		price: {
			from: "",
			to: "",
		},
		sale: {
			from: "",
			to: "",
		},
		rating: {
			positive: false,
			good: false,
			mixed: false,
			bad: false,
			negative: false,
		},
		developers: [tags["developer"]],
		publishers: ""
	};
	db.advancedSearchGames(data).then(result => {
		displayGames(result.recordset);
	})
} else reload();

db.getTags().then(result => {
	populateTags(result.recordset);
});
db.getDevelopersAlphabetical().then(result => {
	populateDevelopers(result.recordset);
});
db.getPublishersAlphabetical().then(result => {
	populatePublishers(result.recordset);
});
