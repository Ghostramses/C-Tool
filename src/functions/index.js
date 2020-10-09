const fs = require('fs-extra');
const Proyecto = require('./../model/Proyecto');
const { app, dialog } = require('electron');
const {
	HTMLHomeGenerator
} = require('./../model/builder/HTMLGenerators/HTMLHomeGenerator');
const { ModuleGenerator } = require('./../model/builder/ModuleGenerator');
const {
	HTMLAdministrationGenerator
} = require('./../model/builder/HTMLGenerators/HTMLAdministrationGenerator');
const {
	HTMLAdminViewGenerator
} = require('./../model/builder/HTMLGenerators/HTMLAdminViewGenerator');
const {
	CargadorGenerator
} = require('./../model/builder/JavaScriptGenerators/CargadorGenerator');
const {
	ControllerGenerator
} = require('./../model/builder/JavaScriptGenerators/ControllerGenerator');
const {
	HTMLViewGenerator
} = require('./../model/builder/HTMLGenerators/HTMLViewGenerator');
const {
	WidgetAdministrationGenerator
} = require('./../model/builder/JavaScriptGenerators/WidgetAdministrationGenerator');
const {
	WidgetGenerator
} = require('./../model/builder/JavaScriptGenerators/WidgetGenerator');
const {
	ReadModelGenerator
} = require('./../model/builder/PHPGenerators/ReadModelGenerator');
const {
	CreateModelGenerator
} = require('./../model/builder/PHPGenerators/CreateModelGenerator');
const {
	DeleteModelGenerator
} = require('./../model/builder/PHPGenerators/DeleteModelGenerator');
const {
	UpdateModelGenerator
} = require('./../model/builder/PHPGenerators/UpdateModelGenerator');

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

exports.generarCodigo = proyecto => {
	const outDir = proyecto.path + '/out';
	try {
		//Crear el directorio de salida si este no existe
		if (fs.existsSync(outDir)) {
			fs.removeSync(outDir);
		}
		fs.mkdirSync(outDir);
		//Crear los directorios con archivos estaticos
		fs.copySync(app.getAppPath() + '/static/_estilo', outDir + '/_estilo', {
			dereference: true
		});
		fs.copySync(app.getAppPath() + '/static/_img', outDir + '/_img', {
			dereference: true
		});
		fs.copySync(
			app.getAppPath() + '/static/_jscript',
			outDir + '/_jscript',
			{
				dereference: true
			}
		);
		fs.copySync(
			app.getAppPath() + '/static/_jqwidgets',
			outDir + '/_jqwidgets',
			{
				dereference: true
			}
		);
		fs.copySync(app.getAppPath() + '/static/Modelo', outDir + '/Modelo', {
			dereference: true
		});
		// ! Cambiar los permisos para que puedan acceder
		fs.chmodSync(outDir + '/_estilo/', 0o755);
		fs.chmodSync(outDir + '/_img/', 0o755);
		fs.chmodSync(outDir + '/_jscript/', 0o755);
		fs.chmodSync(outDir + '/_jqwidgets/', 0o755);
		fs.chmodSync(outDir + '/Modelo/', 0o755);

		// * Generar homepage
		let generator = new HTMLHomeGenerator(proyecto);
		generator.generate();
		fs.writeFileSync(outDir + '/index.html', generator.getResult());

		// * Generar Modulo de administración
		let moduleGenerator = new ModuleGenerator(outDir, 'Administracion');
		moduleGenerator.generate();
		// * Generar index del modulo de administración
		generator = new HTMLAdministrationGenerator(proyecto);
		generator.generate();
		fs.writeFileSync(
			moduleGenerator.getResult() + '/index.html',
			generator.getResult()
		);
		// * Generar las vistas del modulo de administración
		for (const model in proyecto.models) {
			if (proyecto.models.hasOwnProperty(model)) {
				generator = new HTMLAdminViewGenerator(proyecto, model);
				generator.generate();
				fs.writeFileSync(
					moduleGenerator.getResult() +
						`/Vista/vta${proyecto.models[model].name}.html`,
					generator.getResult()
				);
			}
		}
		// * Generar el controlador del modulo
		generator = new CargadorGenerator(proyecto);
		generator.generate();
		fs.writeFileSync(
			moduleGenerator.getResult() + '/Controlador/ajxCargador.js',
			generator.getResult()
		);

		// * Generar los widgets del modulo
		for (const model in proyecto.models) {
			if (proyecto.models.hasOwnProperty(model)) {
				generator = new WidgetAdministrationGenerator(
					proyecto.models[model]
				);
				generator.generate();
				fs.writeFileSync(
					moduleGenerator.getResult() +
						`/Widgets/jqx${proyecto.models[model].name}.js`,
					generator.getResult()
				);
			}
		}

		// * Generar los modelos del modulo
		for (const model in proyecto.models) {
			if (proyecto.models.hasOwnProperty(model)) {
				const data = proyecto.models[model];
				generator = new ReadModelGenerator(data);
				generator.generate();
				fs.writeFileSync(
					moduleGenerator.getResult() +
						`/Modelo/mod${data.name}Obtener.php`,
					generator.getResult()
				);
				generator = new CreateModelGenerator(data);
				generator.generate();
				fs.writeFileSync(
					moduleGenerator.getResult() +
						`/Modelo/mod${data.name}Crear.php`,
					generator.getResult()
				);
				generator = new DeleteModelGenerator(data);
				generator.generate();
				fs.writeFileSync(
					moduleGenerator.getResult() +
						`/Modelo/mod${data.name}Eliminar.php`,
					generator.getResult()
				);
				generator = new UpdateModelGenerator(data);
				generator.generate();
				fs.writeFileSync(
					moduleGenerator.getResult() +
						`/Modelo/mod${data.name}Modificar.php`,
					generator.getResult()
				);
			}
		}

		// * Generar los modulos
		for (const model in proyecto.models) {
			if (proyecto.models.hasOwnProperty(model)) {
				const data = proyecto.models[model];
				moduleGenerator = new ModuleGenerator(outDir, data.name);
				moduleGenerator.generate();
				generator = new HTMLViewGenerator(proyecto.name, data);
				generator.generate();
				fs.writeFileSync(
					moduleGenerator.getResult() + '/index.html',
					generator.getResult()
				);
				generator = new WidgetGenerator(data);
				generator.generate();
				fs.writeFileSync(
					moduleGenerator.getResult() + '/Widgets/jqxData.js',
					generator.getResult()
				);
				generator = new ReadModelGenerator(data);
				generator.generate();
				fs.writeFileSync(
					moduleGenerator.getResult() +
						`/Modelo/mod${data.name}Obtener.php`,
					generator.getResult()
				);
				generator = new ControllerGenerator(data.name);
				generator.generate();
				fs.writeFileSync(
					moduleGenerator.getResult() + '/Controlador/ajxLoader.js',
					generator.getResult()
				);
			}
		}
	} catch (e) {
		console.log(e);
	}
};
