import { IPersistenciaSessao } from './IPersistenciaSessao';
import { PersistenciaStorage } from './../../persistencia/PersistenciaStorage';
import { Storage } from '@ionic/storage';
import { Sessao } from '../../objects/entidades/Sessao';

export class PersistenciaSessaoStorage extends PersistenciaStorage<Sessao> implements IPersistenciaSessao {

    constructor(storage: Storage) {
        super(storage, 'SESSAO_STORAGE');
    }
}
