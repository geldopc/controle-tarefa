import { Injectable } from "@angular/core";
import { Util } from "./util/Util";
import { AtualizacaoVersaoProvider } from "../providers/AtualizacaoVersaoProvider";
import { Atualizacao } from "../objects/entidades/Atualizacao";
import { ControleAtualizacaoRequest } from "../objects/entidades/ControleAtualizacaoRequest";
import { AtualizacaoHistorico } from "../objects/entidades/AtualizacaoHistorico";

@Injectable()
export class AtualizacaoVersaoService {

    constructor(private online: AtualizacaoVersaoProvider, private util: Util) { }

    verificarAtualizacao(atualizacao: Atualizacao) {
        return new Promise<any[]>((resolve, reject) => {
            this.online.verificarAtualizacao(atualizacao)
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

    obterHistoricoAtualizacao(atualizacao: AtualizacaoHistorico) {
        return new Promise<any[]>((resolve, reject) => {
            this.online.obterHistoricoAtualizacao(atualizacao)
            .then(resposta => {
                if (resposta.dados.codMsgResponse.startsWith("MR")) {
                    reject();
                } else {
                    resolve(resposta.dados.atualizacoes);
                }
            }).catch(err => {
                reject();
            });
        });
    }

    atualizarControleAtualizacao(controleAtualizacaoRequest: ControleAtualizacaoRequest) {
        return new Promise<any[]>((resolve, reject) => {
            this.online.atualizarControleAtualizacao(controleAtualizacaoRequest)
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
