import { Generator } from '../Generator';

export class ControllerGenerator implements Generator {
	private js: string = '';
	private modelName: string;

	constructor(modelName: string) {
		this.modelName = modelName;
	}

	public generate(): void {
		this.js = `
            $(document).ready(function(){
                $.getScript("Widgets/jqxData.js",function(){
                    widget${this.modelName}Cargar()
                })
            });
        `;
	}
	public reset(): void {
		this.js = '';
	}
	public getResult(): string {
		const code: string = this.js;
		this.reset();
		return code;
	}
}
