import { Injectable } from "@angular/core";
import { Usuario } from '../objects/entidades/Usuario';
import { PerfilProvider } from '../providers/PerfilProvider';
import { Perfil } from "../objects/entidades/Perfil";

@Injectable()
export class PerfilService {

    constructor(private online: PerfilProvider) { }

    obterPerfis(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.online.obterPerfis()
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

}
