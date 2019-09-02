import { Input, Output, EventEmitter } from '@angular/core';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-grafico-dinamico',
  templateUrl: './grafico-dinamico.component.html'
})
export class GraficoDinamicoComponent implements OnInit {

  @Input() titulocaixa: string;
  labelsChar: Array<string>;
  labelsPie: Array<string>;
  dadosChar: Array<number>;
  dadosPie: Array<number>;

  @Output() labelsCharCustomsChange = new EventEmitter();
  @Output() labelsPieCustomsChange = new EventEmitter();
  @Output() dadosCharCustomsChange = new EventEmitter();
  @Output() dadosPieCustomsChange = new EventEmitter();


  public lineChartData: Array<any> = this.dadosCharCustoms;
  public lineChartLabels: Array<any> = this.labelsCharCustoms;
  public lineChartType: String = 'line';
  public pieChartType: String = 'pie';
  public lineChartOptions: any = {
    responsive: true
  };

  // Pie
  public pieChartLabels: string[] = this.labelsPieCustoms;
  public pieChartData: number[] = this.dadosPieCustoms;

  constructor() { }

  ngOnInit() {
  }

  @Input()
  get labelsCharCustoms(): Array<string> {
    return this.labelsChar;
  }

  @Input()
  get labelsPieCustoms(): Array<string> {
    return this.labelsPie;
  }

  set labelsCharCustoms(val) {
    this.labelsChar = val;
    this.labelsCharCustomsChange.emit(this.labelsChar);
  }

  set labelsPieCustoms(val) {
    this.labelsPie = val;
    this.labelsPieCustomsChange.emit(this.labelsPie);
  }


  @Input()
  get dadosCharCustoms(): Array<number> {
    return this.dadosChar;
  }

  set dadosCharCustoms(val) {
    console.log('dadosDinamicosChar, ', val);
    this.dadosChar = val;
    this.dadosCharCustomsChange.emit(this.dadosChar);
  }

  @Input()
  get dadosPieCustoms(): Array<number> {
    return this.dadosPie;
  }

  set dadosPieCustoms(val) {
    console.log('dadosDinamicosPie, ', val);
    this.dadosPie = val;
    this.dadosPieCustomsChange.emit(this.dadosPie);
  }
  // lineChart
  // public lineChartData:Array<any> = [
  //   [65, 59, 80, 81, 56, 55, 40],
  //   [28, 48, 40, 19, 86, 27, 90]
  // ];

  public randomizeType(): void {
    this.lineChartType = this.lineChartType === 'line' ? 'bar' : 'line';
    this.pieChartType = this.pieChartType === 'doughnut' ? 'pie' : 'doughnut';
  }

  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }
}
