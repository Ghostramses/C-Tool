exports.guardarCambiosLocales = data => {
	ipcRenderer.send('save-local', data);
};

exports.limpiarDiv = parent => {
	while (parent.firstChild) {
		parent.firstChild.remove();
	}
};

/*
exports.drop = e => {
	console.log(e);
};

exports.allowDrop = e => {
	e.preventDefault();
	console.log(e);
};

exports.drag = e => {
	console.log(e);
};
*/
