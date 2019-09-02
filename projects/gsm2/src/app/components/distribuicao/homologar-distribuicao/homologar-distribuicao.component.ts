import { DistribuicaoOcorrenciaGsm } from '../../../objects/entidades/DistribuicaoOcorrenciaGsm';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LoadingController } from 'ionic-angular';
import * as $ from 'jquery';
import { SmAlertController } from '../../sm-alert-controller/sm-alert-controller.component';
import { AppGsmModule } from '../../../app.gsm.module';
import { OcorrenciaGsm } from '../../../objects/entidades/OcorrenciaGsm';
import { Usuario } from '../../../objects/entidades/Usuario';
import { Util } from '../../../services/util/Util';
import { OcorrenciaGsmService } from '../../../services/OcorrenciaGsmService';
@Component({
    selector: 'homologar-distribuicao',
    templateUrl: './homologar-distribuicao.component.html',
    styleUrls: ['./homologar-distribuicao.component.scss']
})
export class HomologarDistribuicaoComponent implements OnInit {

    @Input() ocorrenciaGsm: OcorrenciaGsm;
    distribuicao: DistribuicaoOcorrenciaGsm;
    usuarioLogado: Usuario = new Usuario();

    @Output() carregarGridChange: EventEmitter<string> = new EventEmitter<string>();

    constructor(
        private util: Util,
        private ocorrenciaGsmService: OcorrenciaGsmService,
        private loadingCtrl: LoadingController,
        private smAlertController: SmAlertController
    ) {
    }

    ngOnInit() {
        this.ocorrenciaGsm.inOcorrenciaInterna = true;
        if (this.ocorrenciaGsm.distribuicoes && this.ocorrenciaGsm.distribuicoes.length) {
            this.distribuicao = this.ocorrenciaGsm.distribuicoes[0];
        }
    }


    reprovarDistribuicao(distribuicao) {
        const load = this.loadingCtrl.create({
            content: 'Reprovando a homologação...'
        });
        load.present().then(() => {
            this.ocorrenciaGsmService.reprovarDistribuicao(distribuicao)
                .then(resposta => {
                    load.dismiss();
                    this.ocorrenciaGsm = resposta.ocorrencia;
                    $('#modalEditarDistribuicao').hide();
                    this.carregarGrid();
                }).catch((err) => {
                    AppGsmModule.injector.get(SmAlertController).error("", "Não foi possível concluir a operação.");
                    load.dismiss();
                });
        }).catch(erro => {
            load.dismiss();
        });
    }


    aprovarDistribuicao(idOcorrenciaDistribuicao: number) {
        const load = this.loadingCtrl.create({
            content: 'Aprovando a homologação...'
        });
        load.present().then(() => {
            this.ocorrenciaGsmService.finalizarDistribuicao(idOcorrenciaDistribuicao)
                .then(resposta => {
                    load.dismiss();
                    this.ocorrenciaGsm = resposta.ocorrencia;
                    this.carregarGrid();
                    this.smAlertController.sucesso("", resposta.msgResponse);
                }).catch((err) => {
                    load.dismiss();
                    this.smAlertController.error("", "Não foi possível concluir a operação.");
                });
        }).catch(erro => {
            load.dismiss();
        });
    }

    getDataFormatada(data) {
        return this.util.formatarDataUS(data, 'dd/MM/yyyy');
    }

    carregarGrid() {
        this.carregarGridChange.emit('teste');
    }
}
