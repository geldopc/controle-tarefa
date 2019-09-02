import { Util } from './util/Util';
import { GerenciadorSessao } from './util/GerenciadorSessao';
import { Injectable } from "@angular/core";
import { TrabalheConoscoProvider } from '../providers/TrabalheConoscoProvider';
import { TrabalheConosco } from 'src/app/objects/entidades/TabalheConosco';
// import { DocumentoPreCadastro } from 'src/app/objects/entidades/DocumentoPreCadastro';
// import { DocumentoObrigatorio } from 'src/app/objects/entidades/DocumentoObrigatorio';


@Injectable()
export class TrabalheConoscoService {

  private base64Image: any;
  // documentoObrigatorioPreCadastros: DocumentoObrigatorio[];
  // documentos: DocumentoPreCadastro[];
  newobjeto = new TrabalheConosco;

  constructor(private online: TrabalheConoscoProvider,
              private util: Util) {}

  public enviarTrabalheConosco(newobjeto: TrabalheConosco): Promise<any> {
    return new Promise<any>((resolve, reject) => {
        this.online.enviar(this.converterTrabalheConosco(newobjeto))
            .then(resposta => {
                if (String(resposta.dados.codMsgResponse).startsWith('MR')) {
                    reject(resposta.dados.msgResponse);
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

private converterTrabalheConosco(newobjeto: TrabalheConosco): string {
  return JSON.stringify({
      dsNome: newobjeto.dsNome,
      dsEmail: newobjeto.dsEmail,
      dsTelefone: newobjeto.nrTelefoneCelular,
      dsCelular: newobjeto.nrTelefoneResidencial,
      dsFormacao: newobjeto.dsFormacao,
      dsMunicipio: newobjeto.dsCidade,
      dsEstado: newobjeto.dsSiglaEstado,
      upCurriculo: newobjeto.curriculoAnexado
  });
}


}
