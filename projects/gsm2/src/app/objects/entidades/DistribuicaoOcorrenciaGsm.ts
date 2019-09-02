import { Injectable } from '@angular/core';
import { OcorrenciaGsm } from './OcorrenciaGsm';
import { Usuario } from './Usuario';

@Injectable()
export class DistribuicaoOcorrenciaGsm {

    idOcorrenciaDistribuicao: number;
    cdOcorrencia: number;
    cdUsuarioAtendimento: String;
    dsUsuarioAtendimento: String;
    cdTipoTarefa: number;
    inStatus: String;
    dtDistribuicao: String;
    cdBranch: number;
    dsBranch: String;
    dsComentarioTecnico: String;
    dsSubmodalidade: String;
    dtprevisaoEntrega: Date;
    cdProduto: number;
    tipoTarefa: String;
    inTipo: string;
    inSigla: string;
    dtEncerramento: Date;
    usuarioAtendimento: Usuario;
    ocorrencia: OcorrenciaGsm;

    constructor() {

    }
}
