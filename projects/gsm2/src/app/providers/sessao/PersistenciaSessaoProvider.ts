import { IPersistenciaSessao } from './IPersistenciaSessao';
import { Sessao } from './../../objects/entidades/Sessao';
import { Storage } from '@ionic/storage';
import { Injectable } from "@angular/core";
import { PersistenciaSessaoStorage } from './PersistenciaSessaoStorage';
import { PersistenciaGenerica } from '../../persistencia/PersistenciaGenerica';

@Injectable()
export class PersistenciaSessaoProvider
    extends PersistenciaGenerica<Sessao, IPersistenciaSessao>
    implements IPersistenciaSessao {

    constructor(private storage: Storage) {
      super();
    }

    criarPersistencia(tipo: string): IPersistenciaSessao {
        switch (tipo) {
            case 'sqlite':
                return new PersistenciaSessaoStorage(this.storage);
            default:
                throw new Error('Tipo de persistencia desconhecida: ' + tipo);
        }
    }
}
