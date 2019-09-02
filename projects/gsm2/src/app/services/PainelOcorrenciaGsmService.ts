import { PainelOcorrenciaRequest, PainelFinalizadasGsm } from './../objects/entidades/OcorrenciaGsm';
import { Injectable } from "@angular/core";
import { PainelOcorrenciaGsmProvider } from "../providers/PainelOcorrenciaGsmProvider";
import { PainelOcorrenciaGsm } from "../objects/entidades/OcorrenciaGsm";

@Injectable()
export class PainelOcorrenciaService {

    constructor(private online: PainelOcorrenciaGsmProvider) { }


    obterOcorrenciasNaoDistribuidasPorCliente(request: PainelOcorrenciaRequest) {
        return new Promise<PainelOcorrenciaGsm[]>((resolve, reject) => {
            this.online.obterOcorrenciasNaoDistribuidasPorCliente(request)
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

    obterOcorrenciasPorStatusSelecionado(request: PainelOcorrenciaRequest) {
        return new Promise<PainelOcorrenciaGsm[]>((resolve, reject) => {
            this.online.obterOcorrenciasPorStatusSelecionado(request)
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

    obterOcorrenciasEmDesenvolvimentoPorCliente(request: PainelOcorrenciaRequest) {
        return new Promise<PainelOcorrenciaGsm[]>((resolve, reject) => {
            this.online.obterOcorrenciasEmDesenvolvimentoPorCliente(request)
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

    obterOcorrenciasAguardandoAtualizacao(request: PainelOcorrenciaRequest) {
        return new Promise<PainelOcorrenciaGsm[]>((resolve, reject) => {
            this.online.obterOcorrenciasAguardandoAtualizacao(request)
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

    obterEmDesenvolvimentoPorNivelPrioridade(request: PainelOcorrenciaRequest) {
        return new Promise<PainelOcorrenciaGsm[]>((resolve, reject) => {
            this.online.obterEmDesenvolvimentoPorNivelPrioridade(request)
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

    obterOcorrenciasEmDesenvolvimentoPorTipoSolicitacao(request: PainelOcorrenciaRequest) {
        return new Promise<PainelOcorrenciaGsm[]>((resolve, reject) => {
            this.online.obterOcorrenciasEmDesenvolvimentoPorTipoSolicitacao(request)
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

    obterOcorrenciasEmDesenvolvimentoPorNivelComplexidade(request: PainelOcorrenciaRequest) {
        return new Promise<PainelOcorrenciaGsm[]>((resolve, reject) => {
            this.online.obterOcorrenciasEmDesenvolvimentoPorNivelComplexidade(request)
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

      obterTarefasEmDesenvolvimentoFuncionalidade(request: PainelOcorrenciaRequest) {
        return new Promise<PainelOcorrenciaGsm[]>((resolve, reject) => {
            this.online.obterTarefasEmDesenvolvimentoFuncionalidade(request)
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

    obterTarefasEmDesenvolvimentoPorTecnico(request: PainelOcorrenciaRequest) {
        return new Promise<PainelOcorrenciaGsm[]>((resolve, reject) => {
            this.online.obterTarefasEmDesenvolvimentoPorTecnico(request)
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
    obterTarefasFinalizadasPorTecnico(request: PainelOcorrenciaRequest) {
        return new Promise<PainelOcorrenciaGsm[]>((resolve, reject) => {
            this.online.obterTarefasFinalizadasPorTecnico(request)
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

    obterTarefasEmDesenvolvimentoModalidade(request: PainelOcorrenciaRequest) {
        return new Promise<PainelOcorrenciaGsm[]>((resolve, reject) => {
            this.online.obterTarefasEmDesenvolvimentoModalidade(request)
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

    obterTarefasFinalizadosPorData(request: PainelOcorrenciaRequest) {
        return new Promise<PainelFinalizadasGsm[]>((resolve, reject) => {
            this.online.obterTarefasFinalizadosPorData(request)
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
    obterOcorrenciasFinalizadosUltimosCincoDias(request: PainelOcorrenciaRequest) {
        return new Promise<PainelFinalizadasGsm[]>((resolve, reject) => {
            this.online.obterOcorrenciasFinalizadosUltimosCincoDias(request)
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
}
