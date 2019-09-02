import { Input, Output, EventEmitter } from '@angular/core';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-grafico-radar',
  templateUrl: './grafico-radar.component.html'
})
export class GraficoRadarComponent implements OnInit {

  @Input() titulocaixa: string;
  dados: Array<number>;
  labels: Array<string>
  
  constructor() { }

  ngOnInit() {
  }

  @Input() 
  get labelsCustoms(): Array<string>{
    return this.labels
  };
  
  @Output() labelsCustomsChange = new EventEmitter();
  @Output() dadosCustomsChange = new EventEmitter();
  
  set labelsCustoms(val) {
    this.labels = val;
    this.labelsCustomsChange.emit(this.labels);
  }

  @Input() 
  get dadosCustoms(): Array<number>{
    return this.dados;
  };
  
  set dadosCustoms(val) {
    console.log('dadosPizza, ', val)
    this.dados = val;
    this.dadosCustomsChange.emit(this.dados);
  }

  // PolarArea
  public polarAreaChartLabels: string[] = this.labelsCustoms;
  public polarAreaChartData: number[] = this.dadosCustoms;
  public polarAreaLegend: boolean = true;

  public polarAreaChartType: string = 'polarArea';

  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

}
