import { Component, OnInit, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { LoadingController, AlertController } from 'ionic-angular';
import { SmAlertController } from 'projects/gsm2/src/app/components/sm-alert-controller/sm-alert-controller.component';
import { OcorrenciaGsmService } from 'projects/gsm2/src/app/services/OcorrenciaGsmService';
import { OcorrenciaGsm, OcorrenciaGsmAnexo } from '../../objects/entidades/OcorrenciaGsm';
import { OcorrenciaProdutoService } from '../../services/OcorrenciaProdutoService';
import { OcorrenciaTipoService } from '../../services/OcorrenciaTipoService';
import { Tuple } from '../../objects/entidades/Tuple';
import { UsuarioService } from '../../services/UsuarioService';
import { Usuario } from '../../objects/entidades/Usuario';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { GerenciadorSessao } from '../../services/util/GerenciadorSessao';
import * as $ from 'jquery';

@Component({
    selector: 'app-add-ocorrencia-modal',
    templateUrl: './add-ocorrencia-modal.component.html',
    styleUrls: ['./add-ocorrencia-modal.component.scss']
})
export class AddOcorrenciaModalComponent implements OnInit {

    produtos;
    funcionalidades;
    clientes;
    solicitantes;
    replica: boolean;
    descricao;
    anexos;
    ocorrencia = new OcorrenciaGsm();
    solicitante: Usuario;
    produto;
    funcionalidade;
    cliente;
    isTabDistribuicao = false;
    editorConfig: AngularEditorConfig = {
        editable: true,
        spellcheck: true,
        height: '25rem',
        minHeight: '5rem',
        placeholder: 'Descreva aqui o problema...',
        translate: 'no',
        uploadUrl: 'arquivos/images', // if needed
        customClasses: [
            {name: "quote", class: "quote"},
            {name: 'redText', class: 'redText'},
            {name: "titleText", class: "titleText", tag: "h1"}]
    };
    dsAnexo: any;
    upAnexo: any;
    dsExtensao: any;
    @Output() refresh = new EventEmitter();

    constructor(
        private ocorrenciaGsmService: OcorrenciaGsmService,
        private ocorrenciaProdutoService: OcorrenciaProdutoService,
        private ocorrenciaTipoService: OcorrenciaTipoService,
        private usuarioService: UsuarioService,
        private loadingCtrl: LoadingController,
        private smAlert: SmAlertController,
        private alertCtrl: AlertController,
    ) {
        // console.log('constructor...', this);
    }

    ngOnInit() {
        // console.log('ngOnInit...', this);
        // this.obterProdutos();
        const user = GerenciadorSessao.usuario;
        if (user.funcionario && user.inSituacao) {
            this.obterProdutosSituacao();
        } else if (user.funcionario) {
            this.obterProdutosTecnico();
        } else {
            this.obterProdutos();
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        // console.log('AddOcorrenciaModalComponent/ngOnInit...', this);
        // const user = GerenciadorSessao.usuario;
        // if (user.funcionario && user.inSituacao) {
        //     this.obterProdutosSituacao();
        // } else {
        //     this.obterProdutosTecnico();
        // }
    }

    obterProdutos() {
        this.ocorrenciaProdutoService.obterProdutos(null)
        .then(res => {
            this.produtos = res;
        }).catch(err => {
            console.error('ERRO', err);
        });
    }

    obterProdutosSituacao() {
        this.ocorrenciaProdutoService.obterProdutosSituacao()
        .then(res => {
            this.produtos = res;
        }).catch(err => {
            console.error('ERRO', err);
        });
    }

    obterProdutosTecnico() {
        this.ocorrenciaProdutoService.obterProdutosTecnico()
        .then(res => {
            this.produtos = res;
        }).catch(err => {
            console.error('ERRO', err);
        });
    }

    obterFuncionalidade() {
        if (this.ocorrencia && this.ocorrencia.cdProduto) {
            this.ocorrenciaTipoService.obterFuncionalidade(this.ocorrencia.cdProduto)
            .then(res => {
                this.funcionalidades = res;
            });
        }
    }

    obterCliente() {
        if (this.ocorrencia && this.ocorrencia.cdProduto) {
            this.ocorrenciaProdutoService.obterClientes(this.ocorrencia.cdProduto)
            .then(res => {
                this.clientes = res;
            });
        } else {
            this.ocorrenciaProdutoService.obterClientes(null)
            .then(resposta => {
                this.clientes = [];
                resposta.forEach(item => {
                    this.clientes.push(new Tuple(item.valor, item.codigo));
                });
            });
        }
    }

    obterSolicitante(idCliente) {
        const load = this.loadingCtrl.create({
            content: 'Aguarde...'
        });
        load.present().then(() => {
            this.solicitante = new Usuario('', null, 'Selecione...');
            this.usuarioService.obterUsuarios(idCliente)
            .then(res => {
                console.log();
                this.solicitantes = [];
                this.solicitantes.push(new Usuario('', null, 'Selecione...'));
                if (res) {
                    res.forEach(item => {
                        this.solicitantes.push(new Usuario(item.idUsuario, item.nrDocumento, item.nome));
                    });
                }
                load.dismiss();
            }).catch(err => {
                console.error('ERRO', err);
                load.dismiss();
            });
        }).catch(() => {
            load.dismiss();
        });
    }


    lerUrlImagem(event) {
        // console.log("lerUrlImagem: ", event);
        const file = event.target.files[0];
        const fileName = file.name;
        const fileExtensao = fileName.split('.').pop();
        this.dsAnexo = fileName;
        this.dsExtensao = fileExtensao;
        if (event.target.files && event.target.files[0]) {
            const reader = new FileReader();
            // tslint:disable-next-line:no-shadowed-variable
            reader.onload = (event: any) => {
                // console.log("FILE...", event.target.result);
                if (event.target.result) {
                    this.upAnexo = event.target.result.split(",")[1];
                    let anexo: OcorrenciaGsmAnexo = new OcorrenciaGsmAnexo();
                    anexo.cdOcorrencia = this.ocorrencia.idOcorrencia;
                    anexo.idOcorrenciaAnexo =  null;
                    anexo.upAnexo =  this.upAnexo;
                    anexo.dsNome = fileName;
                    anexo.dsExtensao =  this.dsExtensao;
                    // console.log("add Anexo...", anexo);
                    const arq = this.ocorrencia.anexos.find(a => a.dsNome === fileName);
                    // console.log('ARQ', arq);
                    if (!arq && anexo.dsNome && anexo.dsExtensao) {
                        this.ocorrencia.anexos.push(anexo);
                    } else if (arq) {
                        this.msgAnexoExiste();
                    }
                }
            };
            reader.readAsDataURL(event.target.files[0]);
        } else {
            this.msgAnexoExiste();
        }
    }

    msgAnexoExiste() {
        const alert = this.alertCtrl.create({
            title: 'Informação',
            message: "Este Aquivo já foi Anexado!",
            buttons: [{
                text: 'OK',
            }]
            , enableBackdropDismiss: false
        });
        alert.present();
    }

    salvarOcorrencia() {
        console.log("salvarOcorrencia...", this);
        if (this.formIsValid()) {
            const load = this.loadingCtrl.create({
                content: 'Gravando Nova Ocorrência...'
            });
            load.present().then(() => {
                this.ocorrencia.dtSolicitacao = new Date();
                this.ocorrencia.cdUsuarioCadastro = GerenciadorSessao.usuario.nrDocumento;
                this.ocorrenciaGsmService.manterOcorrencia(this.ocorrencia)
                .then(res => {
                    // console.log('manterOcorrencia....', resposta);
                    load.dismiss();
                    this.smAlert.sucesso("Informação", res.msgResponse);
                    $("#modalAddOcorrencia").hide();
                    this.refresh.emit(true);
                }).catch(err => {
                    load.dismiss();
                    console.error('ERRO...', err);
                    this.smAlert.error("", err.msgResponse);
                });
            }).catch(() => {
                load.dismiss();
            });
        }
    }

    formIsValid(): boolean {
        if (this.ocorrencia.cdProduto && this.ocorrencia.cdFuncionalidade && this.ocorrencia.dsOcorrencia) {
            return true;
        } else {
            return false;
        }
    }

    removeList(index) {
        this.ocorrencia.anexos.splice(index, 1);
    }

    preRemove(index: number) {
        const anexo = this.ocorrencia.anexos[index];
        const alert = this.alertCtrl.create({
            title: 'Informação',
            message: "Confirmar a Exclusão do Arquivo: " + anexo.dsNome,
            buttons: [{
                text: 'Não',
                handler: data => {
                    // console.log('Cancelado...', anexo);
                }
            }, {
                text: 'Sim',
                handler: data => {
                    this.removeList(index);
                }
            }]
            , enableBackdropDismiss: false
        });
        alert.present();
    }

    onClose() {
        this.refresh.emit(false);
    }
}
