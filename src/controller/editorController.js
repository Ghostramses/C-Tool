const { ipcRenderer } = require('electron');
const Swal = require('sweetalert2');
const Vista = require('./../../model/Vista');
const { guardarCambiosLocales } = require('../../functions');
const { limpiarDiv } = require('../../functions');

let proyecto = {};
let moduleToEdit = {};
let vistaAnterior;
let llaveVistaAnterior;

document.addEventListener('DOMContentLoaded', () => {
	const titulo = document.getElementById('moduleName');
	const btnCrearVista = document.getElementById('crearVista');
	const divVistas = document.getElementById('elementos-vistas');
	const spanArbol = document.getElementById('tituloArbol');

	ipcRenderer.send('get-module-to-edit');
	ipcRenderer.on('module-info', (event, args) => {
		proyecto = args.proyecto;
		moduleToEdit = args.moduleToEdit;
		titulo.innerText = moduleToEdit.name;
		printViews(proyecto.modules[moduleToEdit.key].elements, divVistas);
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
			if (
				proyecto.modules[moduleToEdit.key].elements[nombreVista] !=
				undefined
			) {
				Swal.fire({
					title: '¿Está seguro?',
					text: `Se sobreescribira la vista ${
						proyecto.modules[moduleToEdit.key].elements[nombreVista]
							.name
					}`,
					icon: 'warning',
					showCancelButton: true,
					confirmButtonColor: '#32e0c4',
					confirmButtonText: 'Sobreescribir',
					cancelButtonColor: '#d33',
					cancelButtonText: 'Cancelar',
					background: '#222831'
				}).then(result => {
					if (result.value) {
						Swal.fire({
							title: 'Sobreescrita',
							text: `La vista ${
								proyecto.modules[moduleToEdit.key].elements[
									nombreVista
								].name
							} ha sido sobreescrita`,
							icon: 'success',
							background: '#222831'
						});
						proyecto.modules[moduleToEdit.key].elements[
							nombreVista
						] = new Vista(nombreVista);
						guardarCambiosLocales(proyecto);
						printViews(
							proyecto.modules[moduleToEdit.key].elements,
							divVistas
						);
					} else {
						Swal.fire({
							title: 'No se sobreescribió la vista',
							text: `La vista ${
								proyecto.modules[moduleToEdit.key].elements[
									nombreVista
								].name
							} no ha sido sobreescrita`,
							icon: 'error',
							background: '#222831'
						});
					}
				});
			} else {
				proyecto.modules[moduleToEdit.key].elements[
					nombreVista
				] = new Vista(nombreVista);

				// * Enviar el proyecto a backend
				guardarCambiosLocales(proyecto);
				printViews(
					proyecto.modules[moduleToEdit.key].elements,
					divVistas
				);
			}
		}
	});

	divVistas.addEventListener('click', e => {
		if (
			e.target.classList.contains('btn-view-delete') ||
			e.target.classList.contains('fa-trash-alt')
		) {
			const key = e.target.parentNode.getAttribute('view-key')
				? e.target.parentNode.getAttribute('view-key')
				: e.target.parentNode.parentNode.getAttribute('view-key');
			Swal.fire({
				title: '¿Está seguro?',
				text: `Se eliminará la vista ${
					proyecto.modules[moduleToEdit.key].elements[key].name
				}`,
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#32e0c4',
				confirmButtonText: 'Eliminar',
				cancelButtonColor: '#d33',
				cancelButtonText: 'Cancelar',
				background: '#222831'
			}).then(result => {
				// * Si se confirma se elimina la vista
				if (result.value) {
					Swal.fire({
						title: 'Eliminado',
						text: `La vista ${
							proyecto.modules[moduleToEdit.key].elements[key]
								.name
						} ha sido eliminada`,
						icon: 'success',
						background: '#222831'
					});
					// * Eliminar el objeto del proyecto
					delete proyecto.modules[moduleToEdit.key].elements[key];
					// * Enviar el proyecto a backend
					guardarCambiosLocales(proyecto);
					// * Repintar las vistas restantes
					printViews(
						proyecto.modules[moduleToEdit.key].elements,
						divVistas
					);
					// * Si fue seleccionado previamente eliminar el nombre del arbol
					if ((spanArbol.innerText = key)) {
						spanArbol.innerText = '';
					}
				}
			});
		} else if (
			e.target.classList.contains('vista') ||
			e.target.parentNode.classList.contains('vista') ||
			e.target.parentNode.parentNode.classList.contains('vista')
		) {
			console.log('Vista seleccionada');
			const vista = e.target.classList.contains('vista')
				? e.target
				: e.target.parentNode.classList.contains('vista')
				? e.target.parentNode
				: e.target.parentNode.parentNode;
			spanArbol.innerText = vista.getAttribute('view-key');
			if (vistaAnterior) {
				vistaAnterior.classList.remove('vista-seleccionada');
			}
			vista.classList.add('vista-seleccionada');
			vistaAnterior = vista;
			llaveVistaAnterior = vistaAnterior.getAttribute('view-key');
		}
	});
});

function printViews(views, parent = document.createElement('div')) {
	limpiarDiv(parent);
	if (Object.entries(views).length == 0) {
		const divSinVistas = document.createElement('div');
		if (!parent.firstChild) {
			divSinVistas.classList.add('sin-modulos');
			divSinVistas.classList.add('sin-borde');
			divSinVistas.innerHTML = `<h1>No se ha creado ninguna vista</h1>`;
			parent.appendChild(divSinVistas);
		}
		return;
	}
	for (const view in views) {
		if (views.hasOwnProperty(view)) {
			const vista = document.createElement('div');
			vista.classList.add('vista');
			vista.setAttribute('view-key', view);
			vista.innerHTML = `
				<span> <i class="fas fa-eye"></i> ${views[view].name}</span>
				<button class="btn-view-delete">
					<i class="far fa-trash-alt"></i>
				</button>
			`;
			if (views[view].name === llaveVistaAnterior) {
				vista.classList.add('vista-seleccionada');
				vistaAnterior = vista;
			}
			parent.appendChild(vista);
		}
	}
}
