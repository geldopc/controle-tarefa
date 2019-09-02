import { LoadingController } from 'ionic-angular';
import { OcorrenciaGsmVersao } from './../objects/entidades/OcorrenciaGsmVersao';
import { Injectable } from "@angular/core";
import { OcorrenciaGsm } from "../objects/entidades/OcorrenciaGsm";
import { OcorrenciaGsmProvider } from '../providers/OcorrenciaGsmProvider';
import { Util } from "./util/Util";
import { Usuario } from "../objects/entidades/Usuario";
import { Ocorrencia } from '../objects/entidades/Ocorrencia';
import { DistribuicaoOcorrenciaGsm } from '../objects/entidades/DistribuicaoOcorrenciaGsm';
import { HistoricoAtualizacaoBuilds } from '../objects/entidades/Historico';
import { GerenciadorSessao } from './util/GerenciadorSessao';
import { OcorrenciaProdutoService } from './OcorrenciaProdutoService';
import { FiltrosPesquisa } from '../components/filtros-pesquisa-tecnico/filtros-pesquisa-tecnico.component';
import { Agenda } from '../objects/entidades/Agenda';

@Injectable()
export class OcorrenciaGsmService {

    constructor(
        private online: OcorrenciaGsmProvider,
        private loadingCtrl: LoadingController,
        private ocorrenciaProdutoService: OcorrenciaProdutoService,
        private util: Util
    ) { }

    manterOcorrencia(ocorrencia: OcorrenciaGsm) {
        // console.log('manterOcorrencia...', ocorrencia);
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

    alterarTecnico(idOcorrencia: number[], funcionarioDe: Usuario, funcionarioPara: Usuario) {
        this.util.carregando(true);
        return new Promise<any>((resolve, reject) => {
            this.online.alterarTecnico(idOcorrencia, funcionarioDe, funcionarioPara)
                .then(resposta => {
                    if (resposta.dados.codMsgResponse.startsWith("MR")) {
                        reject();
                        this.util.carregando(false);
                    } else {
                        console.log("resposta.dados::  " + JSON.stringify(resposta.dados));
                        this.util.carregando(false);
                        resolve(resposta.dados);
                    }
                }).catch(err => {
                    this.util.carregando(false);
                    reject(err);
                });
        });
    }

    obterBranchesAtivos(cdTipoTarefa: number) {
        return new Promise<any[]>((resolve, reject) => {
            this.online.obterBranchesAtivos(cdTipoTarefa)
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

    gravarOcorrencia(ocorrencia: OcorrenciaGsm): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.online.gravarOcorrencia(ocorrencia)
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

    gerarVersao(ocorrenciaGsmVersao: OcorrenciaGsmVersao): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.online.gerarVersao(ocorrenciaGsmVersao)
                .then(resposta => {
                    if (resposta.dados.codMsgResponse.startsWith("MR")) {
                        console.log('gerarVersao... MR', JSON.stringify(resposta));
                        reject(resposta.dados);
                    } else {
                        console.log('gerarVersao... !MSSS');
                        resolve(resposta.dados);
                    }
                }).catch(err => {
                    reject();
                });
        });
    }
    callJenkins(ocorrenciaGsmVersao: OcorrenciaGsmVersao, versao: String): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.online.callJenkins(ocorrenciaGsmVersao, versao)
                .then(resposta => {
                    if (resposta.dados.codMsgResponse.startsWith("MR")) {
                        console.log('gerarVersao... MR', JSON.stringify(resposta));
                        reject(resposta.dados);
                    } else {
                        console.log('gerarVersao... !MSSS');
                        resolve(resposta.dados);
                    }
                }).catch(err => {
                    reject();
                });
        });
    }

    distribuir(distribuicao: any): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.online.distribuir(distribuicao)
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

    editarDistribuicao(distribuicao: any): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.online.editarDistribuicao(distribuicao)
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

    removerDistribuicao(distribuicao: number): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.online.removerDistribuicao(distribuicao)
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

    iniciarDistribuicao(idOcorrenciaDistribuicao): Promise<any> {
        return new Promise<any[]>((resolve, reject) => {
            this.online.iniciarDistribuicao(idOcorrenciaDistribuicao)
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

    pararDistribuicao(idOcorrenciaDistribuicao): Promise<any> {
        return new Promise<any[]>((resolve, reject) => {
            this.online.pararDistribuicao(idOcorrenciaDistribuicao)
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

    reprovarDistribuicao(distribuicao): Promise<any> {
        return new Promise<any[]>((resolve, reject) => {
            this.online.reprovarDistribuicao(distribuicao)
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

    reiniciarDistribuicao(idOcorrenciaDistribuicao: number): Promise<any> {
        return new Promise<any[]>((resolve, reject) => {
            this.online.reiniciarDistribuicao(idOcorrenciaDistribuicao)
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

    finalizarDistribuicao(idOcorrenciaDistribuicao: number): Promise<any> {
        return new Promise<any[]>((resolve, reject) => {
            this.online.finalizarDistribuicao(idOcorrenciaDistribuicao)
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

    obterfuncionariosTarefa(cdTipoTarefa: number) {
        return new Promise<Usuario[]>((resolve, reject) => {
            this.online.obterfuncionariosTarefa(cdTipoTarefa)
                .then(resposta => {
                    if (resposta.dados.codMsgResponse.startsWith("MR")) {
                        reject();
                    } else {
                        resolve(resposta.dados.usuarios);
                    }
                }).catch(err => {
                    reject();
                });
        });
    }

    alterarPrioridadeOcorrencia(ocorrencias) {
        return new Promise<any>((resolve, reject) => {
            this.online.alterarPrioridadeOcorrencia(ocorrencias)
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

    alterarStatus(ocorrencia) {
        return new Promise<any>((resolve, reject) => {
            this.online.alterarStatus(ocorrencia)
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

    finalizarOcorrencia(ocorrencia) {
        return new Promise<any>((resolve, reject) => {
            this.online.finalizarOcorrencia(ocorrencia)
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

    editarOcorrencia(ocorrencia: OcorrenciaGsm): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.online.editarOcorrencia(ocorrencia)
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

    obterPorStatus(ocorrencia) {
        return new Promise<Ocorrencia[]>((resolve, reject) => {
            this.online.obterPorStatus(ocorrencia)
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

    obterOcorrenciasStatusFuncaoOrganograma(ocorrencia) {
        return new Promise<OcorrenciaGsm[]>((resolve, reject) => {
            this.online.obterOcorrenciasStatusFuncaoOrganograma(ocorrencia)
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

    obterDistribuicoes(idOcorrencia) {
        return new Promise<DistribuicaoOcorrenciaGsm[]>((resolve, reject) => {
            this.online.obterDistribuicoes(idOcorrencia)
                .then(resposta => {
                    if (resposta.dados.codMsgResponse.startsWith("MR")) {
                        reject();
                    } else {
                        resolve(resposta.dados.ocorrencia.distribuicoes);
                    }
                }).catch(err => {
                    reject();
                });
        });
    }

    obterHistoricoBuilds(idOcorrencia: number): Promise<HistoricoAtualizacaoBuilds[]> {
        return new Promise<HistoricoAtualizacaoBuilds[]>((resolve, reject) => {
            this.online.obterHistoricoBuilds(idOcorrencia)
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

    filtrarOcorrenciaGsm(filtros: FiltrosPesquisa): Promise<any> {
        return new Promise<any>((resolve, reject)=>{
            const load = this.loadingCtrl.create({
                content: "Buscando Ocorrências..."
            });
            load.present()
            .then(() => {
                const obj = {
                    usuarioAbertura: GerenciadorSessao.usuario.nrDocumento,
                    inStatus: filtros.status.valor
                };
                const status = [];
                if (filtros.listStatusSelecionado && filtros.listStatusSelecionado.length > 0) {
                    filtros.listStatusSelecionado.forEach(item => {
                        if (item.select != null) {
                            status.push(item.select);
                        }
                    });
                }
                const clientes = [];
                if (filtros.listClientesSelecionados && filtros.listClientesSelecionados.length > 0) {
                    filtros.listClientesSelecionados.forEach(item => {
                        clientes.push(item.select);
                    });
                    clientes.sort();
                }
                const produtos = [];
                if (filtros.listProdutosSelecionados && filtros.listProdutosSelecionados.length > 0) {
                    filtros.listProdutosSelecionados.forEach(item => {
                        produtos.push(item.select);
                    });
                    produtos.sort();
                }
                const prioriades1 = [];
                if (filtros.prioridades1Selecionados && filtros.prioridades1Selecionados.length > 0) {
                    filtros.prioridades1Selecionados.forEach(item => {
                        prioriades1.push(item.select);
                    });
                    prioriades1.sort();
                }
                const prioriades2 = [];
                if (filtros.prioridades2Selecionados && filtros.prioridades2Selecionados.length > 0) {
                    filtros.prioridades2Selecionados.forEach(item => {
                        prioriades2.push(item.select);
                    });
                    prioriades2.sort();
                }
                const desenvolvedores = [];
                if (filtros.listDesenvolvedoresSelecionado && filtros.listDesenvolvedoresSelecionado.length > 0) {
                    filtros.listDesenvolvedoresSelecionado.forEach(item => {
                        desenvolvedores.push(item.select);
                    });
                    desenvolvedores.sort();
                }
                const modalidades = [];
                if (filtros.listModalidadesSelecionados && filtros.listModalidadesSelecionados.length > 0) {
                    filtros.listModalidadesSelecionados.forEach(item => {
                        modalidades.push(item.select);
                    });
                    modalidades.sort();
                }
                const tipoSolicitacoes = [];
                if (filtros.listTipoSolicitacaoSelecionado && filtros.listTipoSolicitacaoSelecionado.length > 0) {
                    filtros.listTipoSolicitacaoSelecionado.forEach(item => {
                        tipoSolicitacoes.push(item.select);
                    });
                    tipoSolicitacoes.sort();
                }
                const nivelComplexidade = [];
                if (filtros.listNivelComplexidadeSelecionado && filtros.listNivelComplexidadeSelecionado.length > 0) {
                    filtros.listNivelComplexidadeSelecionado.forEach(item => {
                        nivelComplexidade.push(item.select);
                    });
                    nivelComplexidade.sort();
                }
                const funcionalidades = [];
                if (filtros.listFuncionalidadeSelecionada && filtros.listFuncionalidadeSelecionada.length > 0) {
                    filtros.listFuncionalidadeSelecionada.forEach(item => {
                        funcionalidades.push(item.select);
                    });
                    funcionalidades.sort();
                }
                const solicitantes = [];
                if (filtros.solicitanteSelecionado && filtros.solicitanteSelecionado.length > 0) {
                    filtros.solicitanteSelecionado.forEach(item => {
                        solicitantes.push(item.select);
                    });
                    solicitantes.sort();
                }
                const convertFiltroPainelWS = {
                    status: status,
                    dataInicial: filtros.dtInicio,
                    dataFinal: filtros.dtFim,
                    clientes: clientes,
                    produtos: produtos,
                    descricao: null,
                    prioridades1: prioriades1,
                    prioridades2: prioriades2,
                    desenvolvedores: desenvolvedores,
                    modalidades: modalidades,
                    inTipoSolicitacao: tipoSolicitacoes,
                    inNivelComplexidade: nivelComplexidade,
                    homologador: null,
                    idUsuario: GerenciadorSessao.usuario.nrDocumento,
                    funcionalidades: funcionalidades,
                    inAtendimento: filtros.inAtendimento,
                    inOcorrenciaInterna: filtros.inOcorrenciaInterna,
                    solicitantes: solicitantes
                };
                this.ocorrenciaProdutoService.obterOcorrenciasGsmPorFiltrosPainelOcorrencia(convertFiltroPainelWS)
                .then(resp => {
                    // console.log("Consulta...", resp);
                    resolve(resp);
                }).catch(erro => {
                    console.error("obterOcorrenciasGsmPorFiltrosPainelOcorrencia", erro);
                    load.dismiss();
                    reject();
                });
            }).catch(erro => {
                load.dismiss();
                reject();
            });
        });
    }

    editarPrioridadeCliente(prioridade: any): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.online.editarPrioridadeCliente(prioridade)
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

    obterAgendaDistribuicao(doc): Promise<Agenda[]> {
        return new Promise<Agenda[]>((resolve, reject) => {
            this.online.obterAgendaDistribuicao(doc)
            .then(resposta => {
                console.log("obterAgendaDistribuicao...", resposta);
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

    obter(filtros) {
        return new Promise<OcorrenciaGsm[]>((resolve, reject) => {
            this.online.obter(filtros)
            .then(resposta => {
                if (resposta.dados.codMsgResponse.startsWith("MR")) {
                    reject(resposta);
                } else {
                    resolve(resposta.dados.obj);
                }
            }).catch(err => {
                reject(err);
            });
        });
    }

    downloadAnexo(idOcorrenciaAnexo, ext) {
        return new Promise<any>((resolve, reject) => {
            this.online.downloadAnexo(idOcorrenciaAnexo, ext)
            .then(resposta => {
                console.log("resposta downloadAnexo: " + JSON.stringify(resposta));
                // console.info('RESPOSTA');
                // console.info(resposta);
                resolve(resposta.dados);
            }).catch(erro => {
                console.log("erro: " + JSON.stringify(erro));
                reject(erro);
                // console.info("ERRO");
                // console.info(erro);
            });
        });
    }

    obterHistoricoAnexo(idOcorrencia) {
        return new Promise<OcorrenciaGsm>((resolve, reject) => {
            this.online.obterHistoricoAnexo(idOcorrencia)
            .then(res => {
                if (res.dados.codMsgResponse.startsWith("MR")) {
                    reject(res);
                } else {
                    resolve(res.dados.obj);
                }
            }).catch(err => {
                reject(err);
            });
        });
    }
}
