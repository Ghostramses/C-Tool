import { Generator } from '../Generator';
import * as fs from 'fs-extra';

export class ModuleGenerator implements Generator {
	private pathToOut: string;
	private moduleName: string;
	private pathToModule: string;

	constructor(pathToOut: string, moduleName: string) {
		this.pathToOut = pathToOut;
		this.moduleName = moduleName;
		this.pathToModule = this.pathToOut + '/modulo' + this.moduleName;
	}

	public generate(): void {
		fs.mkdirSync(this.pathToModule);
		fs.mkdirSync(this.pathToModule + '/modelo');
		fs.mkdirSync(this.pathToModule + '/vista');
		fs.mkdirSync(this.pathToModule + '/controlador');
		fs.mkdirSync(this.pathToModule + '/widgets');
	}

	public getResult(): string {
		return this.pathToModule;
	}

	public reset(): void {}
}
