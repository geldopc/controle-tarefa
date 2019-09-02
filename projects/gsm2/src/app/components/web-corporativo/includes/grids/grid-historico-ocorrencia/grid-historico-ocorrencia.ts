import { Component, Input, Output, EventEmitter } from '@angular/core';
import { LoadingController } from 'ionic-angular';
import * as $ from 'jquery';
import { Historico } from 'projects/gsm2/src/app/objects/entidades/Historico';
import { OcorrenciaGsm } from 'projects/gsm2/src/app/objects/entidades/OcorrenciaGsm';
import { OcorrenciaService } from 'projects/gsm2/src/app/services/OcorrenciaService';
import { SmAlertController } from '../../../../sm-alert-controller/sm-alert-controller.component';
import { GerenciadorSessao } from 'projects/gsm2/src/app/services/util/GerenciadorSessao';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { Util } from 'projects/gsm2/src/app/services/util/Util';

@Component({
    selector: 'app-grid-historico-ocorrencia',
    templateUrl: 'grid-historico-ocorrencia.html',
    styleUrls: ['./grid-historico-ocorrencia.scss'],
})
export class GridHistoricoOcorrenciaComponent {

    p: number = 1;
    @Input() ocorrencia: OcorrenciaGsm;
    @Output() refresh = new EventEmitter();
    historico: Historico;
    editorConfig: AngularEditorConfig = {
        editable: true,
        spellcheck: true,
        height: '25rem',
        minHeight: '5rem',
        placeholder: 'Descreva aqui o problema...',
        translate: 'no',
        uploadUrl: 'arquivos/images', // if needed
        customClasses: [
            { name: "quote", class: "quote" },
            { name: "redText", class: "redText" },
            { name: "titleText", class: "titleText", tag: "h1" }]
    };

    constructor(
        private ocorrenciaService: OcorrenciaService,
        private loadingCtrl: LoadingController,
        private smAlert: SmAlertController,
    ) { }

    preAddHistorico(): void {
        this.historico = new Historico();
        this.historico.cdOcorrencia = this.ocorrencia.idOcorrencia;
        this.historico.cdUsuario = GerenciadorSessao.usuario.idUsuario;
        if (!this.ocorrencia.historico || !this.ocorrencia.historico.length)  {
            this.ocorrencia.historico = [];
        }
    }

    gravarHistorico() {
        if (this.historico.dsMensagem) {
            const load = this.loadingCtrl.create({
                content: 'Aguarde...'
            });
            load.present().then(() => {
                this.ocorrenciaService.manterHistoricoOcorrencia(this.historico)
                .then(res => {
                    this.ocorrencia.historico.push(this.historico);
                    this.refresh.emit(true);
                    load.dismiss();
                    this.smAlert.sucesso("Informação", res.msgResponse);
                    $("#modalAddHistorico").hide();
                }).catch(err => {
                    load.dismiss();
                    console.error('ERROR', err);
                    this.smAlert.error("", "Não foi possível concluir a operação.");
                });
            });
        }
    }
}
