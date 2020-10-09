const { ipcRenderer } = require('electron');
const Swal = require('sweetalert2');
const {
	limpiarDiv,
	guardarCambiosLocales
} = require('../../functions/render.js');
const Metadata = require('../../model/Metadata.js');

let proyecto;
let modelKey;
let editing = false;

document.addEventListener('DOMContentLoaded', () => {
	const btnGuardarMetadato = document.getElementById('btnGuardarMetadato');
	const divErrores = document.getElementById('errores');
	const divListaMetadatos = document.getElementById('listaMetadatos');

	ipcRenderer.send('get-model');
	ipcRenderer.on('model-info', (event, args) => {
		proyecto = args.proyecto;
		document.getElementById('modelo').innerText = args.modelToEdit.name;
		console.log(args);
		modelKey = args.modelToEdit.key;
		printMetadata(proyecto.models[modelKey].metadata, divListaMetadatos);
	});

	btnGuardarMetadato.addEventListener('click', e => {
		e.preventDefault();
		limpiarDiv(divErrores);
		// * Obtener los datos del formulario
		const nombre = document.getElementById('nombreMetadato').value;
		const tipoSelect = document.getElementById('tipoMetadato');
		const tipo = tipoSelect.options[tipoSelect.selectedIndex].value;
		const descripcion = document.getElementById('descripcionMetadato')
			.value;
		if (nombre === '') {
			generarError(
				'El nombre del metadato no puede estar vacío',
				divErrores,
				document.getElementById('nombreMetadato')
			);
			return;
		}
		if (!RegExp(/^[A-Z][A-Za-z]*$/).test(nombre)) {
			generarError(
				'El nombre de los metadatos debe iniciar con una letra mayúscula y sólo puede contener mayúsculas y minúsculas. No se admiten numeros, espacios, simbolos o acentos.',
				divErrores,
				document.getElementById('nombreMetadato')
			);
			return;
		}
		if (tipo === '') {
			generarError(
				'Seleccione un tipo de dato',
				divErrores,
				document.getElementById('tipoMetadato')
			);
			return;
		}

		if (
			proyecto.models[modelKey].metadata[nombre] != undefined &&
			!editing
		) {
			Swal.fire({
				title: '¿Está seguro?',
				text: `Se sobreescribira el metadato ${proyecto.models[modelKey].metadata[nombre].name}`,
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
						text: `El metadato ${proyecto.models[modelKey].metadata[nombre].name} ha sido sobreescrito`,
						icon: 'success',
						background: '#222831'
					});

					proyecto.models[modelKey].metadata[nombre] = new Metadata(
						nombre,
						tipo,
						descripcion
					);

					// * Enviar los cambios a backend
					guardarCambiosLocales(proyecto);

					// * Repintar metadatos
					printMetadata(
						proyecto.models[modelKey].metadata,
						divListaMetadatos
					);

					document.getElementById('formularioMetadato').reset();
				} else {
					Swal.fire({
						title: 'No se sobreescribió el metadato',
						text: `El metadato ${proyecto.models[modelKey].metadata[nombre].name} no ha sido sobreescrito`,
						icon: 'error',
						background: '#222831'
					});
					document.getElementById('formularioMetadato').reset();
				}
			});
		} else {
			proyecto.models[modelKey].metadata[nombre] = new Metadata(
				nombre,
				tipo,
				descripcion
			);

			// * Enviar los cambios a backend
			guardarCambiosLocales(proyecto);

			// * Repintar metadatos
			printMetadata(
				proyecto.models[modelKey].metadata,
				divListaMetadatos
			);

			document.getElementById('formularioMetadato').reset();

			editing = false;
		}
	});

	divListaMetadatos.addEventListener('click', e => {
		if (
			e.target.classList.contains('btn-control-delete') ||
			e.target.parentNode.classList.contains('btn-control-delete')
		) {
			// * Obtener la llave del metadato
			const key = e.target.parentNode.parentNode.getAttribute(
				'metadata-key'
			)
				? e.target.parentNode.parentNode.getAttribute('metadata-key')
				: e.target.parentNode.parentNode.parentNode.getAttribute(
						'metadata-key'
				  );

			// * Alerta para eliminar el metadato
			Swal.fire({
				title: '¿Está seguro?',
				text: `Se eliminará el metadato ${proyecto.models[modelKey].metadata[key].name}`,
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#32e0c4',
				confirmButtonText: 'Eliminar',
				cancelButtonColor: '#d33',
				cancelButtonText: 'Cancelar',
				background: '#222831'
			}).then(result => {
				// * Si confirma la eliminación
				if (result.value) {
					Swal.fire({
						title: 'Eliminado',
						text: `El metadato ${proyecto.models[modelKey].metadata[key].name} ha sido eliminado`,
						icon: 'success',
						background: '#222831'
					});

					// * Eliminar el objeto del modelo
					delete proyecto.models[modelKey].metadata[key];

					// * Enviar cambios a backend
					guardarCambiosLocales(proyecto);

					// * Repintar los metadatos
					printMetadata(
						proyecto.models[modelKey].metadata,
						divListaMetadatos
					);

					document.getElementById('formularioMetadato').reset();

					editing = false;
				}
			});
		} else if (
			e.target.classList.contains('btn-control-edit') ||
			e.target.parentNode.classList.contains('btn-control-edit')
		) {
			const key = e.target.parentNode.parentNode.getAttribute(
				'metadata-key'
			)
				? e.target.parentNode.parentNode.getAttribute('metadata-key')
				: e.target.parentNode.parentNode.parentNode.getAttribute(
						'metadata-key'
				  );
			editing = true;
			document.getElementById('nombreMetadato').value =
				proyecto.models[modelKey].metadata[key].name;
			document.getElementById('tipoMetadato').value =
				proyecto.models[modelKey].metadata[key].type;
			document.getElementById('descripcionMetadato').value =
				proyecto.models[modelKey].metadata[key].description;
			document.getElementById('nombreMetadato').focus();
		}
	});
});

function generarError(mensaje, parent, input = undefined) {
	const divMensaje = document.createElement('div');
	divMensaje.classList.add('error-message');
	divMensaje.innerHTML = `<p class="message">${mensaje}</p><span class="close">&times;</span>`;
	divMensaje.addEventListener('click', e => {
		if (e.target.classList.contains('close')) {
			divMensaje.remove();
		}
	});
	parent.appendChild(divMensaje);
	if (input) {
		input.focus();
	}
}

function printMetadata(metadata, parent) {
	limpiarDiv(parent);
	if (Object.entries(metadata).length === 0) {
		const divSinMetadata = document.createElement('div');
		if (!parent.firsChild) {
			divSinMetadata.classList.add('sin-elementos', 'sin-metadatos');
			divSinMetadata.innerHTML =
				'<h1>No se ha creado ningún metadato</h1>';
			parent.appendChild(divSinMetadata);
		}
		return;
	}
	for (const data in metadata) {
		if (metadata.hasOwnProperty(data)) {
			let divMetadata = document.createElement('div');
			divMetadata.classList.add('metadato');
			divMetadata.setAttribute('metadata-key', data);
			divMetadata.innerHTML = `
			<p class="nombre-metadato">
				<i class="fas fa-columns"></i> ${metadata[data].name}
			</p>
			<p class="tipo-metadato">Tipo: ${typeToString(metadata[data].type)}</p>
			<div class="btn-control-panel">
				<button class="btn-control-edit">
					<i class="fas fa-edit"></i>
				</button>
				<button class="btn-control-delete">
					<i class="fas fa-trash"></i>
				</button>
			</div>
			`;
			parent.appendChild(divMetadata);
		}
	}
}

function typeToString(type) {
	switch (type) {
		case 'text':
			return 'Texto';
		case 'number':
			return 'Número';
		case 'date':
			return 'Fecha';
		case 'email':
			return 'E-Mail';
		case 'tel':
			return 'Teléfono';
		case 'password':
			return 'Contraseña';
		case 'longtext':
			return 'Texto largo';
	}
}
