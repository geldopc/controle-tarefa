import { PersistenciaStorage } from './../../persistencia/PersistenciaStorage';
import { Storage } from '@ionic/storage';
import { IPersistenciaUsuario } from './IPersistenciaUsuario';
import { Usuario } from '../../objects/entidades/Usuario';

export class PersistenciaUsuarioStorage extends PersistenciaStorage<Usuario> implements IPersistenciaUsuario {

  constructor(protected storage: Storage) {
        super(storage, 'USUARIO_STORAGE');
    }

    // METODOS ADICIONOAIS AQUI
}
