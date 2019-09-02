
export class Estado {

    nrCodigoIbge: string;
    dsEnderecoWs: string;
    dsEstado: string;
    dsUF: string;
    bandeira: string;

    constructor(dsEnderecoWs?: string, dsEstado?: string, dsUf?: string, bandeira?: string) {
        this.dsEnderecoWs = dsEnderecoWs;
        this.dsEstado = dsEstado;
        this.dsUF = dsUf;
        this.bandeira = bandeira;
    }

    get chave() {
        return this.dsUF;
    }

    toString(): string {
        return JSON.stringify(this);
    }
}
