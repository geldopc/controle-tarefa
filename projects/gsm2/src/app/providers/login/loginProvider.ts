import { GerenciadorSessao } from './../../services/util/GerenciadorSessao';
import { EventEmitter } from '@angular/core';
import { ServicoProvider } from './../ServicoProvider';
import { Injectable } from '@angular/core';
import { Util } from '../../services/util/Util';
import { HTTPResponse } from '../../objects/entidades/HTTPResponse';
import { TipoTimeout } from '../../objects/enums/TipoTimeout';

@Injectable()
export class LoginProvider {

    liberarAcessoApp = new EventEmitter<Boolean>();


    constructor(private servicoProvider: ServicoProvider
        , private util: Util
        ) { }

    /**
     * Efetua o login
     * @param usuario cpf/cnpj do usuário
     * @param senha senha do usuário
     */
    login(usuario: string, senha: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            const data = JSON.stringify({ "nrDocumento": usuario, "senha": senha});
            this.servicoProvider.post('usuario/login/', data, false)
            .then(response => {
                let resposta;
                if (response.dados.codMsgResponse === "MS0001") {
                    resposta = response.dados;
                    GerenciadorSessao.sessao.usuarioAutenticado = true;
                    this.liberarAcessoApp.emit(true); // caso o Token ainda esteja ativo
                    resolve(resposta);
                } else {
                    resposta = response;
                    GerenciadorSessao.sessao.usuarioAutenticado = false;
                    this.liberarAcessoApp.emit(false); // caso o Token ainda esteja ativo
                    reject(resposta);
                }
            }).catch(err => {
                reject(err);
            });
        });
    }

    validarEmail(email: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            const data = JSON.stringify({ "dsEmail": email});
            this.servicoProvider.post('usuario/validarEmail/', data, false)
            .then(response => {
                let resposta;
                if (response.dados.codMsgResponse === "MS0001") {
                    resposta = response.dados;
                    GerenciadorSessao.sessao.usuarioAutenticado = true;
                    this.liberarAcessoApp.emit(true); // caso o Token ainda esteja ativo
                    resolve(resposta);
                } else {
                    resposta = response;
                    GerenciadorSessao.sessao.usuarioAutenticado = false;
                    this.liberarAcessoApp.emit(false); // caso o Token ainda esteja ativo
                    reject(resposta);
                }
            }).catch(err => {
                reject(err);
            });
        });
    }

    consultarEmailUsuario(usuario: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            const data = JSON.stringify({  "dsCpfCnpj": usuario });
            this.servicoProvider.post('usuario/consultarEmailUsuario/', data, false)
            .then(response => {
                let resposta;
                if (response.dados.codMsgResponse === "MS0001") {
                    resposta = response.dados;
                    GerenciadorSessao.sessao.usuarioAutenticado = true;
                    this.liberarAcessoApp.emit(true); // caso o Token ainda esteja ativo
                    resolve(resposta);
                } else {
                    resposta = response;
                    GerenciadorSessao.sessao.usuarioAutenticado = false;
                    this.liberarAcessoApp.emit(false); // caso o Token ainda esteja ativo
                    reject(resposta);
                }
            }).catch(err => {
                reject(err);
            });
        });
    }


    /**
     * atualiza apenas o email do usuário
     * @param usuario cpf/cnpj do usuário
     * @param senha do usuário
     * @param email do usuário
     */
    atualizarEmail(usuario: string, senha: string, email: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            const data = JSON.stringify({ "cpfCnpj": usuario, "senha": senha, "dsEmail": email });
            this.servicoProvider.post('usuario/atualizarEmail/', data, true)
                .then(response => {
                    resolve(response.dados);
                })
                .catch(err => {
                    console.log(err);
                    reject(err);
                });
        });
    }

    /**
     * Recupera Login do Produtor Sindicalizado
     * @param usuario cpf/cnpj do usuário
     * @param senha senha do usuário
     */
    recuperarLoginProdutorSindicalizado(usuarioSindicato: string, cpfCnpjProdutor: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            const data = JSON.stringify({ "dsCpfCnpjUsuarioSindicato": usuarioSindicato, "dsCpfCnpjProdutor": cpfCnpjProdutor });
            this.servicoProvider.post('usuario/obterUsuarioProdutorSindicato/', data, true)
                .then(response => {
                    resolve(response.dados);
                })
                .catch(err => {
                    console.log(err);
                    reject(err);
                });
        });
    }

    /**
     * Efetua o login
     * @param usuario cpf/cnpj do usuário
     */
    reenviarEmailLiberacaoDispositivo(usuario: any): Promise<any> {
        usuario.nome = usuario.dsNome;
        return new Promise<any>((resolve, reject) => {
            this.servicoProvider.post('usuario/reenviarEmailLiberacaoDispositivo/', usuario, true)
                .then(response => {
                    resolve(response.dados);
                })
                .catch(err => {
                    console.log(err);
                    reject(err);
                });
        });
    }

    /**
     * Recupera uma lista de emails cadastrados no sistema relacionado ao usuário em questão.
     * @param usuario cpf/cnpj do usuário
     */
    obterEmailsComHash(cpfCnpj: string, host: string) {
        return this.servicoProvider.post('usuario/obterEmailUsuario/', cpfCnpj, false, TipoTimeout.DEFAULT.value, host);
    }

    obterDadosUsuario(cpfCnpj: string, host: string): Promise<HTTPResponse> {
        return this.servicoProvider.post('usuario/obterInformacoesUsuario/', cpfCnpj, false, TipoTimeout.DEFAULT.value, host);
    }

    solicitarNovaSenha(cpfCnpj: string, emailDigitado, host: string): Promise<HTTPResponse> {
        const request = { usuario: cpfCnpj, email: emailDigitado };
        return this.servicoProvider.post('usuario/solicitarNovaSenha/', JSON.stringify(request), false, TipoTimeout.DEFAULT.value, host);
    }
}
