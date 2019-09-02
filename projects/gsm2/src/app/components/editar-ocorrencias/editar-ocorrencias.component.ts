import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { SmAlertController } from 'projects/gsm2/src/app/components/sm-alert-controller/sm-alert-controller.component';
import { OcorrenciaGsmService } from 'projects/gsm2/src/app/services/OcorrenciaGsmService';
import { OcorrenciaGsm } from '../../objects/entidades/OcorrenciaGsm';
import { Tuple } from '../../objects/entidades/Tuple';
import * as $ from 'jquery';
@Component({
    selector: 'editar-ocorrencias',
    templateUrl: './editar-ocorrencias.component.html',
    styleUrls: ['./editar-ocorrencias.component.scss']
})
export class EditarOcorrenciasComponent implements OnInit {

    @Input() ocorrencias: OcorrenciaGsm[];
    @Output() carregarGridChange: EventEmitter<string> = new EventEmitter<string>();

    reqMsgPrioridadeUm: string;
    reqMsgPrioridadeDois: string;
    prioridadeUm = 1;
    prioridadeDois = 1;

    constructor(
        private ocorrenciaGsmService: OcorrenciaGsmService,
        private smAlert: SmAlertController
    ) {
        // console.log('EditarOcorrenciasComponent/constructor', this);
    }

    ngOnInit() {
        // Modal Distribuição
        // console.log('EditarOcorrenciasComponent/ngOnInit', this);
    }

    alterarPrioridade() {
        // console.log('alterarPrioridade', this);
        if (this.isValid()) {
            this.ocorrencias.forEach(item => {
                item.nrPrioridade1 = this.prioridadeUm;
                item.nrPrioridade2 = this.prioridadeDois;
            });
            const list = <any>JSON.parse(JSON.stringify(this.ocorrencias));
            list.forEach(item => {
                delete item['exibe'];
                delete item['cor'];
                delete item['add'];
                delete item['icon'];
                delete item['classPanelColor'];
                delete item['listBuilds'];
            });
            this.ocorrenciaGsmService.alterarPrioridadeOcorrencia(JSON.stringify(list))
                .then(resp => {
                    this.smAlert.sucesso("Informação", resp.msgResponse);
                    $("#modalEditarOcorrencia").hide();
                    this.carregarGrid();
                }).catch(erro => {
                    this.smAlert.error("Informação", "Ocorreu um problema para alterar a prioridade.");
                });
        }
    }

    isValid(): boolean {
        let valida = false;
        if (this.ocorrencias && this.ocorrencias.length > 0 && this.prioridadeUm !== null && this.prioridadeUm !== undefined && this.prioridadeDois !== null && this.prioridadeDois !== undefined) {
            valida = true;
        }
        return valida;
    }

    carregarGrid() {
        // console.log('carregarGrid...EditarOcorrenciasComponent', this);
        this.carregarGridChange.emit();
    }
}
