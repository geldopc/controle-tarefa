import { HistoricoAtualizacaoBuilds } from './../objects/entidades/Historico';
import { GerenciadorSessao } from './util/GerenciadorSessao';
import { Ocorrencia } from "./../objects/entidades/Ocorrencia";
import { Injectable } from "@angular/core";
import { OcorrenciaProvider } from "../providers/OcorrenciaProvider";
import { Util } from "./util/Util";
import { Historico } from '../objects/entidades/Historico';
import { OcorrenciaGsmAnexo, OcorrenciaGsm } from '../objects/entidades/OcorrenciaGsm';
import { OcorrenciaCommit } from '../objects/entidades/OcorrenciaCommit';

@Injectable()
export class OcorrenciaService {

    constructor(private online: OcorrenciaProvider, private util: Util) { }

    // Consulta status do Pre-Cadastro
    manterOcorrencia(ocorrencia: Ocorrencia) {
        ocorrencia.usuarioAbertura = GerenciadorSessao.usuario.nrDocumento;
        ocorrencia.cdCliente = GerenciadorSessao.usuario.cdCliente;
        ocorrencia.dtAbertura = this.util.formatarDataUS(new Date().toDateString(), 'yyyy-MM-dd');
        console.log('manterOcorrencia...', ocorrencia);
        return new Promise<any>((resolve, reject) => {
            this.online.manterOcorrencia(ocorrencia)
            .then(resposta => {
                if (resposta.dados.codMsgResponse.startsWith("MR")) {
                    reject(resposta.dados);
                } else {
                    resolve(resposta.dados);
                }
            }).catch(err => {
                reject();
            });
        });
    }

    obterOcorrencias(cpfCnpj: string) {
        return new Promise<Ocorrencia[]>((resolve, reject) => {
            this.online.obterOcorrencias(cpfCnpj)
            .then(resposta => {
                if (resposta.dados.codMsgResponse.startsWith("MR")) {
                    reject();
                } else {
                    resolve(resposta.dados.ocorrencias);
                }
            }).catch(err => {
                reject();
            });
        });
    }

    obterOcorrenciasAbertas(cpfCnpj: string) {
        return new Promise<Ocorrencia[]>((resolve, reject) => {
            this.online.obterOcorrenciasAbertas(cpfCnpj)
            .then(resposta => {
                if (resposta.dados.codMsgResponse.startsWith("MR")) {
                    reject();
                } else {
                    resolve(resposta.dados.ocorrencias);
                }
            }).catch(err => {
                reject();
            });
        });
    }

    convertOcorrencia(resposta, ocorrencias): Promise<Ocorrencia> {
        return new Promise<Ocorrencia>(resolve => {
            resposta.dados.ocorrencia.forEach(ocorrencia => {
                ocorrencia.idOcorrencia = ocorrencia.idOcorrencia;
                ocorrencia.usuarioAbertura = ocorrencia.usuarioAbertura;
                ocorrencia.dsProblema = ocorrencia.dsProblema;
                ocorrencia.cdTipoAtendimento = ocorrencia.cdTipoAtendimento;
                ocorrencia.dtAbertura = ocorrencia.dtAbertura;
                ocorrencia.cdNivelSeveridade = ocorrencia.cdNivelSeveridade;
                ocorrencia.cdProdutoServico = ocorrencia.cdProdutoServico;
                ocorrencia.cdCliente = ocorrencia.cdCliente;
                ocorrencia.inStatus = ocorrencia.inStatus;
                ocorrencia.dtLimiteAtendimento = ocorrencia.dtLimiteAtendimento;
                ocorrencia.listAnexo = ocorrencia.listAnexo;
                ocorrencia.listHistorico = ocorrencia.listHistorico;
                ocorrencia.jsonItens = JSON.stringify(ocorrencia.itens);
                ocorrencias.push(ocorrencia);
            });
        });
    }

    obterPorStatus(obj) {
        return new Promise<Ocorrencia[]>((resolve, reject) => {
            this.online.obterPorStatus(obj)
            .then(resposta => {
                if (resposta.dados.codMsgResponse.startsWith("MR")) {
                    reject();
                } else {
                    resolve(resposta.dados.ocorrencias);
                }
            }).catch(err => {
                reject();
            });
        });
    }

    excluirAnexo(idOcorrencia, idOcorrenciaAnexo) {
        return new Promise<any>((resolve, reject) => {
            this.online.excluirAnexo(idOcorrencia, idOcorrenciaAnexo)
            .then(resposta => {
                if (resposta.dados.codMsgResponse.startsWith("MR")) {
                    reject();
                } else {
                    resolve(resposta.dados);
                }
            }).catch(err => {
                reject();
            });
        });
    }

    obterAnexoOcorrencia(idOcorrencia: number): Promise<OcorrenciaGsmAnexo[]> {
        return new Promise<OcorrenciaGsmAnexo[]>((resolve, reject) => {
            this.online.obterAnexoOcorrencia(idOcorrencia)
            .then(resposta => {
                if (resposta.dados.codMsgResponse.startsWith("MR")) {
                    reject();
                } else {
                    resolve(resposta.dados.anexos);
                }
            }).catch(err => {
                reject();
            });
        });
    }

    adicionarAnexo(idOcorrencia: number, idOcorrenciaAnexo: number, upAnexo: string, dsAnexo: string, dsExtensao: string) {
        return new Promise<any>((resolve, reject) => {
            this.online.adicionarAnexo(idOcorrencia, idOcorrenciaAnexo, upAnexo, dsAnexo, dsExtensao)
            .then(resposta => {
                console.log("resposta adicionarAnexo: " + JSON.stringify(resposta));
                if (resposta.dados.codMsgResponse.startsWith("MR")) {
                    reject();
                } else {
                    resolve(resposta.dados);
                }
            }).catch(err => {
                reject("Erro");
            });
        });
    }

    downloadAnexo(idOcorrencia, idOcorrenciaAnexo, file) {
        return new Promise<any>((resolve, reject) => {
            this.online.downloadAnexo(idOcorrencia, idOcorrenciaAnexo, file)
            .then(resposta => {
                console.log("resposta downloadAnexo: " + JSON.stringify(resposta));
                // console.info('RESPOSTA');
                // console.info(resposta);
                resolve(resposta.dados);
            }).catch(erro => {
                reject();
                console.log("erro: " + JSON.stringify(erro));
                // console.info("ERRO");
                // console.info(erro);
            });
        });
    }

    downloadAnexoNovo(idOcorrencia, file) {
        return new Promise<any>((resolve, reject) => {
            this.online.downloadAnexoNovo(idOcorrencia, file)
            .then(resposta => {
                console.log("resposta downloadAnexo: " + JSON.stringify(resposta));
                // console.info('RESPOSTA');
                // console.info(resposta);
                resolve(resposta.dados);
            }).catch(erro => {
                reject();
                console.log("erro: " + JSON.stringify(erro));
                // console.info("ERRO");
                // console.info(erro);
            });
        });
    }

    excluirHistorico(idOcorrencia: number, idOcorrenciaHistorico: number, dsAtendimento: string) {
        return new Promise<any>((resolve, reject) => {
            this.online.excluirHistorico(idOcorrencia, idOcorrenciaHistorico, dsAtendimento)
            .then(resposta => {
                if (resposta.dados.codMsgResponse.startsWith("MR")) {
                    reject();
                } else {
                    resolve(resposta.dados);
                }
            }).catch(err => {
                reject();
            });
        });
    }

    adicionarHistorico(idOcorrencia: number, idOcorrenciaHistorico: number, dsAtendimento: string, cdUsuarioAtendimento: string) {
        return new Promise<any>((resolve, reject) => {
            this.online.adicionarHistorico(idOcorrencia, idOcorrenciaHistorico, dsAtendimento, cdUsuarioAtendimento)
            .then(resposta => {
                console.log("resposta adicionarHistorico: " + JSON.stringify(resposta));
                if (resposta.dados.codMsgResponse.startsWith("MR")) {
                    reject();
                } else {
                    resolve(resposta.dados);
                }
            }).catch(err => {
                reject();
            });
        });
    }

    obterHistoricoOcorrencia(idOcorrencia: number): Promise<Historico[]> {
        return new Promise<Historico[]>((resolve, reject) => {
            this.online.obterHistoricoOcorrencia(idOcorrencia)
            .then(resposta => {
                // console.log("resposta obter historico: " + JSON.stringify(resposta));
                if (resposta.dados.codMsgResponse.startsWith("MR")) {
                    reject();
                } else {
                    resolve(resposta.dados.lista);
                }
            }).catch(err => {
                reject();
            });
        });
    }


    manterHistoricoOcorrencia(historico: Historico) {
        return new Promise<any>((resolve, reject) => {
            this.online.manterHistoricoOcorrencia(historico)
            .then(res => {
                // console.log("resposta manter histórico: " + JSON.stringify(resposta));
                if (res.dados.codMsgResponse.startsWith("MR")) {
                    reject();
                } else {
                    resolve(res.dados);
                }
            }).catch(err => {
                reject(err);
            });
        });
    }

    obterStatus(usuario) {
        return new Promise<{ label: string, valor: string }[]>((resolve, reject) => {
            this.online.obterStatus(usuario)
            .then(resposta => {
                if (resposta.dados.codMsgResponse.startsWith("MR")) {
                    reject();
                } else {
                    resolve(resposta.dados.listStatus);
                }
            }).catch(err => {
                reject();
            });
        });
    }

    gerarBranch(idDistribuicao: number): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.online.gerarBranch(idDistribuicao)
            .then(resposta => {
                if (resposta.dados.codMsgResponse.startsWith("MR")) {
                    reject();
                } else {
                    resolve(resposta.dados);
                }
            }).catch(err => {
                reject();
            });
        });
    }

    gerarVersaoHomo(idDistribuicoesTeste: any): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.online.gerarVersaoHomo(idDistribuicoesTeste)
            .then(resposta => {
                if (resposta.dados.codMsgResponse.startsWith("MR")) {
                    reject();
                } else {
                    resolve(resposta.dados);
                }
            }).catch(err => {
                reject();
            });
        });
    }

    finalizarOcorrencia(ocorrencia: Ocorrencia) {
        ocorrencia.usuarioAbertura = GerenciadorSessao.usuario.nrDocumento;
        ocorrencia.cdCliente = GerenciadorSessao.usuario.cdCliente;
        ocorrencia.dtAbertura = this.util.formatarDataUS(new Date().toDateString(), 'yyyy-MM-dd');
        return new Promise<any>((resolve, reject) => {
            this.online.finalizarOcorrencia(ocorrencia)
            .then(resposta => {
                if (resposta.dados.codMsgResponse.startsWith("MR")) {
                    reject(resposta.dados);
                } else {
                    resolve(resposta.dados);
                }
            })
            .catch(err => {
                reject();
            });
        });
    }

    encerrarOcorrencia(ocorrencia: Ocorrencia) {
        ocorrencia.usuarioAbertura = GerenciadorSessao.usuario.nrDocumento;
        ocorrencia.cdCliente = GerenciadorSessao.usuario.cdCliente;
        ocorrencia.dtAbertura = this.util.formatarDataUS(new Date().toDateString(), 'yyyy-MM-dd');
        return new Promise<any>((resolve, reject) => {
            this.online.encerrarOcorrencia(ocorrencia)
            .then(resposta => {
                if (resposta.dados.codMsgResponse.startsWith("MR")) {
                    reject(resposta.dados);
                } else {
                    resolve(resposta.dados);
                }
            }).catch(err => {
                reject();
            });
        });
    }

    reabrirOcorrencia(ocorrencia: Ocorrencia) {
        ocorrencia.usuarioAbertura = GerenciadorSessao.usuario.nrDocumento;
        ocorrencia.cdCliente = GerenciadorSessao.usuario.cdCliente;
        ocorrencia.dtAbertura = this.util.formatarDataUS(new Date().toDateString(), 'yyyy-MM-dd');
        return new Promise<any>((resolve, reject) => {
            console.log('reabrirOcorrencia...Service', ocorrencia);
            this.online.reabrirOcorrencia(ocorrencia)
            .then(resposta => {
                if (resposta.dados.codMsgResponse.startsWith("MR")) {
                    reject(resposta.dados);
                } else {
                    resolve(resposta.dados);
                }
            }).catch(err => {
                reject();
            });
        });
    }

    addAnexos(ocorrencia: Ocorrencia) {
        return new Promise<any>((resolve, reject) => {
            this.online.addAnexos(ocorrencia)
            .then(resposta => {
                // console.log("resposta adicionarAnexo: ", resposta);
                if (resposta.dados.codMsgResponse.startsWith("MR")) {
                    reject();
                } else {
                    resolve(resposta.dados);
                }
            }).catch(err => {
                reject("Erro");
            });
        });
    }

    manterAnexo(anexo: OcorrenciaGsmAnexo) {
        return new Promise<any>((resolve, reject) => {
            this.online.manterAnexo(anexo)
            .then(resposta => {
                if (resposta.dados.codMsgResponse.startsWith("MR")) {
                    reject();
                } else {
                    resolve(resposta.dados);
                }
            }).catch(err => {
                reject();
            });
        });
    }

    obterStatusOcorrencias() {
        return new Promise<any[]>((resolve, reject) => {
            this.online.obterStatusOcorrencias()
            .then(resposta => {
                if (resposta.dados.codMsgResponse.startsWith("MR")) {
                    reject();
                } else {
                    resolve(resposta.dados.lista);
                }
            }).catch(err => {
                reject();
            });
        });
    }

    manterListAnexoHistorico(ocorrencia: OcorrenciaGsm) {
        return new Promise<any>((resolve, reject) => {
            this.online.manterListAnexoHistorico(ocorrencia)
            .then(resposta => {
                // console.log("manterListAnexoHistorico: ", JSON.stringify(resposta));
                if (resposta.dados.codMsgResponse.startsWith("MR")) {
                    reject();
                } else {
                    resolve(resposta.dados);
                }
            }).catch(err => {
                reject();
            });
        });
    }

    obterCommits(idOcorrencia: number) {
        return new Promise<any>((resolve, reject) => {
            this.online.obterCommits(idOcorrencia)
            .then(resposta => {
                if (resposta.dados.codMsgResponse.startsWith("MR")) {
                    reject();
                } else {
                    resolve(resposta.dados.obj);
                }
            }).catch(err => {
                reject();
            });
        });
    }

    gravarCommit(commit: OcorrenciaCommit) {
        return new Promise<any>((resolve, reject) => {
            this.online.gravarCommit(commit)
            .then(resposta => {
                if (resposta.dados.codMsgResponse.startsWith("MR")) {
                    reject();
                } else {
                    resolve(resposta.dados);
                }
            }).catch(err => {
                reject();
            });
        });
    }

    atualizarCommits(commit: OcorrenciaCommit) {
        return new Promise<any>((resolve, reject) => {
            this.online.atualizarCommits(commit)
            .then(resposta => {
                if (resposta.dados.codMsgResponse.startsWith("MR")) {
                    reject();
                } else {
                    resolve(resposta.dados);
                }
            }).catch(err => {
                reject();
            });
        });
    }

    excluirCommit(commit: OcorrenciaCommit) {
        return new Promise<any>((resolve, reject) => {
            this.online.excluirCommit(commit)
            .then(resposta => {
                if (resposta.dados.codMsgResponse.startsWith("MR")) {
                    reject();
                } else {
                    resolve(resposta.dados);
                }
            }).catch(err => {
                reject();
            });
        });
    }

    excluirCommitsOcorrencia(commit: OcorrenciaCommit) {
        return new Promise<any>((resolve, reject) => {
            this.online.excluirCommitsOcorrencia(commit)
            .then(resposta => {
                if (resposta.dados.codMsgResponse.startsWith("MR")) {
                    reject();
                } else {
                    resolve(resposta.dados);
                }
            }).catch(err => {
                reject();
            });
        });
    }

    gravarVariosCommits(ocorrencia: OcorrenciaGsm) {
        return new Promise<any>((resolve, reject) => {
            this.online.gravarVariosCommits(ocorrencia)
            .then(resposta => {
                if (resposta.dados.codMsgResponse.startsWith("MR")) {
                    reject();
                } else {
                    resolve(resposta.dados);
                }
            }).catch(err => {
                reject();
            });
        });
    }
}
