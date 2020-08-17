const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const fs = require('fs');

//imports
const { abrirArchivo, escribirArchivo } = require('./functions');

const Proyecto = require('./model/Proyecto');

let appWindow;
let proyecto;

function createWindow() {
	appWindow = new BrowserWindow({
		width: 800,
		height: 600,
		center: true,
		resizable: false,
		show: false,
		webPreferences: {
			nodeIntegration: true
		}
	});

	appWindow.removeMenu();

	appWindow.on('closed', () => (appWindow = null));

	appWindow.loadFile('./src/view/portada/index.html');

	appWindow.once('ready-to-show', () => appWindow.show());
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

ipcMain.on('open-directory', event => {
	dialog
		.showOpenDialog(appWindow, {
			properties: ['openDirectory'],
			title: 'Seleccione una carpeta'
		})
		.then(({ filePaths }) => {
			if (filePaths) {
				event.sender.send('selected-directory', filePaths);
			}
		});
});

ipcMain.on('create-project', (event, args) => {
	proyecto = new Proyecto(args.name, args.path);
	fs.stat(proyecto.path, err => {
		if (err) {
			fs.mkdir(proyecto.path, { recursive: true }, e => {
				if (e) {
					dialog.showErrorBox(
						'Ha ocurrido un error',
						'No se ha podido crear la carpeta'
					);
					return;
				}
			});
		}

		const filePath = proyecto.path + '/' + proyecto.name + '.json';
		escribirArchivo(filePath, proyecto);
		abrirArchivo(filePath);
	});
});

ipcMain.on('open-prototype', event => {
	dialog
		.showOpenDialog(appWindow, {
			title: 'Seleccione un prototipo',
			properties: ['openFile'],
			filters: [{ name: 'Prototypes', extensions: ['json'] }]
		})
		.then(({ filePaths }) => {
			proyecto = abrirArchivo(filePaths.toString());
		});
});
