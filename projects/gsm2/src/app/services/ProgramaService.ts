import { Injectable } from "@angular/core";
import { ProgramaProvider } from '../providers/ProgramaProvider';

@Injectable()
export class ProgramaService {

    constructor(
        private online: ProgramaProvider
    ) { }

    obterProgramas(): Promise<any[]> {
        return new Promise<any[]>((resolve, reject) => {
            this.online.obterProgramas()
            .then(resposta => {
                if (resposta.dados.codMsgResponse.startsWith("MR")) {
                    reject(resposta.dados);
                } else {
                    if (resposta.dados) {
                        resolve(resposta.dados.programas);
                    }
                }
            }).catch(err => {
                reject();
            });
        });
    }

}
