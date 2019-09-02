import { Injectable } from "@angular/core";
import { FuncionalidadeProvider } from '../providers/FuncionalidadeProvider';
import { Ocorrencia } from "./../objects/entidades/Ocorrencia";
import { Util } from "./util/Util";

@Injectable()
export class FuncionalidadeService {

    constructor(private online: FuncionalidadeProvider, private util: Util) { }

    obterFuncionalidade(idProduto: number) {
        return new Promise<any[]>((resolve, reject) => {
            this.online.obterFuncionalidade(idProduto)
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
