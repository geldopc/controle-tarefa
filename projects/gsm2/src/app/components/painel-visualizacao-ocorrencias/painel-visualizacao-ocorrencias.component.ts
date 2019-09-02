import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { OcorrenciaGsm } from '../../objects/entidades/OcorrenciaGsm';
import { DistribuicaoOcorrenciaGsm } from '../../objects/entidades/DistribuicaoOcorrenciaGsm';
import { FiltrosPesquisa } from 'projects/gsm2/src/app/components/filtros-pesquisa-tecnico/filtros-pesquisa-tecnico.component';

@Component({
  selector: 'painel-visualizacao-ocorrencias',
  templateUrl: './painel-visualizacao-ocorrencias.component.html',
  styleUrls: ['./painel-visualizacao-ocorrencias.component.scss']
})
export class PainelVisualizacaoOcorrenciasComponent implements OnInit {

    angmobile: DistribuicaoOcorrenciaGsm[] = [];
    percAngmobile: any;
    angweb: DistribuicaoOcorrenciaGsm[] = [];
    angWebGuiaUso: DistribuicaoOcorrenciaGsm[] = [];
    angWebFiscalizacao: DistribuicaoOcorrenciaGsm[] = [];
    angWebAtend: DistribuicaoOcorrenciaGsm[] = [];
    angWebBi: DistribuicaoOcorrenciaGsm[] = [];
    percAngweb: any;
    angportaldeservicos: DistribuicaoOcorrenciaGsm[] = [];
    percAngportaldeservicos: any;
    java: DistribuicaoOcorrenciaGsm[] = [];
    percJava: any;
    banco: DistribuicaoOcorrenciaGsm[] = [];
    percBanco: any;
    wi: DistribuicaoOcorrenciaGsm[] = [];
    percWi: any;
    listAguardAt: any = [];
    listAguardDist: any[] = [];
    listAguardViab: any[] = [];
    listDesenvolvimento: any[] = [];
    listHomoBeta: any[] = [];
    listHomoCliente: any[] = [];
    listGerandoVersaoAlfa: any[] = [];
    listHomologacaoAlfa: any[] = [];
    listAguardBeta: any[] = [];
    listGerandoVersaoBeta: any[] = [];
    listTecnico: {nome: String, qtd: number}[] = [];
    listProduto: {nome: String, qtd: number}[] = [];
    listCliente: {nome: String, qtd: number}[] = [];
    listAguardProd: any[] = [];
    listFuncionalidade: any[] = [];
    total = 0;
    totalTipos: { titulo: String, qtd: Number }[] = [];
    @Input() ocorrencias: OcorrenciaGsm[];
    @Input() filtros: FiltrosPesquisa;
    private _totalDistribuicao = 0;
    private _totalOcorrencias = 0;
    @Output() totalDistribuicaoChange: EventEmitter<any> = new EventEmitter<any>();
    @Output() totalOcorrenciasChange: EventEmitter<any> = new EventEmitter<any>();
    usuarioAtendimento: string;

    constructor() {
        // console.log('PainelVisualizacaoOcorrenciasComponent/constructor...', this);
    }

    limpar() {
        this.totalDistribuicao = 0;
        this.angmobile = [];
        this.percAngmobile = 0;
        this.angweb = [];
        this.angWebAtend = [];
        this.angWebBi = [];
        this.angWebGuiaUso = [];
        this.angWebFiscalizacao = [];
        this.percAngweb = 0;
        this.angportaldeservicos = [];
        this.percAngportaldeservicos = 0;
        this.java = [];
        this.percJava = 0;
        this.banco = [];
        this.percBanco = 0;
        this.wi = [];
        this.percWi = 0;
        this.listAguardAt = [];
        this.listAguardDist = [];
        this.listAguardViab = [];
        this.listDesenvolvimento = [];
        this.listHomoBeta = [];
        this.listHomoCliente = [];
        this.listGerandoVersaoAlfa = [];
        this.listHomologacaoAlfa = [];
        this.listAguardBeta = [];
        this.listGerandoVersaoBeta = [];
        this.listTecnico = [];
        this.listProduto = [];
        this.listCliente = [];
        this.listAguardProd = [];
        this.listFuncionalidade = [];
    }

    ngOnInit(): void {
        this.limpar();
        this.usuarioAtendimento = this.filtros['cpfUsuario'];
        const distro:  Array<DistribuicaoOcorrenciaGsm> = [];
        if (this.ocorrencias && this.ocorrencias.length > 0) {
            this.totalOcorrencias = this.ocorrencias.length;

            this.ocorrencias.forEach(o => {
                if (o.distribuicoes && o.distribuicoes.length) {
                    o.distribuicoes.forEach(d => {
                        let statusSelecionado = (o.inStatus === "DE") ?  d.inStatus !== "F" : true;
                        // console.log("d.inSigla:: " + JSON.stringify(d));
                        if (d.inSigla === 'AM' && (this.usuarioAtendimento && d.cdUsuarioAtendimento === this.usuarioAtendimento) && statusSelecionado) {
                            this.angmobile.push(d);
                            distro.push(d);
                        } else if (d.inSigla === 'AB' && (this.usuarioAtendimento && d.cdUsuarioAtendimento === this.usuarioAtendimento) && statusSelecionado) {
                            this.angWebBi.push(d);
                            distro.push(d);
                        } else if (d.inSigla === 'AC' && (this.usuarioAtendimento && d.cdUsuarioAtendimento === this.usuarioAtendimento) && statusSelecionado) {
                            this.angWebAtend.push(d);
                            distro.push(d);
                        } else if (d.inSigla === 'AW' && (this.usuarioAtendimento && d.cdUsuarioAtendimento === this.usuarioAtendimento) && statusSelecionado) {
                            this.angweb.push(d);
                            distro.push(d);
                        } else if (d.inSigla === 'AG' && (this.usuarioAtendimento && d.cdUsuarioAtendimento === this.usuarioAtendimento) && statusSelecionado) {
                            this.angWebGuiaUso.push(d);
                            distro.push(d);
                        } else if (d.inSigla === 'AF' && (this.usuarioAtendimento && d.cdUsuarioAtendimento === this.usuarioAtendimento) && statusSelecionado) {
                            this.angWebFiscalizacao.push(d);
                            distro.push(d);
                        } else if (d.inSigla === 'AP' && (this.usuarioAtendimento && d.cdUsuarioAtendimento === this.usuarioAtendimento) && statusSelecionado) {
                            this.angportaldeservicos.push(d);
                            distro.push(d);
                        } else if (d.inSigla === 'JA' && (this.usuarioAtendimento && d.cdUsuarioAtendimento === this.usuarioAtendimento) && statusSelecionado) {
                            this.java.push(d);
                            distro.push(d);
                        } else if (d.inSigla === 'BD' && (this.usuarioAtendimento && d.cdUsuarioAtendimento === this.usuarioAtendimento) && statusSelecionado) {
                            this.banco.push(d);
                            distro.push(d);
                        } else if (d.inSigla === 'WI' && (this.usuarioAtendimento && d.cdUsuarioAtendimento === this.usuarioAtendimento) && statusSelecionado) {
                            this.wi.push(d);
                            distro.push(d);
                        } else if (this.usuarioAtendimento === null) {
                            if (d.inSigla === 'AM'  && statusSelecionado) {
                                this.angmobile.push(d);
                                distro.push(d);
                            } else if (d.inSigla === 'AB'  && statusSelecionado) {
                                this.angWebBi.push(d);
                                distro.push(d);
                            } else if (d.inSigla === 'AC'  && statusSelecionado) {
                                this.angWebAtend.push(d);
                                distro.push(d);
                            } else if (d.inSigla === 'AW'  && statusSelecionado) {
                                this.angweb.push(d);
                                distro.push(d);
                            } else if (d.inSigla === 'AG'  && statusSelecionado) {
                                this.angWebGuiaUso.push(d);
                                distro.push(d);
                            } else if (d.inSigla === 'AF'  && statusSelecionado) {
                                this.angWebFiscalizacao.push(d);
                                distro.push(d);
                            } else if (d.inSigla === 'AP'  && statusSelecionado) {
                                this.angportaldeservicos.push(d);
                                distro.push(d);
                            } else if (d.inSigla === 'JA'  && statusSelecionado) {
                                this.java.push(d);
                                distro.push(d);
                            } else if (d.inSigla === 'BD'  && statusSelecionado) {
                                this.banco.push(d);
                                distro.push(d);
                            } else if (d.inSigla === 'WI'  && statusSelecionado) {
                                this.wi.push(d);
                                distro.push(d);
                            }
                        }
                    });
                }
            });
            this.totalDistribuicao = distro.length;
            this.percAngmobile = String((this.angmobile.length > 0) ? Number(this.angmobile.length / distro.length * 100).toFixed(2) : 0) + "%";
            this.percAngweb = String((this.angweb.length > 0) ? Number(this.angweb.length / distro.length * 100).toFixed(2) : 0) + "%";
            this.percAngportaldeservicos = String((this.angportaldeservicos.length > 0) ? Number(this.angportaldeservicos.length / distro.length * 100).toFixed(2) : 0) + "%";
            this.percJava = String((this.java.length > 0) ? Number(this.java.length / distro.length * 100).toFixed(2) : 0) + "%";
            this.percBanco = String((this.banco.length > 0) ? Number(this.banco.length / distro.length * 100).toFixed(2) : 0) + "%";
            this.percWi = String((this.wi.length > 0) ? Number(this.wi.length / distro.length * 100).toFixed(2) : 0) + "%";
        }
    }

    @Input()
    get totalDistribuicao(){
        return this._totalDistribuicao;
    }

    set totalDistribuicao(value: any){
        this._totalDistribuicao = value;
        this.totalDistribuicaoChange.emit(value);
    }
    @Input()
    get totalOcorrencias(){
        return this._totalOcorrencias;
    }

    set totalOcorrencias(value: any){
        this._totalOcorrencias = value;
        this.totalOcorrenciasChange.emit(value);
    }

    // tslint:disable-next-line:use-life-cycle-interface
    ngDoCheck() {
        // console.log("View ngDoCheck", this);
        this.limpar();
        this.usuarioAtendimento = this.filtros['cpfUsuario'];
        const distro:  Array<DistribuicaoOcorrenciaGsm> = [];
        if (this.ocorrencias && this.ocorrencias.length > 0) {
            this.totalOcorrencias = this.ocorrencias.length;
            this.ocorrencias.forEach(o => {
                if (o) {
                    if (o.inStatus === "AA") {
                        this.listAguardAt.push(o);
                    } else if (o.inStatus === "AD") {
                        this.listAguardDist.push(o);
                    } else if (o.inStatus === "AV") {
                        this.listAguardViab.push(o);
                    } else if (o.inStatus === "DE") {
                        this.listDesenvolvimento.push(o);
                    }  else if (o.inStatus === "VA") {
                        this.listGerandoVersaoAlfa.push(o);
                    } else if (o.inStatus === "HA") {
                        this.listHomologacaoAlfa.push(o);
                    } else if (o.inStatus === "AB") {
                        this.listAguardBeta.push(o);
                    } else if (o.inStatus === "VB") {
                        this.listGerandoVersaoBeta.push(o);
                    } else if (o.inStatus === "HB") {
                        this.listHomoBeta.push(o);
                    } else if (o.inStatus === "HC") {
                        this.listHomoCliente.push(o);
                    } else if (o.inStatus === "AP") {
                        this.listAguardProd.push(o);
                    }
                    if (o && o.dsProduto) {
                        let userProduto = this.listProduto.find(t => t.nome === o.dsProduto.split(" ")[0]);
                        if (userProduto) {
                            userProduto.qtd++;
                        } else {
                            this.listProduto.push({nome: o.dsProduto.split(" ")[0], qtd: 1});
                        }
                        this.listProduto.sort();
                        let userCliente = this.listCliente.find(t => t.nome === o.dsCliente);
                        if (userCliente) {
                            userCliente.qtd++;
                        } else {
                            this.listCliente.push({nome: o.dsCliente, qtd: 1});
                        }
                        this.listCliente.sort();
                        let userFuncionalidade = this.listFuncionalidade.find(t => t.nome === o.dsFuncionalidade);
                        if (userFuncionalidade) {
                            userFuncionalidade.qtd++;
                        } else {
                            this.listFuncionalidade.push({nome: o.dsFuncionalidade, qtd: 1});
                        }
                        this.listFuncionalidade.sort();
                    }
                    if (o && o.distribuicoes && o.distribuicoes.length) {
                        o.distribuicoes.forEach(d => {
                            // console.log("TEM USUARIO", this);
                            if (d) {
                                let statusSelecionado = o.inStatus === "DE" ? d.inStatus !== "F" : true;
                                if (this.usuarioAtendimento) {
                                    if (d.inSigla === 'AM' && d.cdUsuarioAtendimento === this.usuarioAtendimento && statusSelecionado) {
                                        this.angmobile.push(d);
                                        distro.push(d);
                                    } else if (d.inSigla === 'AB' && (this.usuarioAtendimento && d.cdUsuarioAtendimento === this.usuarioAtendimento) && statusSelecionado) {
                                        this.angWebBi.push(d);
                                        distro.push(d);
                                    } else if (d.inSigla === 'AC' && (this.usuarioAtendimento && d.cdUsuarioAtendimento === this.usuarioAtendimento) && statusSelecionado) {
                                        this.angWebAtend.push(d);
                                        distro.push(d);
                                    } else if (d.inSigla === 'AW' && (this.usuarioAtendimento && d.cdUsuarioAtendimento === this.usuarioAtendimento) && statusSelecionado) {
                                        this.angweb.push(d);
                                        distro.push(d);
                                    } else if (d.inSigla === 'AG' && (this.usuarioAtendimento && d.cdUsuarioAtendimento === this.usuarioAtendimento) && statusSelecionado) {
                                        this.angWebGuiaUso.push(d);
                                        distro.push(d);
                                    } else if (d.inSigla === 'AF' && (this.usuarioAtendimento && d.cdUsuarioAtendimento === this.usuarioAtendimento) && statusSelecionado) {
                                        this.angWebFiscalizacao.push(d);
                                        distro.push(d);
                                    } else if (d.inSigla === 'AP' && d.cdUsuarioAtendimento === this.usuarioAtendimento && statusSelecionado) {
                                        this.angportaldeservicos.push(d);
                                        distro.push(d);
                                    } else if (d.inSigla === 'JA' && d.cdUsuarioAtendimento === this.usuarioAtendimento && statusSelecionado) {
                                        this.java.push(d);
                                        distro.push(d);
                                    } else if (d.inSigla === 'BD' && d.cdUsuarioAtendimento === this.usuarioAtendimento && statusSelecionado) {
                                        this.banco.push(d);
                                        distro.push(d);
                                    } else if (d.inSigla === 'WI' && d.cdUsuarioAtendimento === this.usuarioAtendimento && statusSelecionado) {
                                        this.wi.push(d);
                                        distro.push(d);
                                    }
                                } else {
                                    // console.log("NAO TEM USUARIO", this);
                                    if (d.inSigla === 'AM'  && statusSelecionado) {
                                        this.angmobile.push(d);
                                        distro.push(d);
                                    } else if (d.inSigla === 'AB'  && statusSelecionado) {
                                        this.angWebBi.push(d);
                                        distro.push(d);
                                    } else if (d.inSigla === 'AC'  && statusSelecionado) {
                                        this.angWebAtend.push(d);
                                        distro.push(d);
                                    } else if (d.inSigla === 'AW'  && statusSelecionado) {
                                        this.angweb.push(d);
                                        distro.push(d);
                                    } else if (d.inSigla === 'AG'  && statusSelecionado) {
                                        this.angWebGuiaUso.push(d);
                                        distro.push(d);
                                    } else if (d.inSigla === 'AF'  && statusSelecionado) {
                                        this.angWebFiscalizacao.push(d);
                                        distro.push(d);
                                    }  else if (d.inSigla === 'AP'  && statusSelecionado) {
                                        this.angportaldeservicos.push(d);
                                        distro.push(d);
                                    } else if (d.inSigla === 'JA'  && statusSelecionado) {
                                        this.java.push(d);
                                        distro.push(d);
                                    } else if (d.inSigla === 'BD'  && statusSelecionado) {
                                        this.banco.push(d);
                                        distro.push(d);
                                    } else if (d.inSigla === 'WI'  && statusSelecionado) {
                                        this.wi.push(d);
                                        distro.push(d);
                                    }
                                }
                                if (d.dsUsuarioAtendimento && statusSelecionado) {
                                    let user = this.listTecnico.find(t => t.nome === d.dsUsuarioAtendimento.split(" ")[0]);
                                    if (user) {
                                        user.qtd++;
                                    } else {
                                        this.listTecnico.push({nome: d.dsUsuarioAtendimento.split(" ")[0], qtd: 1});
                                    }
                                    this.listTecnico.sort();
                                }
                            }
                        });
                    }
                }
            });
            this.totalDistribuicao = distro.length ;
            this.percAngmobile = String((this.angmobile.length > 0) ? Number(this.angmobile.length / distro.length * 100).toFixed(2) : 0) + "%";
            this.percAngweb = String((this.angweb.length > 0) ? Number(this.angweb.length / distro.length * 100).toFixed(2) : 0) + "%";
            this.percAngportaldeservicos = String((this.angportaldeservicos.length > 0) ? Number(this.angportaldeservicos.length / distro.length * 100).toFixed(2) : 0) + "%";
            this.percJava = String((this.java.length > 0) ? Number(this.java.length / distro.length * 100).toFixed(2) : 0) + "%";
            this.percBanco = String((this.banco.length > 0) ? Number(this.banco.length / distro.length * 100).toFixed(2) : 0) + "%";
            this.percWi = String((this.wi.length > 0) ? Number(this.wi.length / distro.length * 100).toFixed(2) : 0) + "%";
        }
    }

    public calcularPercentual(ocorrencias: Array<OcorrenciaGsm> = [], cdUsuarioAtend: string) {
        this.angmobile = [];
            this.angweb = [];
            this.angportaldeservicos = [];
            this.java = [];
            this.banco = [];
            this.wi = [];

        const distro:  Array<DistribuicaoOcorrenciaGsm> = [];

        ocorrencias.forEach((oc) => {

            if (oc.distribuicoes) {
                oc.distribuicoes.forEach((d: DistribuicaoOcorrenciaGsm) => {
                    let statusSelecionado = (oc.inStatus === "DE") ?  d.inStatus !== "F" : true;
                    if (d.inSigla === 'AM' && d.cdUsuarioAtendimento === cdUsuarioAtend && statusSelecionado) {
                        this.angmobile.push(d);
                    } else if (d.inSigla === 'AW' && d.cdUsuarioAtendimento === cdUsuarioAtend && statusSelecionado) {
                        this.angweb.push(d);
                    } else if (d.inSigla === 'AP' && d.cdUsuarioAtendimento === cdUsuarioAtend && statusSelecionado) {
                        this.angportaldeservicos.push(d);
                    } else if (d.inSigla === 'JA' && d.cdUsuarioAtendimento === cdUsuarioAtend && statusSelecionado) {
                        this.java.push(d);
                    } else if (d.inSigla === 'BD' && d.cdUsuarioAtendimento === cdUsuarioAtend && statusSelecionado) {
                        this.banco.push(d);
                    } else if (d.inSigla === 'WI' && d.cdUsuarioAtendimento === cdUsuarioAtend && statusSelecionado) {
                        this.wi.push(d);
                    }

                    distro.push(d);
                });
            }

        });
        this.percAngmobile = String((this.angmobile.length > 0) ? Number(this.angmobile.length / distro.length * 100).toFixed(2) : 0) + "%";
        this.percAngweb = String((this.angweb.length > 0) ? Number(this.angweb.length / distro.length * 100).toFixed(2) : 0) + "%";
        this.percAngportaldeservicos = String((this.angportaldeservicos.length > 0) ? Number(this.angportaldeservicos.length / distro.length * 100).toFixed(2) : 0) + "%";
        this.percJava = String((this.java.length > 0) ? Number(this.java.length / distro.length * 100).toFixed(2) : 0) + "%";
        this.percBanco = String((this.banco.length > 0) ? Number(this.banco.length / distro.length * 100).toFixed(2) : 0) + "%";
        this.percWi = String((this.wi.length > 0) ? Number(this.wi.length / distro.length * 100).toFixed(2) : 0) + "%";


      this.total = this.angmobile.length + this.angweb.length + this.angportaldeservicos.length + this.java.length + this.banco.length + this.wi.length;

      // captura o nome das tecnologias e a quantidade
      this.totalTipos = [];

    }

}
