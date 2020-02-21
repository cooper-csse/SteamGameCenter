$ = require("jquery");
require("jquery-validation");
db = require(__dirname + "/js/routines");
require("bootstrap");
require("popper.js");

developerList = $("#developer-list");
developerModal = $("#developer-modal");

browseMode = true;

developerData = {
	name: $("#developer-name"),
	address: $("#developer-address"),
	games: $("#developer-games")
};

searchData = {
	modal: $("#search-modal"),
	tabs: {
		basic: $("#tabs-search-basic"),
		advanced: $("#tabs-search-advanced")
	},
	name: $("#search-name"),
	address: $("#search-address"),
	games: {
		from: $("#search-games-from"),
		to: $("#search-games-to")
	}
};

oldDevelopers = [];
selectedDeveloper = "";

function displayDevelopers(developers) {
	if (developers === undefined) developers = oldDevelopers;
	else oldDevelopers = developers;
	db.getFollowingDev().then(result => {
		let following = [];
		for (let developer of result.recordset) following.push(developer.ID);

		developerList.empty();
		let i = 0;
		for (let developer of developers) {
			i++;
			developerList.append(`
				<tr class="developer" id="developer-${developer.ID}">
					<td>${developer.Name}</td>
					<td>${developer.Address.slice(0, 20) + (developer.Address.length > 20 ? "..." : "")}</td>
					<td>${developer.Games}</td>
					<td>
						<button onclick="showModal('${developer.ID}')" class="action-info developer-action btn btn-sm btn-outline-info"><i class="fas fa-info"></i></button>
						${(following.includes(developer.ID)) ?
							`<button onclick="removeFollowing('${developer.ID}')" class="action-remove developer-action btn btn-sm btn-outline-danger"><i class="fas fa-xs fa-minus"></i></button>` :
							`<button onclick="addFollowing('${developer.ID}')" class="action-add developer-action btn btn-sm btn-outline-success"><i class="fas fa-xs fa-plus"></i></button>`
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
	db.getDeveloperDetails(id).then(result => {
		let developer = result.recordset[0];
		let date = new Date(developer.Release);
		selectedDeveloper = developer.Name;
		developerData.name.html(developer.Name);
		developerData.address.html(developer.Address);
		developerData.games.html(developer.Games + " game" + (developer.Games !== 1 ? 's' : ""));
		developerModal.modal();
	});
}

function reload() {
	(browseMode ? db.getDevelopers() : db.getFollowingDev()).then(result => {
		displayDevelopers(result.recordset);
	});
}

function addFollowing(id="") {
	db.addFollowingDev(id).then(result => {
		displayDevelopers();
	});
}

function removeFollowing(id="") {
	db.removeFollowingDev(id).then(result => {
		displayDevelopers();
	});
}

$("#reload").on("click", e => {
	searchData.name.val("");
	searchData.address.val("");
	searchData.games.from.val("");
	searchData.games.to.val("");
	reload();
});

$("#mode-game-browse").on("click", e => {
	$("#wrapper").toggleClass("toggled");
	window.location = "games.html";
});

$("#mode-game-following").on("click", e => {
	$("#wrapper").toggleClass("toggled");
	window.location = "games.html?following=true";
});

$("#mode-developer-browse").on("click", e => {
	$("#wrapper").toggleClass("toggled");
	browseMode = true;
	reload();
});

$("#mode-developer-following").on("click", e => {
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
		db.basicSearchDev(searchData.name.val()).then(result => {
			displayDevelopers(result.recordset);
		});
		return;
	}
	let data = {
		address: searchData.address.val(),
		games: {
			from: searchData.games.from.val(),
			to: searchData.games.to.val(),
		}
	};
	db.advancedSearchDev(data).then(result => {
		displayDevelopers(result.recordset);
	})
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
	db.basicSearchDev(tags["developer"]).then(result => {
		displayDevelopers(result.recordset);
	});
} else reload();

$("#developer-view").on("click", e => {
	window.location = `games.html?developer=${selectedDeveloper}`;
});
