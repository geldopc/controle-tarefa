import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { LoadingController } from 'ionic-angular';
import * as $ from 'jquery';
import { SmAlertController } from 'projects/gsm2/src/app/components/sm-alert-controller/sm-alert-controller.component';
import { OcorrenciaGsmService } from 'projects/gsm2/src/app/services/OcorrenciaGsmService';
import { OcorrenciaGsm } from '../../objects/entidades/OcorrenciaGsm';
import { GerenciadorSessao } from '../../services/util/GerenciadorSessao';

@Component({
    selector: 'app-edit-status-modal',
    templateUrl: './edit-status-modal.component.html',
    styleUrls: ['./edit-status-modal.component.scss']
})
export class EditStatusModalComponent implements OnInit {

    @Input() ocorrencias: OcorrenciaGsm[];
    @Output() refresh = new EventEmitter();

    reqMsgMotivo: string;
    listStatus = [];
    statusSelecionado: { descricao: string, sigla: string };
    motivo: string;

    constructor(
        private ocorrenciaGsmService: OcorrenciaGsmService,
        private loadingCtrl: LoadingController,
        private smAlert: SmAlertController
    ) { }

    ngOnInit() {
        this.listStatus = [
            { descricao: "Aguardando Viabilidade", sigla: "AV" },
            { descricao: "Aguardando Atualização Alpha", sigla: "AA" },
            { descricao: "Gerando Versão Alpha", sigla: "VA" },
            { descricao: "Em Homologação Alpha", sigla: "HA" },
            { descricao: "Gerando Versão Beta", sigla: "VB" },
            { descricao: "Aguardando Atualização Beta", sigla: "AB" },
            { descricao: "Em Homologação Beta", sigla: "HB" },
            { descricao: "Em Homologação Cliente", sigla: "HC" },
            { descricao: "Aguardando Atualização Produção", sigla: "AP" },
            { descricao: "Gerando Versão Produção", sigla: "VP" },
            { descricao: "Duplicada", sigla: "TD" },
            { descricao: "Finalizada", sigla: "TF" },
            { descricao: "Inviabilizada", sigla: "TI" },
            { descricao: "Aguardando Definição Contratual", sigla: "AC" },
            { descricao: "Aguardando Distribuição", sigla: "AD" },
            { descricao: "Em desenvolvimento", sigla: "DE" },
            { descricao: "Aguardando Regularização dos Pagamentos", sigla: "AR" },
            { descricao: "Aguardando Informações do Cliente", sigla: "AI" },
            { descricao: "Em Análise", sigla: "EA" },
        ];
        this.motivo = null;
        // this.statusSelecionado = {descricao: "Selecione...", sigla: ""};
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.statusSelecionado = { descricao: "Selecione...", sigla: "" };
    }

    alterar() {
        if (this.isValid()) {
            const load = this.loadingCtrl.create({
                content: "Aguarde..."
            });
            load.present().then(() => {
                this.ocorrencias.forEach(item => {
                    item.dsMensagem = this.motivo;
                    item.inStatus = this.statusSelecionado.sigla;
                    item.dsStatus = this.statusSelecionado.descricao;
                    item.cdUsuarioAlteracao = GerenciadorSessao.usuario.idUsuario;
                    item.cdUsuarioCadastro = GerenciadorSessao.usuario.nrDocumento;
                });
                this.ocorrenciaGsmService.alterarStatus(this.ocorrencias)
                    .then(res => {
                        this.smAlert.sucesso("Informação", res.msgResponse);
                        $("#modalEditStatus").hide();
                        this.refresh.emit(true);
                        load.dismiss();
                    }).catch(err => {
                        console.error('ERRO', err);
                        load.dismiss();
                        this.smAlert.error("Informação", "Ocorreu um problema para alterar o status da ocorrência.");
                    });
            }).catch(() => {
                load.dismiss();
            });
        }
    }

    isValid(): boolean {
        if (this.statusSelecionado.sigla && ((this.checkStatusMotivoIsRequired() && this.motivo) || (!this.checkStatusMotivoIsRequired()))) {
            return true;
        } else {
            this.reqMsgMotivo = "Campo obrigatório";
            return false;
        }
    }

    checkStatusMotivoIsRequired(): boolean {
        return this.statusSelecionado.sigla === "AV" || this.statusSelecionado.sigla === "TF" || this.statusSelecionado.sigla === "AI";
    }

    checkAddMotivo(): boolean {
        return this.statusSelecionado.sigla === "AV" || this.statusSelecionado.sigla === "TF" || this.statusSelecionado.sigla === "AI" ||
            this.statusSelecionado.sigla === "TD";
    }

    onClose() {
        this.refresh.emit(false);
    }
}
