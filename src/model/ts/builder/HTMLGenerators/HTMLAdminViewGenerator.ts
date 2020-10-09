import { HTMLGenerator } from './HTMLGenerator';

export class HTMLAdminViewGenerator extends HTMLGenerator {
	private modelKey: string;

	public constructor(proyecto: any, modelKey: string) {
		super(proyecto);
		this.modelKey = modelKey;
	}

	private generateInputs(update: boolean = false): string {
		const suffix = update ? 'Up' : 'Add';
		let inputs = '';
		for (const metadata in this.proyecto.models[this.modelKey].metadata) {
			if (
				this.proyecto.models[this.modelKey].metadata.hasOwnProperty(
					metadata
				)
			) {
				const meta = this.proyecto.models[this.modelKey].metadata[
					metadata
				];
				inputs += `
                <div class="form-group row">
                    <label for="${
						suffix +
						meta.name +
						this.proyecto.models[this.modelKey].name
					}" class="control-label col-sm-3">${meta.name}:</label>
                    <div class="col-sm-9">
                    ${
						meta.type === 'longtext'
							? `<textarea id="${
									suffix +
									meta.name +
									this.proyecto.models[this.modelKey].name
							  }"class="form-control"></textarea>`
							: `<input type="${meta.type}" id="${
									suffix +
									meta.name +
									this.proyecto.models[this.modelKey].name
							  }" class="form-control">`
					}
                    </div>
                </div>
                `;
			}
		}
		return inputs;
	}

	public generate(): void {
		this.html = `
            <h2 class="text-center">Modelo ${
				this.proyecto.models[this.modelKey].name
			}</h2>
            <div class="text-right">
                <button class="btn btn-success" type="button" id="btnCreate${
					this.proyecto.models[this.modelKey].name
				}"><span class="glyphicon glyphicon-plus"></span>Añadir ${
			this.proyecto.models[this.modelKey].name
		}</button>
            </div>
            <div class="row admon-grid">
                <div id="jqxgrid" class="col-12 p0"></div>
            </div>

            <!--Ventanas Modales-->

            <!--Modal de modificacion-->
            <div class="modal fade" id="modalUp${
				this.proyecto.models[this.modelKey].name
			}" role="dialog">
                <div class="modal-dialog modal-lg">  
                    <div class="modal-content">
                        <div class="modal-header text-center">
                            <h2 class="col-12">Modificar ${
								this.proyecto.models[this.modelKey].name
							}</h2>
                        </div>
                        <div class="modal-body">
                            <form action="" class="form-horizontal">
                                ${this.generateInputs(true)}
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-danger" id="btnCancelarUp${
								this.proyecto.models[this.modelKey].name
							}" data-dismiss="modal"><span class="glyphicon glyphicon-remove btn-glyph-izq"></span>Cancelar</button>
                            <button type="button" class="btn btn-success" id="btnUp${
								this.proyecto.models[this.modelKey].name
							}"><span class="glyphicon glyphicon-floppy-disk btn-glyph-izq"></span>Guardar</button>
                        </div>
                    </div>
                </div>
            </div>

            <!--Modal de eliminacion-->
            <div class="modal fade" id="modalDel${
				this.proyecto.models[this.modelKey].name
			}" role="dialog">
                <div class="modal-dialog">  
                    <div class="modal-content">
                        <div class="modal-header text-center">
                            <h2>¿Desea eliminar el registro del modelo ${
								this.proyecto.models[this.modelKey].name
							}?</h2>
                        </div>
                        <div class="modal-body text-center">
                            <button type="button" class="btn btn-danger" id="btnCancelarDel${
								this.proyecto.models[this.modelKey].name
							}" data-dismiss="modal"><span class="glyphicon glyphicon-remove btn-glyph-izq"></span>No</button>
                            <button type="button" class="btn btn-success" id="btnDel${
								this.proyecto.models[this.modelKey].name
							}"><span class="glyphicon glyphicon-trash btn-glyph-izq"></span>Si</button>
                        </div>
                    </div>
                </div>
            </div>

            <!--Modal de creacion-->
            <div class="modal fade" id="modalAdd${
				this.proyecto.models[this.modelKey].name
			}" role="dialog">
                <div class="modal-dialog modal-lg">  
                    <div class="modal-content">
                        <div class="modal-header text-center">
                            <h2 class="col-12">Agregar registro a modelo ${
								this.proyecto.models[this.modelKey].name
							}</h2>
                        </div>
                        <div class="modal-body">
                            <form id="formAdd${
								this.proyecto.models[this.modelKey].name
							}" action="" class="form-horizontal">
                                ${this.generateInputs()}
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-danger" id="btnCancelarAdd${
								this.proyecto.models[this.modelKey].name
							}" data-dismiss="modal"><span class="glyphicon glyphicon-remove btn-glyph-izq"></span>Cancelar</button>
                            <button type="button" class="btn btn-success" id="btnAdd${
								this.proyecto.models[this.modelKey].name
							}"><span class="glyphicon glyphicon-plus btn-glyph-izq"></span>Añadir</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
	}
}
