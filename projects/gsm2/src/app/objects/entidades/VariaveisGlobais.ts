
import { Injectable } from '@angular/core';
import { Estado } from './Estado';
import { Municipio } from './Municipio';
import { Usuario } from './Usuario';
import { EstadoProvider } from '../../providers/estadoLocal/EstadoProvider';
import { MunicipioProvider } from '../../providers/municipioLocal/MunicipioProvider';

@Injectable()
export class VariaveisGlobais {

    estados: Estado[];
    estadosSelecionados: Estado[];
    municipios: Municipio[];
    usuario: Usuario = null;
    contas: Usuario[];
    tipoCadastro: string;

    constructor(
      estadoProvider: EstadoProvider
      , municipioProvider: MunicipioProvider) {
        this.estados = estadoProvider.getEstados();
        this.municipios = municipioProvider.getMunicipios();

    }

    getEstados() {

    }



}
