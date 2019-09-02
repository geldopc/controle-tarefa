import { Component, OnInit } from "@angular/core";
import { GerenciadorSessao } from "../../services/util/GerenciadorSessao";
import { GrupoGestorService } from "../../services/GrupoGestorService";
import { LoadingController } from "ionic-angular";
import { GrupoGestor } from "../../objects/entidades/GrupoGestor";
import { OrganogramaBean } from "../../objects/bean/OrganogramaBean";
import * as $ from 'jquery';
import { Usuario } from "../../objects/entidades/Usuario";
import { OcorrenciaGsmService } from "../../services/OcorrenciaGsmService";
import { ActivatedRoute } from "@angular/router";
import { GridDataResult, PageChangeEvent } from "@progress/kendo-angular-grid";

@Component({
    selector: "page-organograma",
    templateUrl: "./organograma.component.html",
    styleUrls: ["./organograma.component.scss"]
})
// tslint:disable-next-line:component-class-suffix
export class OrganogramaPage implements OnInit {

    grupoGestor = new GrupoGestor();
    listGrupoGestor: GrupoGestor[] = [];
    organograma = new OrganogramaBean();
    usuario: Usuario;
    listStatusView: any[] = [];
    funcao: any;
    idCliente: Number = 0;
    totalTarefa: number;
    listGroup: any[] = [];
    gridView: GridDataResult;
    pageSize = 10;
    skip = 0;
    expandido: boolean = false;
    usuarioLogado: Usuario;
    removerAnimal: boolean = false;
    removerVegetal: boolean = false;
    removerOutros: boolean = false;

    constructor(
        private grupoGestorService: GrupoGestorService,
        private loadingCtrl: LoadingController,
        private ocorrenciaGsmService: OcorrenciaGsmService,
        private route: ActivatedRoute
    ) {
        // console.log("constructor...", this);
    }

    ngOnInit() {
        this.usuarioLogado = GerenciadorSessao.usuario;
        this.route.queryParams.subscribe((param: any) => {
            // console.log("route.queryParams.subscribe", param, typeof param);
            if (param && param.idCliente) {
                this.idCliente = param.idCliente;
            }
        });
        // console.log("ngOnInit...", GerenciadorSessao.usuario, this);
        this.obterGrupoGestor();
    }
    private zoom: number = 1;
    minor(){
        this.zoom = (this.zoom >= 1)? this.zoom - 0.2 : 1;
        $('.principal').css("zoom", this.zoom);
    }

    plus(){
        this.zoom = this.zoom + 0.2;
        $('.principal').css("zoom", this.zoom);
    }

    obterGrupoGestor() {
        const load = this.loadingCtrl.create({
            content: "Buscando Grupo Gestor..."
        });
        if (this.idCliente || GerenciadorSessao.usuario.cdCliente) {
            load.present().then(() => {
                this.grupoGestorService.obter(this.idCliente ? +this.idCliente : GerenciadorSessao.usuario.cdCliente)
                    .then(resp => {
                        this.grupoGestor = resp;
                        this.organograma.grupoGestor = resp;
                        let apenasOutro = false;
                        for (let i = 0; i < this.grupoGestor.listFocalPoint.length; i++) {
                            if (this.grupoGestor.listFocalPoint[i].gerentePrograma.nrDocumento == GerenciadorSessao.sessao.usuario.nrDocumento &&
                                this.grupoGestor.listFocalPoint[i].programa.area == 'O') {
                                apenasOutro = true;
                                break;
                            }
                        }
                        if (this.grupoGestor.veterinario.nrDocumento == GerenciadorSessao.sessao.usuario.nrDocumento) {
                            this.organograma.listFocalPointAnimal = this.grupoGestor.listFocalPoint.filter(o => o.programa.area === 'A');
                            this.removerVegetal = true;
                            this.removerOutros = true;
                        } else if (this.grupoGestor.agronomo.nrDocumento == GerenciadorSessao.sessao.usuario.nrDocumento) {
                            this.organograma.listFocalPointVegetal = this.grupoGestor.listFocalPoint.filter(o => o.programa.area === 'V');
                            this.removerAnimal = true;
                            this.removerOutros = true;
                        } else if (apenasOutro) {
                            this.organograma.listFocalPointOutros = this.grupoGestor.listFocalPoint.filter(o => o.programa.area === 'O');
                            this.removerVegetal = true;
                            this.removerAnimal = true;
                        } else {
                            this.organograma.listFocalPointAnimal = this.grupoGestor.listFocalPoint.filter(o => o.programa.area === 'A');
                            this.organograma.listFocalPointVegetal = this.grupoGestor.listFocalPoint.filter(o => o.programa.area === 'V');
                            this.organograma.listFocalPointOutros = this.grupoGestor.listFocalPoint.filter(o => o.programa.area === 'O');
                        }
                        load.dismiss();
                        // console.log("obterGrupoGestor...", this);
                    }).catch(erro => {
                        console.error("Erro...", erro);
                        load.dismiss();
                    });
            }).catch(erro => {
                load.dismiss();
            });
        }
    }

    openDemanda(usuario, funcao, idPrograma?) {
        // console.log("openDemanda...", usuario);
        $('#demandaUsuario').show();
        this.usuario = usuario;
        this.funcao = funcao;
        this.totalTarefa = 0;
        this.obterOcorrencia(usuario.nrDocumento, idPrograma);
    }

    closeDemanda() {
        this.expandido = false;
        $('#demandaUsuario').hide();
        this.usuario = null;
    }

    obterOcorrencia(doc, idPrograma?) {
        const load = this.loadingCtrl.create({
            content: "Buscando Ocorrências..."
        });
        load.present().then(() => {
            this.listStatusView = [];
            this.listGroup = [];
            const obj = {
                usuarioAbertura: doc ? doc : '',
                cdCliente: this.idCliente ? +this.idCliente : GerenciadorSessao.usuario.cdCliente,
                inStatus: '',
                cdTipoOcorrencia: idPrograma
            };
            this.ocorrenciaGsmService.obterOcorrenciasStatusFuncaoOrganograma(obj)
                .then(resp => {
                    // console.log("resposta: ", resp, idPrograma);
                    if (resp && resp.length) {
                        resp.forEach(item => {
                            this.popularStatusView(item.inStatus, item.dsStatus, this.listStatusView, true);
                            if (this.usuario.inFiscalContrato || this.usuario.inGerenteProjeto) {
                                this.popularGroup(item['inArea'], item.inStatus, item.dsStatus);
                                // console.log("inFiscalContrato ou inGerenteProjeto: ", this);
                            } else if (this.usuario.inAgronomoResponsavel || this.usuario.inVeterinarioResponsavel || !this.usuario) {
                                this.popularGroup(item['inArea'], item.inStatus, item.dsStatus, item.dsPrograma);
                                // console.log("inAgronomoResponsavel ou inVeterinarioResponsavel ou outros: ", this);
                            }
                        });
                    }
                    load.dismiss();
                }).then(() => {
                    if (this.listStatusView && this.listStatusView.length) {
                        this.listStatusView.sort(function (a, b) {
                            if (a.descricao > b.descricao) {
                                return 1;
                            } else {
                                return -1;
                            }
                        });
                    }
                    if (this.listGroup && this.listGroup.length) {
                        this.listGroup.sort(function (a, b) {
                            if (a.area > b.area) {
                                return 1;
                            } else {
                                return -1;
                            }
                        });
                    }
                    this.loadItems();
                    this.expandido = false;
                    // console.log("final: ", this);
                }).catch(erro => {
                    console.error("Erro: ", erro);
                    load.dismiss();
                });
        }).catch(erro => {
            load.dismiss();
        });
    }

    popularStatusView(sigla, descricao, list, incrementaTotal) {
        if (!list || list.length === 0) {
            this.addStatusQtd(sigla, descricao, list, incrementaTotal);
        } else {
            let status = list.find(o => o.sigla === sigla);
            if (status) {
                if (incrementaTotal) {
                    this.totalTarefa++;
                }
                status.qtd = ++status.qtd;
            } else {
                this.addStatusQtd(sigla, descricao, list, incrementaTotal);
            }
        }
    }

    addStatusQtd(sigla, descricao, list, incrementaTotal) {
        if (incrementaTotal) {
            this.totalTarefa++;
        }
        list.push({
            sigla: sigla,
            descricao: descricao,
            qtd: 1
        });
        return list;
    }

    popularGroup(tipo, sigla, descricao, programa?) {
        // console.log("popularGroup: ", this);
        let obj = {
            tipo: tipo,
            area: programa ? programa : this.obterArea(tipo),
            responsavel: programa ?
                this.grupoGestor.listFocalPoint.find(fp => fp.programa.dsPrograma === programa && fp.programa.area === tipo).gerentePrograma.nome :
                this.obterResponsavel(tipo)
        };
        if (!this.listGroup || this.listGroup.length === 0) {
            this.addGroupQtd(obj, sigla, descricao);
        } else {
            let group;
            if (programa) {
                group = this.listGroup.find(o => o.area === programa);
            } else {
                group = this.listGroup.find(o => o.tipo === tipo);
            }
            if (group) {
                group.qtd = ++group.qtd;
                this.popularStatusView(sigla, descricao, group.list, false);
            } else {
                this.addGroupQtd(obj, sigla, descricao);
            }
        }
    }

    addGroupQtd(obj, sigla, descricao) {
        obj.list = [];
        this.popularStatusView(sigla, descricao, obj.list, false);
        this.listGroup.push({
            tipo: obj.tipo,
            area: obj.area,
            responsavel: obj.responsavel,
            qtd: 1,
            list: obj.list
        });
    }

    obterArea(area) {
        switch (area) {
            case "A":
                return "Veterinário";
            case "V":
                return "Agrônomo";
            case "O":
                return "Outros";
            default:
                return "Não classificado";
        }
    }

    obterResponsavel(area) {
        switch (area) {
            case "A":
                return this.grupoGestor.veterinario.nome;
            case "V":
                return this.grupoGestor.agronomo.nome;
            case "O":
                return "Vago";
            default:
                return "Não classificado";
        }
    }

    public pageChange(event: PageChangeEvent): void {
        this.skip = event.skip;
        this.loadItems();
        // console.log('pageChange...', this.mySelection);
    }

    private loadItems(): void {
        // console.log("loadItems...", this);
        this.gridView = {
            data: this.listGroup.slice(this.skip, this.skip + this.pageSize),
            total: this.listGroup.length
        };
    }

    public showOnlyBeveragesDetails(dataItem: any, index: number): boolean {
        // console.log("showOnlyBeveragesDetails", dataItem, index);
        return true;
    }
}
