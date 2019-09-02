import { Util } from './util/Util';
import { GerenciadorSessao } from './util/GerenciadorSessao';
import { OcorrenciaTipo } from "./../objects/entidades/OcorrenciaTipo";
import { Injectable } from "@angular/core";
import { OcorrenciaTipoProvider } from "../providers/OcorrenciaTipoProvider";

@Injectable()
export class OcorrenciaTipoService {

    constructor(private online: OcorrenciaTipoProvider, private util: Util) { }

    obterOcorrenciasTipo(produtoOcorrencia: number): Promise<OcorrenciaTipo[]> {
        return new Promise<OcorrenciaTipo[]>((resolve, reject) => {
            this.online.obterTipoOcorrencia(produtoOcorrencia)
            .then(resposta => {
                if (resposta.dados.codMsgResponse.startsWith("MR")) {
                    reject();
                } else {
                    const tipos: OcorrenciaTipo[] = [];
                    if (resposta.dados) {
                        resolve(resposta.dados.listTipoOcorrencia);
                    }
                }
            }).catch(err => {
                reject();
            });
        });
    }

    obterFuncionalidade(produtoOcorrencia): Promise<any[]> {
        return new Promise<any[]>((resolve, reject) => {
            this.online.obterFuncionalidade(produtoOcorrencia)
            .then(resposta => {
                if (resposta.dados.codMsgResponse.startsWith("MR")) {
                    reject();
                } else {
                    // const tipos: OcorrenciaProduto[] = [];
                    if (resposta.dados) {
                        resolve(resposta.dados.lista);
                    }
                }
            }).catch(err => {
                reject();
            });
        });
    }

    // obterAtividade(): Promise<any[]> {
    //     return new Promise<any[]>((resolve, reject) => {
    //         this.online.obterAtividade()
    //         .then(resposta => {
    //             if (resposta.dados.codMsgResponse.startsWith("MR")) {
    //                 reject();
    //             } else {
    //                 // const tipos: OcorrenciaProduto[] = [];
    //                 if (resposta.dados) {
    //                     resolve(resposta.dados.obj);
    //                 }
    //             }
    //         }).catch(err => {
    //             reject();
    //         });
    //     });
    // }


    obterModalidadeDesenvolvimento(produtoOcorrencia): Promise<any[]> {
        return new Promise<any[]>((resolve, reject) => {
            this.online.obterModalidadeDesenvolvimento(produtoOcorrencia)
            .then(resposta => {
                if (resposta.dados.codMsgResponse.startsWith("MR")) {
                    reject();
                } else {
                    // const tipos: OcorrenciaProduto[] = [];
                    if (resposta.dados) {
                        resolve(resposta.dados.lista);
                    }
                }
            }).catch(err => {
                reject();
            });
        });
    }

    obterFuncionalidadesProgramaUsuario(cpfCnpj): Promise<any[]> {
        return new Promise<any[]>((resolve, reject) => {
            this.online.obterFuncionalidadesProgramaUsuario(cpfCnpj)
            .then(resposta => {
                if (resposta.dados.codMsgResponse.startsWith("MR")) {
                    reject();
                } else {
                    // const tipos: OcorrenciaProduto[] = [];
                    if (resposta.dados) {
                        resolve(resposta.dados.lista);
                    }
                }
            })
            .catch(err => {
                reject();
            });
        });
    }
    obterFuncionalidadesClientePorArea(oco): Promise<any[]> {
        return new Promise<any[]>((resolve, reject) => {
            this.online.obterFuncionalidadesClientePorArea(oco)
            .then(resposta => {
                if (resposta.dados.codMsgResponse.startsWith("MR")) {
                    reject();
                } else {
                    // const tipos: OcorrenciaProduto[] = [];
                    if (resposta.dados) {
                        resolve(resposta.dados.lista);
                    }
                }
            })
            .catch(err => {
                reject();
            });
        });
    }

    obterNivelSeveridade(): Promise<any[]> {
        return new Promise<any[]>((resolve, reject) => {
            this.online.obterNivelSeveridade()
            .then(res => {
                if (res.dados.codMsgResponse.startsWith("MR")) {
                    reject();
                } else {
                    if (res.dados) {
                        resolve(res.dados.obj);
                    }
                }
            }).catch(err => {
                reject(err);
            });
        });
    }
}
