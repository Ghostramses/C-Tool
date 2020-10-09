import { Generator } from '../Generator';

export class ReadModelGenerator implements Generator {
	private code: string = '';
	private model: any;

	constructor(model: any) {
		this.model = model;
	}

	public reset(): void {
		this.code = '';
	}

	private generateRows(): string {
		let rows: string = '';

		for (const key in this.model.metadata) {
			if (this.model.metadata.hasOwnProperty(key)) {
				const data = this.model.metadata[key];
				rows += `
                    ${
						data.description
							? `
                    /*
                        ${data.description}
                    */
                    `
							: ''
					}
                    $fila['${data.name}'] = ${this.getFillValue(data.type)}
                `;
			}
		}
		return rows;
	}

	private getFillValue(type: string): string {
		let value: string = '';
		switch (type) {
			case 'text':
				value += '"Lorem ipsum"';
				break;
			case 'number':
				value += 'rand(1,100)';
				break;
			case 'date':
				value += `''.getdate()['year'].'-'.rand(1,12).'-'.(1+rand(0,27))`;
				break;
			case 'email':
				value += '"correo".$contador++."@correo.com"';
				break;
			case 'tel':
				value += 'rand(7000000000,8000000000);';
				break;
			case 'password':
				value += '"password"';
				break;
			case 'longtext':
				value +=
					'"Donec volutpat ligula eu dui malesuada commodo. Duis sit amet convallis leo, sed gravida dui. Duis sed lorem eu justo ultrices lacinia. Curabitur eget placerat ipsum, ut ornare orci. Donec nibh nisl, mattis eget euismod vel, posuere eu eros."';
				break;
		}
		value += ';';
		return value;
	}

	public generate(): void {
		this.code = `
        <?php
            $contador = 1;
            $arreglo = array();
            for($i=0;$i<5;$i++){
                $fila = array();
                $fila[id${this.model.name}]=$i+1;
                ${this.generateRows()}
                $arreglo[]=$fila;
            }
            echo json_encode($arreglo);
        `;
	}

	public getResult(): string {
		return this.code;
	}
}
