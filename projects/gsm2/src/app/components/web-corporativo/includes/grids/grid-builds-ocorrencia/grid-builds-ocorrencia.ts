import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { LoadingController } from 'ionic-angular';
import * as $ from 'jquery';
import { Historico } from 'projects/gsm2/src/app/objects/entidades/Historico';
import { OcorrenciaGsm } from 'projects/gsm2/src/app/objects/entidades/OcorrenciaGsm';
import { OcorrenciaService } from 'projects/gsm2/src/app/services/OcorrenciaService';
import { GerenciadorSessao } from 'projects/gsm2/src/app/services/util/GerenciadorSessao';
import { SmAlertController } from '../../../../sm-alert-controller/sm-alert-controller.component';
import { OcorrenciaGsmService } from 'projects/gsm2/src/app/services/OcorrenciaGsmService';
import { Util } from 'projects/gsm2/src/app/services/util/Util';

@Component({
    selector: 'app-grid-builds-ocorrencia',
    templateUrl: 'grid-builds-ocorrencia.html',
    styleUrls: ['./grid-builds-ocorrencia.scss'],
})
export class GridBuildsOcorrenciaComponent {

    @Input() ocorrencia: OcorrenciaGsm;
    builds: any[];

    constructor(
        private ocorrenciaGsmService: OcorrenciaGsmService,
        private util: Util,
    ) { }

    ngOnChanges(changes: SimpleChanges): void {
        // console.log('ngOnChanges...', this);
        this.obterHistoricoBuilds();
    }

    obterHistoricoBuilds() {
        this.ocorrenciaGsmService.obterHistoricoBuilds(this.ocorrencia.idOcorrencia)
        .then(res => {
            if (res && res.length) {
                this.builds = res;
                this.builds.forEach(item => {
                    if (item.dtInicioAtualizacao) {
                        item.dtInicioAtualizacao = this.util.stringToDate(String(item.dtInicioAtualizacao)).toLocaleDateString();
                    }
                    if (item.dtFimAtualizacao) {
                        item.dtFimAtualizacao = this.util.stringToDate(String(item.dtFimAtualizacao)).toLocaleDateString();
                    }
                });
            }
        }).catch(err => {
            console.error('ERRO', err);
        });
    }
}
