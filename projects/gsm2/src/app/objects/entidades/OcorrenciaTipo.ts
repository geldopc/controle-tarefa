import { Injectable } from '@angular/core';

@Injectable()
export class OcorrenciaTipo {

  idTipoOcorrencia: number;
  dsTipoOcorrencia: string;
  inAtivo: Boolean;
  cdProdutoServico: number;
  inDesenvolvimento: Boolean;
  cdNivelSeveridade: number;
  nrOrdem: number;

  constructor() {
    this.idTipoOcorrencia = 0;
    this.dsTipoOcorrencia = null;
    this.cdProdutoServico = 0;
    this.inAtivo = null;
    this.cdNivelSeveridade = null;
    this.cdProdutoServico = null;
    this.inDesenvolvimento = null;
    this.nrOrdem = null;
  }
}
