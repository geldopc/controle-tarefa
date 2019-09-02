
export class Parametros {
  dsNomeEmpresa: string;
  dsUf: string;
  dsSigla: string;
  dsEnderecoWs: string;
  dsPaginaInicial: string;
  caminhoRaizProjeto: string;
  cdPerfilEstabInspecao: number;
  cdPerfilProdutorPropEras: number;
  cdPerfilVetHabGta: number;
  cdPerfilEstabEmbalagensVazias: number;
  cdPerfilEstabComercialAgrotoxico: number;
  inPossuiPortalCorporativoMobile: boolean;
  inHabilitaArrecadacaoNf: boolean;
  inHabilitaControleArrecadacaoGtaRt: string;
  inHabilitaControleArrecadacaoGtaProd: string;
  inCobrancaGtaRtComoProdutor: string;
  cdPerfilFuncionarioSindicato: number;
  inObrigaGeoCadastroPropriedade: string;
  dataSincronismo: string;
  inAtivaArrecadacaoSefaz: boolean;

  constructor() {}

  init(
    dsUf: string,
    dsNomeEmpresa: string,
    dsSigla: string,
    cdPerfilEstabInspecao: number,
    cdPerfilProdutorPropEras: number,
    cdPerfilVetHabGta: number,
    inHabilitaControleArrecadacaoGtaRt: string,
    inHabilitaControleArrecadacaoGtaProd: string,
    dsSiteAutenticacaoEGtaSiapec: string,
    inCobrancaGtaRtComoProdutor: string,
    cdPerfilFuncionarioSindicato: number,
    dataSincronismo: string,
    inPossuiPortalCorporativoMobile: boolean
  ) {
    this.dsUf = dsUf;
    this.dsNomeEmpresa = dsNomeEmpresa;
    this.dsSigla = dsSigla;
    this.cdPerfilEstabInspecao = cdPerfilEstabInspecao;
    this.cdPerfilProdutorPropEras = cdPerfilProdutorPropEras;
    this.cdPerfilVetHabGta = cdPerfilVetHabGta;
    this.inHabilitaControleArrecadacaoGtaRt = inHabilitaControleArrecadacaoGtaRt;
    this.inHabilitaControleArrecadacaoGtaProd = inHabilitaControleArrecadacaoGtaProd;
    this.inCobrancaGtaRtComoProdutor = inCobrancaGtaRtComoProdutor;
    this.cdPerfilFuncionarioSindicato = cdPerfilFuncionarioSindicato;
    this.dataSincronismo = dataSincronismo;
  }
  get chave(): any {
    return this.dsUf;
  }
}
