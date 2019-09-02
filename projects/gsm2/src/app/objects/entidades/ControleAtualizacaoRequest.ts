import { Injectable } from '@angular/core';

@Injectable()
export class ControleAtualizacao {
    idControleAtualizacaoTipoTarefa: number;
    inSucesso: Boolean;

    constructor() {}
}

@Injectable()
export class ControleAtualizacaoRequest {

    controleAtualizacao: Array<ControleAtualizacao>;

    constructor() {}

}
