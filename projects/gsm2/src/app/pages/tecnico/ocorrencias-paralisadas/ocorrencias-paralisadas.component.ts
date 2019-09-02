import { Util } from './../../../services/util/Util';
import { Component, OnInit, ViewChild } from "@angular/core";
import { HomeTecnicoPage } from "../../home-tecnico/home-tecnico";

@Component({
    selector: "app-ocorrencias-paralisadas",
    templateUrl: "./ocorrencias-paralisadas.component.html",
    styleUrls: ["./ocorrencias-paralisadas.component.scss"]
})
export class OcorrenciasFinalizadasPage implements OnInit {
    @ViewChild(HomeTecnicoPage) homeTecnicoPage: HomeTecnicoPage;
    dtInicio: any = new Date();
    dtFim: any = new Date();

    constructor(
        private util: Util
    ) {}

    ngOnInit() {
        this.mesAtual();
        this.homeTecnicoPage.filtrosPesquisaTecnico.inAtendimento = false;
        this.homeTecnicoPage.filtrosPesquisaTecnico.inAguardandoViabilidade = false;
        // setTimeout (() => {
        //     this.mesAtual();
        // }, 1000);
        this.homeTecnicoPage.filtrosPesquisaTecnico.alteraData();
    }

    pesquisarWS() {
        this.homeTecnicoPage.filtrosPesquisaTecnico.inAtendimento = false;
        this.homeTecnicoPage.filtrosPesquisaTecnico.inAguardandoViabilidade = false;
        this.homeTecnicoPage.filtrosPesquisaTecnico.pesquisarWS();
    }

    mesAtual(): void{
        this.dtInicio = new Date();
        this.dtInicio.setDate(new Date().getDate() - 30);
        // this.filtros.dtInicio.setDate(new Date().getDate() - 30);
        this.dtInicio = this.util.formatarDataUS(this.dtInicio.toDateString(), 'yyyy-MM-dd');
        this.dtFim = new Date();
        this.dtFim = this.util.formatarDataUS(this.dtFim.toDateString(), 'yyyy-MM-dd');
    }

}
