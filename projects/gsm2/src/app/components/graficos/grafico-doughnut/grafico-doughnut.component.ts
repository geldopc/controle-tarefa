import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Util } from '../../../services/util/Util';

@Component({
  selector: 'app-grafico-doughnut',
  templateUrl: './grafico-doughnut.component.html',
  styleUrls: ['./grafico-doughnut.component.scss']
})
export class GraficoDoughnutComponent {

  @Input() titulocaixa: string;
  dados: Array<number>;
  labels: Array<string>;
  cores: Array<any> = [];
  legendas: Array<any> = [];

  constructor(private util: Util) {
      this.cores.push({backgroundColor: this.util.cores});
  }



  @Output() labelsCustomsChange = new EventEmitter();
  @Output() dadosCustomsChange = new EventEmitter();
  @Output() selecionadoChange = new EventEmitter();

  @Input()
  get labelsCustoms(): Array<string> {
    return this.labels;
  }

  set labelsCustoms(val) {
    this.labels = val;
    this.labelsCustomsChange.emit(this.labels);
  }

  @Input()
  get dadosCustoms(): Array<number> {
    this.preencherLegenda();
    return this.dados;
  }

  set dadosCustoms(val) {
    this.dados = val;
    this.dadosCustomsChange.emit(this.dados);
  }

  //  Doughnut
  public doughnutChartLabels: string[] = this.labelsCustoms;
  public doughnutChartData: number[] = this.dadosCustoms;
  public doughnutChartType: String = 'doughnut';
  public total: Number = 0;

  //  events
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
    if (this.legendas.length === 0 && this.dados) {
      // tslint:disable-next-line:no-inferrable-types

      for (let i = 0; i < this.dados.length; i++) {
        this.cores.push({ backgroundColor: this.util.cores[i], borderColor:  this.util.cores[i] });
        this.legendas.push({ cor: this.util.cores[i], label: this.labels[i], dado: this.dados[i] });
        this.total = Number(this.dados[i]) + Number(this.total);
      }
    }
  }

}
