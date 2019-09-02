import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, ResponseContentType } from "@angular/http";
import { ActivatedRoute } from "@angular/router";
import "rxjs/add/operator/map";
import "rxjs/add/operator/timeout";
import "rxjs/add/operator/toPromise";
import { Autenticacao } from "../objects/entidades/Autenticacao";
import { Estado } from "./../objects/entidades/Estado";
import { HTTPResponse } from "./../objects/entidades/HTTPResponse";
import { UsuarioNaoAutenticadoError } from "./../objects/entidades/UsuarioNaoAutenticadoError";
import { VariaveisGlobais } from "./../objects/entidades/VariaveisGlobais";
import { TipoTimeout } from "./../objects/enums/TipoTimeout";
import { ConfiguracaoService } from './../services/util/Config';
import { GerenciadorSessao } from './../services/util/GerenciadorSessao';
import { EstadoProvider } from "./estadoLocal/EstadoProvider";
import { AutenticacaoPersistenciaProvider } from './login/AutenticacaoPersistenciaProvider';
import { saveAs } from 'file-saver/FileSaver';


@Injectable()
export class ServicoProvider {
    constructor(
        private http: Http,
        private autenticacaoPersistenciaProvider: AutenticacaoPersistenciaProvider,
        private variaveisGlobais: VariaveisGlobais,
        private estadoProvider: EstadoProvider,
        private activatedRoute: ActivatedRoute,
    ) { }

    /**
     * obtem a url atual para definir a url do serviço
     */
    obterUrlAtual(): string {
        // const urls = window.location.href.split("/");
        // let urlAtual = "";
        // for (let i = 0; i < urls.length; i++) {
        //   // resgata até antes da palavra "angular"
        //   if (urls[i] !== "portalcorporativo") {
        //     //  console.log("testeURl: ", urls[i]);
        //     urlAtual += urls[i] + "/";
        //     continue;
        //   }
        //   break;
        // }
        return ConfiguracaoService.enderecoBase;
    }

    /**
     * Atribui na sessão, os parâmetros iniciais, obtendo o objeto do estado
     */
    private obterParametrosIniciais(urlAtual: string): Promise<any> {
        return new Promise<any>(resolve => {
            this.variaveisGlobais.estadosSelecionados = [new Estado()];
            // trocar por cookies
            this.activatedRoute.queryParams.subscribe(param => {
                // obtem a uf do parâmetro da url
                //  const ufParametro = JSON.parse(document.forms["angular"]["parametros"].value).estado;
                // carrega todos os estados do arquivo
                resolve();
            });
        });
    }

    /**
     * Não se aplica no Ambiente Web
     * @param host
     */
    public checkConnection(host?: string): Promise<HTTPResponse> {
        // console.log("checkConnection...", host);
        return new Promise<HTTPResponse>((resolve, reject) => {
            const urlAtual = !host ? ConfiguracaoService.enderecoBase : host;
            this.obterParametrosIniciais(urlAtual).then(() => {
                resolve(this.executaRequisicao("seguranca/check/", "", false, TipoTimeout.DEFAULT.value));
            });
        });
    }

    private getHeaders(check?: boolean): Promise<RequestOptions> {
        return new Promise<RequestOptions>((resolve, reject) => {
            const headers = new Headers();
            headers.append("Content-Type", "application/json;charset=UTF-8");
            if (!check) {
                headers.append("client_id", ConfiguracaoService.clientId);
                headers.append("client_secret", ConfiguracaoService.clientSecret);
                const options = new RequestOptions({ headers: headers });
                //  console.log(JSON.stringify(options));
                resolve(options);
            } else {
                const options = new RequestOptions({ headers: headers });
                //  console.log(JSON.stringify(options));
                resolve(options);
            }
        });
    }

    public getHeadersComAutenticacao(): Promise<RequestOptions> {
        return new Promise<RequestOptions>((resolve, reject) => {
            //  console.log("Montando Header");
            const headers = new Headers();
            headers.append("Content-Type", "application/json;charset=UTF-8");
            headers.append("client_id", ConfiguracaoService.clientId);
            headers.append("client_secret", ConfiguracaoService.clientSecret);
            this.obterAccessToken().then(accessToken => {
                headers.append("access_token", accessToken);
                const options = new RequestOptions({ headers: headers });
                //  console.log(JSON.stringify(options));
                resolve(options);
            });
        });
    }
    public getHeadersJenkinsComAutenticacao(versao): Promise<RequestOptions> {
        return new Promise<RequestOptions>((resolve, reject) => {
            //  console.log("Montando Header");
            const headers = new Headers();
            headers.append("Content-Type", "application/json;charset=UTF-8");
            switch (versao) {
                case "A":
                    headers.append("siapec3", "117457a2f825a549f615a1f5149cca8af7");
                    break;
                case "B":
                    headers.append("siapec3", "1bca6bbc53c4632f4c411cdef31e2ac1");
                    break;
                case "C":
                    headers.append("siapec3", "1bca6bbc53c4632f4c411cdef31e2ac1");
                    break;
            }
            const options = new RequestOptions({ headers: headers });
                //  console.log(JSON.stringify(options));
                resolve(options);
        });
    }

    private obterAccessToken(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            //  console.log("obterAccessToken");
            this.autenticacaoPersistenciaProvider.obter(1).then(result => {
                //  console.log("obterAccessToken - result");
                //  console.log(JSON.stringify(result));
                if (result) {
                    resolve(result.accessToken);
                } else {
                    reject(new UsuarioNaoAutenticadoError());
                }
            });
        });
    }

    private obterRefreshToken(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            //  console.log("obterRefreshToken");
            this.autenticacaoPersistenciaProvider.obter(1).then(result => {
                resolve(result.refreshToken);
            });
        });
    }

    private refreshToken(): Promise<RequestOptions> {
        return new Promise<RequestOptions>((resolve, reject) => {
            //  console.log("Montando Header");
            const headers = new Headers();
            headers.append("Content-Type", "application/json;charset=UTF-8");
            headers.append("client_id", ConfiguracaoService.clientId);
            headers.append("client_secret", ConfiguracaoService.clientSecret);
            this.obterRefreshToken()
                .then(refreshToken => {
                    headers.append("refresh_token", refreshToken);
                    return new RequestOptions({ headers: headers });
                })
                .then(options => {
                    this.http
                        .post(
                            ConfiguracaoService.rest + "seguranca/refresh_token/",
                            "",
                            options
                        )
                        .toPromise()
                        .then(
                            response => {
                                if (response.json().codMsgResponse === "MS0001") {
                                    //  console.log("Autenticado");
                                    this.salvarAutenticacao(
                                        new Autenticacao().init(
                                            1,
                                            response.json().accessToken,
                                            response.json().refreshToken,
                                            GerenciadorSessao.usuario,
                                            GerenciadorSessao.estado
                                        )
                                    ).then(() => {
                                        const newHeader = new Headers();
                                        newHeader.append(
                                            "Content-Type",
                                            "application/json;charset=UTF-8"
                                        );
                                        newHeader.append("client_id", ConfiguracaoService.clientId);
                                        newHeader.append(
                                            "client_secret",
                                            ConfiguracaoService.clientSecret
                                        );
                                        newHeader.append(
                                            "access_token",
                                            response.json().accessToken
                                        );
                                        return resolve(new RequestOptions({ headers: newHeader }));
                                    });
                                } else if (response.json().codMsgResponse === "MR0142") {
                                    console.log(new UsuarioNaoAutenticadoError());
                                    reject(new UsuarioNaoAutenticadoError());
                                }
                            },
                            err => {
                                console.log(err);
                                reject(err);
                            }
                        );
                });
        });
    }

    public checkAuthentication(options: RequestOptions): Promise<RequestOptions> {
        return new Promise<RequestOptions>((resolve, reject) => {
            //  console.log("checkAuthentication");
            //  console.log(JSON.stringify(options));
            this.http.post(ConfiguracaoService.rest + "seguranca/authenticate/", "", options)
                .toPromise()
                .then(response => {
                    //  console.log("Response authenticate::> ", JSON.stringify(response));
                    if (response.json().codMsgResponse === "MS0001") {
                        //  console.log("Autenticado");
                        GerenciadorSessao.usuario.listPerfil = response.json().oAuthSecurity.perfil;
                        resolve(options);
                    } else if (response.json().codMsgResponse === "MR0142") {
                        console.log("Não autenticado Autenticado");
                        resolve(this.refreshToken());
                    }
                }, err => {
                    console.log(err);
                    reject(err);
                });
        });
    }

    private montaRequisicao(url: string, dados: string, options: RequestOptions, timeout?: number, host?: string): Promise<HTTPResponse> {
        // console.log("montaRequisicao...", url, dados, options, timeout, host);
        return new Promise<HTTPResponse>((resolve, reject) => {
            const resposta = new HTTPResponse();
            //  console.log("montaRequisicao");
            const timeoutConexao = timeout ? timeout : TipoTimeout.DEFAULT.value;
            const hostFinal = !host ? ConfiguracaoService.rest : host;
            this.http.post(hostFinal + url, dados, options)
            .timeout(timeoutConexao)
            .toPromise()
            .then(response => {
                //  console.log("Executado");
                resposta.status = response.status;
                resposta.dados = response.json();
                resposta.headers = response.headers;
                //  console.log(resposta.dados)
                resolve(resposta);
            });
        });
    }
    private montaRequisicaoJenkins(
        url: string,
        dados: string,
        options: RequestOptions,
        timeout?: number,
        host?: string
    ): Promise<HTTPResponse> {
        return new Promise<HTTPResponse>((resolve, reject) => {
            const resposta = new HTTPResponse();
            //  console.log("montaRequisicao");
            const timeoutConexao = timeout ? timeout : TipoTimeout.DEFAULT.value;
            this.http.post(url, dados, options)
            .timeout(timeoutConexao)
            .toPromise()
            .then(response => {
                //  console.log("Executado");
                resposta.status = response.status;
                resposta.dados = response.json();
                resposta.headers = response.headers;
                //  console.log(resposta.dados)
                resolve(resposta);
            });
        });
    }

    private montaRequisicaoDownload(url: string, dados: string, options: RequestOptions, timeout?: number, host?: string, file?: string): Promise<HTTPResponse> {
        let ext = '';
        let fileName = '';
        if (file) {
            const files = file.split(".");
            ext = files[files.length - 1];
            fileName = files[0];
        }
        console.log('FILES', fileName, ext);
        return new Promise<HTTPResponse>((resolve, reject) => {
            const resposta = new HTTPResponse();
            const timeoutConexao = timeout ? timeout : TipoTimeout.DEFAULT.value;
            const hostFinal = host ? host + "rest/" : ConfiguracaoService.rest;
            options.responseType = ResponseContentType.Blob;
            this.http.post(hostFinal + url, dados, options).timeout(timeoutConexao).toPromise()
            .then(response => {
                const type = this.getTypeDownload(ext);
                console.log('getTypeDownload', ext, type);
                const blob = new Blob([response.blob()], { type: type + "/" + ext });
                const fileURL = URL.createObjectURL(blob);
                if (!this.isImage(ext) && ext.toLowerCase() !== "pdf") {
                    console.log("ext.toLowerCase():: " + ext.toLowerCase());
                    console.log("fileURL:: " + fileURL);
                    if (ext.toLowerCase() === "csv") {
                        saveAs(blob, 'documento.csv');
                    } else {
                        saveAs(blob, 'relatorio.' + ext.toLowerCase());
                    }
                } else {
                    window.open(fileURL);
                }
                resolve(resposta);
            }).catch(err => {
                console.log(err);
                reject(err);
            });
        });
    }

    getTypeDownload(ext): string {
        if (this.isImage(ext)) {
            return "image";
        } else if (this.isSheet(ext)) {
            return "application/vnd.ms-excel";
        } else {
            return "application";
        }
    }

    isImage(ext): boolean {
        const imgFileTypes = ["png", "jpg", "jpeg", "gif"];
        return imgFileTypes.indexOf(ext) > -1;
    }

    isSheet(ext): boolean {
        const sheetFileTypes = ["xls", "xlsx"];
        return sheetFileTypes.indexOf(ext) > -1;
    }

    private getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    private executaRequisicao(url: string, dados: string, exigeAutenticacao: boolean, timeout?: number, host?: string, download?: boolean, extensao?: string): Promise<HTTPResponse> {
        // console.log("executaRequisicao...", url, dados, exigeAutenticacao, timeout, host, download, extensao);
        return new Promise<HTTPResponse>((resolve, reject) => {
            if (exigeAutenticacao) {
                this.getHeadersComAutenticacao()
                .then(options => {
                    return this.checkAuthentication(options);
                }).then(options => {
                    if (download) {
                        resolve(this.montaRequisicaoDownload(url, dados, options, timeout, host, extensao));
                    } else {
                        resolve(this.montaRequisicao(url, dados, options, timeout, host));
                    }
                });
            } else {
                this.getHeaders().then(options => {
                    if (download) {
                        resolve(this.montaRequisicaoDownload(url, dados, options, timeout, host, extensao));
                    } else {
                        resolve(this.montaRequisicao(url, dados, options, timeout, host));
                    }
                });
            }
        });
    }

    executaRequisicaoJenkins(versao, url: string, dados: string, exigeAutenticacao: boolean, timeout?: number, host?: string, download?: boolean, extensao?: string): Promise<HTTPResponse> {
        return new Promise<HTTPResponse>((resolve, reject) => {
            if (exigeAutenticacao) {
                this.getHeadersJenkinsComAutenticacao(versao)
                .then(options => {
                    resolve(this.montaRequisicaoJenkins(url, dados, options, timeout, host));
                });
            }
        });
    }

    post(url: string, dados: string, exigeAutenticacao: boolean, timeout?: number, host?: string, download?: boolean, extensao?: string): Promise<HTTPResponse> {
        // console.log("post...", url, dados, exigeAutenticacao, timeout, host, download, extensao);
        return new Promise<HTTPResponse>((resolvePost, rejectPost) => {
            this.checkConnection(host)
            .then(() => {
                resolvePost(this.executaRequisicao(url, dados, exigeAutenticacao, timeout, host, download, extensao));
            }).catch(err => {
                rejectPost(err);
            });
        });
    }

    private salvarAutenticacao(autenticacao: Autenticacao): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.autenticacaoPersistenciaProvider.removerTodos().then(() => {
                //  console.log("salvarAutenticacao: ", JSON.stringify(autenticacao));
                this.autenticacaoPersistenciaProvider.inserir(autenticacao).then(() => {
                    resolve(true);
                });
            });
        });
    }
}
