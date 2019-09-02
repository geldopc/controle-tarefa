import { Component, OnInit, Input } from "@angular/core";
import { FiltrosPesquisa, FiltrosPesquisaTecnicoComponent } from "../filtros-pesquisa-tecnico/filtros-pesquisa-tecnico.component";
import { Util } from "../../services/util/Util";
import { OcorrenciaGsm } from "../../objects/entidades/OcorrenciaGsm";
import { Historico } from "../../objects/entidades/Historico";
import { OcorrenciaGsmVersao } from "../../objects/entidades/OcorrenciaGsmVersao";
import { AppGsmModule } from "../../app.gsm.module";
import { SmAlertController } from "../sm-alert-controller/sm-alert-controller.component";
import { OcorrenciaGsmService } from "../../services/OcorrenciaGsmService";
import { LoadingController } from "ionic-angular";
import * as $ from "jquery";

@Component({
    selector: "grid-atualizacao-ocorrencias",
    templateUrl: "./grid-atualizacao-ocorrencias.component.html",
    styleUrls: ["./grid-atualizacao-ocorrencias.component.css"]
})
export class GridAtualizacaoOcorrenciasComponent implements OnInit {
    @Input() chamadosTemp: OcorrenciaGsm[];
    @Input() filtros: FiltrosPesquisa;
    @Input() filtrosPesquisaTecnico: FiltrosPesquisaTecnicoComponent;

    icone: String = "fa fa-square-o";
    historico: Historico = new Historico();
    chamadosSelecionados: Array<OcorrenciaGsm> = [];
    ocorrenciaSelecionada: OcorrenciaGsm;
    buildVersao: boolean;
    private _gerarBuild: OcorrenciaGsmVersao = new OcorrenciaGsmVersao();
    @Input()

    get gerarBuild(): OcorrenciaGsmVersao {
        return this._gerarBuild;
    }
    set gerarBuild(value: OcorrenciaGsmVersao) {
        this._gerarBuild = value;
    }

    refreshFinalizarOcorrencia: boolean;

    constructor(
        public util: Util,
        private ocorrenciaGsmService: OcorrenciaGsmService,
        private loadingCtrl: LoadingController
    ) {}

    ngOnInit() {}

    abrirPanel(chamado) {
        $('#listAtualizacoes').hide();
        this.obterDistribuicoes(this.ocorrenciaSelecionada);
        this.obterHistoricoBuilds(this.ocorrenciaSelecionada);
        setTimeout(() => {
            $('#ocorrencia' + chamado.idOcorrencia).show();
        }, 500);
    }

    obterDistribuicoes(chamado) {
        const load = this.loadingCtrl.create({
            content: 'Consultando as distribuições...'
        });
        load.present().then(() => {
            if (chamado) {
                this.ocorrenciaGsmService.obterDistribuicoes(chamado.idOcorrencia)
                    .then((result) => {
                        chamado.distribuicoes = result;
                        load.dismiss();
                    }).catch(err => {
                        console.error("Erro...", err);
                        load.dismiss();
                    });
            }
        }).catch(erro => {
            load.dismiss();
        });
    }

    obterHistoricoBuilds(chamado) {
        if (chamado) {
            this.ocorrenciaGsmService.obterHistoricoBuilds(chamado.idOcorrencia).then((result) => {
                chamado.listBuilds = result;
            });
        }
    }

    fecharPanel(chamado) {
        // $('#ocorrencia' + chamado.idOcorrencia).css('display', 'none');
        $('#ocorrencia' + chamado.idOcorrencia).hide();
    }

    addOrDelOcorrencia(obj: any) {
        // console.log("chamado: " + JSON.stringify(obj))
        if (
            this.filtros.chamadosSelecionados &&
            this.filtros.chamadosSelecionados.length > 0
        ) {
            const list = this.filtros.chamadosSelecionados.find(
                c => c.idOcorrencia === obj.idOcorrencia
            );

            if (list) {
                this.delOcorrencia(obj);
            } else {
                this.addOcorrencia(obj);
            }
        } else {
            this.addOcorrencia(obj);
        }
        this.getBuildVersao();
    }

    mostrarMerge(chamado: OcorrenciaGsm) {
        return chamado.inStatus === "AA" || chamado.inStatus === "AB" || chamado.inStatus === "AP" ;
    }

    mostrarBuild(chamado: OcorrenciaGsm) {
        return chamado.inStatus === "VA" || chamado.inStatus === "VB" || chamado.inStatus === "VP" ;
    }

    callJenkins() {
        const load = this.loadingCtrl.create({
            content: "Aguarde o jenkins atualizar..."
        });
        load.present()
            .then(() => {

                this.ocorrenciaGsmService
        .callJenkins(this.gerarBuild, this.gerarBuild.versao)
            .then(updated => {
                console.log("updated:: " + updated);
                load.dismiss();
            });
        }).catch(err => {
            load.dismiss();
        });
    }

    public gerarVersao(chamadoSelecionado?: OcorrenciaGsm) {
        /* idOcorrencia */
        this.gerarBuild = new OcorrenciaGsmVersao();
        if (chamadoSelecionado) {
            // chamadoSelecionado.mapOcorrencia(this.gerarBuild, chamadoSelecionado);
            this.gerarBuild.idOcorrencia.push(chamadoSelecionado.idOcorrencia);
            this.gerarBuild.cdProduto = chamadoSelecionado.cdProduto;
            this.gerarBuild.versao = chamadoSelecionado.inStatus;
        } else if (this.filtros.chamadosSelecionados) {
            this.filtros.chamadosSelecionados.forEach(ocorr => {
                // ocorr.mapOcorrencia(this.gerarBuild, ocorr);
                this.gerarBuild.idOcorrencia.push(ocorr.idOcorrencia);
                this.gerarBuild.cdProduto = ocorr.cdProduto;
                this.gerarBuild.versao = ocorr.inStatus;
            });
        }
        switch (this.gerarBuild.versao) {
            case "AA":
                this.gerarBuild.versao = "A";
                this.gerarBuildCod(this.gerarBuild);
                break;
            case "AB":
                this.gerarBuild.versao = "B";
                this.gerarBuildCod(this.gerarBuild);
                break;
            case "AP":
                this.gerarBuild.versao = "P";
                break;
        }
    }

    private gerarBuildCod(gerarBuild: OcorrenciaGsmVersao) {
        const load = this.loadingCtrl.create({
            content: "Aguarde o build do Código..."
        });
        load.present()
            .then(() => {
                this.refreshFinalizarOcorrencia = true;
                this.ocorrenciaGsmService
                    .gerarVersao(gerarBuild)
                    .then(resposta => {
                        AppGsmModule.injector
                            .get(SmAlertController)
                            .sucesso("", resposta.msgResponse);
                        this.ocorrenciaGsmService
                        .callJenkins(gerarBuild, gerarBuild.versao)
                            .then(updated => {
                                load.dismiss();
                            });
                    })
                    .catch(err => {
                        load.dismiss();
                        AppGsmModule.injector
                            .get(SmAlertController)
                            .error("", "Não foi possível atualizar a versão." + JSON.stringify(err.msgResponse));
                    });
            })
            .catch(err => {
                load.dismiss();
            });
    }

    getBuildVersao(): void {
        // console.log("getBuildVersao...entrada", this.filtros.chamadosSelecionados);
        const geraBuild = this.filtros.chamadosSelecionados.filter(
            c =>
                c.inStatus === "AP" ||
                c.inStatus === "AB" ||
                c.inStatus === "AA"
        );
        const naoGeraBuild = this.filtros.chamadosSelecionados.filter(
            c =>
                c.inStatus !== "AP" &&
                c.inStatus !== "AB" &&
                c.inStatus !== "AA"
        );
        // console.log("getBuildVersao...", this, geraBuild, naoGeraBuild);
        this.buildVersao =
            geraBuild.length > 0 && naoGeraBuild.length === 0 ? true : false;
    }

    delOcorrencia(obj: any) {
        this.filtros.chamadosSelecionados.splice(
            this.filtros.chamadosSelecionados.indexOf(obj),
            1
        );
        obj["icon"] = "fa fa-square-o";
        obj["add"] = false;
        obj["classPanelColor"] = "panel-no-selected";
        if (this.filtros.chamadosSelecionados.length === 0) {
            this.icone = "fa fa-square-o";
        }
    }

    addOcorrencia(obj: any) {
        this.filtros.chamadosSelecionados.push(obj);
        obj["icon"] = "fa fa-check-square";
        obj["add"] = true;
        obj["classPanelColor"] = "panel-selected";
        if (
            this.filtros.chamadosSelecionados.length ===
            this.chamadosTemp.length
        ) {
            this.icone = "fa fa-check-square";
        }
    }

    addOrDelTodas(obj: any) {
        obj.forEach(element => {
            if (
                this.filtros.chamadosSelecionados &&
                this.filtros.chamadosSelecionados.length > 0
            ) {
                const list = this.filtros.chamadosSelecionados.find(
                    c => c.idOcorrencia === element.idOcorrencia
                );
                if (list) {
                    this.delTodas(element);
                } else {
                    this.addTodas(element);
                }
            } else {
                this.addTodas(element);
            }
        });
    }

    addOrDelAll() {
        if (
            this.filtros.chamadosSelecionados &&
            this.filtros.chamadosSelecionados.length > 0
        ) {
            this.filtros.chamadosSelecionados = [];
            this.chamadosTemp.forEach(item => {
                item["icon"] = "fa fa-square-o";
                item["add"] = false;
                this.icone = "fa fa-square-o";
            });
        } else {
            this.filtros.chamadosSelecionados = <any>(
                JSON.parse(JSON.stringify(this.chamadosTemp))
            );
            this.chamadosTemp.forEach(item => {
                item["icon"] = "fa fa-check-square";
                item["add"] = true;
                this.icone = "fa fa-check-square";
            });
        }
    }

    delTodas(obj: any) {
        this.filtros.chamadosSelecionados.splice(
            this.filtros.chamadosSelecionados.indexOf(obj),
            1
        );
        this.icone = "fa fa-square-o";
        obj["icon"] = "fa fa-square-o";
        obj["add"] = false;
        obj["classPanelColor"] = "panel-no-selected";
    }

    addTodas(obj: any) {
        this.filtros.chamadosSelecionados.push(obj);
        this.icone = "fa fa-check-square";
        obj["icon"] = "fa fa-check-square";
        obj["add"] = true;
        obj["classPanelColor"] = "panel-selected";
        // console.log("chamados selecionados: " + JSON.stringify(this.filtros.chamadosSelecionados))
    }
}
