import { Component, OnInit } from "@angular/core";
import { GridDataResult, PageChangeEvent } from "@progress/kendo-angular-grid";
import { OcorrenciaProdutoService } from "../../services/OcorrenciaProdutoService";
import { UsuarioService } from "../../services/UsuarioService";
import { GrupoGestor } from "../../objects/entidades/GrupoGestor";
import { Usuario } from "../../objects/entidades/Usuario";
import { LoadingController, AlertController } from "ionic-angular";
import { GrupoGestorService } from "../../services/GrupoGestorService";
import { Util } from "../../services/util/Util";
import { SmAlertController } from "../../components/sm-alert-controller/sm-alert-controller.component";
import { ProgramaService } from "../../services/ProgramaService";
import { FocalPoint } from "../../objects/entidades/FocalPoint";
import { Programa } from "../../objects/entidades/Programa";
import { KeyUser } from "../../objects/entidades/KeyUser";
import { GerenciadorSessao } from "../../services/util/GerenciadorSessao";
import { Router } from "@angular/router";
import { AppGsmModule } from "../../app.gsm.module";
import { AuthService } from "../../services/AuthService";

@Component({
    selector: "page-grupo-gestor",
    templateUrl: "./grupo-gestor.component.html",
    styleUrls: ["./grupo-gestor.component.scss"]
})
// tslint:disable-next-line:component-class-suffix
export class GrupoGestorPage implements OnInit {

    aguardAt: number = 0;
    aguardDist: number = 0;
    aguardViab: number = 0;
    desenvolvimento: number = 0;
    homoBeta: number = 0;
    gerandoVersaoAlfa: number = 0;
    gridView: GridDataResult;
    pageSize = 10;
    skip = 0;
    // listGrupoGestor: any[] = [];
    clientes: any[] = [];
    clientesTemp: any[] = [];
    programas: Programa[];
    programasTemp: Programa[];
    grupoGestor: GrupoGestor = new GrupoGestor();
    listGrupoGestor: GrupoGestor[];
    usuarios: Usuario[] = [];
    labelFiscalContrato: string;
    labelGerenteProjeto: string;
    labelVeterinario: string;
    labelAgronomo: string;
    labelCliente: string;
    focalPoint: FocalPoint;
    // focalPointTemp: FocalPoint;
    areas = [{ descricao: 'Animal', valor: 'A' }, { descricao: 'Vegetal', valor: 'V' }, { descricao: 'Outros', valor: 'O' }];
    area = { descricao: 'Animal', valor: 'A' };
    labelPrograma: string;
    labelGerentePrograma: string;
    keyUser: KeyUser;
    labelKeyUser: string;
    reqMsgArea;
    reqMsgPrograma;
    reqMsgGerentePrograma;
    reqMsgKeyUser: any;
    reqMsgCliente: any;
    reqMsgFiscalContrato: any;
    reqMsgGerenteProjeto: any;
    reqMsgVeterinario: any;
    reqMsgAgronomo: any;
    permiteEditar: boolean;

    constructor(
        private ocorrenciaProdutoService: OcorrenciaProdutoService,
        private usuarioService: UsuarioService,
        private programaService: ProgramaService,
        private loadingCtrl: LoadingController,
        private grupoGestorService: GrupoGestorService,
        private util: Util,
        private smAlertController: SmAlertController,
        private alertCtrl: AlertController,
        private router: Router
    ) { }

    ngOnInit() {
        // console.log('ngOnInit...', this);
        this.obterGrupoGestor();
        this.obterCliente();
    }

    // tslint:disable-next-line:use-life-cycle-interface
    ngAfterViewInit(): void {
        // console.log('ngAfterViewInit...', this);
        // this.obterCliente();
    }

    public pageChange(event: PageChangeEvent): void {
        this.skip = event.skip;
        this.loadItems();
    }

    private loadItems(): void {
        // console.log("loadItems...", this);
        this.gridView = {
            data: this.listGrupoGestor.slice(this.skip, this.skip + this.pageSize),
            total: this.listGrupoGestor.length
        };
    }

    novoGrupoGestor() {
        this.grupoGestor = new GrupoGestor();
        // this.obterCliente();
        this.labelCliente = '';
        this.limparGrupoGestor();
        this.limparMsgReqGrupoGestor();
    }

    eliminarClientesCadastrados(list) {
        // console.log("Tratar cliente", list);
        this.clientes = [];
        let listClientesAdd: number[] = [];
        this.listGrupoGestor.forEach(gg => {
            listClientesAdd.push(gg.cliente.idCliente);
        });
        list.forEach(item => {
            if (listClientesAdd.indexOf(+item.codigo) < 0 && item.valor !== 'SM') {
                this.clientes.push(item);
            }
        });
    }

    obterCliente() {
        const load = this.loadingCtrl.create({
            content: "Carregando Clientes..."
        });
        load.present().then(() => {
            if (!GerenciadorSessao.sessao.usuario) {
                load.dismiss();
                this.alertCtrl.create({
                    title: 'Aviso',
                    subTitle: 'Efetue o login novamente',
                    buttons: [{
                        text: 'Ok',
                        handler: () => {
                            AppGsmModule.injector.get(AuthService).destruirSessao();
                            this.router.navigate(["/login"]);
                        }
                    }]
                }).present();
            } else if (GerenciadorSessao.sessao.usuario.nrDocumento === 'admin') {
                this.ocorrenciaProdutoService.obterClientes(null)
                    .then(resp => {
                        if (resp && resp.length) {
                            // this.clientes = resp;
                            // console.log("Tratar cliente", resp);
                            this.clientes = [];
                            let listClientesAdd: number[] = [];
                            this.listGrupoGestor.forEach(gg => {
                                listClientesAdd.push(gg.cliente.idCliente);
                            });
                            resp.forEach(item => {
                                if (item.valor !== 'SM') {
                                    if (listClientesAdd.indexOf(+item.codigo) > -1) {
                                        this.clientes.push(item);
                                    } else {
                                        this.clientesTemp.push(item);
                                    }
                                }
                            });
                        }
                        load.dismiss();
                    }).catch(erro => {
                        console.error("obterClientes...", erro);
                    });
            } else {
                this.ocorrenciaProdutoService.obterClientesPorFuncionarioSituacao(GerenciadorSessao.sessao.usuario.nrDocumento)
                .then(resp => {
                    if (resp && resp.length) {
                        // this.clientes = resp;
                        // console.log("Tratar cliente", resp);
                        this.clientes = [];
                        let listClientesAdd: number[] = [];
                        if (this.listGrupoGestor && this.listGrupoGestor.length) {
                            this.listGrupoGestor.forEach(gg => {
                                listClientesAdd.push(gg.cliente.idCliente);
                            });
                        }
                        resp.forEach(item => {
                            if (item.valor !== 'SM') {
                                if (listClientesAdd && listClientesAdd.length && listClientesAdd.indexOf(+item.codigo) > -1) {
                                    this.clientes.push(item);
                                } else {
                                    this.clientesTemp.push(item);
                                }
                            }
                        });
                    }
                    load.dismiss();
                }).catch(erro => {
                    load.dismiss();
                    console.error("obterClientes...", erro);
                });
            }
        }).catch(erro => {
            load.dismiss();
        });
    }

    obterUsuarios() {
        this.usuarioService.obterUsuarios(this.grupoGestor.cdCliente)
            .then(resp => {
                // console.log("obterUsuarios...", resp);
                this.usuarios = [];
                let usuario = new Usuario();
                usuario.idUsuario = null;
                usuario.nome = 'Selecione...';
                this.usuarios.push(usuario);
                if (resp && resp.length) {
                    resp.forEach(u => {
                        this.usuarios.push(u);
                    });
                }
                // this.usuarios = resp;
            }).catch(erro => {
                console.error("obterUsuarios...", erro);
            });
    }

    limparGrupoGestor() {
        // console.log("limparGrupoGestor...", this);
        this.grupoGestor.cdFiscalContrato = null;
        this.grupoGestor.cdGerenteProjeto = null;
        this.grupoGestor.cdVeterinario = null;
        this.grupoGestor.cdAgronomo = null;
        this.labelFiscalContrato = '';
        this.labelGerenteProjeto = '';
        this.labelVeterinario = '';
        this.labelAgronomo = '';
    }

    manterGrupoGestor() {
        if (this.validaGrupoGestor()) {
            if (this.grupoGestor.idGrupoGestor) {
                const load = this.loadingCtrl.create({
                    content: "Atualizando Grupo Gestor..."
                });
                load.present().then(() => {
                    this.grupoGestorService.editar(this.grupoGestor)
                        .then(resp => {
                            // console.log("editar...", resp);
                            load.dismiss();
                            this.util.closeModal('modalGrupoGestor');
                            this.smAlertController.sucesso("", resp.msgResponse);
                        }).then(() => {
                            this.obterGrupoGestor();
                        }).catch(erro => {
                            load.dismiss();
                            this.smAlertController.error("", erro.msgResponse);
                            console.error("Erro...", erro);
                        });
                }).catch(erro => {
                    load.dismiss();
                });
            } else {
                const load = this.loadingCtrl.create({
                    content: "Gravando Grupo Gestor..."
                });
                load.present().then(() => {
                    this.grupoGestorService.gravar(this.grupoGestor)
                        .then(resp => {
                            // console.log("gravar...", resp);
                            load.dismiss();
                            this.util.closeModal('modalGrupoGestor');
                            this.smAlertController.sucesso("", resp.msgResponse);
                        }).then(() => {
                            this.obterGrupoGestor();
                        }).catch(erro => {
                            console.error("Erro...", erro);
                            load.dismiss();
                            this.smAlertController.error("", erro.msgResponse);
                        });
                }).catch(erro => {
                    load.dismiss();
                });
            }
        }
    }

    obterGrupoGestor() {
        const load = this.loadingCtrl.create({
            content: "Carregando Grupo Gestor..."
        });
        load.present().then(() => {
            this.grupoGestorService.obterTodos()
                .then(resp => {
                    // console.log("obterTodos...", resp);
                    this.listGrupoGestor = resp;
                }).then(() => {
                    this.loadItems();
                    load.dismiss();
                }).catch(erro => {
                    load.dismiss();
                    console.error("obterUsuarios...", erro);
                });
        }).catch(erro => {
            load.dismiss();
        });
    }

    editarGrupoGestor(gp: GrupoGestor) {
        // console.log("editarGrupoGestor...", gp, this);
        this.grupoGestor = gp;
        this.obterUsuarios();
        this.labelCliente = this.grupoGestor.cliente.dsCliente;
        this.labelFiscalContrato = this.grupoGestor.fiscalContrato.nome;
        this.labelGerenteProjeto = this.grupoGestor.gerenteProjeto.nome;
        this.labelVeterinario = this.grupoGestor.veterinario.nome;
        this.labelAgronomo = this.grupoGestor.agronomo.nome;
    }

    private obterProgramas() {
        const load = this.loadingCtrl.create({
            content: "Carregando Programas..."
        });
        load.present().then(() => {
            this.programaService.obterProgramas()
                .then(resp => {
                    // console.log("obterProgramas...", resp);
                    if (resp && resp.length) {
                        this.programas = resp;
                    }
                    load.dismiss();
                }).then(() => {
                    this.filtrarPrograma();
                }).catch(erro => {
                    load.dismiss();
                    console.error("obterProgramas...", erro);
                });
        }).catch(erro => {
            load.dismiss();
        });
    }

    preAddFocalPoint(gp: GrupoGestor) {
        // console.log("preAddFocalPoint...", this, gp);
        this.labelPrograma = '';
        this.labelGerentePrograma = '';
        this.grupoGestor = gp;
        this.area = { descricao: 'Animal', valor: 'A' };
        if (!this.programas || this.programas.length === 0) {
            this.obterProgramas();
        }
        this.focalPoint = new FocalPoint();
        this.focalPoint.programa = new Programa();
        this.focalPoint.programa.area = this.area.valor;
        this.focalPoint.cdGrupoGestor = this.grupoGestor.idGrupoGestor;
        this.obterUsuarios();
        this.limparMsgReqFocalPoint();
    }

    filtrarPrograma() {
        // console.log("filtrarPrograma...", this);
        // this.programasTemp = this.programas.filter(p => p.area === this.area.valor);
        let list = this.programas.filter(p => p.area === this.area.valor);
        this.programasTemp = Object.assign([], list);
    }

    gravarFocalPoint() {
        if (this.validaFocalPoint()) {
            if (this.focalPoint.idFocalPoint) {
                this.editFocalPoint();
            } else {
                this.addFocalPoint();
            }
        }
    }

    addFocalPoint() {
        const load = this.loadingCtrl.create({
            content: "Gravando Focal Pointer..."
        });
        load.present().then(() => {
            this.grupoGestorService.gravarFocalPoint(this.focalPoint)
                .then(resp => {
                    // console.log("gravar...", resp);
                    load.dismiss();
                    this.util.closeModal('modalAddFocalPoint');
                    this.smAlertController.sucesso("", resp.msgResponse);
                }).then(() => {
                    this.obterGrupoGestor();
                }).catch(erro => {
                    console.error("Erro...", erro);
                    load.dismiss();
                    this.smAlertController.error("", erro.msgResponse);
                });
        }).catch(erro => {
            load.dismiss();
        });
    }

    limparFocalPoint() {
        this.labelPrograma = '';
        this.labelGerentePrograma = '';
        this.focalPoint.cdPrograma = null;
        this.focalPoint.cdGerentePrograma = null;
    }

    preAddKeyUser(gp: GrupoGestor, fp: FocalPoint) {
        // console.log("preAddKeyUser...", this, gp, fp);
        this.focalPoint = fp;
        this.grupoGestor.cdCliente = gp.cliente.idCliente;
        this.keyUser = new KeyUser();
        this.keyUser.focalPoint = fp;
        this.keyUser.cdFocalPoint = this.focalPoint.idFocalPoint;
        this.labelKeyUser = '';
        this.obterUsuarios();
        this.limparMsgReqKeyUser();
    }

    addKeyUser() {
        if (this.validaKeyUser()) {
            const load = this.loadingCtrl.create({
                content: "Gravando Key User..."
            });
            load.present().then(() => {
                this.grupoGestorService.gravarKeyUser(this.keyUser)
                    .then(resp => {
                        // console.log("gravar...", resp);
                        load.dismiss();
                        this.util.closeModal('modalAddKeyUser');
                        this.smAlertController.sucesso("", resp.msgResponse);
                        if (this.focalPoint) {
                            if (this.focalPoint.listKeyUser && this.focalPoint.listKeyUser.length) {
                                this.focalPoint.listKeyUser.push(this.keyUser);
                            } else {
                                this.focalPoint.listKeyUser = [];
                                this.focalPoint.listKeyUser.push(this.keyUser);
                            }
                        }
                    }).then(() => {
                        this.obterGrupoGestor();
                    }).catch(erro => {
                        console.error("Erro...", erro);
                        load.dismiss();
                        this.smAlertController.error("", erro.msgResponse);
                    });
            }).catch(erro => {
                load.dismiss();
            });
        }
    }

    limparKeyUser() {
        this.labelKeyUser = '';
        this.keyUser.cdFocalPoint = null;
        this.focalPoint = null;
    }

    preEditFocalPoint(gp: GrupoGestor, fp: FocalPoint) {
        // console.log("preEditFocalPoint...", fp);
        this.focalPoint = fp;
        this.grupoGestor = gp;
        this.area = this.areas.find(f => f.valor === fp.programa.area);
        this.labelPrograma = this.focalPoint.programa.dsPrograma;
        this.labelGerentePrograma = this.focalPoint.gerentePrograma.nome;
        if (!this.programas || this.programas.length === 0) {
            this.obterProgramas();
        }
        this.obterUsuarios();
        this.limparMsgReqFocalPoint();
    }

    preDelFocalPoint(fp: FocalPoint) {
        // console.log("preDelFocalPoint...", fp);
        if (fp.listKeyUser && fp.listKeyUser.length) {
            let alert = this.alertCtrl.create({
                title: 'Confirmação',
                subTitle: "Não é permitido excluir um Focal Point que possui Key User vinculado!",
                buttons: ['OK']
            });
            alert.present();
        } else {
            let alert = this.alertCtrl.create({
                title: 'Confirmação',
                subTitle: "<div class='alert alert-info text-center'><strong>" + fp.programa.dsPrograma + "</strong><br/><small>" + fp.gerentePrograma.nome +
                    "</small></div><br/>Deseja realmente excluir o Focal Point selecionado?",
                buttons: [{
                    text: 'Não'
                }, {
                    text: 'Sim',
                    handler: data => {
                        this.focalPoint = fp;
                        this.delFocalPoint();
                    }
                }]
            });
            alert.present();
        }
    }

    editFocalPoint() {
        const load = this.loadingCtrl.create({
            content: "Editando dados Focal Point..."
        });
        load.present().then(() => {
            this.grupoGestorService.editarFocalPoint(this.focalPoint)
                .then(resp => {
                    this.focalPoint = null;
                    // console.log("editarFocalPoint...", resp);
                    load.dismiss();
                    this.util.closeModal('modalAddFocalPoint');
                    this.smAlertController.sucesso("", resp.msgResponse);
                }).then(() => {
                    this.obterGrupoGestor();
                }).catch(erro => {
                    console.error("Erro...", erro);
                    load.dismiss();
                    this.smAlertController.error("", erro.msgResponse);
                });
        }).catch(erro => {
            load.dismiss();
        });
    }

    delFocalPoint() {
        const load = this.loadingCtrl.create({
            content: "Excluindo Focal Point..."
        });
        load.present().then(() => {
            this.grupoGestorService.excluirFocalPoint(this.focalPoint)
                .then(resp => {
                    this.focalPoint = null;
                    // console.log("excluirFocalPoint...", resp);
                    load.dismiss();
                    this.smAlertController.sucesso("", resp.msgResponse);
                }).then(() => {
                    this.obterGrupoGestor();
                }).catch(erro => {
                    console.error("Erro...", erro);
                    load.dismiss();
                    this.smAlertController.error("", erro.msgResponse);
                });
        }).catch(erro => {
            load.dismiss();
        });
    }

    preDelKeyUser(key: KeyUser, fp: FocalPoint) {
        // console.log("preDelKeyUser...", key, fp);
        // this.keyUser = JSON.parse(JSON.stringify(key));
        // this.keyUser.focalPoint = JSON.parse(JSON.stringify(fp));
        this.keyUser = new KeyUser();
        this.keyUser.idKeyUser = key.idKeyUser;
        this.keyUser.focalPoint = new FocalPoint();
        this.keyUser.focalPoint.tipo = fp.programa.area;
        let alert = this.alertCtrl.create({
            title: 'Confirmação',
            subTitle: "<div class='alert alert-info text-center'><small>" + key.usuario.nome +
                "</small></div><br/>Deseja realmente excluir o Key User selecionado?",
            buttons: [{
                text: 'Não'
            }, {
                text: 'Sim',
                handler: data => {
                    this.delKeyUser();
                }
            }]
        });
        alert.present();
    }

    delKeyUser() {
        // console.log("delKeyUser...", this);
        const load = this.loadingCtrl.create({
            content: "Excluindo Key User..."
        });
        load.present().then(() => {
            this.grupoGestorService.excluirKeyUser(this.keyUser)
                .then(resp => {
                    this.focalPoint = null;
                    // console.log("excluirKeyUser...", resp);
                    load.dismiss();
                    this.smAlertController.sucesso("", resp.msgResponse);
                }).then(() => {
                    this.obterGrupoGestor();
                }).catch(erro => {
                    console.error("Erro...", erro);
                    load.dismiss();
                    this.smAlertController.error("", erro.msgResponse);
                });
        }).catch(erro => {
            load.dismiss();
        });
    }

    validaFocalPoint(): boolean {
        let valida = false;
        if (this.focalPoint.programa.area) {
            this.reqMsgArea = null;
        } else {
            this.reqMsgArea = "Campo Obrigatório";
        }
        if (this.focalPoint.cdPrograma) {
            this.reqMsgPrograma = null;
        } else {
            this.reqMsgPrograma = "Campo Obrigatório";
        }
        // if (this.focalPoint.cdGerentePrograma) {
        //     this.reqMsgGerentePrograma = null;
        // } else {
        //     this.reqMsgGerentePrograma = "Campo Obrigatório";
        // }
        if (this.focalPoint && this.focalPoint.cdPrograma /*&& this.focalPoint.cdGerentePrograma*/) {
            valida = true;
        } else {
            valida = false;
        }
        return valida;
    }

    limparMsgReqFocalPoint() {
        this.reqMsgGerentePrograma = null;
        this.reqMsgPrograma = null;
        this.reqMsgArea = null;
    }

    validaKeyUser(): boolean {
        let valida = false;
        if (this.keyUser.cdUsuario) {
            this.reqMsgKeyUser = null;
        } else {
            this.reqMsgKeyUser = "Campo Obrigatório";
        }
        if (this.keyUser.cdUsuario) {
            valida = true;
        } else {
            valida = false;
        }
        return valida;
    }

    limparMsgReqKeyUser() {
        this.reqMsgKeyUser = null;
    }

    validaGrupoGestor(): boolean {
        let valida = false;
        if (this.grupoGestor.cdCliente) {
            this.reqMsgCliente = null;
        } else {
            this.reqMsgCliente = "Campo Obrigatório";
        }
        if (this.grupoGestor.cdFiscalContrato) {
            this.reqMsgFiscalContrato = null;
        } else {
            this.reqMsgFiscalContrato = "Campo Obrigatório";
        }
        if (this.grupoGestor.cdGerenteProjeto) {
            this.reqMsgGerenteProjeto = null;
        } else {
            this.reqMsgGerenteProjeto = "Campo Obrigatório";
        }
        if (this.grupoGestor.cdVeterinario) {
            this.reqMsgVeterinario = null;
        } else {
            this.reqMsgVeterinario = "Campo Obrigatório";
        }
        // if (this.grupoGestor.cdAgronomo) {
        //     this.reqMsgAgronomo = null;
        // } else {
        //     this.reqMsgAgronomo = "Campo Obrigatório";
        // }
        if (this.grupoGestor.cdCliente && this.grupoGestor.cdFiscalContrato && this.grupoGestor.cdGerenteProjeto
            && this.grupoGestor.cdVeterinario/* && this.grupoGestor.cdAgronomo*/) {
            valida = true;
        } else {
            valida = false;
        }
        return valida;
    }

    limparMsgReqGrupoGestor() {
        this.reqMsgCliente = null;
        this.reqMsgFiscalContrato = null;
        this.reqMsgGerenteProjeto = null;
        this.reqMsgVeterinario = null;
        this.reqMsgAgronomo = null;
    }

    validaPermissaoEdicao(idCliente): boolean {
        if (GerenciadorSessao.usuario.nrDocumento === 'admin') {
            return true;
        } else {
            let permite = this.clientes.find(c => +c.codigo === idCliente);
            // console.log('validaPermissaoEdicao...', idCliente, permite);
            return permite;
        }
    }

    irParaOrganograma(idCliente) {
        // console.log('irParaOrganograma...', idCliente);
        let obj = { idCliente: idCliente };
        this.router.navigate(["/painel/organograma"], { queryParams: obj });
    }
}
