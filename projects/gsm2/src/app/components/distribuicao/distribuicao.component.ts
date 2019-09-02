import { DistribuicaoOcorrenciaGsm } from './../../objects/entidades/DistribuicaoOcorrenciaGsm';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LoadingController } from 'ionic-angular';
import * as $ from 'jquery';
import { Tuple } from 'projects/gsm2/src/app/objects/entidades/Tuple';
import { Usuario } from 'projects/gsm2/src/app/objects/entidades/Usuario';
import { OcorrenciaGsmService } from 'projects/gsm2/src/app/services/OcorrenciaGsmService';
import { OcorrenciaProdutoService } from 'projects/gsm2/src/app/services/OcorrenciaProdutoService';
import { OcorrenciaTipoService } from 'projects/gsm2/src/app/services/OcorrenciaTipoService';
import { Util } from 'projects/gsm2/src/app/services/util/Util';
import { GerenciadorSessao } from '../../services/util/GerenciadorSessao';
import { SmAlertController } from '../sm-alert-controller/sm-alert-controller.component';
import { AppGsmModule } from './../../app.gsm.module';
import { OcorrenciaGsm } from './../../objects/entidades/OcorrenciaGsm';
import { FiltrosPesquisa, FiltrosPesquisaTecnicoComponent } from './../filtros-pesquisa-tecnico/filtros-pesquisa-tecnico.component';
@Component({
    selector: 'distribuicao',
    templateUrl: './distribuicao.component.html',
    styleUrls: ['./distribuicao.component.scss']
})
export class DistribuicaoComponent implements OnInit {

    filtros: FiltrosPesquisa = new FiltrosPesquisa();
    @Input() ocorrenciaGsm: OcorrenciaGsm;
    // Modal Distribuição

    branches: {valor: string, codigo: number}[];
    branchesTemp: any[];
    branch: any = {valor: "Novo branch..", codigo: 0};
    // ocorrenciaGsm: OcorrenciaGsm = new OcorrenciaGsm();
    distribuicao: DistribuicaoOcorrenciaGsm;
    listFuncionarioTarefa: Usuario[];
    listUsuarioDtPrevisao: {id: String, datas: Date[]}[];
    modalidades: Array<{"codigo": number, "valor": string, "tipo": string, "sigla": string}> = [];
    funcionarioTarefa: Usuario = new Usuario();
    listFuncionariosSm: Usuario[] = new Array<Usuario>();
    usuarioLogado: Usuario = new Usuario();

    @Output() carregarGridChange: EventEmitter<string> = new EventEmitter<string>();

    @Input()
    public modoGravacao: boolean;
    @Input()
    public filtrosPesquisaTecnico: FiltrosPesquisaTecnicoComponent;

    constructor(
        private util: Util,
        private smAlert: SmAlertController,
        private ocorrenciaGsmService: OcorrenciaGsmService,
        private ocorrenciaProdutoService: OcorrenciaProdutoService,
        private ocorrenciaTipoService: OcorrenciaTipoService,
        private loadingCtrl: LoadingController,
    ) {
        this.filtros = new FiltrosPesquisa();
        this.usuarioLogado = GerenciadorSessao.sessao.usuario;
        this.ocorrenciaGsm = new OcorrenciaGsm();
        this.distribuicao = new DistribuicaoOcorrenciaGsm();
        this.ocorrenciaProdutoService.obterUsuarios().then(resposta => {
            resposta.forEach(item => {
                this.listFuncionariosSm.push(item);
            });
        });
    }

    ngOnInit() {
        this.obterModalidadeDesenvolvimento();
        this.obterUsuarios();
        this.modoGravacao = true;
    }

    obterUsuarios() {
        this.ocorrenciaProdutoService.obterUsuarios().then(resposta => {
            this.listFuncionarioTarefa = resposta;
        });
    }

    obterModalidadeDesenvolvimento() {
        this.ocorrenciaTipoService
            .obterModalidadeDesenvolvimento(null)
            .then(resposta => {
                let front;
                front = resposta.filter(
                    filtro =>
                        filtro.tipo === "FE" ||
                        filtro.tipo === "BE" ||
                        filtro.tipo === "BD" &&
                        filtro.codigo !== 2 || filtro.codigo !== 505
                );
                front.forEach(frontEnd => {
                    this.modalidades.push(frontEnd);
                });
            })
            .then(() => {});
    }

    tarefaIniciadaDesenv(distribuicao: DistribuicaoOcorrenciaGsm) {
        return distribuicao && (distribuicao.inStatus === 'I' && distribuicao.inSigla !== "HO");
    }

    tarefaIniciadaHomo(distribuicao: DistribuicaoOcorrenciaGsm) {
        return distribuicao && (distribuicao.inStatus === 'I' && distribuicao.inSigla === "HO");
    }

    getControleBotao(distribuicao: DistribuicaoOcorrenciaGsm) {
        return distribuicao && (((this.usuarioLogado.inSituacao && distribuicao.inSigla === "HO") || this.usuarioLogado.nrDocumento === distribuicao.cdUsuarioAtendimento));
    }

    selecionarTipoOcorrenciaFiltro(produto: Tuple): void {
        this.ocorrenciaTipoService.obterFuncionalidade(produto.select)
        .then(resposta => {
            this.filtros.tiposOcorrencia = [];
            resposta.forEach(item => {
                this.filtros.tiposOcorrencia.push(new Tuple(item.valor, item.codigo));
            });
        }).then(() => {
            this.filtros.tipoOcorrencia = new Tuple(this.ocorrenciaGsm.dsFuncionalidade, this.ocorrenciaGsm.cdFuncionalidade);
            // this.tipoOcorrencia.show = this.ocorrenciaGsm.dsFuncionalidade;
            // this.tipoOcorrencia.select = this.ocorrenciaGsm.cdFuncionalidade;
        });
    }

    obterProdutoFiltro() {
        this.ocorrenciaProdutoService.obterProdutos(null)
        .then(resposta => {
            this.filtros.produtos = [];
            resposta.forEach(item => {
                this.filtros.produtos.push(new Tuple(item.valor, item.codigo));
            });
        }).then(() => {
            this.filtros.produto = new Tuple(this.ocorrenciaGsm.dsProduto, this.ocorrenciaGsm.cdProduto);
        });
    }

    setUsuarioSmFiltro(usuario) {
        this.filtros.desenvolvedorSm = new Tuple(usuario.nome, usuario.idUsuario);
        this.distribuicao.cdUsuarioAtendimento = usuario.nrDocumento;
    }

    preDistribuir(chamado) {
        // chamado.inOcorrenciaInterna = true;
        this.ocorrenciaGsm = chamado;
        this.filtros.produto = new Tuple(this.ocorrenciaGsm.dsProduto, this.ocorrenciaGsm.cdProduto);
        this.distribuicao = new DistribuicaoOcorrenciaGsm();
        if (!this.ocorrenciaGsm.distribuicoes || this.ocorrenciaGsm.distribuicoes.length === 0) {
            this.ocorrenciaGsm.distribuicoes = [];
        }
    }

    iniciarDistribuicao(idOcorrenciaDistribuicao) {
        const load = this.loadingCtrl.create({
            content: 'Iniciando...'
        });
        load.present().then(() => {
            this.ocorrenciaGsmService.iniciarDistribuicao(idOcorrenciaDistribuicao)
                .then(resposta => {
                    load.dismiss();
                    this.ocorrenciaGsm = resposta.ocorrencia;
                    // this.carregarGrid();
                    // AppGsmModule.injector.get(SmAlertController).sucesso("", resposta.msgResponse);
                }).catch((err) => {
                    AppGsmModule.injector.get(SmAlertController).error("", "Não foi possível concluir a operação.");
                    load.dismiss();
                });
        }).catch(erro => {
            load.dismiss();
        });
    }

    pararDistribuicao(idOcorrenciaDistribuicao) {
        const load = this.loadingCtrl.create({
            content: 'Parando...'
        });
        load.present().then(() => {
            this.ocorrenciaGsmService.pararDistribuicao(idOcorrenciaDistribuicao)
                .then(resposta => {
                    load.dismiss();
                    this.ocorrenciaGsm = resposta.ocorrencia;
                    // this.carregarGrid();
                    // AppGsmModule.injector.get(SmAlertController).sucesso("", resposta.msgResponse);
                }).catch((err) => {
                    AppGsmModule.injector.get(SmAlertController).error("", "Não foi possível concluir a operação.");
                    load.dismiss();
                });
        }).catch(erro => {
            load.dismiss();
        });
    }

    finalizarDistribuicao(idOcorrenciaDistribuicao) {
        const load = this.loadingCtrl.create({
            content: 'Finalizando...'
        });
        load.present().then(() => {
            this.ocorrenciaGsmService.finalizarDistribuicao(idOcorrenciaDistribuicao)
                .then(resposta => {
                    load.dismiss();
                    this.ocorrenciaGsm = resposta.ocorrencia;
                    // this.carregarGrid();
                    // AppGsmModule.injector.get(SmAlertController).sucesso("", resposta.msgResponse);
                }).catch((err) => {
                    AppGsmModule.injector.get(SmAlertController).error("", "Não foi possível concluir a operação.");
                    load.dismiss();
                });
        }).catch(erro => {
            load.dismiss();
        });
    }

    reiniciarDistribuicao(idOcorrenciaDistribuicao) {
        const load = this.loadingCtrl.create({
            content: 'Reiniciando...'
        });
        load.present().then(() => {
            this.ocorrenciaGsmService.reiniciarDistribuicao(idOcorrenciaDistribuicao)
                .then(resposta => {
                    load.dismiss();
                    this.ocorrenciaGsm = resposta.ocorrencia;
                    this.carregarGrid();
                    // AppGsmModule.injector.get(SmAlertController).sucesso("", resposta.msgResponse);
                }).catch((err) => {
                    AppGsmModule.injector.get(SmAlertController).error("", "Não foi possível concluir a operação.");
                    load.dismiss();
                });
        }).catch(erro => {
            load.dismiss();
        });
    }

    carregarDadosTarefa(codigo, adicionarDistribuicao?: string) {
        this.obterBranches(codigo);
        this.obterFuncionariosTarefa(codigo, adicionarDistribuicao);
    }

    limparDadosTarefa() {
        this.branches = [];
        this.listFuncionarioTarefa = [];
        this.funcionarioTarefa = new Usuario();
        this.branch = null;
        this.branch = {valor: "Não Gerar Branch...", codigo: null};
    }

    obterBranches(codigo) {
        this.ocorrenciaGsmService.obterBranchesAtivos(codigo)
        .then(resp => {
            if (resp) {
                this.branches = [];
                this.branches.push({valor: "Não Gerar Branch...", codigo: null}, {valor: "Novo Branch...", codigo: 0});
                resp.forEach((item) => {
                    this.branches.push(item);
                });
                if (this.branchesTemp && this.branchesTemp.length) {
                    this.branches.forEach(b => {
                        if (!this.branchesTemp.find(t => t.codigo === b.codigo)) {
                            this.branchesTemp.push(b);
                        }
                    });
                } else {
                    this.branchesTemp = resp;
                }
            }
        });
    }

    obterFuncionariosTarefa(codigo, adicionarDistribuicao?: string) {
        this.ocorrenciaGsmService.obterfuncionariosTarefa(codigo)
        .then(resp => {
            this.listFuncionarioTarefa = resp;
            if(adicionarDistribuicao){
                this.funcionarioTarefa = new Usuario();
                this.funcionarioTarefa.nome = 'Selecione...';
            } else {
                if (this.distribuicao.cdUsuarioAtendimento) {
                    this.funcionarioTarefa.idUsuario = String(this.distribuicao.cdUsuarioAtendimento);
                    this.funcionarioTarefa.nome = String(this.distribuicao.dsUsuarioAtendimento);
                }
            }
        });
    }

    obterModalidadeDistribuicao() {
        this.filtros.modalidadeDesenvolvimento.show = "Todos ... ";
        this.filtros.modalidadeDesenvolvimento.select = "";
        this.limparDadosTarefa();
    }

    distribuir() {
        if (!this.ocorrenciaGsm.distribuicoes || this.ocorrenciaGsm.distribuicoes.length === 0) {
            this.ocorrenciaGsm.distribuicoes = [];
        }

        this.distribuicao.cdOcorrencia = this.ocorrenciaGsm.idOcorrencia;
        this.gravarDistribuicao().then(resp => {
            // console.log("gravarDistribuicao...", resp);
            $('#modalDistribuicao').hide("fast");
            $('#modalEditarDistribuicao').hide("fast");
            this.smAlert.sucesso('Informação', resp.msgResponse);
            this.ocorrenciaGsm.distribuicoes.push(resp.obj);
        }).catch( err => {
            $('#modalDistribuicao').hide("fast");
            $('#modalEditarDistribuicao').hide("fast");
            this.smAlert.error('Erro', err.msgResponse);
        });
    }

    editarDistribuicao(dist) {
        this.distribuicao = dist;
        this.branch = {codigo: this.distribuicao.cdBranch, valor: this.distribuicao.dsBranch};
        this.filtros.modalidadeDesenvolvimento.show = this.distribuicao.tipoTarefa;
        this.carregarDadosTarefa(this.distribuicao.cdTipoTarefa);
    }

    removerDistribuicao(dist) {
        // this.ocorrenciaGsm.distribuicoes.splice(this.ocorrenciaGsm.distribuicoes.indexOf(dist), 1);
        const load = this.loadingCtrl.create({
            content: 'Removendo esta distribuição...'
        });
        load.present().then(() => {
            this.ocorrenciaGsmService.removerDistribuicao(dist.idOcorrenciaDistribuicao)
                .then(resp => {
                    // this.smAlert.info('Informação', resp.msgResponse);
                    this.ocorrenciaGsm = resp.ocorrencia;
                    // this.carregarGrid();
                    $('#modalAlocar').hide();
                    load.dismiss();
                }).catch((err) => {
                    // AppGsmModule.injector.get(SmAlertController).error("", "Não foi possível concluir a operação.");
                    load.dismiss();
                });
        }).catch(erro => {
            load.dismiss();
        });
    }

    novaDistribuicao() {
        this.filtros.modalidadeDesenvolvimento = new Tuple("Selecione...", "");
        this.filtros.tipoDesenvolvimentoBack  = new Tuple("Selecione...", "");
        // this.copyListDevs();
        this.ngOnInit();
        this.branch = {valor: "Selecione...", codigo: 0};
        this.branches = [];
        this.listFuncionarioTarefa = [];
        this.funcionarioTarefa = null;

        this.distribuicao = new DistribuicaoOcorrenciaGsm();
        // Novo
        if (!this.ocorrenciaGsm.distribuicoes || this.ocorrenciaGsm.distribuicoes.length === 0) {
            this.ocorrenciaGsm.distribuicoes = [];
        }
    }

    gravarOcorrencia() {
        const obj = <any>JSON.parse(JSON.stringify(this.ocorrenciaGsm));
        delete obj['exibe'];
        delete obj['cor'];
        delete obj['add'];
        delete obj['icon'];
        delete obj['classPanelColor'];
        const load = this.loadingCtrl.create({
            content: 'Gravando Ocorrência...'
        });
        load.present().then(() => {
            this.ocorrenciaGsmService.gravarOcorrencia(obj)
            .then(resp => {
                this.smAlert.sucesso('Informação', resp.msgResponse);
                // this.filtrosPesquisaTecnico.filtrarPorStatus(this.filtros.status);
                load.dismiss();
                this.carregarGrid();
                $('#modalAlocar').hide();
            }).catch((err) => {
                AppGsmModule.injector.get(SmAlertController).error("", err.msgResponse);
                load.dismiss();
            });
        }).catch(erro => {
            load.dismiss();
        });
    }

    gravarDistribuicao(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
        if (!this.filtrosPesquisaTecnico.filtros.tipoSolicitacao.select) {
            this.filtrosPesquisaTecnico.reqMsgSeveridade = "É necessário definir o tipo de solicitação da ocorrência";
            AppGsmModule.injector.get(SmAlertController).info("Campo não preenchido!", "É necessário definir o tipo de solicitação da ocorrência");
            return;
        }
        const load = this.loadingCtrl.create({
            content: 'Gravando Distribuição...' + ((this.distribuicao.idOcorrenciaDistribuicao) ? this.distribuicao.idOcorrenciaDistribuicao : '')
        });
        load.present().then(() => {
            if (this.distribuicao.idOcorrenciaDistribuicao === undefined) {
                this.ocorrenciaGsmService.distribuir(this.distribuicao)
                .then(resp => {
                    // this.filtrosPesquisaTecnico.filtrarPorStatus(this.filtros.status);
                    console.log("1.");
                    resolve(resp);
                    this.filtrosPesquisaTecnico.filtros.status.codigo = resp.ocorrencia.inStatus;
                    this.ocorrenciaGsm = resp.ocorrencia;
                    this.carregarGrid();
                    this.distribuicao = new DistribuicaoOcorrenciaGsm();
                    this.filtros.modalidadeDesenvolvimento = new Tuple("Todos ...", null);
                    this.funcionarioTarefa = new Usuario();
                }).then(() => {
                    // this.smAlert.info('Informação', resp.msgResponse);
                    load.dismiss();
                }).catch((err) => {
                    reject(err);
                    load.dismiss();
                    this.distribuicao = new DistribuicaoOcorrenciaGsm();
                    this.filtros.modalidadeDesenvolvimento = new Tuple("Todos ...", null);
                     this.funcionarioTarefa = new Usuario();
                    // AppGsmModule.injector.get(SmAlertController).error("", err);
                });
            } else {
                this.ocorrenciaGsmService.editarDistribuicao(this.distribuicao)
                .then(resp => {
                    resolve(resp);
                    this.filtrosPesquisaTecnico.filtros.status = resp.ocorrencia.inStatus;
                    this.ocorrenciaGsm = resp.ocorrencia;
                    this.carregarGrid();
                    this.distribuicao = new DistribuicaoOcorrenciaGsm();
                    this.filtros.modalidadeDesenvolvimento = new Tuple("Todos ...", null);
                    this.funcionarioTarefa = new Usuario();
                     // this.filtrosPesquisaTecnico.filtrarPorStatus(this.filtros.status);
                }).then((resp) => {
                    load.dismiss();
                    // this.smAlert.info('Informação', resp.msgResponse);
                }).catch((err) => {
                    this.distribuicao = new DistribuicaoOcorrenciaGsm();
                    this.filtros.modalidadeDesenvolvimento = new Tuple("Todos ...", null);
                     this.funcionarioTarefa = new Usuario();
                    load.dismiss();
                    reject(err);
                    // AppGsmModule.injector.get(SmAlertController).error("", err);

                });
            }
        }).catch(erro => {
            load.dismiss();
            reject(erro);
        });
    });
    }



    getDataFormatada(data) {
        return this.util.formatarDataUS(data, 'dd/MM/yyyy');
        // return this.util.formatarData(data, 'dd/MM/yyyy');
    }

    getTipoTarefa(codigo) {

        const tipo = this.modalidades.find(f => f.codigo === codigo);
        if (tipo) {
            return tipo.valor;
        } else {
            return '';
        }
    }

    getBranch(cdBranch) {
        if (cdBranch && this.branchesTemp && this.branchesTemp.length > 0) {
            const obj = this.branchesTemp.find(b => b.codigo === cdBranch);
            if (obj) {
                return obj.valor;
            } else {
                return '';
            }
        } else if (this.branchesTemp) {
            return this.branchesTemp.find((item) => this.distribuicao.cdBranch === item.codigo).valor;
        }
    }

    // copyListDevs() {
    //     this.modalidades = [];
    //     this.filtros.produtos = [];
    //     this.filtros.tiposOcorrencia = [];
    //     this.modalidades = <any> JSON.parse(JSON.stringify(this.filtrosCopy.listModalidadeDesenvolvimento));
    //     this.filtros.produtos = <any> JSON.parse(JSON.stringify(this.filtrosCopy.produtos));
    //     this.filtros.tiposOcorrencia = <any> (this.filtrosCopy.tiposOcorrencia) ? JSON.parse(JSON.stringify(this.filtrosCopy.tiposOcorrencia)) : null ;
    // }

    carregarGrid() {
        this.carregarGridChange.emit('teste');
    }
}
