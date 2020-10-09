import { Generator } from '../Generator';

export class WidgetAdministrationGenerator implements Generator {
	private code: string = '';
	private modelo: any;

	constructor(modelo: any) {
		this.modelo = modelo;
	}

	public reset(): void {
		this.code = '';
	}

	public generate(): void {
		this.code =
			`
        let boundindex;

        function datosCargar(){
            let dataSource = {
                datatype: 'json',
                addrow: function(rowid,rowdata,position,commit){
                    alert("Creado correctamente")
                    commit(true);
                },
                deleterow:function(rowid,commit){
                    let {id${
						this.modelo.name
					}} = $("#jqxgrid").jqxGrid("getrowdatabyid",rowid);
                    $.post("Modelo/mod${this.modelo.name}Eliminar.php",{id${
				this.modelo.name
			}},function(data){
                        let json = JSON.parse(data);
                        if (json.noError == 0) {
                            alert('${
								this.modelo.name
							} Eliminado Correctamente');
                            $('#modalDel${this.modelo.name}').modal('hide');
                            commit(true);
                        } else {
                            alert(\`Error \${json.noError}:\\n\${json.mensaje}\`);
                            commit(false);
                        }
                    })
                },
                updaterow:function(rowid,newdata,commit){
                    ${this.getRowData()} = newdata
                    $.post("Modelo/mod${this.modelo.name}Modificar.php",
                        {id${this.modelo.name},${this.getAllVars()}},
                        function(data){
                            let json = JSON.parse(data)
                            if (json.noError == 0) {
                                $('#modalUp${this.modelo.name}').modal('hide');
                                alert("Registro actualizado correctamente")
                                commit(true);
                            } else {
                                alert("No se pudo actualizar el registro")
                                commit(false);
                            }
                    })
                },
                url: 'Modelo/mod${this.modelo.name}Obtener.php',
                type: 'POST',
                async: true
            };
            return new $.jqx.dataAdapter(dataSource);
        }

        function widget${this.modelo.name}Cargar(){
            let dataAdapter = datosCargar();
            $('#jqxgrid').jqxGrid({
                width: '100%',
                source: dataAdapter,
                pageable: true,
                autoheight: true,
                sortable: true,
                rowsheight: 50,
                filterable: false,
                selectionmode: 'singlerow',
                columns:[
                    {
                        text: 'Acciones',
                        datafield: 'id${this.modelo.name}',
                        width: 120,
                        createwidget: function(row, column, value, htmlElement){
                            const button = ` +
			"$(`<div class='buttonValue3 btn btn-crud btn-success' valor=${value}><span class='glyphicon glyphicon-edit'></span></div>`);\n" +
			`const button2 =` +
			"$(`<div class='buttonDelValue3 btn btn-crud btn-danger' valor=${value}><span class='glyphicon glyphicon-trash'></span></div>`);" +
			`
                            button.jqxButton({});
                            button2.jqxButton({});
                            $(htmlElement).addClass('d-flex');
                            $(htmlElement).addClass('pnl-crud');
                            $(htmlElement).append(button);
                            $(htmlElement).append(button2);
                            $(button).click(function (e) {
                                let valor = $(this).attr('valor');
                                $('#jqxgrid')
                                    .jqxGrid('getdisplayrows')
                                    .forEach(function (row) {
                                        let { id${this.modelo.name} } = row;
                                        if (valor == id${this.modelo.name}) {
                                            boundindex = row.boundindex;
                                            return;
                                        }
                                    });
                                $('#jqxgrid').jqxGrid('selectrow', boundindex);
                                ${this.getRowData()} = $("#jqxgrid").jqxGrid('getrowdata',boundindex);
                                ${this.loadDataToUpdate()}
                                $('#modalUp${this.modelo.name}').modal();
                            });
                            $(button2).click(function(){
                                let valor = $(this).attr('valor');
                                $('#jqxgrid')
                                    .jqxGrid('getdisplayrows')
                                    .forEach(function (row) {
                                        let { id${this.modelo.name} } = row;
                                        if (valor == id${this.modelo.name}) {
                                            boundindex = row.boundindex;
                                            return;
                                        }
                                    });
                                $('#jqxgrid').jqxGrid('selectrow', boundindex);
                                $("#modalDel${this.modelo.name}").modal();
                            });
                        },
                        initwidget: function (row, column, value, htmlElement) {
                            $(htmlElement)
                                .find('.buttonValue3')[0]
                                .setAttribute('valor', value);
                            $(htmlElement)
                                .find('.buttonDelValue3')[0]
                                .setAttribute('valor', value);
                        }
                    },
                    ${this.generateColumns()}
                ]
            });
            $("#btnCreate${this.modelo.name}").click(function(){
                $("#formAdd${this.modelo.name}").trigger("reset");
                $("#modalAdd${this.modelo.name}").modal();
            });

            $("#btnAdd${this.modelo.name}").click(function(){
                ${this.dataValidation()}
                $.post("Modelo/mod${this.modelo.name}Crear.php",{${this.getVars(
				false
			)}},function(data){
                let json = JSON.parse(data);
                if(json.noError == 0){
                    $("#jqxgrid").jqxGrid("addrow",null,{
                        id${this.modelo.name}: json.id${this.modelo.name},
                        ${this.createGridVars(false)}
                    })
                    $("#modalAdd${this.modelo.name}").modal("hide")
                } else {
                    alert(\`Error \${json.error}: \${json.mensaje}\`);
                }
            })
            });

            $("#btnDel${this.modelo.name}").click(function(){
                let dIndex = $('#jqxgrid').jqxGrid('getselectedrowindex');
                let rowscount = $('#jqxgrid').jqxGrid('getdatainformation').rowscount;
                if (dIndex >= 0 && dIndex < rowscount) {
                    let dId = $('#jqxgrid').jqxGrid('getrowid', dIndex);
                    $('#jqxgrid').jqxGrid('deleterow', dId);
                }
            })

            $("#btnUp${this.modelo.name}").click(function(){
                ${this.getNewData()}
                ${this.preventEmpty()}
                let {id${
					this.modelo.name
				}} = $("#jqxgrid").jqxGrid("getrowdata",boundindex);
                let rowID = $('#jqxgrid').jqxGrid('getrowid', boundindex);
                $("#jqxgrid").jqxGrid("updaterow",rowID,{id${
					this.modelo.name
				},${this.createGridVars(true)}})
            })
        }
        `;
	}

	public getResult(): string {
		return this.code;
	}

	private generateColumns(): string {
		let columns: string = '';
		for (const key in this.modelo.metadata) {
			if (this.modelo.metadata.hasOwnProperty(key)) {
				const data = this.modelo.metadata[key];
				columns += `
                {
                    text: "${data.name}",
                    datafield: "${data.name}"
                },
                `;
			}
		}
		return columns;
	}

	private dataValidation(): string {
		let validation: string = '';
		for (const key in this.modelo.metadata) {
			if (this.modelo.metadata.hasOwnProperty(key)) {
				const data = this.modelo.metadata[key];
				validation += `
                let add${data.name} = $("#Add${data.name}${this.modelo.name}").val();
                if(!add${data.name}){
                    alert("El campo: ${data.name} no puede estar vacío");
                    $("#Add${data.name}${this.modelo.name}").focus();
                    return;
                }
                `;
			}
		}
		return validation;
	}

	private getRowData(): string {
		let rowdata: string = `
        let{
            id${this.modelo.name},
        `;
		for (const key in this.modelo.metadata) {
			if (this.modelo.metadata.hasOwnProperty(key)) {
				const data = this.modelo.metadata[key];
				rowdata += `
                    ${data.name},
                `;
			}
		}
		rowdata += '}';
		return rowdata;
	}

	private loadDataToUpdate(): string {
		let loader: string = '';

		for (const key in this.modelo.metadata) {
			if (this.modelo.metadata.hasOwnProperty(key)) {
				const data = this.modelo.metadata[key];
				if (data.type == 'date') {
					loader += `
                    let dateParts = ${data.name}.split("-");
                    let dateObject = new Date(dateParts[1]+"/"+dateParts[2]+"/"+dateParts[0]);
                    let formatedDate = dateObject.getFullYear()+"-"+(dateObject.getMonth()+1).toString().padStart(2,0)+"-"+dateObject.getDate().toString().padStart(2,0);
                    document.getElementById("Up${data.name}${this.modelo.name}").value=formatedDate;
                    `;
				} else {
					loader += `
                    $("#Up${data.name}${this.modelo.name}").val(${data.name});
                    `;
				}
			}
		}
		return loader;
	}

	private getVars(update: boolean): string {
		let variables: string = '';
		const prefix = update ? 'new' : 'add';
		for (const key in this.modelo.metadata) {
			if (this.modelo.metadata.hasOwnProperty(key)) {
				const data = this.modelo.metadata[key];
				variables += prefix + data.name + ',';
			}
		}
		return variables;
	}

	private createGridVars(update: boolean): string {
		let variables: string = '';
		const prefix = update ? 'new' : 'add';
		for (const key in this.modelo.metadata) {
			if (this.modelo.metadata.hasOwnProperty(key)) {
				const data = this.modelo.metadata[key];
				variables += `${data.name}: ${prefix}${data.name},`;
			}
		}
		return variables;
	}

	private getNewData(): string {
		let newData: string = '';
		for (const key in this.modelo.metadata) {
			if (this.modelo.metadata.hasOwnProperty(key)) {
				const data = this.modelo.metadata[key];
				newData += `
                    let new${data.name} = $("#Up${data.name}${this.modelo.name}").val()
                `;
			}
		}
		return newData;
	}

	private preventEmpty(): string {
		let condiciones: string = '';
		for (const key in this.modelo.metadata) {
			if (this.modelo.metadata.hasOwnProperty(key)) {
				const data = this.modelo.metadata[key];
				condiciones += `
                    if(!new${data.name}){
                        alert("${data.name} no puede estar vacío")
                        $("#Up${data.name}${this.modelo.name}").focus()
                        return
                    }
                `;
			}
		}
		return condiciones;
	}

	private getAllVars(): string {
		let variables: string = '';
		for (const key in this.modelo.metadata) {
			if (this.modelo.metadata.hasOwnProperty(key)) {
				const data = this.modelo.metadata[key];
				variables += `${data.name},`;
			}
		}
		return variables;
	}
}
