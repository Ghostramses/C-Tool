import { Generator } from '../Generator';

export class CreateModelGenerator implements Generator {
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
        <?php
            ${this.getVars()}
            $out = new stdClass();
            $out -> noError = 0;
            $out -> mensaje = "";
            $out -> id${this.modelo.name} = rand(11,10011);
            echo json_encode($out);
        `;
	}
	public getResult(): string {
		return this.code;
	}

	private getVars(): string {
		let variables = '';
		for (const key in this.modelo.metadata) {
			if (this.modelo.metadata.hasOwnProperty(key)) {
				const data = this.modelo.metadata[key];
				variables += `
                $${data.name} = $_POST["add${data.name}"];
                `;
			}
		}
		return variables;
	}
}
