import { Generator } from '../Generator';

export class CargadorGenerator implements Generator {
	private proyecto: any;
	private js: string = '';

	constructor(proyecto: any) {
		this.proyecto = proyecto;
	}

	public generate(): void {
		this.js = `
            const localData = localStorage.getItem("prototype-session");
            $(document).ready(function(){
                $("#nombreAdmin").append(JSON.parse(localData).nombre);
                $("#cerrar-sesion").click(function(){
                    localStorage.removeItem("prototype-session");
                    window.location="../";
                });
                ${this.generarCargadores()}
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

	private generarCargadores(): string {
		let cargadores: string = '';
		for (const model in this.proyecto.models) {
			if (this.proyecto.models.hasOwnProperty(model)) {
				const data = this.proyecto.models[model];
				cargadores += `
                $("#btnAdmon${data.name}").click(function(){
                    $.get("Vista/vta${data.name}.html",function(html){
                        $("#workspace").html(html);
                        $.getScript("Widgets/jqx${data.name}.js",function(){
                            widget${data.name}Cargar();
                        })
                    });
                });
                `;
			}
		}
		return cargadores;
	}
}
