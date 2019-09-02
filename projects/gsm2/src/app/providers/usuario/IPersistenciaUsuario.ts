import { Usuario } from '../../objects/entidades/Usuario';
import { IPersistencia } from '../../persistencia/IPersistencia';

export interface IPersistenciaUsuario extends IPersistencia<Usuario> {
    // METODOS ADICIONAIS AQUI
}
