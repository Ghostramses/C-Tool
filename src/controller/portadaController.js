const { ipcRenderer } = require('electron');

document.addEventListener('DOMContentLoaded', () => eventListeners());

function eventListeners() {
	const nuevoPrototipo = document.getElementById('nuevoPrototipo');
	const slide1 = document.getElementById('slide-1');
	const slide2 = document.getElementById('slide-2');
	const btnCancelarNuevoProyecto = document.getElementById(
		'cancelarNuevoProyecto'
	);
	const inputNombre = document.getElementById('nombre');
	const inputUbicacion = document.getElementById('ubicacion');
	const btnAbrirDirectorio = document.getElementById('btnUbicacion');
	const btnCrearNuevoProyecto = document.getElementById('crearNuevoProyecto');

	/* Cambiar de slide */
	nuevoPrototipo.addEventListener('click', () => {
		slide1.style.left = '-2000px';
		slide2.style.right = '0px';
	});

	/* Reiniciar valores y regresar de slide en caso de cancelar */

	btnCancelarNuevoProyecto.addEventListener('click', () => {
		slide1.style.left = '0px';
		slide2.style.right = '-2000px';
		inputNombre.value = '';
		inputUbicacion.value = '';
	});

	/* Enviar al proceso principal la orden para abrir un directorio*/

	btnAbrirDirectorio.addEventListener('click', () =>
		ipcRenderer.send('open-directory')
	);

	/* Colocar el directorio seleccionado en la barra de la pantalla */
	ipcRenderer.on(
		'selected-directory',
		(event, path) => (document.getElementById('ubicacion').value = path)
	);

	btnCrearNuevoProyecto.addEventListener('click', () => {
		if (inputNombre.value === '') {
			inputNombre.focus();
			return;
		} else if (inputUbicacion.value === '') {
			inputUbicacion.focus();
			return;
		}
		ipcRenderer.send('create-project', {
			name: inputNombre.value,
			path: inputUbicacion.value
		});
	});
}
