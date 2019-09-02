import { Usuario } from "./Usuario";
import { Cliente } from "./Cliente";
import { FocalPoint } from "./FocalPoint";

export class GrupoGestor {

    idGrupoGestor: number;
    cdCliente: number;
    dsCliente: String;
    cdFiscalContrato: number;
    dsFiscalContrato: String;
    cdGerenteProjeto: number;
    dsGerenteProjeto: String;
    cdVeterinario: number;
    dsVeterinario: String;
    cdAgronomo: number;
    dsAgronomo: String;
    fiscalContrato: Usuario;
    gerenteProjeto: Usuario;
    veterinario: Usuario;
    agronomo: Usuario;
    cliente: Cliente;
    listFocalPoint: FocalPoint[];

    constructor() { }

}
