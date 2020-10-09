import { HTMLGenerator } from './HTMLGenerator';

export class HTMLHomeGenerator extends HTMLGenerator {
	public constructor(proyecto: any) {
		super(proyecto);
	}

	private generateButtons(): string {
		let botonesHTML: string = '';
		for (const data in this.proyecto.models) {
			if (this.proyecto.models.hasOwnProperty(data)) {
				botonesHTML += `
                    <div class="col-md-4 contenedor-ancla-home">
                        <a href="./Modulo${this.proyecto.models[data].name}" class="btn btn-home btn-block">
                            ${this.proyecto.models[data].name}
                        </a>
                    </div>
                `;
			}
		}
		return botonesHTML;
	}

	public generate(): void {
		this.html = `
            <!DOCTYPE html>
            <html>
                <head>
                    <meta charset="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <title>UAEH::${this.proyecto.name}</title>
                    
                    <!--Estilos-->
                    <link rel="stylesheet" href="_estilo/bootstrap.min.css" />
                    <link rel="stylesheet" href="_estilo/_glyphicons.css" />
                    <link rel="stylesheet" href="_estilo/SIBStyles.css" />
                    <link rel="stylesheet" href="_estilo/styles.css" />

                    <!--Scripts-->
                    <script src="_jscript/JQuery-1.11.1.js"></script>
                    <script src="_jscript/bootstrap.min.js"></script>
                    <script src="_jscript/ajxLogin.js"></script>
                </head>
                <body>
                    <header class="p-3">
                        <div class="container" id="cabeza">
                            <div class="row">
                                <div class="col-md-3">
                                    <img
                                        src="_img/uaeh2.png"
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
                                <div class="col-md pt-4">
                                    <span
                                        ><a
                                            href="#"
                                            id="adminLogin"
                                            data-toggle="modal"
                                            data-target="#modal"
                                            data-backdrop="static"
                                            ><img
                                                src="_img/admin-settings.png"
                                                alt="imgAdmon"
                                                class="img-fluid" /></a
                                    ></span>
                                </div>
                            </div>
                        </div>
                    </header>

                    <nav class="navbar-expand-md navbar">
                        <div class="container">
                            <button
                                class="navbar-toggler navbar-toggler-right"
                                type="button"
                                data-toggle="collapse"
                                data-target="#navbar2SupportedContent"
                            >
                                <span class="navbar-toggler-icon"></span>
                            </button>
                        </div>
                    </nav>

                    <div class="container bg-light principal">
                        <main>
                            <h1 class="text-center">${this.proyecto.name}</h1>
                            <div class="row">
                                ${this.generateButtons()}
                            </div>
                        </main>
                    </div>

                    <footer id="pie">
                        <div class="container p-3">
                            <div class="logouaeh" draggable="true"></div>
                        </div>
                    </footer>
                    <div class="logo" draggable="true"></div>

                    <div class="modal fade" id="modal" role="dialog">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header center-block">
                                    <div>
                                        <h3 class="modal-title text-center">
                                            Administrador
                                        </h3>
                                        <h5 class="text-center">Iniciar Sesi&oacute;n</h5>
                                    </div>
                                </div>
                                <div class="modal-body">
                                    <form method="POST" class="login" id="adminLoginForm">
                                        <div class="form-group">
                                            <label for="adminUser"
                                                ><span
                                                    class="glyphicon glyphicon-user"
                                                ></span>
                                                Usuario:</label
                                            >
                                            <input
                                                type="text"
                                                class="form-control"
                                                id="adminUser"
                                                name="adminUser"
                                            />
                                        </div>
                                        <div class="form-group">
                                            <label for="adminPassword"
                                                ><span
                                                    class="glyphicon glyphicon-lock"
                                                ></span>
                                                Contrase&ntilde;a:</label
                                            >
                                            <input
                                                type="password"
                                                name="adminPassword"
                                                id="adminPassword"
                                                class="form-control"
                                            />
                                        </div>
                                        <div class="spinner-svg" id="spinnerAdmin">
                                            <img src="_img/spinner.svg" alt="spinner" />
                                        </div>
                                        <button
                                            type="submit"
                                            class="btn btn-success btn-block"
                                            id="btnAdmin"
                                        >
                                            Iniciar sesi&oacute;n
                                        </button>
                                        <button
                                            type="button"
                                            class="btn btn-danger btn-block"
                                            data-dismiss="modal"
                                            id="limpiarAdmin"
                                        >
                                            Cancelar
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </body>
            </html>
        `;
	}
}
