import { Input, Output } from "@angular/core";
import { Component, OnInit, EventEmitter } from "@angular/core";
import { Util } from "../../../services/util/Util";

@Component({
    selector: "app-grafico-barra",
    templateUrl: "./grafico-barra.component.html",
    styleUrls: ["./grafico-barra.component.scss"]
})
export class GraficoBarraComponent implements OnInit {

    @Input() isAlternado: Boolean = false;
    @Input()
    titulocaixa: string;
    @Input()
    labels: Array<string>;
    cores: Array<any> = [];
    legendas: Array<any> = [];
    _dadosCustoms: Array<{ data: number[]; label: string }> = [];
    public barChartLabels: String[] = this.labelsCustoms;
    public barChartType: String = "bar";
    public barChartLegend: Boolean = true;
    public barChartData: Array<{data: number[], label: string}> = null;
    public barChartOptions: any = {
        scaleShowVerticalLines: false,
        responsive: true
    };
    public total: number = 0;
    public isTotal: Boolean = false;
    @Output() labelsCustomsChange = new EventEmitter();
    @Output() dadosCustomsChange = new EventEmitter();
    @Output() selecionadoChange = new EventEmitter();

    constructor(private util: Util) {
        this.cores.push({ backgroundColor: this.util.cores });
    }

    ngOnInit() {}

    @Input()
    get dadosCustoms(): Array<{ data: number[]; label: string }> {
        return this._dadosCustoms;
    }

    set dadosCustoms(val: Array<{ data: number[]; label: string }>) {
        this._dadosCustoms = val;
        this.barChartData = val;
        this.dadosCustomsChange.emit(val);
    }

    // tslint:disable-next-line:use-life-cycle-interface
    ngAfterViewInit(): void {
        this.preencherLegenda();
    }

    @Input()
    get labelsCustoms(): Array<string> {
      return this.labels;
    }

    set labelsCustoms(val) {
      this.labels = val;
      this.labelsCustomsChange.emit(this.labels);
    }

    // events
    public chartClicked(e: any): void {
        console.log(e);
    }

    public chartHovered(e: any): void {
        console.log(e);
    }

    selecionar(ev) {
        this.selecionadoChange.emit(ev);
    }

    preencherLegenda() {
        // este método é chamado várias vezes, mas só preenche o array uma unica vez
        if (this.labelsCustoms && this.labels.length > 0 && this.barChartData) {
            // tslint:disable-next-line:no-inferrable-types
            if (!this.isAlternado) {
                for (let i = 0; i < this.barChartData.length; i++) {
                    for (let f = 0; f < this.barChartData[i].data.length; f++) {
                        this.cores.push({
                            backgroundColor: this.util.cores[f],
                            borderColor: this.util.cores[f]
                        });
                        this.legendas.push({
                            cor: this.util.cores[f],
                            label:  this.labelsCustoms[f] + " - " + this.barChartData[i].label,
                            dado: this.barChartData[i].data[f]
                        });
                        this.total = Number(this.barChartData[i].data[f]) + Number(this.total);
                        this.isTotal = (this.total > 0);
                    }
                    this.legendas.sort((a, b) => {
                        if (a.label > b.label) {
                            return 1;
                        } else {
                            return -1;
                        }
                    });
                }
            } else {

            }
        }
    }

    public randomize(): void {
        // Only Change 3 values
        // tslint:disable-next-line:prefer-const
        let data = [
            Math.round(Math.random() * 100),
            59,
            80,
            Math.random() * 100,
            56,
            Math.random() * 100,
            40
        ];
        // tslint:disable-next-line:prefer-const
        let clone = JSON.parse(JSON.stringify(this.barChartData));
        clone[0].data = data;
        this.barChartData = clone;
    }
}
