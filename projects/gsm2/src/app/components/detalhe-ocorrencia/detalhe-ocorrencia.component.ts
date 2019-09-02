import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { LoadingController } from 'ionic-angular';
import { OcorrenciaGsm } from '../../objects/entidades/OcorrenciaGsm';
import { Tuple } from '../../objects/entidades/Tuple';
import { OcorrenciaGsmService } from '../../services/OcorrenciaGsmService';
import { OcorrenciaTipoService } from '../../services/OcorrenciaTipoService';
import { GerenciadorSessao } from '../../services/util/GerenciadorSessao';
import { SmAlertController } from '../sm-alert-controller/sm-alert-controller.component';
import { Util } from '../../services/util/Util';

@Component({
    selector: 'app-detalhe-ocorrencia',
    templateUrl: './detalhe-ocorrencia.component.html',
    styleUrls: ['./detalhe-ocorrencia.component.scss'],
})
export class DetalheOcorrenciaComponent implements OnInit {

    @Input() ocorrencia: OcorrenciaGsm;
    @Output() close = new EventEmitter();
    tipoSolicitacao: Tuple;
    prioridade1: Tuple;
    prioridade2: Tuple;
    complexidade: Tuple;
    severidade: Tuple;
    funcionalidades: Tuple[];
    selecione = new Tuple('Selecione...', '');
    listTipoSolicitacao = [
        new Tuple("Suporte", "S"),
        new Tuple("Manutenção Corretiva", "C"),
        new Tuple("Manutenção Adaptativa", "A"),
        new Tuple("Manutenção Evolutiva", "N"),
        new Tuple("Desenvolvimento", "D")
    ];
    listNivelComplexidade = [
        new Tuple("Baixa", "B"),
        new Tuple("Média", "M"),
        new Tuple("Alta", "A")
    ];
    listNivelSeveridade: Tuple[];

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
    atividades: Tuple[];

    constructor(
        private loadingCtrl: LoadingController,
        private ocorrenciaService: OcorrenciaGsmService,
        private ocorrenciaTipoService: OcorrenciaTipoService,
        private smAlert: SmAlertController,
        private util: Util,
    ) {
        // console.log("DetalheOcorrenciaComponent/constructor", this);
    }

    ngOnInit(): void {
        // console.log("ngOnInit", this);
    }

    fechar() {
        this.close.emit();
    }

    obterFuncionalidade() {
        if (this.ocorrencia && this.ocorrencia.cdProduto) {
            this.ocorrenciaTipoService.obterFuncionalidade(this.ocorrencia.cdProduto)
            .then(resp => {
                if (resp && resp.length) {
                    this.funcionalidades = [];
                    this.funcionalidades.push(new Tuple("Selecione...", null));
                    resp.forEach(item => {
                        this.funcionalidades.push(new Tuple(item.valor, item.codigo));
                    });
                }
            });
        }
    }

    obterHistoricoAnexo() {
        if (this.ocorrencia && this.ocorrencia.idOcorrencia &&
            (!this.ocorrencia.historico || !this.ocorrencia.historico.length || !this.ocorrencia.anexos || !this.ocorrencia.anexos.length)) {
            this.ocorrenciaService.obterHistoricoAnexo(this.ocorrencia.idOcorrencia)
            .then(res => {
                if (res) {
                    if (res.historico) {
                        this.ocorrencia.historico = res.historico;
                        this.ocorrencia.historico.forEach(item => {
                            item.dtCadastro = this.util.stringToDate(String(item.dtSolicitacao));
                        });
                    }
                    if (res.anexos) {
                        this.ocorrencia.anexos = res.anexos;
                    }
                }
            });
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        // console.log("DetalheOcorrenciaComponent/ngOnChanges", changes, this);
        this.obterNivelSeveridade();
        this.obterFuncionalidade();
        this.obterHistoricoAnexo();
        this.setarValorFiltro();
    }

    setarValorFiltro(): void {
        if (this.ocorrencia) {
            this.setarTipoSolicitacao();
            this.setarPrioridade1();
            this.setarPrioridade2();
            this.setarComplexidade();
        }
    }

    setarTipoSolicitacao(): void {
        let tipo = this.listTipoSolicitacao.find(o => o.select === this.ocorrencia.inTipoSolicitacao);
        if (tipo) {
            this.tipoSolicitacao = tipo;
        } else {
            this.tipoSolicitacao = this.selecione;
        }
    }

    setarPrioridade1(): void {
        let nrPrioridade1 = this.listNivelPrioridade.find(o => o.select === this.ocorrencia.nrPrioridade1);
        if (nrPrioridade1) {
            this.prioridade1 = nrPrioridade1;
        } else {
            this.prioridade1 = this.selecione;
        }
    }

    setarPrioridade2(): void {
        let nrPrioridade2 = this.listNivelPrioridade.find(o => o.select === this.ocorrencia.nrPrioridade2);
        if (nrPrioridade2) {
            this.prioridade2 = nrPrioridade2;
        } else {
            this.prioridade2 = this.selecione;
        }
    }

    setarComplexidade(): void {
        let complexidade = this.listNivelComplexidade.find(o => o.select === this.ocorrencia.inNivelComplexidade);
        if (complexidade) {
            this.complexidade = complexidade;
        } else {
            this.complexidade = this.selecione;
        }
    }

    setarSeveridade(): void {
        let severidade = this.listNivelSeveridade.find(o => o.select === this.ocorrencia.cdNivelSeveridade);
        if (severidade) {
            this.severidade = severidade;
        } else {
            this.severidade = this.selecione;
        }
    }

    editarOcorrencia() {
        if (this.validarEdicao()) {
            const load = this.loadingCtrl.create({
                content: "Aguarde..."
            });
            load.present().then(() => {
                this.ocorrencia.cdUsuarioAlteracao = GerenciadorSessao.usuario.idUsuario;
                this.ocorrenciaService.editarOcorrencia(this.ocorrencia)
                .then(resp => {
                    console.log('ocorrenciaService.obter...', resp);
                    this.smAlert.sucesso("", resp.msgResponse);
                    load.dismiss();
                }).catch(erro => {
                    console.error('ERRO...', this);
                    load.dismiss();
                });
            });
        } else {
            this.smAlert.warning("Alerta", "Favor classificar a ocorrência!");
        }
    }

    validarEdicao(): boolean {
        const o = this.ocorrencia;
        if (o.cdFuncionalidade && o.inTipoSolicitacao && o.inNivelComplexidade &&
            o.cdNivelSeveridade && o.nrPrioridade1 > -1 && o.nrPrioridade2 > -1) {
            return true;
        } else {
            return false;
        }
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
                this.setarSeveridade();
            }
        });
    }
}
