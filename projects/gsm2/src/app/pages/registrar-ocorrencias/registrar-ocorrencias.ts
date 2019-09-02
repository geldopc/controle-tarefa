import { AuthService } from './../../services/AuthService';
import { SmAlertController } from './../../components/sm-alert-controller/sm-alert-controller.component';
import { AppGsmModule } from './../../app.gsm.module';
import { OcorrenciaTipo } from './../../objects/entidades/OcorrenciaTipo';
import { OcorrenciaProduto } from './../../objects/entidades/OcorrenciaProduto';
import { GerenciadorSessao } from './../../services/util/GerenciadorSessao';
import { OcorrenciaProdutoService } from './../../services/OcorrenciaProdutoService';
import { OcorrenciaTipoService } from './../../services/OcorrenciaTipoService';
import { Component, ViewChild, OnInit } from "@angular/core";
import { IonicPage, MenuController, NavController, NavParams, Select } from "ionic-angular";
import { Ocorrencia } from "../../objects/entidades/Ocorrencia";
import { Estado } from "../../objects/entidades/Estado";
import { OcorrenciaService } from "../../services/OcorrenciaService";
import { Router } from "@angular/router";
import { FormControl } from '@angular/forms';
import { Tuple } from '../../objects/entidades/Tuple';
import { Usuario } from '../../objects/entidades/Usuario';

@IonicPage()
@Component({
    // tslint:disable-next-line:component-selector
    selector: "page-registrar-ocorrencias",
    templateUrl: "registrar-ocorrencias.html",
    styleUrls: ["registrar-ocorrencias.scss"]
})
// tslint:disable-next-line:component-class-suffix
export class RegistrarOcorrenciasPage implements OnInit {

    produtos: Tuple[];
    tiposOcorrencia: OcorrenciaTipo[];

    public usuario: Usuario;
    nivel = [{ valor: "normal", descricao: "Normal" }, { valor: "urgente", descricao: "Urgente" }];
    date = new FormControl(new Date());
    serializedDate = new FormControl((new Date()).toISOString());
    codProdutoSelecionado: number;
    @ViewChild("#produto")
    private select: Select;
    @ViewChild("#tipoOcorrencia")
    private selectTipo: Select;
    public ocorrencia: Ocorrencia;

    constructor(
        private router: Router,
        private ocorrenciaService: OcorrenciaService,
        private ocorrenciaProdutoService: OcorrenciaProdutoService,
        private ocorrenciaTipoService: OcorrenciaTipoService,
        private menuCtrl: MenuController,
    ) {
        this.usuario = GerenciadorSessao.usuario;
        this.ocorrencia = new Ocorrencia();
        this.ocorrenciaProdutoService.obterProdutos(GerenciadorSessao.usuario.cdCliente)
        // this.ocorrenciaProdutoService.obterOcorrenciasProduto(GerenciadorSessao.usuario.nrDocumento)
        .then((resposta) => {
            this.produtos = [];
            resposta.forEach(item => {
                console.log("item: ", JSON.stringify(item));
                this.produtos.push(new Tuple(item.dsSigla, item.idProdutoServico));
            });
            //   this.produtos = resposta;
        });
    }

    ngOnInit(): void {
    }

    public voltar() {
        this.router.navigate(["pesquisar"]);
    }

    openMenu() {
        this.menuCtrl.open();
    }

    selecionarTipoOcorrencia(): void {
        this.ocorrenciaTipoService.obterOcorrenciasTipo(this.ocorrencia.cdProdutoServico).then((resposta) => {
            this.tiposOcorrencia = [];
            const tipo: OcorrenciaTipo = new OcorrenciaTipo();
            resposta.forEach(item => {
                this.tiposOcorrencia.push(item);
            });
        });
    }

    salvar() {
        this.ocorrenciaService.manterOcorrencia(this.ocorrencia).then((resposta) => {
            AppGsmModule.injector.get(SmAlertController).sucesso("", resposta.msgResponse);
        }).catch((err) => {
            AppGsmModule.injector.get(SmAlertController).error("", err.msgResponse);
        });
    }


    sair() {
        AppGsmModule.injector.get(AuthService).destruirSessao();
        this.router.navigate(['/login']);
    }

}
