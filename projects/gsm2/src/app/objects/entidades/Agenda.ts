import { DistribuicaoOcorrenciaGsm } from "./DistribuicaoOcorrenciaGsm";

export class Agenda {

    idAgenda: number;
    cdOcorrenciaDistribuicao: number;
    descricao: string;
    dtInicio: Date;
    dtFim: Date;
    distribuicao: DistribuicaoOcorrenciaGsm;

    constructor() { }
}
