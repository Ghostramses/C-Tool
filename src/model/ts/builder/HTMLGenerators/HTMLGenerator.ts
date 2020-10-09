import { Generator } from '../Generator';

export abstract class HTMLGenerator implements Generator {
	protected proyecto: any;
	protected html: string = '';

	public constructor(proyecto: any) {
		this.proyecto = proyecto;
		this.reset();
	}

	public abstract generate(): void;

	public getResult(): string {
		const code = this.html;
		this.reset();
		return code;
	}

	public reset(): void {
		this.html = '';
	}
}
