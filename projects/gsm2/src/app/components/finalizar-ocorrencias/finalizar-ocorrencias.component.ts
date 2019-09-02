import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { SmAlertController } from 'projects/gsm2/src/app/components/sm-alert-controller/sm-alert-controller.component';
import { OcorrenciaGsmService } from 'projects/gsm2/src/app/services/OcorrenciaGsmService';
import { OcorrenciaGsm } from '../../objects/entidades/OcorrenciaGsm';
import * as $ from 'jquery';
import { GerenciadorSessao } from '../../services/util/GerenciadorSessao';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
@Component({
    selector: 'finalizar-ocorrencias',
    templateUrl: './finalizar-ocorrencias.component.html',
    styleUrls: ['./finalizar-ocorrencias.component.scss']
})
export class FinalizarOcorrenciasComponent implements OnInit {

    @Input() ocorrencias: OcorrenciaGsm[];
    @Output() carregarGridChange: EventEmitter<string> = new EventEmitter<string>();

    reqMsgMotivo: string;
    listStatus: {descricao: string, sigla: string}[];
    statusSelecionado: {descricao: string, sigla: string};
    motivo: string;

    constructor(
        private ocorrenciaGsmService: OcorrenciaGsmService,
        private loading: Ng4LoadingSpinnerService,
        private smAlert: SmAlertController
    ) {
    }

    ngOnInit() {
        // Modal Distribuição
        this.listStatus = [
            {descricao: "Aguardando Viabilidade", sigla: "AV"},
            {descricao: "Aguardando Atualização Alpha", sigla: "AA"},
            {descricao: "Gerando Versão Alpha", sigla: "VA"},
            {descricao: "Em Homologação Alpha", sigla: "HA"},
            {descricao: "Gerando Versão Beta", sigla: "VB"},
            {descricao: "Aguardando Atualização Beta", sigla: "AB"},
            {descricao: "Em Homologação Beta", sigla: "HB"},
            {descricao: "Em Homologação Cliente", sigla: "HC"},
            {descricao: "Aguardando Atualização Produção", sigla: "AP"},
            {descricao: "Gerando Versão Produção", sigla: "VP"},
            {descricao: "Duplicada", sigla: "TD"},
            {descricao: "Finalizar", sigla: "TF"},
            {descricao: "Inviabilizada", sigla: "TI"},
            {descricao: "Aguardando Definição Contratual", sigla: "AC"},
            {descricao: "Aguardando Regularização dos Pagamentos", sigla: "AR"},
            {descricao: "Ocorrência Descontinuada", sigla: "OD"},
            {descricao: "Aguardando Informações do Cliente", sigla: "AI"}
        ];
        this.motivo = null;
        this.statusSelecionado = this.listStatus[0];
    }

    alterar() {
        // console.log('alterarPrioridade', this);
        if (this.statusSelecionado.sigla !== 'TF' && this.statusSelecionado.sigla !== 'AV' &&
            this.statusSelecionado.sigla !== 'TD' && this.statusSelecionado.sigla !== 'TI' && this.statusSelecionado.sigla !== 'AI' ) {
            this.motivo = null;
        }
        if (this.isValid()) {
            this.loading.show();
            this.ocorrencias.forEach(item => {
                item.dsMensagem = this.motivo;
                item.inStatus = this.statusSelecionado.sigla;
                item.dsStatus = this.statusSelecionado.descricao;
                item.cdUsuarioCadastro = GerenciadorSessao.usuario.nrDocumento;
                item.cdUsuarioAlteracao = GerenciadorSessao.usuario.idUsuario;
            });
            this.ocorrencias.map((obj: any) => {
                // const obj = <any> JSON.parse(JSON.stringify(this.ocorrencias[0]));
                delete obj['exibe'];
                delete obj['cor'];
                delete obj['add'];
                delete obj['icon'];
                delete obj['dsOcorrencia'];
                delete obj['dsFuncionalidade'];
                delete obj['dsProduto'];
                delete obj['dsPrograma'];
                delete obj['dtCadastro'];
                delete obj['classPanelColor'];
                if (obj && obj.listBuilds && obj.listBuilds.length === 0) {
                    delete obj['listBuilds'];
                }
            });
            console.log("this.ocorrencias:: ", JSON.stringify(this.ocorrencias));
            this.ocorrenciaGsmService.alterarStatus(this.ocorrencias)
            .then(resp => {
                // console.log('finalizarDistribuicao...', resp);
                this.smAlert.sucesso("Informação", resp.msgResponse);
                $("#modalFinalizarOcorrencia").hide();
                this.carregarGrid();
                this.loading.hide();
            }).catch(erro => {
                this.loading.hide();
                this.smAlert.error("Informação", "Ocorreu um problema para alterar o status da ocorrência.");
            });
        }

    }

    isValid(): boolean {
        let valida = false;
        if (this.ocorrencias && this.ocorrencias.length > 0 && this.statusSelecionado ) {
            // somente nestes casos o campo motivo é obrigatório
            if (/*this.statusSelecionado.sigla !==  "AV" &&*/
                 this.statusSelecionado.sigla !==  "TD" && this.statusSelecionado.sigla !==  "TF"
                 && this.statusSelecionado.sigla !==  "TI") {
                    valida = true;
            } else {
                if (this.motivo) {
                    valida = true;
                } else {
                    this.reqMsgMotivo = "Campo obrigatório";
                }
            }
        }
        return valida;
    }

    carregarGrid() {
        //console.log('carregarGrid...FinalizarOcorrenciasComponent', this);
        this.carregarGridChange.emit();
    }
}
