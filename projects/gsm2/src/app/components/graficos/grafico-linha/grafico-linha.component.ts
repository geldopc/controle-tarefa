import { Input, EventEmitter, Output } from "@angular/core";
import { Component, OnInit } from "@angular/core";

@Component({
    selector: "app-grafico-linha",
    templateUrl: "./grafico-linha.component.html"
})
export class GraficoLinhaComponent implements OnInit {
    @Input()
    titulocaixa: String = "";
    dados: Array<number>;
    labels: Array<string>;

    @Input()
    get labelsCustoms(): Array<string> {
        return this.labels;
    }

    @Output()
    labelsCustomsChange = new EventEmitter();
    @Output()
    dadosCustomsChange = new EventEmitter();

    set labelsCustoms(val) {
        this.labels = val;
        console.log("labelsLinha, ", JSON.stringify(val));
        this.labelsCustomsChange.emit(this.labels);
    }

    @Input()
    get dadosCustoms(): Array<number> {
        return this.dados;
    }

    set dadosCustoms(val) {
        this.dados = val;
        this.dadosCustomsChange.emit(this.dados);
    }

    constructor() {}

    ngOnInit() {}

    ngAfterViewInit() {
        this.lineChartData = this.dadosCustoms;
        this.lineChartLabels = this.labelsCustoms;
        console.log(
            "grafico em linha rgba labels: ",
            this.lineChartData,
            ", dados: ",
            this.lineChartData
        );
    }

    // lineChart
    public lineChartData: Array<any> = this.dadosCustoms;
    public lineChartLabels: Array<any> = this.labelsCustoms;
    public lineChartOptions: any = {
        responsive: true
    };

    public lineChartColors: Array<any> = [
        {
            // grey
            backgroundColor: "rgba(148,159,177,0.2)",
            borderColor: "#009688",
            pointBackgroundColor: "rgba(0, 148, 133, 0.25)",
            pointBorderColor: "rgba(0, 148, 133, 0.25)",
            pointHoverBackgroundColor: "rgba(0, 148, 133, 0.25)",
            pointHoverBorderColor: "rgba(77,83,96,1)"
        },
        {
            // dark grey
            backgroundColor: "rgba(244, 64, 52, 0.5)",
            borderColor: "#f44336",
            pointBackgroundColor: "rgba(244, 64, 52, 0.5)",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgba(77,83,96,1)"
        },
        {
            // grey
            backgroundColor: "rgba(0, 189, 214, 0.25)",
            borderColor: "#00bcd4",
            pointBackgroundColor: "rgba(0, 189, 214, 0.25)",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgba(148,159,177,0.8)"
        }
    ];
    public lineChartLegend: boolean = true;
    public lineChartType: string = "line";

    public randomize(): void {
        let _lineChartData: Array<any> = new Array(this.lineChartData.length);
        for (let i = 0; i < this.lineChartData.length; i++) {
            _lineChartData[i] = {
                data: new Array(this.lineChartData[i].data.length),
                label: this.lineChartData[i].label
            };
            for (let j = 0; j < this.lineChartData[i].data.length; j++) {
                _lineChartData[i].data[j] = Math.floor(Math.random() * 100 + 1);
            }
        }
        this.lineChartData = _lineChartData;
    }

    // events
    public chartClicked(e: any): void {
        console.log(e);
    }

    public chartHovered(e: any): void {
        console.log(e);
    }

    @Input()
    carregarPosicaoEscritorios() {}
}
