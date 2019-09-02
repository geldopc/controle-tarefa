import { GrupoGestor } from "./GrupoGestor";
import { Usuario } from "./Usuario";
import { Programa } from "./Programa";
import { KeyUser } from "./KeyUser";

export class FocalPoint {

    idFocalPoint: number;
    cdPrograma: number;
    cdGerentePrograma: number;
    cdGrupoGestor: number;
    grupoGestor: GrupoGestor;
    gerentePrograma: Usuario;
    programa: Programa;
    tipo: string;
    listKeyUser: KeyUser[];

    constructor() { }

}
