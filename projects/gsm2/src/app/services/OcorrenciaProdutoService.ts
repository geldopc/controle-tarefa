import { Injectable } from "@angular/core";
import { OcorrenciaGsm } from '../objects/entidades/OcorrenciaGsm';
import { OcorrenciaProdutoProvider } from "../providers/OcorrenciaProdutoProvider";
import { Usuario } from './../objects/entidades/Usuario';
import { Util } from './util/Util';

@Injectable()
export class OcorrenciaProdutoService {

    constructor(private online: OcorrenciaProdutoProvider, private util: Util) { }

    // obterOcorrenciasProduto(cpfCnpj: string): Promise<OcorrenciaProduto[]> {
    //     return new Promise<OcorrenciaProduto[]>((resolve, reject) => {
    //         this.online.obterOcorrenciasProdutos(cpfCnpj)
    //         .then(resposta => {
    //             if (resposta.dados.codMsgResponse.startsWith("MR")) {
    //                 reject();
    //             } else {
    //                 const tipos: OcorrenciaProduto[] = [];
    //                 if (resposta.dados) {
    //                     resolve(resposta.dados.listProdutoServico);
    //                 }
    //             }
    //         }).catch(err => {
    //             reject();
    //         });
    //     });
    // }

    obterProdutos(parametro): Promise<any[]> {
        return new Promise<any[]>((resolve, reject) => {
            this.online.obterProdutos(parametro)
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

    obterClientes(parametro): Promise<any[]> {
        return new Promise<any[]>((resolve, reject) => {
            this.online.obterClientes(parametro)
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

    obterUsuarios(): Promise<Usuario[]> {
        return new Promise<Usuario[]>((resolve, reject) => {
            this.online.obterUsuarios()
            .then(resposta => {
                if (resposta.dados.codMsgResponse.startsWith("MR")) {
                    reject();
                } else {
                    // const tipos: OcorrenciaProduto[] = [];
                    if (resposta.dados) {
                        resolve(resposta.dados.usuarios);
                    }
                }
            }).catch(err => {
                reject();
            });
        });
    }

    obterOcorrenciasGsmPorUsuario(parametro): Promise<OcorrenciaGsm[]> {
        return new Promise<OcorrenciaGsm[]>((resolve, reject) => {
            this.online.obterOcorrenciasGsmPorUsuario(parametro)
            .then(resposta => {
                if (resposta.dados.codMsgResponse.startsWith("MR")) {
                    reject();
                } else {
                    // const tipos: OcorrenciaProduto[] = [];
                    if (resposta.dados) {
                        resolve(resposta.dados.ocorrencias);
                    }
                }
            }).catch(err => {
                reject();
            });
        });
    }

    obterOcorrenciasGsmPorFiltrosPainelOcorrencia(convertFiltroPainelWS): Promise<OcorrenciaGsm[]> {
        return new Promise<OcorrenciaGsm[]>((resolve, reject) => {
            this.online.obterOcorrenciasGsmPorFiltrosPainelOcorrencia(convertFiltroPainelWS)
            .then(resposta => {
                if (resposta.dados.codMsgResponse.startsWith("MR")) {
                    reject();
                } else {
                    // const tipos: OcorrenciaProduto[] = [];
                    if (resposta.dados) {
                        resolve(resposta.dados.ocorrencias);
                    }
                }
            }).catch(err => {
                reject();
            });
        });
    }

    obterDistribuicoesPorVariasOcorrencias(convertFiltroPainelWS): Promise<OcorrenciaGsm[]> {
        return new Promise<OcorrenciaGsm[]>((resolve, reject) => {
            this.online.obterDistribuicoesPorVariasOcorrencias(convertFiltroPainelWS)
            .then(resposta => {
                if (resposta.dados.codMsgResponse.startsWith("MR")) {
                    reject();
                } else {
                    // const tipos: OcorrenciaProduto[] = [];
                    if (resposta.dados) {
                        resolve(resposta.dados.ocorrencia.distribuicoes);
                    }
                }
            }).catch(err => {
                reject();
            });
        });
    }

    // aprovacoesMerge(): Promise<OcorrenciaGsm[]> {
    //     return new Promise<OcorrenciaGsm[]>((resolve, reject) => {
    //         this.online.aprovacoesMerge()
    //         .then(resposta => {
    //             if (resposta.dados.codMsgResponse.startsWith("MR")) {
    //                 reject();
    //             } else {
    //                 // const tipos: OcorrenciaProduto[] = [];
    //                 if (resposta.dados) {
    //                     resolve(resposta.dados.ocorrencias);
    //                 }
    //             }
    //         }).catch(err => {
    //             reject();
    //         });
    //     });
    // }

    gerarCsvWS(convertFiltroPainelWS): Promise<OcorrenciaGsm[]> {
        return new Promise<OcorrenciaGsm[]>((resolve, reject) => {
            this.online.gerarCsvWS(convertFiltroPainelWS)
            .then(resposta => {
                if (!resposta) {
                    reject();
                } else {
                    console.log("resposta gerarCsvWS: " + JSON.stringify(resposta));
                    resolve(resposta.dados);
                }
            }).catch(err => {
                reject(err);
            });
        });
    }

    gerarCsvClienteSiapec1WS(convertFiltroPainelWS): Promise<OcorrenciaGsm[]> {
        return new Promise<OcorrenciaGsm[]>((resolve, reject) => {
            this.online.gerarCsvClienteSiapec1WS(convertFiltroPainelWS)
            .then(resposta => {
                if (!resposta) {
                    reject();
                } else {
                    resolve(resposta.dados);
                }
            }).catch(err => {
                reject(err);
            });
        });
    }
    gerarCsvClienteWS(convertFiltroPainelWS): Promise<OcorrenciaGsm[]> {
        return new Promise<OcorrenciaGsm[]>((resolve, reject) => {
            this.online.gerarCsvClienteWS(convertFiltroPainelWS)
            .then(resposta => {
                if (!resposta) {
                    reject();
                } else {
                    resolve(resposta.dados);
                }
            }).catch(err => {
                reject(err);
            });
        });
    }

    obterClientesPorResponsavel(doc): Promise<any[]> {
        return new Promise<any[]>((resolve, reject) => {
            this.online.obterClientesPorResponsavel(doc)
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

    obterClientesPorFuncionarioSituacao(doc): Promise<any[]> {
        return new Promise<any[]>((resolve, reject) => {
            this.online.obterClientesPorFuncionarioSituacao(doc)
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

    obterProdutosTecnico(): Promise<any[]> {
        return new Promise<any[]>((resolve, reject) => {
            this.online.obterProdutosTecnico()
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
                reject(err);
            });
        });
    }

    obterProdutosSituacao(): Promise<any[]> {
        return new Promise<any[]>((resolve, reject) => {
            this.online.obterProdutosSituacao()
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
                reject(err);
            });
        });
    }
}
