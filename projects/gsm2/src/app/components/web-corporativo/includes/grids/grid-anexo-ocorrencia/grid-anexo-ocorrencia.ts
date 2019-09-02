import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LoadingController } from 'ionic-angular';
import { OcorrenciaGsm, OcorrenciaGsmAnexo } from 'projects/gsm2/src/app/objects/entidades/OcorrenciaGsm';
import { OcorrenciaGsmService } from 'projects/gsm2/src/app/services/OcorrenciaGsmService';
import { SmAlertController } from '../../../../sm-alert-controller/sm-alert-controller.component';
import { OcorrenciaService } from 'projects/gsm2/src/app/services/OcorrenciaService';
import * as $ from "jquery";

@Component({
    selector: 'app-grid-anexo-ocorrencia',
    templateUrl: 'grid-anexo-ocorrencia.html',
    styleUrls: ['./grid-anexo-ocorrencia.scss'],
})
export class GridAnexoOcorrenciaComponent {

    p: number = 1;
    @Input() ocorrencia: OcorrenciaGsm;
    @Output() refresh = new EventEmitter();
    upAnexo: any;
    downAnexo: string;
    dsAnexo: string;
    dsExtensao: string;
    anexo: OcorrenciaGsmAnexo = new OcorrenciaGsmAnexo();

    constructor(
        private ocorrenciaGsmService: OcorrenciaGsmService,
        private ocorrenciaService: OcorrenciaService,
        private loadingCtrl: LoadingController,
        private smAlert: SmAlertController,
    ) { }


    downloadAnexo(idOcorrenciaAnexo, ext) {
        const load = this.loadingCtrl.create({
            content: 'Aguarde...'
        });
        load.present().then(() => {
            this.ocorrenciaGsmService.downloadAnexo(idOcorrenciaAnexo, ext)
                .then(res => {
                    load.dismiss();
                }).catch(err => {
                    load.dismiss();
                    console.error('ERROR', err);
                    this.smAlert.error("", "Não foi possível concluir a operação.");
                });
        });
    }

    lerUrlImagem(event) {
        console.log("ocorrencia: ", this.ocorrencia);
        // console.log("lerUrlImagem: ", event);
        const file = event.target.files[0];
        const fileName = file.name;
        const fileExtensao = fileName.split('.').pop();
        this.dsAnexo = fileName;
        this.dsExtensao = fileExtensao;
        if (event.target.files && event.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event: any) => {
                if (event.target.result) {
                    this.upAnexo = event.target.result.split(",")[1];
                    this.anexo = new OcorrenciaGsmAnexo();
                    this.anexo.cdOcorrencia = this.ocorrencia.idOcorrencia;
                    this.anexo.upAnexo = this.upAnexo;
                    this.anexo.dsNome = fileName;
                    this.anexo.dsExtensao = this.dsExtensao;
                    // console.log("anexo: " + JSON.stringify(this.anexo));
                    if (!this.ocorrencia.anexos || !this.ocorrencia.anexos.length) {
                        this.ocorrencia.anexos = [];
                    }
                    const arq = this.ocorrencia.anexos.find(a => a.dsNome === fileName);
                    // console.log("arq" + JSON.stringify(arq));
                    if (!arq && this.anexo.dsNome && this.anexo.dsExtensao) {
                        this.ocorrencia.anexos.push(this.anexo);
                        this.addAnexos();
                    } else if (arq) {
                        this.smAlert.sucesso("Informação", "Este Aquivo já foi Anexado!");
                    }
                }
            };
            reader.readAsDataURL(event.target.files[0]);
        } else {
            this.smAlert.sucesso("Informação", "Este Aquivo já foi Anexado!");
        }
    }

    addAnexos() {
        this.ocorrenciaService.manterAnexo(this.anexo)
        .then(res => {
            // console.log("resposta adicionar:", resposta);
            this.smAlert.sucesso("Informação", res.msgResponse);
            this.ocorrenciaService.obterAnexoOcorrencia(this.ocorrencia.idOcorrencia)
            .then(res1 => {
                this.ocorrencia.anexos = res1;
            });
        }).catch(err => {
            console.error('ERROR', err);
            this.smAlert.error("Informação", "Não foi possível concluir a operação.");
        });
    }
}
