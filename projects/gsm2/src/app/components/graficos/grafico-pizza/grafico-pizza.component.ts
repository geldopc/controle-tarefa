import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-grafico-pizza',
  templateUrl: './grafico-pizza.component.html'
})
export class GraficoPizzaComponent implements OnInit {

  @Input() titulocaixa: string = '';
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

  // Pie
  public pieChartLabels:string[] = this.labelsCustoms;
  public pieChartData:number[] = this.dadosCustoms;
  public pieChartType: string = 'pie';

  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

}
