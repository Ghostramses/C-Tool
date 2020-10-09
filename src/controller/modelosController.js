const { ipcRenderer } = require('electron');
const Swal = require('sweetalert2');
const {
	limpiarDiv,
	guardarCambiosLocales
} = require('../../functions/render.js');
const Modelo = require('../../model/Model');

let proyecto;

document.addEventListener('DOMContentLoaded', () => {
	const listaModelos = document.getElementById('modelos');
	const btnCrearModelo = document.getElementById('btnCrearModelo');

	ipcRenderer.send('get-project');
	ipcRenderer.on('project-info', (event, args) => {
		proyecto = args;
		console.log(proyecto);
		printModels(proyecto.models, listaModelos);
	});

	ipcRenderer.on('update-project', (event, args) => (proyecto = args));

	ipcRenderer.on('save', event => ipcRenderer.send('save-local', proyecto));

	btnCrearModelo.addEventListener('click', async e => {
		const { value: nombreModelo } = await Swal.fire({
			title: 'Ingrese el nombre del nuevo modelo',
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
					return 'El nombre de los modelos debe iniciar con una letra mayúscula y sólo puede contener mayúsculas y minúsculas. No se admiten numeros, espacios, simbolos o acentos.';
				}
			}
		});
		if (nombreModelo) {
			if (proyecto.models[nombreModelo] != undefined) {
				Swal.fire({
					title: '¿Está seguro?',
					text: `Se sobreescribira el modelo ${proyecto.models[nombreModelo].name}`,
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
							title: 'Sobreescrito',
							text: `El modelo ${proyecto.models[nombreModelo].name} ha sido sobreescrito`,
							icon: 'success',
							background: '#222831'
						});
						proyecto.models[nombreModelo] = new Modelo(
							nombreModelo
						);

						// * Enviar el proyecto a backend
						guardarCambiosLocales(proyecto);

						printModels(proyecto.models, listaModelos);
					} else {
						Swal.fire({
							title: 'No se sobreescribió el módulo',
							text: `El modelo ${proyecto.models[nombreModelo].name} no ha sido sobreescrito`,
							icon: 'error',
							background: '#222831'
						});
					}
				});
			} else {
				proyecto.models[nombreModelo] = new Modelo(nombreModelo);

				// * Enviar el proyecto a backend
				guardarCambiosLocales(proyecto);

				printModels(proyecto.models, listaModelos);
			}
		}
	});

	listaModelos.addEventListener('click', e => {
		if (
			e.target.classList.contains('btn-control-delete') ||
			e.target.parentNode.classList.contains('btn-control-delete')
		) {
			// * Obtener la llave del objeto modelo
			const key = e.target.parentNode.parentNode.getAttribute(
				'object-key'
			)
				? e.target.parentNode.parentNode.getAttribute('object-key')
				: e.target.parentNode.parentNode.parentNode.getAttribute(
						'object-key'
				  );
			// * Alerta para eliminar el modelo
			Swal.fire({
				title: '¿Está seguro?',
				text: `Se eliminará el modelo ${proyecto.models[key].name}`,
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
						text: `El modelo ${proyecto.models[key].name} ha sido eliminado`,
						icon: 'success',
						background: '#222831'
					});

					// * Eliminar el objeto del proyecto
					delete proyecto.models[key];

					// * Enviar el proyecto al backend
					guardarCambiosLocales(proyecto);

					// * Repintar los modulos
					printModels(proyecto.models, listaModelos);
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
			ipcRenderer.send('open-metadata', {
				modelKey: key
			});
		}
	});
});

function printModels(models, parent) {
	limpiarDiv(parent);
	if (Object.entries(models).length === 0) {
		const divSinModelos = document.createElement('div');
		if (!parent.firstChild) {
			divSinModelos.classList.add('sin-elementos');
			divSinModelos.innerHTML = '<h1>No se ha creado ningún modelo</h1>';
			parent.appendChild(divSinModelos);
		}
		return;
	}
	for (const modelo in models) {
		if (models.hasOwnProperty(modelo)) {
			let divModelo = document.createElement('div');
			divModelo.classList.add('modelo');
			divModelo.setAttribute('object-key', modelo);
			divModelo.innerHTML = `
            <p>
            <i class="fas fa-table"></i>
            ${models[modelo].name}
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
			parent.appendChild(divModelo);
		}
	}
}
