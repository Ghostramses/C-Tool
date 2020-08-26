const { ipcRenderer } = require('electron');
const Swal = require('sweetalert2');
const Vista = require('./../../model/Vista');
const { guardarCambiosLocales } = require('../../functions');

let proyecto = {};
let moduleToEdit = {};

document.addEventListener('DOMContentLoaded', () => {
	const titulo = document.getElementById('moduleName');
	const btnCrearVista = document.getElementById('crearVista');

	ipcRenderer.send('get-module-to-edit');
	ipcRenderer.on('module-info', (event, args) => {
		proyecto = args.proyecto;
		moduleToEdit = args.moduleToEdit;
		titulo.innerText = moduleToEdit.name;
	});

	btnCrearVista.addEventListener('click', async () => {
		const { value: nombreVista } = await Swal.fire({
			title: 'Ingrese el nombre de la vista',
			input: 'text',
			showCancelButton: true,
			confirmButtonColor: '#32e0c4',
			confirmButtonText: 'Crear',
			cancelButtonColor: '#d33',
			cancelButtonText: 'Cancelar',
			background: '#222831',
			inputValidator: value => {
				if (!value) {
					return '¡Debe escribir algo!';
				}
				if (!RegExp(/^[A-Z][A-Za-z]*$/).test(value)) {
					return 'El nombre de las vistas debe iniciar con una letra mayúscula y sólo puede contener mayúsculas y minúsculas. No se admiten numeros, simbolos o acentos';
				}
			}
		});
		if (nombreVista) {
			proyecto.modules[moduleToEdit.key].elements[
				nombreVista
			] = new Vista(nombreVista);

			// * Enviar el proyecto a backend
			guardarCambiosLocales(proyecto);
			//printModules(proyecto.modules, listaModulos);
		}
	});
});
