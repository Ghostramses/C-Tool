const fs = require('fs');
const Proyecto = require('./../model/Proyecto');
const { dialog } = require('electron');

exports.escribirArchivo = (path, data) => {
	try {
		fs.writeFileSync(path, JSON.stringify(data));
	} catch (err) {
		throw err;
	}
};

exports.abrirArchivo = path => {
	let proyecto;
	try {
		const data = fs.readFileSync(path, 'utf8');
		const json = JSON.parse(data);
		if (!json.name || !json.path || !json.models) {
			let err = new Error();
			err.code = 'NOTAPROTOTYPE';
			throw err;
		}
		proyecto = new Proyecto(json.name, json.path, json.models);
	} catch (error) {
		if (error.code === 'EISDIR') {
			dialog.showErrorBox(
				'Ha ocurrido un error',
				'Ha seleccionado un directorio, por favor seleccione un archivo JSON'
			);
			return;
		} else if (error.code === 'NOTAPROTOTYPE') {
			dialog.showErrorBox(
				'Ha ocurrido un error',
				'El archivo no tiene la estructura de un proyecto de C-Tool'
			);
			return;
		} else if (error.code === 'ENOENT') {
			return;
		}
		dialog.showErrorBox('Ha ocurrido un error', 'Error al leer el archivo');
	} finally {
		return proyecto ? proyecto : null;
	}
};
