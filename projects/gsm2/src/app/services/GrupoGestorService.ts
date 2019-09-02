import { Injectable } from "@angular/core";
import { GrupoGestor } from '../objects/entidades/GrupoGestor';
import { GrupoGestorProvider } from '../providers/GrupoGestorProvider';
import { Util } from './util/Util';

@Injectable()
export class GrupoGestorService {

    constructor(private online: GrupoGestorProvider, private util: Util) { }

    gravar(grupoGestor): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.online.gravar(grupoGestor)
            .then(resposta => {
                if (resposta.dados.codMsgResponse.startsWith("MR")) {
                    reject(resposta.dados);
                } else {
                    if (resposta.dados) {
                        resolve(resposta.dados);
                    }
                }
            }).catch(err => {
                reject();
            });
        });
    }

    editar(grupoGestor): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.online.editar(grupoGestor)
            .then(resposta => {
                if (resposta.dados.codMsgResponse.startsWith("MR")) {
                    reject(resposta.dados);
                } else {
                    if (resposta.dados) {
                        resolve(resposta.dados);
                    }
                }
            }).catch(err => {
                reject();
            });
        });
    }

    obterTodos(): Promise<GrupoGestor[]> {
        return new Promise<GrupoGestor[]>((resolve, reject) => {
            this.online.obterTodos()
            .then(resposta => {
                if (resposta.dados.codMsgResponse.startsWith("MR")) {
                    reject(resposta.dados);
                } else {
                    if (resposta.dados) {
                        resolve(resposta.dados.listGrupoGestor);
                    }
                }
            }).catch(err => {
                reject(err);
            });
        });
    }

    obterTodosPorCliente(doc): Promise<GrupoGestor[]> {
        return new Promise<GrupoGestor[]>((resolve, reject) => {
            this.online.obterTodosPorCliente(doc)
            .then(resposta => {
                if (resposta.dados.codMsgResponse.startsWith("MR")) {
                    reject(resposta.dados);
                } else {
                    if (resposta.dados) {
                        resolve(resposta.dados.listGrupoGestor);
                    }
                }
            }).catch(err => {
                reject(err);
            });
        });
    }

    gravarFocalPoint(focalPoint): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.online.gravarFocalPoint(focalPoint)
            .then(resposta => {
                if (resposta.dados.codMsgResponse.startsWith("MR")) {
                    reject(resposta.dados);
                } else {
                    if (resposta.dados) {
                        resolve(resposta.dados);
                    }
                }
            }).catch(err => {
                reject();
            });
        });
    }

    gravarKeyUser(keyUser): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.online.gravarKeyUser(keyUser)
            .then(resposta => {
                if (resposta.dados.codMsgResponse.startsWith("MR")) {
                    reject(resposta.dados);
                } else {
                    if (resposta.dados) {
                        resolve(resposta.dados);
                    }
                }
            }).catch(err => {
                reject();
            });
        });
    }

    editarFocalPoint(focalPoint): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.online.editarFocalPoint(focalPoint)
            .then(resposta => {
                if (resposta.dados.codMsgResponse.startsWith("MR")) {
                    reject(resposta.dados);
                } else {
                    if (resposta.dados) {
                        resolve(resposta.dados);
                    }
                }
            }).catch(err => {
                reject();
            });
        });
    }

    excluirFocalPoint(focalPoint): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.online.excluirFocalPoint(focalPoint)
            .then(resposta => {
                if (resposta.dados.codMsgResponse.startsWith("MR")) {
                    reject(resposta.dados);
                } else {
                    if (resposta.dados) {
                        resolve(resposta.dados);
                    }
                }
            }).catch(err => {
                reject();
            });
        });
    }

    excluirKeyUser(keyUser): Promise<any> {
        // console.log("GrupoGestorService/delKeyUser...", keyUser);
        return new Promise<any>((resolve, reject) => {
            this.online.excluirKeyUser(keyUser)
            .then(resposta => {
                // console.log("GrupoGestorService/delKeyUser/resposta...", resposta);
                if (resposta.dados.codMsgResponse.startsWith("MR")) {
                    reject(resposta.dados);
                } else {
                    if (resposta.dados) {
                        resolve(resposta.dados);
                    }
                }
            }).catch(err => {
                reject();
            });
        });
    }

    obter(idCliente): Promise<GrupoGestor> {
            // console.log("obter...", idCliente);
            return new Promise<GrupoGestor>((resolve, reject) => {
            this.online.obter(idCliente)
            .then(resposta => {
                if (resposta.dados.codMsgResponse.startsWith("MR")) {
                    reject(resposta.dados);
                } else {
                    if (resposta.dados) {
                        resolve(resposta.dados.grupoGestor);
                    }
                }
            }).catch(err => {
                reject(err);
            });
        });
    }
}
