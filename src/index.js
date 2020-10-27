const {
	app,
	BrowserWindow,
	ipcMain,
	dialog,
	screen,
	webContents,
	Menu
} = require('electron');
const fs = require('fs');

//imports
const {
	abrirArchivo,
	escribirArchivo,
	generarCodigo,
	exportarModelo
} = require('./functions');

const Proyecto = require('./model/Proyecto');

let appWindow;
let modelsWindow;
let metadataWindow;

// * Variables del proyecto
let proyecto = {};
let modelToEdit = {};

// * Ventana inicial
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

// * Ventana de los modelos

// Menú
const templateMenu = [
	{
		label: 'Archivo',
		submenu: [
			{
				label: 'Guardar cambios',
				accelerator: 'Ctrl+S',
				click() {
					modelsWindow.webContents.send('update-project', proyecto);
					modelsWindow.webContents.send('save');
					escribirArchivo(
						proyecto.path + '/' + proyecto.name + '.json',
						proyecto
					);
				}
			}
		]
	},
	{
		label: 'Proyecto',
		submenu: [
			{
				label: 'Generar código',
				accelerator: 'Ctrl+E',
				click() {
					modelsWindow.webContents.send('update-project', proyecto);
					modelsWindow.webContents.send('save');
					escribirArchivo(
						proyecto.path + '/' + proyecto.name + '.json',
						proyecto
					);
					generarCodigo(proyecto);
					dialog.showMessageBox(modelsWindow, {
						type: 'info',
						title: 'Proyecto exportado',
						message:
							'El proyecto ha sido exportado con exito, puede encontrar los archivos generados en la carpeta out.'
					});
				}
			}
		]
	},
	{
		label: 'Acerca de',
		click() {
			dialog.showMessageBox(modelsWindow, {
				type: 'info',
				title: 'Acerca de C-Tool',
				message: `Dirección General de Planeación.
				Dirección de Información y Sistemas.

				C-ToolP

				Elaborado por:

				Academicos:
				- Mtro. Jesus Gabriel Banda Durán.
				- Dr Luis Heriberto García Islas.
				
				Alumnos:
				- Alfredo Rafael González Rodríguez.
				- Daniel Antonio Vera Ondarza.
				
				Versión 1.0.1
				Fecha de creación/ 26/10/2020`
			});
		}
	}
];

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

	const mainMenu = Menu.buildFromTemplate(templateMenu);
	Menu.setApplicationMenu(mainMenu);

	modelsWindow.once('ready-to-show', () => {
		modelsWindow.show();
		modelsWindow.maximize();
	});
}

// * Ventana de los metadatos
function createMetadataWindow(model) {
	metadataWindow = new BrowserWindow({
		parent: modelsWindow,
		modal: true,
		minWidth: 900,
		minHeight: 700,
		title: `C-Tool: ${model} Metadata`,
		show: false,
		minimizable: false,
		webPreferences: {
			nodeIntegration: true,
			nodeIntegrationInWorker: true
		}
	});

	metadataWindow.removeMenu();

	metadataWindow.loadFile('./src/view/metadata/index.html');

	metadataWindow.on('closed', () => (metadataWindow = null));

	metadataWindow.on('close', () =>
		modelsWindow.webContents.send('update-project', proyecto)
	);

	metadataWindow.once('ready-to-show', () => {
		metadataWindow.show();
		metadataWindow.maximize();
	});

	metadataWindow.focus();
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

ipcMain.on('open-metadata', (event, { modelKey }) => {
	createMetadataWindow(proyecto.models[modelKey].name);
	modelToEdit.name = proyecto.models[modelKey].name;
	modelToEdit.key = modelKey;
});

ipcMain.on('get-model', event => {
	event.sender.send('model-info', { proyecto, modelToEdit });
});

ipcMain.on('export-model', (event, { key }) => {
	escribirArchivo(proyecto.path + '/' + proyecto.name + '.json', proyecto);
	const out = dialog.showOpenDialogSync(modelsWindow, {
		title: `Exportar modulo ${proyecto.models[key].name} en...`,
		defaultPath: proyecto.path,
		properties: ['openDirectory']
	});
	if (out) {
		exportarModelo(proyecto, key, out, modelsWindow);
	}
});
