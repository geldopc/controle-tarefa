import { Component, Input, SimpleChanges, Output, EventEmitter } from "@angular/core";
import { LoadingController } from "ionic-angular";
import { OcorrenciaGsm } from "../../objects/entidades/OcorrenciaGsm";
import { Usuario } from "../../objects/entidades/Usuario";
import { OcorrenciaGsmService } from "../../services/OcorrenciaGsmService";
import { SmAlertController } from "../sm-alert-controller/sm-alert-controller.component";
import * as $ from 'jquery';

export class Modalidade {
    "codigo": number;
    "valor": string;
    "tipo": string;
    "sigla": string;

}
@Component({
    selector: "alterar-tecnicos-distribuicoes",
    templateUrl: "./alterar-tecnicos.component.html",
    styleUrls: ["./alterar-tecnicos.component.scss"]
})
export class AlterarTecnicosComponent {

    private _ocorrenciasSelecionadas: OcorrenciaGsm[];
    public listFuncionarioDe: Array<{usuario: Usuario, modalidade: Modalidade}> = [];
    public listFuncionarioPara: Array<{usuario: Usuario, modalidade: Modalidade}> = [];
    funcionarioDe: {usuario: Usuario, modalidade: Modalidade} = {usuario: new Usuario(), modalidade: new Modalidade()};
    funcionarioPara: {usuario: Usuario, modalidade: Modalidade} = {usuario: new Usuario(), modalidade: new Modalidade()};
    mensagem: string;
    cor: string;

    @Input() realocar: Boolean = false;
    @Output() refresh = new EventEmitter();

    constructor(
        private ocorrenciaGsmService: OcorrenciaGsmService,
        private smAlert: SmAlertController,
        private loadingCtrl: LoadingController,
    ) {}

    setFuncionarioPara(funcionarioDe: {usuario: Usuario, modalidade: Modalidade}) {
        this.funcionarioPara = {usuario: new Usuario(), modalidade: new Modalidade()};
        this.listFuncionarioPara = [];
        this.ocorrenciaGsmService.obterfuncionariosTarefa(funcionarioDe.modalidade.codigo)
        .then(res => {
            res.forEach(item => {
                if (+item.idUsuario !== +this.funcionarioDe.usuario.idUsuario) {
                    this.listFuncionarioPara.push({usuario: item, modalidade: funcionarioDe.modalidade});
                }
            });
        });
    }

    alterarTecnico() {
        if (this.isValid()) {
            const idOcorrencias: number[] = [];
            this.ocorrenciasSelecionadas.forEach((ocr: OcorrenciaGsm) => {
                if (ocr) {
                    ocr.distribuicoes.forEach((distro) => {
                        if (this.funcionarioDe.usuario.idUsuario === distro.cdUsuarioAtendimento) {
                            idOcorrencias.push(distro.idOcorrenciaDistribuicao);
                        }
                    });
                }
            });
            const load = this.loadingCtrl.create({
                content: "Aguarde..."
            });
            load.present().then(() => {
                return this.ocorrenciaGsmService.alterarTecnico(idOcorrencias, this.funcionarioDe.usuario, this.funcionarioPara.usuario)
                .then(res => {
                    this.smAlert.sucesso("Alteração realizada com sucesso", res.msgResponse);
                    this.refresh.emit(true);
                    load.dismiss();
                    $('#modalAlterarTecnico').hide();
                }).catch(err => {
                    console.error('ERROR', err);
                    load.dismiss();
                    this.smAlert.warning("Alerta", "Não foi possível alterar!");
                });
            });
        }
    }

    isValid(): boolean {
        return this.funcionarioDe.usuario.idUsuario && this.funcionarioPara.usuario.idUsuario &&
            Boolean(this.funcionarioDe.modalidade.codigo && this.funcionarioPara.modalidade.codigo);
    }

    @Input()
    public get ocorrenciasSelecionadas(): any[] {
        return this._ocorrenciasSelecionadas;
    }

    public set ocorrenciasSelecionadas(v: any[]) {
        this._ocorrenciasSelecionadas = v;
    }

    ngOnChanges(changes: SimpleChanges): void {
        // console.log('ngOnChanges...', changes, this);
        this.setFuncionarioDe();
    }

    private listDistribuicoes() {
        const matriz = Array.from(new Set(this.ocorrenciasSelecionadas.map(ocr => ocr.distribuicoes)))
            .filter(dist => Boolean(dist))
            .map(dist => {
                return dist;
            });
        let list = [];
        matriz.forEach(element => {
            for (let i = 0; i < element.length; i++) {
                list.push(element[i]);
            }
        });
        return list;
    }

    setFuncionarioDe() {
        const distribuicoes = this.listDistribuicoes();
        let modalidade: Modalidade;
        let usuario: Usuario;
        this.listFuncionarioDe = [];
        distribuicoes.forEach(item => {
            if (this.listFuncionarioDe && !this.listFuncionarioDe.length ||
                !this.listFuncionarioDe.find(d => +d.modalidade.codigo === +item.cdTipoTarefa && +d.usuario.idUsuario === +item.cdUsuarioAtendimento)) {
                modalidade = new Modalidade();
                modalidade.codigo = item.cdTipoTarefa;
                modalidade.valor = item.tipoTarefa;
                usuario = new Usuario(item.cdUsuarioAtendimento, '', item.dsUsuarioAtendimento);
                this.listFuncionarioDe.push({usuario, modalidade});
            }
        });
    }

    onClose() {
        this.refresh.emit(false);
    }
}
