import { Generator } from '../Generator';

export class ControllerGenerator implements Generator {
	private js: string = '';
	private modelName: string;
	private individual:boolean;

	constructor(modelName: string, individual:boolean=false) {
		this.modelName = modelName;
		this.individual = individual;
	}

	public generate(): void {
		this.js = `
            $(document).ready(function(){
				${this.individual?
					`$.get("vista/vta${this.modelName}.html",function(html){
						$("#workspace").html(html)
						$.getScript("widgets/jqx${this.modelName}.js",function(){
							widget${this.modelName}Cargar()
						})
					})`:
					`$.getScript("widgets/jqxData.js",function(){
						widget${this.modelName}Cargar()
					})`
				}
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
