const {BrowserWindow, ipcMain, dialog} = require("electron").remote;
const fs = require("fs");

module.exports = {
	import: async function() {
		let options = {
			title: "Open file",
			defaultPath: "export",
			buttonLabel: "Open",

			filters: [
				{name: "json", extensions: ["json"]},
				{name: "All Files", extensions: ['*']}
			]
		};

		return dialog.showOpenDialog(options).then(result => {
			if (result.canceled) return;
			return fs.readFileSync(result.filePaths[0], "utf8");
		});
	},
	export: function(contents) {
		let options = {
			title: "Save file",
			defaultPath: "export",
			buttonLabel: "Save",

			filters: [
				{name: "json", extensions: ["json"]},
				{name: "All Files", extensions: ['*']}
			]
		};

		dialog.showSaveDialog(options).then(result => {
			if (result.canceled) return;
			fs.writeFileSync(result.filePath, contents, 'utf-8');
		});
	}
};
