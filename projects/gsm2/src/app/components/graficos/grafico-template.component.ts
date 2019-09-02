import { Component, Input, Output, EventEmitter } from "@angular/core";
import { Util } from "../../services/util/Util";

@Component({
    selector: "app-grafico-template",
    templateUrl: "./grafico-template.component.html",
    styleUrls: ["./grafico-template.component.scss"]
})
export class GraficoTemplateComponent {
    titulocaixa: string;
    private dados: Array<number>;
    private cores: Array<any> = [];
    legendas: Array<any> = [];

    constructor(private util: Util) {
        this.cores.push({ backgroundColor: this.util.cores });
    }

    @Input()
    get titulo(): string {
        return this.titulocaixa;
    }

    set titulo(val) {
        this.titulocaixa = val;
        this.titulocaixaChange.emit(this.titulocaixa);
    }

    @Output()
    dadosCChange = new EventEmitter();
    @Output()
    titulocaixaChange = new EventEmitter();

    @Input()
    get dadosC(): Array<number> {
        return this.dados;
    }

    set dadosC(val) {
        this.dados = val;
        this.dadosCChange.emit(this.dados);
    }
}
