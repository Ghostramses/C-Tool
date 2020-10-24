import { Generator } from '../Generator';

export class WidgetGenerator implements Generator {
	private code: string = '';
	private modelo: any;

	constructor(modelo: any) {
		this.modelo = modelo;
	}

	public reset(): void {
		this.code = '';
	}
	public generate(): void {
		this.code = `
        function datosCargar(){
            let dataSource={
                datatype:'json',
                id:'id${this.modelo.name}',
                url: 'modelo/mod${this.modelo.name}Obtener.php',
                type: 'POST',
                async: true
            };
            return new $.jqx.dataAdapter(dataSource);
        }
        function widget${this.modelo.name}Cargar(){
            let dataAdapter = datosCargar()
            $("#${this.modelo.name}Table").jqxDataTable({
                width: "100%",
                pageable: true,
                pagerButtonsCount: 10,
                source: dataAdapter,
                columnsResize: true,
                selectionMode: 'singleRow',
                source: dataAdapter,
                columns:[
                    {text:"ID",datafield:"id${
						this.modelo.name
					}"},${this.generateColumns()}
                ]
            });
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
}
