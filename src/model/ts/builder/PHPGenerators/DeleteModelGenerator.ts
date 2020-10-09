import { Generator } from '../Generator';

export class DeleteModelGenerator implements Generator {
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
            $id${this.modelo.name} = $_POST["id${this.modelo.name}"];

            $out = new stdClass();
            $out -> noError = 0;
            $out -> mensaje = "";
            echo json_encode($out);
        `;
	}
	public getResult(): string {
		return this.code;
	}
}
