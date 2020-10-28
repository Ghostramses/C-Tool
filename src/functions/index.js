const fs = require('fs-extra');
const { app, dialog } = require('electron');
const prettier = require('prettier');
const phpPlugin = require('@prettier/plugin-php');
const rimraf = require('rimraf');

const Proyecto = require('./../model/Proyecto');
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

const prettierConfig = {
	bracketSpacing: true,
	htmlWhitespaceSensitivity: 'css',
	insertPragma: false,
	jsxBracketSameLine: false,
	jsxSingleQuote: true,
	printWidth: 80,
	proseWrap: 'preserve',
	quoteProps: 'as-needed',
	requirePragma: false,
	semi: true,
	singleQuote: true,
	tabWidth: 4,
	trailingComma: 'none',
	useTabs: true,
	vueIndentScriptAndStyle: false
};

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

exports.generarCodigo = async proyecto => {
	if (Object.keys(proyecto.models).length > 0) {
		const outDir = proyecto.path + '/out';
		try {
			//Si el directorio de salia existe eliminarlo
			if (fs.existsSync(outDir)) {
				await rimraf.sync(outDir);
			}
			fs.mkdirSync(outDir);
			//Crear los directorios con archivos estaticos
			fs.copySync(
				app.getAppPath() + '/static/_estilo',
				outDir + '/_estilo',
				{
					dereference: true
				}
			);
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
			fs.copySync(
				app.getAppPath() + '/static/Modelo',
				outDir + '/modelo',
				{
					dereference: true
				}
			);

			fs.copySync(
				app.getAppPath() + '/static/_config',
				outDir + '/_config',
				{
					dereference: true
				}
			);

			// ! Cambiar los permisos para que puedan acceder
			fs.chmodSync(outDir + '/_estilo/', 0o755);
			fs.chmodSync(outDir + '/_img/', 0o755);
			fs.chmodSync(outDir + '/_jscript/', 0o755);
			fs.chmodSync(outDir + '/_jqwidgets/', 0o755);
			fs.chmodSync(outDir + '/modelo/', 0o755);
			fs.chmodSync(outDir + '/_config/', 0o755);

			// * Generar homepage
			let generator = new HTMLHomeGenerator(proyecto);
			generator.generate();
			fs.writeFileSync(
				outDir + '/index.html',
				prettier.format(generator.getResult(), {
					...prettierConfig,
					parser: 'html'
				})
			);

			// * Generar Modulo de administración
			let moduleGenerator = new ModuleGenerator(outDir, 'Administracion');
			moduleGenerator.generate();
			// * Generar index del modulo de administración
			generator = new HTMLAdministrationGenerator(proyecto);
			generator.generate();
			fs.writeFileSync(
				moduleGenerator.getResult() + '/index.html',
				prettier.format(generator.getResult(), {
					...prettierConfig,
					parser: 'html'
				})
			);
			// * Generar las vistas del modulo de administración
			for (const model in proyecto.models) {
				if (proyecto.models.hasOwnProperty(model)) {
					generator = new HTMLAdminViewGenerator(proyecto, model);
					generator.generate();
					fs.writeFileSync(
						moduleGenerator.getResult() +
							`/vista/vta${proyecto.models[model].name}.html`,
						prettier.format(generator.getResult(), {
							...prettierConfig,
							parser: 'html'
						})
					);
				}
			}
			// * Generar el controlador del modulo de administración
			generator = new CargadorGenerator(proyecto);
			generator.generate();
			fs.writeFileSync(
				moduleGenerator.getResult() + '/controlador/ajxCargador.js',
				prettier.format(generator.getResult(), {
					...prettierConfig,
					parser: 'babel'
				})
			);

			// * Generar los widgets del modulo de administración
			for (const model in proyecto.models) {
				if (proyecto.models.hasOwnProperty(model)) {
					generator = new WidgetAdministrationGenerator(
						proyecto.models[model]
					);
					generator.generate();
					fs.writeFileSync(
						moduleGenerator.getResult() +
							`/widgets/jqx${proyecto.models[model].name}.js`,
						prettier.format(generator.getResult(), {
							...prettierConfig,
							parser: 'babel'
						})
					);
				}
			}

			// * Generar los modelos del modulo de administración
			for (const model in proyecto.models) {
				if (proyecto.models.hasOwnProperty(model)) {
					const data = proyecto.models[model];
					generator = new ReadModelGenerator(data);
					generator.generate();
					fs.writeFileSync(
						moduleGenerator.getResult() +
							`/modelo/mod${data.name}Obtener.php`,
						prettier.format(generator.getResult(), {
							...prettierConfig,
							plugins: [phpPlugin],
							parser: 'php'
						})
					);
					generator = new CreateModelGenerator(data);
					generator.generate();
					fs.writeFileSync(
						moduleGenerator.getResult() +
							`/modelo/mod${data.name}Crear.php`,
						prettier.format(generator.getResult(), {
							...prettierConfig,
							plugins: [phpPlugin],
							parser: 'php'
						})
					);
					generator = new DeleteModelGenerator(data);
					generator.generate();
					fs.writeFileSync(
						moduleGenerator.getResult() +
							`/modelo/mod${data.name}Eliminar.php`,
						prettier.format(generator.getResult(), {
							...prettierConfig,
							plugins: [phpPlugin],
							parser: 'php'
						})
					);
					generator = new UpdateModelGenerator(data);
					generator.generate();
					fs.writeFileSync(
						moduleGenerator.getResult() +
							`/modelo/mod${data.name}Modificar.php`,
						prettier.format(generator.getResult(), {
							...prettierConfig,
							plugins: [phpPlugin],
							parser: 'php'
						})
					);
				}
			}

			// * Generar los modulos de los modelos
			for (const model in proyecto.models) {
				if (proyecto.models.hasOwnProperty(model)) {
					const data = proyecto.models[model];
					moduleGenerator = new ModuleGenerator(outDir, data.name);
					moduleGenerator.generate();
					generator = new HTMLViewGenerator(proyecto.name, data);
					generator.generate();
					fs.writeFileSync(
						moduleGenerator.getResult() + '/index.html',
						prettier.format(generator.getResult(), {
							...prettierConfig,
							parser: 'html'
						})
					);
					generator = new WidgetGenerator(data);
					generator.generate();
					fs.writeFileSync(
						moduleGenerator.getResult() + '/widgets/jqxData.js',
						prettier.format(generator.getResult(), {
							...prettierConfig,
							parser: 'babel'
						})
					);
					generator = new ReadModelGenerator(data);
					generator.generate();
					fs.writeFileSync(
						moduleGenerator.getResult() +
							`/modelo/mod${data.name}Obtener.php`,
						prettier.format(generator.getResult(), {
							...prettierConfig,
							plugins: [phpPlugin],
							parser: 'php'
						})
					);
					generator = new ControllerGenerator(data.name);
					generator.generate();
					fs.writeFileSync(
						moduleGenerator.getResult() +
							'/controlador/ajxLoader.js',
						prettier.format(generator.getResult(), {
							...prettierConfig,
							parser: 'babel'
						})
					);
				}
			}
		} catch (e) {
			console.log(e);
		}
	} else {
	}
};

exports.exportarModelo = async (proyecto, key, out, parent) => {
	try {
		if (fs.existsSync(out + `/modulo${proyecto.models[key].name}`)) {
			await rimraf.sync(out + `/modulo${proyecto.models[key].name}`);
		}
		let moduleGenerator = new ModuleGenerator(
			out,
			proyecto.models[key].name
		);
		moduleGenerator.generate();
		let generator = new WidgetAdministrationGenerator(proyecto.models[key]);
		generator.generate();
		await fs.writeFile(
			moduleGenerator.getResult() +
				`/widgets/jqx${proyecto.models[key].name}.js`,
			prettier.format(generator.getResult(), {
				...prettierConfig,
				parser: 'babel'
			}),
			err => {
				if (err) throw err;
			}
		);
		generator = new ControllerGenerator(proyecto.models[key].name, true);
		generator.generate();
		await fs.writeFile(
			moduleGenerator.getResult() + '/controlador/ajxLoader.js',
			prettier.format(generator.getResult(), {
				...prettierConfig,
				parser: 'babel'
			}),
			err => {
				if (err) throw err;
			}
		);
		generator = new HTMLAdminViewGenerator(proyecto, key);
		generator.generate();
		await fs.writeFile(
			moduleGenerator.getResult() +
				`/vista/vta${proyecto.models[key].name}.html`,
			prettier.format(generator.getResult(), {
				...prettierConfig,
				parser: 'html'
			}),
			err => {
				if (err) throw err;
			}
		);
		generator = new HTMLViewGenerator(
			proyecto.name,
			proyecto.models[key],
			true
		);
		generator.generate();
		await fs.writeFile(
			moduleGenerator.getResult() + '/index.html',
			prettier.format(generator.getResult(), {
				...prettierConfig,
				parser: 'html'
			}),
			err => {
				if (err) throw err;
			}
		);
		generator = new ReadModelGenerator(proyecto.models[key]);
		generator.generate();
		await fs.writeFile(
			moduleGenerator.getResult() +
				`/modelo/mod${proyecto.models[key].name}Obtener.php`,
			prettier.format(generator.getResult(), {
				...prettierConfig,
				plugins: [phpPlugin],
				parser: 'php'
			})
		);
		generator = new CreateModelGenerator(proyecto.models[key]);
		generator.generate();
		await fs.writeFile(
			moduleGenerator.getResult() +
				`/modelo/mod${proyecto.models[key].name}Crear.php`,
			prettier.format(generator.getResult(), {
				...prettierConfig,
				plugins: [phpPlugin],
				parser: 'php'
			})
		);
		generator = new DeleteModelGenerator(proyecto.models[key]);
		generator.generate();
		await fs.writeFile(
			moduleGenerator.getResult() +
				`/modelo/mod${proyecto.models[key].name}Eliminar.php`,
			prettier.format(generator.getResult(), {
				...prettierConfig,
				plugins: [phpPlugin],
				parser: 'php'
			})
		);
		generator = new UpdateModelGenerator(proyecto.models[key]);
		generator.generate();
		await fs.writeFile(
			moduleGenerator.getResult() +
				`/modelo/mod${proyecto.models[key].name}Modificar.php`,
			prettier.format(generator.getResult(), {
				...prettierConfig,
				plugins: [phpPlugin],
				parser: 'php'
			})
		);
		dialog.showMessageBox(parent, {
			type: 'info',
			title: 'Modulo exportado',
			message: `El modulo ${proyecto.models[key].name} ha sido exportado con exito.`
		});
	} catch (e) {
		console.log(e);
		dialog.showErrorBox(
			'Ocurrio un problema',
			`El modulo ${proyecto.models[key].name} no pudo ser exportado debido a un error`
		);
	}
};
