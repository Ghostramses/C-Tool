import { Generator } from '../Generator';

export class UpdateModelGenerator implements Generator {
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
		echo json_encode($out);
	`;
	}
	public getResult(): string {
		return this.code;
	}

	private getVars(): string {
		let variables = `$id${this.modelo.name} = $_POST["id${this.modelo.name}"];`;
		for (const key in this.modelo.metadata) {
			if (this.modelo.metadata.hasOwnProperty(key)) {
				const data = this.modelo.metadata[key];
				variables += `
                $${data.name} = $_POST["${data.name}"];
                `;
			}
		}
		return variables;
	}
}
