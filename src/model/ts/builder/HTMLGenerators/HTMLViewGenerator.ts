import { HTMLGenerator } from './HTMLGenerator';

export class HTMLViewGenerator extends HTMLGenerator {
	private modelo: any;
    private individual:boolean
	constructor(proyecto: string, modelo: any, individual:boolean=false) {
        super(proyecto)
        this.modelo = modelo;
        this.individual = individual;
	}

	public generate(): void {
		this.html = `
        <!DOCTYPE HTML>
        <html>
            <head>
                <meta charset="UTF-8"/>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>UAEH::${this.proyecto}|${this.modelo.name}</title>

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
                <script src="./controlador/ajxLoader.js"></script>

                <!--Widgets-->
                ${this.individual?
                `<script
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
                ></script>`:
                    `<script
                    type="text/javascript"
                    src="../_jqwidgets/jqxcore.js"
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
                    src="../_jqwidgets/jqxdata.js"
                ></script>
                <script
                    type="text/javascript"
                    src="../_jqwidgets/jqxdatatable.js"
                ></script>
                <script
                type="text/javascript"
                src="../_jqwidgets/jqxwidth.js"
            ></script>`
                }
                
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
                <nav class="navbar navbar-expand-md">
                    <div class="container">
                        <button type="button" class="navbar-toggler navbar-toggler-rigth" data-toggle="collapse" data-target="#navbar2SupportedContent">
                            <span class="navbar-toggler-icon"></span>
                        </button>
                    </div>
                </nav>
                <div class="container-fluid bg-light">
                    ${this.individual?"":
                    `<h1 class="col-md-12 text-center">Prototipo para modelo ${this.modelo.name}</h1>` 
                }
                    <div class="container pb-4">
                        <div id="workspace"></div>
                    </div>
                </div>
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
