import { OcorrenciaGsm } from '../../objects/entidades/OcorrenciaGsm';
import { Component, OnInit } from "@angular/core";
import * as $ from 'jquery';
import { AtualizacaoVersaoService } from '../../services/AtualizacaoVersaoService';
import { AtualizacaoHistorico } from "../../objects/entidades/AtualizacaoHistorico";
import { Util } from "../../services/util/Util";
import { Atualizacao } from '../../objects/entidades/Atualizacao';

@Component({
    selector: "lista-atualizacao-de-versao",
    templateUrl: "./lista-atualizacao-de-versao.component.html",
    styleUrls: ["./lista-atualizacao-de-versao.component.scss"]
})
export class ListaAtualizacaoDeVersaoComponent implements OnInit {

    consultar: AtualizacaoHistorico = new AtualizacaoHistorico();
    ocorrencia: OcorrenciaGsm = new OcorrenciaGsm();
    reqMsgDe: string;
    reqMsgAte: string;
    listBuilds: Atualizacao[] = [];

    constructor(
        private atualizacoesService: AtualizacaoVersaoService,
        private util: Util
    ) {



    }

    ngOnInit() {
        const primeiroDia: string = this.util.primerioDiaMes();
        const ultimoDia: string = this.util.ultimoDiaMes();
        this.consultar.dtDe = primeiroDia;
        this.consultar.dtAte = ultimoDia;

        this.atualizacoesService.obterHistoricoAtualizacao(this.consultar).then((response) => {
            this.listBuilds = response;
        });
    }

    filterHistorico() {
        this.atualizacoesService.obterHistoricoAtualizacao(this.consultar).then((response) => {
            this.listBuilds = response;
        });
    }

    fecharAtualizacoes() {
        $('#listAtualizacoes').hide("fast");
    }

    obterHistoricoBuilds() {

    }
}
