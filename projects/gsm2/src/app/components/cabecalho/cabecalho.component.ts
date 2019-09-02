import { UsuarioProvider } from './../../providers/UsuarioProvider';
import { Component, OnInit, Input } from "@angular/core";
import { AppGsmModule } from "../../app.gsm.module";
import { AuthService } from "../../services/AuthService";
import { Router } from "@angular/router";
import { GerenciadorSessao } from "../../services/util/GerenciadorSessao";
import { Usuario } from "../../objects/entidades/Usuario";
import { UsuarioService } from "../../services/UsuarioService";
import { LoadingController } from "ionic-angular";
import { SmAlertController } from "../sm-alert-controller/sm-alert-controller.component";
import * as $ from 'jquery';
import { OcorrenciaProdutoService } from "../../services/OcorrenciaProdutoService";
import { Util } from "../../services/util/Util";
import { Ng4LoadingSpinnerService } from "ng4-loading-spinner";
import { Perfil } from '../../objects/entidades/Perfil';
import { PerfilService } from '../../services/PerfilService';

@Component({
    selector: "cabecalho",
    templateUrl: "./cabecalho.component.html",
    styleUrls: ["./cabecalho.component.scss"]
})
export class CabecalhoComponent implements OnInit {

    usuario: Usuario;
    infoUser;
    @Input() mostrar: boolean;
    novoUsuario: Usuario;
    perfis = [{idPerfil: 1, dsPerfil: "Funcionário SM"}, {idPerfil: 2, dsPerfil: "Cliente"}];
    clientes = [];
    labelClienteFiltro;
    reqMsgCliente;
    reqMsgDoc;
    reqMsgEmail;
    reqMsgNome;
    possuiPermissaoOrganograma: boolean;
    // emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
    msgUsuario: string;
    perfils: Perfil[];

    constructor(
        private router: Router,
        private loadingCtrl: LoadingController,
        private loading: Ng4LoadingSpinnerService,
        private smAlertController: SmAlertController,
        private perfilService: PerfilService,
        private ocorrenciaProdutoService: OcorrenciaProdutoService,
        private util: Util,
        private usuarioService: UsuarioService
    ) {}

    ngOnInit() {
        this.usuario = GerenciadorSessao.sessao.usuario;
        this.user();
        this.validaPermissaoOrganograma();
        // console.log("ngOnInit...", this);
    }

    verificarUsuario(cpfCnpj) {
        if (cpfCnpj && String(cpfCnpj).trim() && this.util.soNumero(cpfCnpj).length >= 11) {
            this.loading.show();
            this.usuarioService.obterUsuarioPorNrDocumento(cpfCnpj)
            .then(user => {
                if (user && user.idUsuario) {
                    // console.log("userRemoto", JSON.stringify(userRemoto));
                    //if (!userRemoto.nrPerfil || userRemoto.nrPerfil === 0) {
                        //this.perfilService.obterPerfis().then((perfils) => {
                            // console.log('perfil: ' + JSON.stringify(perfils));
                            // this.perfils = perfils;
                        //});
                    //}
                    this.novoUsuario = user;
                    if (!this.novoUsuario.inSituacao) {
                        this.novoUsuario.inSituacao = false;
                    }
                }
                this.loading.hide();
            }).catch(() => {
                this.msgUsuario = "Usuário não cadastrado";
                this.loading.hide();
            });
        }
    }

    sair() {
        AppGsmModule.injector.get(AuthService).destruirSessao();
        this.router.navigate(["/login"]);
    }

    user(): void {
        // console.log('user', this);
        let qtdPerfil = 0;
        this.usuario['perfis'] = [];
        if (this.usuario.inFiscalContrato) {
            qtdPerfil++;
            this.usuario['perfis'].push('Fiscal do Contrato');
        }
        if (this.usuario.inGerenteProjeto) {
            qtdPerfil++;
            this.usuario['perfis'].push('Gerente de Projeto');
        }
        if (this.usuario.inVeterinarioResponsavel) {
            qtdPerfil++;
            this.usuario['perfis'].push('Veterinário Responsável');
        }
        if (this.usuario.inAgronomoResponsavel) {
            qtdPerfil++;
            this.usuario['perfis'].push('Agrônome Responsável');
        }
        if (this.usuario.inFocalPoint) {
            qtdPerfil++;
            this.usuario['perfis'].push('Focal Point');
        }
        if (this.usuario.inFocalPoint) {
            qtdPerfil++;
            this.usuario['perfis'].push('Key User');
        }
        if (this.usuario.funcionario) {
            qtdPerfil++;
            this.usuario['perfis'].push('Funcionário SM');
        }
        this.infoUser = qtdPerfil > 1 || qtdPerfil === 0 ? this.usuario.nome : this.usuario.nome + " / " + this.usuario['perfis'][0].toUpperCase();
    }

    inicializarNovoUsuario() {
        this.novoUsuario = new Usuario();
        this.novoUsuario.inVeterinarioResponsavel = false;
        this.novoUsuario.inAgronomoResponsavel = false;
        this.novoUsuario.inFocalPoint = false;
        this.novoUsuario.inKeyUser = false;
        this.novoUsuario.inGerenteProjeto = false;
        this.novoUsuario.inFiscalContrato = false;
        this.novoUsuario.funcionario = false;
        this.novoUsuario.inAtivo = true;
        this.novoUsuario.inSituacao = false;
        this.novoUsuario.cdCliente = null;
        this.novoUsuario.nrPerfil = 2;
        this.labelClienteFiltro = 'Selecione...';
        this.reqMsgCliente = "";
        this.reqMsgDoc = "";
        this.reqMsgEmail = "";
        this.reqMsgNome = "";
        if (this.clientes && this.clientes.length === 0) {
            this.obterCliente();
        }
    }

    gravarUsuario() {
        if (this.validaNovoUsuario()) {
            if (this.novoUsuario.funcionario == true) {
                this.novoUsuario.nrPerfil = 1;
            } else {
                this.novoUsuario.nrPerfil = 2;
            }
            const load = this.loadingCtrl.create({
                content: "Gravando Ocorrência..."
            });
            load.present().then(() => {
                if (!this.novoUsuario.funcionario && !this.novoUsuario.cdCliente) {
                    this.reqMsgCliente = "Campo Obrigatório";
                    return;
                }
                delete this.novoUsuario.perfil;
                delete this.novoUsuario.perfis;
                this.novoUsuario.inMaster = false;
                this.novoUsuario.nrDocumento = this.util.removerCaracteres(this.novoUsuario.nrDocumento, "0123456789");
                this.usuarioService.gravarUsuario(this.novoUsuario)
                .then(resp => {
                    this.inicializarNovoUsuario();
                    load.dismiss();
                    this.smAlertController.sucesso("Informação", resp.msgResponse);
                    $("#modalCadastroUsuario").hide();
                }).catch(erro => {
                    load.dismiss();
                    console.error("gravarUsuario...", erro);
                });
            }).catch(erro => {
                load.dismiss();
                console.error("Load...", erro);
            });
        }
    }

    obterCliente() {
        if (GerenciadorSessao.usuario.nrDocumento === 'admin') {
            this.ocorrenciaProdutoService.obterClientes(null)
                .then(resp => {
                    let clientesFiltrados;
                    clientesFiltrados = resp.filter(a => {
                        return !this[JSON.stringify(a)] && (this[JSON.stringify(a)] = true);
                    }, Object.create(null));

                    this.clientes = clientesFiltrados;
                }).catch(erro => {
                    console.error("obterClientes...", erro);
                });
        } else {
            this.ocorrenciaProdutoService.obterClientesPorFuncionarioSituacao(GerenciadorSessao.usuario.nrDocumento)
                .then(resp => {
                    let clientesFiltrados;
                    clientesFiltrados = resp.filter(a => {
                        return !this[JSON.stringify(a)] && (this[JSON.stringify(a)] = true);
                    }, Object.create(null));

                    this.clientes = clientesFiltrados;
                }).catch(erro => {
                    console.error("obterClientes...", erro);
                });
        }
    }

    setCliente() {
        // console.log("setCliente...", this);
        setTimeout(() => {
            if (this.novoUsuario.funcionario) {
                const cliente = this.clientes.find(c => c.valor === 'SM');
                // console.log("setCliente...", cliente);
                if (cliente) {
                    // Se for funcionario não tem cdCliente
                    // this.novoUsuario.cdCliente = cliente.codigo;
                    this.labelClienteFiltro = cliente.valor;
                    this.novoUsuario.nrPerfil = 1;
                }
            } else {
                this.novoUsuario.cdCliente = null;
                this.labelClienteFiltro = 'Selecione...';
                this.novoUsuario.nrPerfil = 2;
            }
        }, 100);
    }

    validaNovoUsuario(): boolean {
        // console.log("validaNovoUsuario...", this);
        let nrCamposValidos = 0;
        if (!this.novoUsuario.funcionario && !this.novoUsuario.cdCliente) {
            this.reqMsgCliente = "Campo Obrigatório";
        } else {
            this.reqMsgCliente = "";
            nrCamposValidos++;
        }
        if (!this.novoUsuario.nrDocumento || !this.novoUsuario.nrDocumento.trim()) {
            this.reqMsgDoc = "Campo Obrigatório";
        } else {
            this.novoUsuario.nrDocumento = this.novoUsuario.nrDocumento.trim();
            this.reqMsgDoc = "";
            nrCamposValidos++;
        }
        if (!this.novoUsuario.dsEmail || !this.novoUsuario.dsEmail.trim()) {
            this.reqMsgEmail = "Campo Obrigatório";
        } else {
            var regexp = new RegExp('^([a-zA-Z0-9_\\-\\.]+)@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.)|(([a-zA-Z0-9\\-]+\\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})$');
            if (!regexp.test(this.novoUsuario.dsEmail)) {
                this.reqMsgEmail = "E-mail inválido";
            } else {
                this.novoUsuario.dsEmail = this.novoUsuario.dsEmail.trim();
                this.reqMsgEmail = "";
                nrCamposValidos++;
            }
        }
        if (!this.novoUsuario.nome || !this.novoUsuario.nome.trim()) {
            this.reqMsgNome = "Campo Obrigatório";
        } else {
            this.novoUsuario.nome = this.novoUsuario.nome.trim();
            this.reqMsgNome = "";
            nrCamposValidos++;
        }
        return nrCamposValidos === 4;
    }

    validaPermissaoOrganograma(): void {
        // console.log("possuiPermissaoOrganograma...", this);
        // this.possuiPermissaoOrganograma = this.usuario.nrDocumento === 'admin' || this.usuario.nrDocumento === '03802530543' || this.usuario.inSituacao
        // || this.usuario.inGerenteProjeto || this.usuario.inFiscalContrato || this.usuario.inMaster;
        this.possuiPermissaoOrganograma = GerenciadorSessao.usuario.cdCliente && (this.usuario.inGerenteProjeto || this.usuario.inFiscalContrato);
    }
}
