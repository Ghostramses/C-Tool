const { ipcRenderer } = require('electron');

let proyecto = {};
let moduleToEdit = {};

document.addEventListener('DOMContentLoaded', () => {
	const titulo = document.getElementById('moduleName');

	ipcRenderer.send('get-module-to-edit');
	ipcRenderer.on('module-info', (event, args) => {
		proyecto = args.proyecto;
		moduleToEdit = args.moduleToEdit;
		titulo.innerText = moduleToEdit.name;
	});
});
