/*
let localData = localStorage.getItem('sesion');
if (localData != null) {
	json = JSON.parse(localData);
	switch (json.rol) {
		case 'Administrador':
			document.location = './ModuloAdministracion';
			break;
		case 'Operador':
			break;
		case 'Moderador':
			break;
	}
}
*/

$(document).ready(function () {
	//Reset de valores iniciales
	$('#adminLoginForm')[0].reset();
	eliminarAlerta('alertaAdmin');

	//Listeners
	$('#btnAdmin').click(function (e) {
		e.preventDefault();
		eliminarAlerta('alertaAdmin');
		validarYEnviarDatos();
	});

	$('#limpiarAdmin').click(function (e) {
		e.preventDefault();
		$('#adminLoginForm')[0].reset();
		eliminarAlerta('alertaAdmin');
		$('#spinnerAdmin').css('display', 'none');
	});

	//Funciones
	function validarYEnviarDatos() {
		let user = $('#adminUser').val();
		let password = $('#adminPassword').val();
		if (!user || !password) {
			eliminarAlerta('alertaAdmin');
			const alerta = document.createElement('div');
			alerta.classList.add('alert', 'alert-danger', 'alert-dismissible');
			alerta.id = 'alertaAdmin';
			alerta.innerHTML = `
			<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
			<strong>Error 1:</strong> Falta usuario y/o contraseña.
			`;
			$('#adminLoginForm').prepend(alerta);
			return false;
		}
		$('#spinnerAdmin').css('display', 'block');
		$.post(
			'./Modelo/modSesionIniciar.php',
			{ adminUser: user, adminPassword: password },
			function (data) {
				$('#spinnerAdmin').css('display', 'none');
				try {
					let json = JSON.parse(data);
					if (json.error === undefined) {
						localStorage.setItem('prototype-session', data);
						document.location = './ModuloAdministracion';
					} else {
						eliminarAlerta('alertaAdmin');
						const alerta = document.createElement('div');
						alerta.classList.add(
							'alert',
							'alert-danger',
							'alert-dismissible'
						);
						alerta.id = 'alertaAdmin';
						alerta.innerHTML = `
						<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
						<strong>Error ${json.error}:</strong> ${json.mensaje}
						`;
						$('#adminLoginForm').prepend(alerta);
					}
				} catch (e) {
					console.log(e);
				}
			}
		);
	}

	function eliminarAlerta(id) {
		let alerta = document.getElementById(id);
		if (alerta !== null) {
			alerta.remove();
		}
	}
});
