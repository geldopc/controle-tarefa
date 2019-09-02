import { Util } from './util/Util';
import { OcorrenciaTipo } from "../objects/entidades/OcorrenciaTipo";
import { Injectable } from "@angular/core";
import { UsuarioProvider } from '../providers/UsuarioProvider';
import { Usuario } from '../objects/entidades/Usuario';

@Injectable()
export class UsuarioService {

    constructor(private online: UsuarioProvider, private util: Util) { }

    obterUsuarioPorNrDocumento(nrDocumento: string): Promise<Usuario> {
        return new Promise<Usuario>((resolve, reject) => {
            this.online.obterUsuarioPorNrDocumento(nrDocumento)
            .then(resposta => {
                if (resposta.dados.codMsgResponse.startsWith("MR")) {
                    reject(resposta.dados);
                } else {
                    if (resposta.dados) {
                        resolve(resposta.dados.usuario);
                    }
                }
            }).catch(err => {
                reject();
            });
        });
    }

    gravarUsuario(usuario): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.online.gravarUsuario(usuario)
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

    obterUsuarios(idCliente): Promise<Usuario[]> {
        return new Promise<Usuario[]>((resolve, reject) => {
            this.online.obterUsuarios(idCliente)
            .then(resposta => {
                if (resposta.dados.codMsgResponse.startsWith("MR")) {
                    reject(resposta.dados);
                } else {
                    if (resposta.dados) {
                        resolve(resposta.dados.usuarios);
                    }
                }
            }).catch(err => {
                reject(err);
            });
        });
    }

}
