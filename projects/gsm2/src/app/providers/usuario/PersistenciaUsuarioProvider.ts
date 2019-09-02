import { IPersistenciaUsuario } from './IPersistenciaUsuario';
import { PersistenciaUsuarioStorage } from './PersistenciaUsuarioStorage';
import { Storage } from '@ionic/storage';
import { Injectable } from "@angular/core";
import { PersistenciaGenerica } from '../../persistencia/PersistenciaGenerica';
import { Usuario } from '../../objects/entidades/Usuario';

@Injectable()
export class PersistenciaUsuarioProvider
    extends PersistenciaGenerica<Usuario, IPersistenciaUsuario>
    implements IPersistenciaUsuario {

    constructor(private storage: Storage) {
        super();
    }

    criarPersistencia(tipo: string): IPersistenciaUsuario {
        switch (tipo) {
            case 'storage':
                return new PersistenciaUsuarioStorage(this.storage);
            default:
                throw new Error('Não há implementação para o provider: ' + tipo);
        }
    }
}
