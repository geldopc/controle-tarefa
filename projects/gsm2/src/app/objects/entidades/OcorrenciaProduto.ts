import { Injectable } from '@angular/core';

@Injectable()
export class OcorrenciaProduto {

  cdProduto: number;
  dsProdutoServico: string;
  dsSigla: string;
  cdAnalistaResponsavel: string;
  inHabilitaManutencao: number;
  idProdutoServico: number;

  constructor() {
    this.cdProduto = 0;
    this.dsProdutoServico = null;
    this.dsSigla = null;
    this.cdAnalistaResponsavel = null;
    this.inHabilitaManutencao = null;
    this.idProdutoServico = 0;
  }
}
