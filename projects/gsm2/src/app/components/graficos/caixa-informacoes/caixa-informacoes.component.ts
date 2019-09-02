import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-caixa-informacoes',
  templateUrl: './caixa-informacoes.component.html'
})
export class CaixaInformacoesComponent implements OnInit {

  @Input() titulocaixa: string;
  @Input() tamanhocaixa: string;
  @Input() tamanhotexto: string;
  @Input() informacoes: Array<{ titulo: string, icone: string, dados: number }>;

  constructor() { }

  ngOnInit() {
  }




}
