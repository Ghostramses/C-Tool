const { ipcRenderer } = require('electron');
const Swal = require('sweetalert2');
const Modulo = require('../../model/Modulo');
const { guardarCambiosLocales } = require('../../functions');

let proyecto;

document.addEventListener('DOMContentLoaded', () => {
	const listaModulos = document.getElementById('modulos');
	const btnCrearModulo = document.getElementById('btnCrearModulo');

	ipcRenderer.send('get-project');
	ipcRenderer.on('project-info', (event, args) => {
		proyecto = args;
		printModules(proyecto.modules, listaModulos);
	});

	ipcRenderer.on('update-project', (event, args) => (proyecto = args));

	btnCrearModulo.addEventListener('click', async e => {
		const { value: nombreModulo } = await Swal.fire({
			title: 'Ingrese el nombre del nuevo módulo',
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
					return 'El nombre de los módulos debe iniciar con una letra mayúscula y sólo puede contener mayúsculas y minúsculas. No se admiten numeros, simbolos o acentos';
				}
			}
		});
		if (nombreModulo) {
			proyecto.modules[nombreModulo] = new Modulo(nombreModulo);

			// * Enviar el proyecto a backend
			guardarCambiosLocales(proyecto);

			printModules(proyecto.modules, listaModulos);
		}
	});

	listaModulos.addEventListener('click', e => {
		if (
			e.target.classList.contains('btn-control-delete') ||
			e.target.parentNode.classList.contains('btn-control-delete')
		) {
			// * Obtener la llave del objeto modulo
			const key = e.target.parentNode.parentNode.getAttribute(
				'object-key'
			)
				? e.target.parentNode.parentNode.getAttribute('object-key')
				: e.target.parentNode.parentNode.parentNode.getAttribute(
						'object-key'
				  );
			// * Alerta para eliminar el modulo
			Swal.fire({
				title: '¿Está seguro?',
				text: `Se eliminará el modulo ${proyecto.modules[key].name}`,
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#32e0c4',
				confirmButtonText: 'Eliminar',
				cancelButtonColor: '#d33',
				cancelButtonText: 'Cancelar',
				background: '#222831'
			}).then(result => {
				// * Si se confirma se elimina el modulo
				if (result.value) {
					Swal.fire({
						title: 'Eliminado',
						text: `El modulo ${proyecto.modules[key].name} ha sido eliminado`,
						icon: 'success',
						background: '#222831'
					});
					// * Eliminar el objeto del proyecto
					delete proyecto.modules[key];
					// * Enviar el proyecto a backend
					guardarCambiosLocales(proyecto);
					// * Limpiar la vista
					e.target.parentNode.parentNode.classList.contains('modulo')
						? e.target.parentNode.parentNode.remove()
						: e.target.parentNode.parentNode.parentNode.remove();
					// * Repintar los modulos restantes
					printModules(proyecto.modules, listaModulos);
				}
			});
		} else if (
			e.target.classList.contains('btn-control-edit') ||
			e.target.parentNode.classList.contains('btn-control-edit')
		) {
			const key = e.target.parentNode.parentNode.getAttribute(
				'object-key'
			)
				? e.target.parentNode.parentNode.getAttribute('object-key')
				: e.target.parentNode.parentNode.parentNode.getAttribute(
						'object-key'
				  );
			ipcRenderer.send('open-editor', {
				moduleName: proyecto.modules[key].name,
				moduleKey: key
			});
		}
	});
});

// * Funcion encargada de pintar los modulos en pantalla
function printModules(modules, parent) {
	if (Object.entries(modules).length == 0) {
		const divSinModulos = document.createElement('div');
		if (!parent.firstChild) {
			divSinModulos.classList.add('sin-modulos');
			divSinModulos.innerHTML = `<h1>No se ha creado ningún módulo</h1>`;
			parent.appendChild(divSinModulos);
		}
		return;
	}
	while (parent.firstChild) {
		parent.firstChild.remove();
	}
	for (const modulo in modules) {
		let divModulo = document.createElement('div');
		divModulo.classList.add('modulo');
		divModulo.setAttribute('object-key', modulo);
		divModulo.innerHTML = `
        <p>
        <i class="far fa-folder"></i>
        ${modules[modulo].name}
        </p>
        <div class="btn-control-panel">
            <button class="btn-control-edit">
                <i class="fas fa-edit"></i>
            </button>
            <button class="btn-control-delete">
                <i class="fas fa-trash"></i>
            </button>
        </div>
        `;
		parent.appendChild(divModulo);
	}
}
