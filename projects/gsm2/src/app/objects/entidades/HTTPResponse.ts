export class HTTPResponse {

    status: number;
    dados: any;
    headers: any;
    error: string;

    constructor(status?: number, dados?: any, headers?: any, error?: string) {
        this.status = status;
        this.dados = dados;
        this.headers = headers;
        this.error = error;
     }
}