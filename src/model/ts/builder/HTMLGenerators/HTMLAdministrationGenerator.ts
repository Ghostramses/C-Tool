import { HTMLGenerator } from './HTMLGenerator';

export class HTMLAdministrationGenerator extends HTMLGenerator {
	public constructor(proyecto: any) {
		super(proyecto);
	}

	private generateDropDownOptions(): string {
		let options = '';
		for (const model in this.proyecto.models) {
			if (this.proyecto.models.hasOwnProperty(model)) {
				options += `
                    <li class="dropdown-option" id="btnAdmon${model}">
                        ${this.proyecto.models[model].name}
                    </li>
                `;
			}
		}
		return options;
	}

	public generate(): void {
		this.html = `
        <!DOCTYPE HTML>
        <html>
            <head>
                <meta charset="UTF-8"/>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>UAEH::${this.proyecto.name}|Administración</title>

                <!--Estilos-->
                <link
                    rel="stylesheet"
                    href="../_jqwidgets/styles/jqx.base.css"
                    type="text/css"
                />
                <link rel="stylesheet" href="../_estilo/bootstrap.min.css" />
                <link rel="stylesheet" href="../_estilo/_glyphicons.css" />
                <link rel="stylesheet" href="../_estilo/SIBStyles.css" />
                <link rel="stylesheet" href="../_estilo/styles.css" />

                <!--Scripts-->
                <script src="../_jscript/JQuery-1.11.1.js"></script>
                <script src="../_jscript/bootstrap.min.js"></script>
                <script src="./controlador/ajxCargador.js"></script>

                <!--Widgets-->
                <script
                    type="text/javascript"
                    src="../_jqwidgets/jqxcore.js"
                ></script>
                <script
                    type="text/javascript"
                    src="../_jqwidgets/jqxdata.js"
                ></script>
                <script
                    type="text/javascript"
                    src="../_jqwidgets/jqxbuttons.js"
                ></script>
                <script
                    type="text/javascript"
                    src="../_jqwidgets/jqxscrollbar.js"
                ></script>
                <script
                    type="text/javascript"
                    src="../_jqwidgets/jqxmenu.js"
                ></script>
                <script
                    type="text/javascript"
                    src="../_jqwidgets/jqxlistbox.js"
                ></script>
                <script
                    type="text/javascript"
                    src="../_jqwidgets/jqxdropdownlist.js"
                ></script>
                <script
                    type="text/javascript"
                    src="../_jqwidgets/jqxgrid.js"
                ></script>
                <script
                    type="text/javascript"
                    src="../_jqwidgets/jqxgrid.selection.js"
                ></script>
                <script
                    type="text/javascript"
                    src="../_jqwidgets/jqxgrid.columnsresize.js"
                ></script>
                <script
                    type="text/javascript"
                    src="../_jqwidgets/jqxgrid.filter.js"
                ></script>
                <script
                    type="text/javascript"
                    src="../_jqwidgets/jqxgrid.sort.js"
                ></script>
                <script
                    type="text/javascript"
                    src="../_jqwidgets/jqxgrid.pager.js"
                ></script>
                <script
                    type="text/javascript"
                    src="../_jqwidgets/jqxgrid.grouping.js"
                ></script>
            </head>
            <body>
                <header class="p-3">
                    <div class="container" id="cabeza">
                        <div class="row">
                            <div class="col-md-3">
                                <img
                                    src="../_img/uaeh2.png"
                                    alt="logosup"
                                    class="d-block img-fluid mx-auto"
                                />
                            </div>
                            <div
                                class="col-md-8 justify-content-center d-flex flex-column align-items-center w-100"
                            >
                                <h1 id="texto" class="text-center">
                                    Universidad Aut&oacute;noma del Estado de Hidalgo
                                </h1>
                            </div>
                        </div>
                    </div>
                </header>
                <nav class="navbar navbar-inverse">
                    <div class="container-fluid">
                        <ul class="nav navbar-nav">
                            <li class="dropdown">
                                <a
                                    href="#"
                                    class="dopdown-toggle"
                                    data-toggle="dropdown"
                                    >Administraci&oacute;n <span class="caret"></span
                                ></a>
                                <ul class="dropdown-menu">
                                    ${this.generateDropDownOptions()}
                                </ul>
                            </li>
                        </ul>
                        <ul class="nav navbar-nav navbar-right">
                            <li>
                                <p id="nombreAdmin">
                                    <span class="glyphicon glyphicon-user"></span>
                                </p>
                            </li>
                            <li class="cerrar-sesion" id="cerrar-sesion">
                                <p>
                                    <span class="glyphicon glyphicon-log-out"></span>
                                    Cerrar Sesi&oacute;n
                                </p>
                            </li>
                        </ul>
                    </div>
                </nav>

                <main class="container bg-light principal">
                    <div id="workspace"></div>
                </main>

                <footer id="pie">
                    <div class="container p-3">
                        <div class="logouaeh" draggable="true"></div>
                    </div>
                </footer>
                <div class="logo" draggable="true"></div>
            </body>
        </html>
        `;
	}
}
