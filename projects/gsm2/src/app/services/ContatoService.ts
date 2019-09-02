import { Injectable } from "@angular/core";
import { ContatoCadastro } from 'src/app/objects/entidades/Contato';
import { ContatoProvider } from '../providers/ContatoProvider';
import { Util } from './util/Util';

@Injectable()
export class ContatoService {

  newobjeto = new ContatoCadastro;

  constructor(private online: ContatoProvider, private util: Util) {}


  public enviarContato(newobjeto: ContatoCadastro): Promise<any> {
    return new Promise<any>((resolve, reject) => {
        this.online.enviar(this.converterContato(newobjeto))
            .then(resposta => {
                if (String(resposta.dados.codMsgResponse).startsWith('MR')) {
                    reject(resposta.dados);
                } else {
                    resolve(resposta.dados);
                }
            }).catch(erro => {
                reject();
                // tslint:disable-next-line:no-console
                console.info(erro);
            });
    });
}

private converterContato(newobjeto: ContatoCadastro): string {
  return JSON.stringify({

      dsNome: newobjeto.dsNome,
      dsEmail: newobjeto.dsEmail,
      dsTelefone: newobjeto.nrTelefone,
      dsMensagem: newobjeto.dsMensagem,
      dsAssunto: newobjeto.dsAssunto
  });
}

}
