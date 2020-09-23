const { app, BrowserWindow, ipcMain, dialog, screen } = require('electron');
const fs = require('fs');

//imports
const { abrirArchivo, escribirArchivo } = require('./functions');

const Proyecto = require('./model/Proyecto');
const Modulo = require('./model/Modulo');

let appWindow;
let modelsWindow;
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

function createModelsWindow() {
	const { width, height } = screen.getPrimaryDisplay().workAreaSize;
	modelsWindow = new BrowserWindow({
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

	modelsWindow.on('closed', () => (modelsWindow = null));

	modelsWindow.loadFile('./src/view/modelos/index.html');

	modelsWindow.once('ready-to-show', () => {
		modelsWindow.show();
		modelsWindow.maximize();
	});
}

function createEditorWindow(modulo) {
	editorWindow = new BrowserWindow({
		parent: modelsWindow,
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

	editorWindow.on('closed', () => {
		editorWindow = null;
	});
	editorWindow.on('close', () =>
		modelsWindow.webContents.send('update-project', proyecto)
	);

	editorWindow.once('ready-to-show', () => {
		editorWindow.show();
		editorWindow.maximize();
	});

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
		} else {
			const filePath = proyecto.path + '/' + proyecto.name + '.json';
			try {
				escribirArchivo(filePath, proyecto);
				abrirArchivo(filePath);
				createModelsWindow();
			} catch (e) {
				if (e.code === 'ENOENT') {
					dialog.showErrorBox(
						'Ha ocurrido un error',
						'El nombre del proyecto contiene un caracter no válido.'
					);
					appWindow.webContents.send('error-nombre-proyecto');
					return;
				}
				dialog.showErrorBox(
					'Ha ocurrido un error',
					'No se ha podido escribir en el archivo del proyecto'
				);
			}
		}
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
				createModelsWindow();
			}
		});
});

ipcMain.on('get-project', event => {
	event.sender.send('project-info', proyecto);
});

ipcMain.on('save-local', (event, args) => (proyecto = args));

// ! Eliminar open-editor

ipcMain.on('open-editor', (event, { moduleName, moduleKey }) => {
	createEditorWindow(moduleName);
	moduleToEdit.name = moduleName;
	moduleToEdit.key = moduleKey;
});

ipcMain.on('open-metadata', (event, { moduleKey }) => {
	// TODO crear la ventana del editor de metadatos
	moduleToEdit.name = proyecto.models[moduleKey].name;
	moduleToEdit.key = moduleKey;
	console.log(moduleToEdit);
});

ipcMain.on('get-module-to-edit', event =>
	event.sender.send('module-info', { proyecto, moduleToEdit })
);

ipcMain.on('test', event => {
	console.log(event);
	console.log('Si envia');
});
