import { Component, OnInit, ViewChild } from "@angular/core";
import { HomeTecnicoPage } from "../../home-tecnico/home-tecnico";

@Component({
    selector: "app-ocorrencias-aguardando-viabilidade",
    templateUrl: "./ocorrencias-aguardando-viabilidade.component.html",
    styleUrls: ["./ocorrencias-aguardando-viabilidade.component.scss"]
})
export class OcorrenciasAguardandoViabilidadePage implements OnInit {
    @ViewChild(HomeTecnicoPage) homeTecnicoPage: HomeTecnicoPage;

    constructor() {}

    ngOnInit() {
        this.homeTecnicoPage.filtrosPesquisaTecnico.inAguardandoViabilidade = true;
    }

    pesquisarWS() {
        this.homeTecnicoPage.filtrosPesquisaTecnico.inAguardandoViabilidade = true;
        this.homeTecnicoPage.filtrosPesquisaTecnico.pesquisarWS();
    }
}
