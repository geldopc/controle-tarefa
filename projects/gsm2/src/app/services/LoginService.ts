import { Injectable } from "@angular/core";
import { LoginProvider } from '../providers/login/loginProvider';
import { Usuario } from '../objects/entidades/Usuario';

@Injectable()
export class LoginService {
    constructor( private loginProvider: LoginProvider) { }

    verificarNecessidadeLogin(): Promise<boolean> {
        return this.estaConectado()
            // .then(() => this.persistenciaUsuarioProvider.obterTodos())
            .then(usuarios => {
                switch (usuarios.length) {
                    case 1:
                        return false;
                    case 0:
                        return true;
                    default:
                        throw new Error('Quantidade de usuarios inválido: ' + usuarios.length);
                }
            });
    }

    /**
     * Espera até a conexão estar prota, caso contrário retorna imediatamente.
     */
    private estaConectado(): Promise<any> {
        // return new Promise<any>((resolve, reject) => {
        //     if (this.persistenciaUsuarioProvider.estaConectado()) {
        //         resolve();
        //     } else {
        //         this.persistenciaUsuarioProvider.conectar().then(resolve, reject);
        //     }
        // });
        return;
    }

    /**
     * Efetua o login
     * @param usuario o cpf/cnpj do usuário
     * @param senha
     * @param estado a sigla do estado
     */
    fazerLogin(usuario: string, senha: string): Promise<any> {
        return this.loginProvider.login(usuario, senha);
    }

    getDadosUsuario(cpfCnpj: string, host: string): Promise<Usuario> {
        return new Promise<Usuario>((resolve, reject) => {
            this.loginProvider.obterDadosUsuario(cpfCnpj, host).then(response => {
                if (response.dados.codMsgResponse == null || response.dados.codMsgResponse.startsWith("MR")) {
                    reject(response.dados.msgResponse);
                } else {
                    const resposta = response.dados;
                    const usuario: Usuario = new Usuario();
                    usuario.nome = resposta.usuario.nome;
                    usuario.dsUf = resposta.usuario.dsUf;
                    usuario.dsEmail = resposta.usuario.dsEmail;
                    usuario.dsTelefone = resposta.usuario.dsTelefone;
                    usuario.listPerfil = resposta.usuario.perfis;
                    usuario.inAtivo = resposta.usuario.inAtivo;
                    usuario.dsChave = resposta.usuario.dsChave;
                    usuario.nrPerfil = resposta.usuario.nrPerfil;
                    usuario.cdTipoUsuario = resposta.usuario.cdTipoUsuario;
                    resolve(usuario);
                }
            }).catch(error => {
                reject(error);
            });
        });
    }

    solicitarNovaSenha(cpfCnpj: string, emailDigitado: string, host: string): Promise<any> {
        return new Promise<Usuario>((resolve, reject) => {
            this.loginProvider.solicitarNovaSenha(cpfCnpj, emailDigitado, host).then(resposta => {
                if (resposta.dados.codMsgResponse == null || resposta.dados.codMsgResponse.startsWith("MR")) {
                    reject();
                } else {
                    resolve();
                }
            }).catch(error => {
                reject(error);
            });
        });
    }

    atualizarEmail(usuario: string, senha: string, email: string): Promise<any> {
        return this.loginProvider.atualizarEmail(usuario, senha, email);
    }

    /**
     * Efetua o login
     * @param usuario o cpf/cnpj do usuário
     * @param senha
     * @param estado a sigla do estado
     */
    recuperarLoginProdutorSindicalizado(usuarioSindicato: string, cpfCnpjProdutor: string): Promise<any> {
        return this.loginProvider.recuperarLoginProdutorSindicalizado(usuarioSindicato, cpfCnpjProdutor);
    }

    /**
     * Recuperar a senha do usuario
     * @param usuario o cpf/cnpj do usuário
     * @param senha
     * @param estado a sigla do estado
     */
    recuperarEmailUsuario(cpfCnpj: string, host: string): Promise<any> {
        return new Promise<Usuario>((resolve, reject) => {
            this.loginProvider.obterEmailsComHash(cpfCnpj, host).then(resposta => {
                if (resposta.dados.codMsgResponse == null || resposta.dados.codMsgResponse.startsWith("MR")) {
                    reject(resposta.dados.msgResponse);
                } else {
                    const usuario: Usuario = new Usuario();
                    usuario.dsEmail = resposta.dados.usuario.dsEmail;
                    resolve(usuario);
                }
            }).catch(error => {
                reject(error);
            });
        });
    }


    /**
     * Reenvia email de liberação do dispositivo
     * @param usuario
     */
    reenviarEmailLiberacaoDispositivo(usuario: Usuario): Promise<any> {
        return this.loginProvider.reenviarEmailLiberacaoDispositivo(usuario)
    }
}
