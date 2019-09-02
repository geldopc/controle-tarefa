import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { LoadingController } from 'ionic-angular';
import * as $ from 'jquery';
import { SmAlertController } from 'projects/gsm2/src/app/components/sm-alert-controller/sm-alert-controller.component';
import { OcorrenciaGsmService } from 'projects/gsm2/src/app/services/OcorrenciaGsmService';
import { OcorrenciaGsm } from '../../objects/entidades/OcorrenciaGsm';
import { GerenciadorSessao } from '../../services/util/GerenciadorSessao';
import { Tuple } from '../../objects/entidades/Tuple';
import { OcorrenciaTipoService } from '../../services/OcorrenciaTipoService';

@Component({
    selector: 'app-edit-prioridade-modal',
    templateUrl: './edit-prioridade-modal.component.html',
    styleUrls: ['./edit-prioridade-modal.component.scss']
})
export class EditPrioridadeModalComponent {

    @Input() ocorrencias: OcorrenciaGsm[];
    @Output() refresh = new EventEmitter();
    severidade: Tuple;
    prioridade1: Tuple;
    prioridade2: Tuple;
    listNivelSeveridade: Tuple[];
    //  = [
    //     new Tuple("Crítico", 1),
    //     new Tuple("Urgente", 2),
    //     new Tuple("Normal", 3)
    // ];
    listNivelPrioridade = [
        new Tuple("Nível 0", 0),
        new Tuple("Nível 1", 1),
        new Tuple("Nível 2", 2),
        new Tuple("Nível 3", 3),
        new Tuple("Nível 4", 4),
        new Tuple("Nível 5", 5),
        new Tuple("Nível 6", 6),
        new Tuple("Nível 7", 7),
        new Tuple("Nível 8", 8),
        new Tuple("Nível 9", 9)
    ];

    constructor(
        private ocorrenciaGsmService: OcorrenciaGsmService,
        private loadingCtrl: LoadingController,
        private ocorrenciaTipoService: OcorrenciaTipoService,
        private smAlert: SmAlertController
    ) { }

    ngOnChanges(changes: SimpleChanges): void {
        this.obterNivelSeveridade();
        this.severidade = new Tuple('Selecione...', null);
        this.prioridade1 = new Tuple('Selecione...', null);
        this.prioridade2 = new Tuple('Selecione...', null);
    }

    alterar() {
        if (this.isValid()) {
            const load = this.loadingCtrl.create({
                content: "Aguarde..."
            });
            load.present().then(() => {
                this.ocorrencias.forEach(item => {
                    item.cdNivelSeveridade = this.severidade.select;
                    item.nrPrioridade1 = this.prioridade1.select;
                    item.nrPrioridade2 = this.prioridade2.select;
                    item.cdUsuarioAlteracao = GerenciadorSessao.usuario.idUsuario;
                    item.cdUsuarioCadastro = GerenciadorSessao.usuario.nrDocumento;
                });
                this.ocorrenciaGsmService.alterarStatus(this.ocorrencias)
                    .then(resp => {
                        this.smAlert.sucesso("Informação", resp.msgResponse);
                        $("#modalEditPrioridade").hide();
                        this.refresh.emit(true);
                        load.dismiss();
                    }).catch(erro => {
                        console.error('ERRO', erro);
                        load.dismiss();
                        this.smAlert.error("Informação", "Ocorreu um problema para alterar a prioridade da(s) ocorrência(s).");
                    });
            }).catch(() => {
                load.dismiss();
            });
        }
    }

    isValid(): boolean {
        return this.severidade.select;
    }

    onClose() {
        this.refresh.emit(false);
    }

    obterNivelSeveridade() {
        this.ocorrenciaTipoService.obterNivelSeveridade()
        .then(res => {
            if (res && res.length) {
                this.listNivelSeveridade = [];
                this.listNivelSeveridade.push(new Tuple("Selecione...", null));
                res.forEach(item => {
                    this.listNivelSeveridade.push(new Tuple(item.valor, +item.codigo));
                });
            }
        });
    }
}
