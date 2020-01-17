const {app, BrowserWindow} = require('electron');
const path = require('path');

app.setAppUserModelId('edu.rose-hulman.SteamGameCenter');

let mainWindow;
const createMainWindow = async () => {
	const win = new BrowserWindow({
		title: app.name,
		show: false,
		width: 600,
		height: 400,
		backgroundColor: "#424242"
	});

	win.on('ready-to-show', () => {
		win.show();
	});

	win.on('closed', () => {
		mainWindow = undefined;
	});

	await win.loadFile(path.join(__dirname, 'app/index.html'));

	return win;
};

if (!app.requestSingleInstanceLock()) {
	app.quit();
}

app.on('second-instance', () => {
	if (mainWindow) {
		if (mainWindow.isMinimized()) mainWindow.restore();
		mainWindow.show();
	}
});

app.on('window-all-closed', () => {
	// if (!is.macos) {
		app.quit();
	// }
});

app.on('activate', async () => {
	if (!mainWindow) mainWindow = await createMainWindow();
});

(async () => {
	await app.whenReady();
	mainWindow = await createMainWindow();
	mainWindow.webContents.toggleDevTools();
	mainWindow.setMenu(null);
})();
