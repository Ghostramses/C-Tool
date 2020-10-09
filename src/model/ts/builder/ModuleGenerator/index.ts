import { Generator } from '../Generator';
import * as fs from 'fs-extra';

export class ModuleGenerator implements Generator {
	private pathToOut: string;
	private moduleName: string;
	private pathToModule: string;

	constructor(pathToOut: string, moduleName: string) {
		this.pathToOut = pathToOut;
		this.moduleName = moduleName;
		this.pathToModule = this.pathToOut + '/Modulo' + this.moduleName;
	}

	public generate(): void {
		fs.mkdirSync(this.pathToModule);
		fs.mkdirSync(this.pathToModule + '/Modelo');
		fs.mkdirSync(this.pathToModule + '/Vista');
		fs.mkdirSync(this.pathToModule + '/Controlador');
		fs.mkdirSync(this.pathToModule + '/Widgets');
	}

	public getResult(): string {
		return this.pathToModule;
	}

	public reset(): void {}
}
