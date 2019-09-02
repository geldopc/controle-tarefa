import { Injectable } from '@angular/core';

@Injectable()
export class Formulario {

    serie: string;
    numero: string;

    constructor(serie: string, numero: string) {
        this.serie = serie;
        this.numero = numero;
    }

}
