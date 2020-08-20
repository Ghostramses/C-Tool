const { app, BrowserWindow, ipcMain, dialog, screen } = require('electron');
const fs = require('fs');

//imports
const { abrirArchivo, escribirArchivo } = require('./functions');

const Proyecto = require('./model/Proyecto');
const Modulo = require('./model/Modulo');

let appWindow;
let modulesWindow;
let editorWindow;
let proyecto;
let moduleToEdit = {};

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

function createModulesWindow() {
	const { width, height } = screen.getPrimaryDisplay().workAreaSize;
	modulesWindow = new BrowserWindow({
		minWidth: 800,
		minHeight: 600,
		height,
		width,
		title: 'C-Tool: ' + proyecto.path + '/' + proyecto.name,
		show: false,
		webPreferences: {
			nodeIntegration: true,
			nodeIntegrationInWorker: true
		}
	});
	appWindow.close();

	modulesWindow.on('closed', () => (modulesWindow = null));

	modulesWindow.loadFile('./src/view/modules/index.html');

	modulesWindow.once('ready-to-show', () => modulesWindow.show());
}

function createEditorWindow(modulo) {
	/*
	if (editorWindow) {
		editorWindow.close();
	}
	*/
	editorWindow = new BrowserWindow({
		parent: modulesWindow,
		modal: true,
		minWidth: 800,
		minHeight: 600,
		title: `C-Tool: ${modulo} Editor`,
		show: false,
		webPreferences: {
			nodeIntegration: true,
			nodeIntegrationInWorker: true
		}
	});

	editorWindow.loadFile('./src/view/editor/index.html');

	editorWindow.on('closed', () => (editorWindow = null));

	editorWindow.once('ready-to-show', () => editorWindow.show());

	editorWindow.focus();
}

// * Listeners

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
		proyecto.modules.login = new Modulo('Login');
		proyecto.modules.administracion = new Modulo('Administracion');
		escribirArchivo(filePath, proyecto);
		abrirArchivo(filePath);
		createModulesWindow();
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
			if (proyecto) {
				createModulesWindow();
			}
		});
});

ipcMain.on('get-project', event => event.sender.send('project-info', proyecto));

ipcMain.on('save-local', (event, args) => (proyecto = args));

ipcMain.on('open-editor', (event, { moduleName, moduleKey }) => {
	createEditorWindow(moduleName);
	moduleToEdit.name = moduleName;
	moduleToEdit.key = moduleKey;
});

ipcMain.on('get-module-to-edit', event =>
	event.sender.send('module-info', { proyecto, moduleToEdit })
);
