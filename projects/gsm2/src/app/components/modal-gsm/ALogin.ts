import { AuthService } from './../../services/AuthService';
import { EventEmitter } from '@angular/core';
import { GerenciadorSessao } from './../../services/util/GerenciadorSessao';
import { Sessao } from './../../objects/entidades/Sessao';
import { Util } from './../../services/util/Util';
import { Parametros } from './../../objects/entidades/Parametros';
import { Usuario } from './../../objects/entidades/Usuario';
import { LoginService } from './../../services/LoginService';
import { ConfiguracaoService } from './../../services/util/Config';
import { VariaveisGlobais } from './../../objects/entidades/VariaveisGlobais';
import { Estado } from './../../objects/entidades/Estado';
import { Logger } from './../../services/util/Logger';
import { AlertController, MenuController } from 'ionic-angular';
import { Input } from '@angular/core';
import { PersistenciaSessaoProvider } from '../../providers/sessao/PersistenciaSessaoProvider';
import { Router } from '@angular/router';
import { AppGsmModule } from '../../app.gsm.module';

export abstract class ALogin {

    private logger = new Logger('ALogin');

    protected atualizarEmail: Boolean = false;
    protected atualizarDados: Boolean = false;

    @Input() mensagem: string;
    cor: string;
    renderedBotao: boolean;

    constructor(
        protected authService: AuthService
    ) {
        this.cor = 'red';
    }

    private recuperarEstado(uf: string): Estado {
        return AppGsmModule.injector.get(VariaveisGlobais).estados.find(el => el.dsUF === uf);
    }

    public exibirMensagemSucesso(msg: string, cor: string = 'green') {
        this.mensagem = msg;
        this.cor = cor;
    }

    public exibirMensagemErro(msg: string, cor: string = 'red') {
        this.mensagem = msg;
        this.cor = cor;
    }

    public efetuarLogin(cpfCnpj: string, senha: string): Promise<any> {
        return this.validarLogin(cpfCnpj, senha);
    }

    public consultarEmailUsuario(usuario): Promise<any>{
        return this.authService.consultarEmailUsuario(usuario);
    }
    public validarEmail(email): Promise<any>{
        return this.authService.validarEmail(email);
    }

    private validarLogin(cpfCnpj: string, senha: string): Promise<any> {
        return this.authService.fazerLoginWS(cpfCnpj, senha).then(resposta => {
            this.mensagem = null;
            let usuario: Usuario;
            usuario = new Usuario();
            if (resposta.usuario) {
                usuario.idUsuario = resposta.usuario.idUsuario;
                usuario.nrDocumento = resposta.usuario.nrDocumento;
                usuario.nome = resposta.usuario.nome;
                usuario.inAtivo = resposta.usuario.inAtivo;
                usuario.dsEmail = resposta.usuario.dsEmail;
                usuario.dsTelefone = resposta.usuario.dsTelefone;
                usuario.dsChave = resposta.usuario.dsChave;
                usuario.nrPerfil = resposta.usuario.nrPerfil;
                usuario.cdTipoUsuario = resposta.usuario.cdTipoUsuario;
                usuario.cdCliente = resposta.usuario.cdCliente;
                usuario.listPerfil = resposta.usuario.perfis;
                usuario.inSituacao = resposta.usuario.inSituacao;
                usuario.inMaster = resposta.usuario.inMaster;
                usuario.funcionario = resposta.usuario.funcionario;
                usuario.inVeterinarioResponsavel = resposta.usuario.inVeterinarioResponsavel;
                usuario.inAgronomoResponsavel = resposta.usuario.inAgronomoResponsavel;
                usuario.inFocalPoint = resposta.usuario.inFocalPoint;
                // usuario.inFocalPointVegetal = resposta.usuario.inFocalPointVegetal;
                usuario.inKeyUser = resposta.usuario.inKeyUserAnimal;
                // usuario.inKeyUserVegetal = resposta.usuario.inKeyUserVegetal;
                usuario.inGerenteProjeto = resposta.usuario.inGerenteProjeto;
                usuario.inFiscalContrato = resposta.usuario.inFiscalContrato;
            }
            GerenciadorSessao.salvarSessao(usuario).then(() => {
                if (resposta.codMsgResponse == null || resposta.codMsgResponse.startsWith("MR")) {
                    this.exibirMensagemErro(resposta.msgResponse);
                } else {
                    this.exibirMensagemSucesso(resposta.msgResponse);
                    return this.loginSucesso(resposta, usuario, senha);
                }
            });
        }).catch((err) => {
            if (err && err.name !== undefined && err.name === 'TimeoutError') {
                this.exibirMensagemErro('Excedido o tempo limite da operação');
            } else if (err.dados && err.dados.codMsgResponse && err.dados.codMsgResponse === "MR0001" && err.dados.msgResponse) {
                this.exibirMensagemErro(err.dados.msgResponse);
            } else {
                this.exibirMensagemErro('Não foi possível efetuar o login, tente mais tarde.');
            }
            this.logger.error('validarLogin', err, JSON.stringify({
                cpfCnpj: cpfCnpj,
                senha: senha
            }));
        });
    }

    reenviarEmail(usuario) {
        AppGsmModule.injector.get(LoginService).reenviarEmailLiberacaoDispositivo(usuario)
            .then(() => {
                //   const toast = AppGsmModule.injector.get(SmA).create({
                //     message: 'Email enviado com sucesso',
                //     duration: 3000
                // });
                // toast.present();

            }).catch(err => {
                //   const toast = AppGsmModule.injector.get(ToastController).create({
                //     message: 'Não foi possível enviar email',
                //     duration: 3000
                // });
                // toast.present();
            });
    }

    private avisoLiberarDispositivo(usuario: Usuario) {
        const alert = AppGsmModule.injector.get(AlertController).create({
            title: 'Atenção!',
            subTitle: 'Este dispositivo ainda não foi liberado para este usuário, acesse o endereço enviado para o seu email para efetuar a liberação.',
            buttons: [{
                text: 'REENVIAR EMAIL',
                handler: () => {
                    const dispositivo = AppGsmModule.injector.get(Util).getDispositivo() as any;
                    dispositivo.cdUsuario = usuario.nrDocumento;
                    usuario.dispositivo = dispositivo;
                    this.reenviarEmail(usuario);
                }
            }, {
                text: 'OK'
            }]
        });
        alert.present();
    }

    private enableAuthenticatedMenu() {
        const menuCtrl = AppGsmModule.injector.get(MenuController);
        menuCtrl.enable(true, 'autenticado');
        menuCtrl.enable(false, 'anonimo');
    }

    private loginSucesso(resposta: any, usuario: Usuario, senha: string): Promise<any> {
        const persistenciaSessaoProvider = AppGsmModule.injector.get(PersistenciaSessaoProvider);
        return persistenciaSessaoProvider.conectar()
        .then(() => {
            persistenciaSessaoProvider.criar();
        }).then(() => {
            const sessao = new Sessao();
            sessao.usuario = usuario;
            sessao.dataUltimoLogin = new Date();
            GerenciadorSessao.salvarSessao(usuario).then(() => {
                if (usuario.nrDocumento === "admin") {
                    AppGsmModule.injector.get(Router).navigate(["/controle-tarefa"]);
                    // AppGsmModule.injector.get(Router).navigate(["/painel/administracao"]);
                } else if (usuario.funcionario) {
                    // AppGsmModule.injector.get(Router).navigate(["/home-tecnico"]);
                    AppGsmModule.injector.get(Router).navigate(["/controle-tarefa"]);
                } else {
                    AppGsmModule.injector.get(Router).navigate(["/home"]);

                }
            });
            if (usuario.listPerfil && usuario.listPerfil.length === 1) {
                GerenciadorSessao.usuario.listPerfil = usuario.listPerfil[0];
            }
        }).then(() => {
            persistenciaSessaoProvider.obter('1');
        }).then(() => {
            if (Boolean(resposta.atualizarDados)) {
                this.atualizaDadosPage(senha, usuario);
            } else if (Boolean(resposta.atualizarEmail)) {
                this.atualizaEmailPage(senha, usuario);
            } else {
                this.acessarSistema(usuario);
            }
        }).catch(err => {
            if (err.name !== undefined && err.name === 'TimeoutError') {
                this.exibirMensagemErro('Excedido o tempo limite da operação');
            } else {
                this.exibirMensagemErro('Não foi possível efetuar o login, tente mais tarde.');
            }
            this.logger.error('loginSucesso', err, JSON.stringify({
                resposta: resposta,
                usuario: usuario,
                senha: senha
            }));
        });
    }

    // tslint:disable-next-line:member-ordering
    liberarAcessoApp = new EventEmitter<Boolean>();

    public acessarSistema(usuario: Usuario) {
        GerenciadorSessao.sessao.usuarioAutenticado = true;
        this.liberarAcessoApp.emit(true); // caso o Token ainda esteja ativo
    }

    public abstract atualizaDadosPage(senha: string, usuario: Usuario);

    public abstract atualizaEmailPage(senha: string, usuario: Usuario);

}
