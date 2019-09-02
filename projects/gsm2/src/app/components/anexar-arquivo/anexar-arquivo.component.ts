import { Component, OnInit, Input } from '@angular/core';
import { LoadingController, AlertController } from 'ionic-angular';
import { OcorrenciaService } from '../../services/OcorrenciaService';
import { AppGsmModule } from '../../app.gsm.module';
import { SmAlertController } from '../sm-alert-controller/sm-alert-controller.component';
import * as $ from "jquery";
import { FiltrosPesquisa } from './../filtros-pesquisa-tecnico/filtros-pesquisa-tecnico.component';
import { OcorrenciaGsm, OcorrenciaGsmAnexo } from '../../objects/entidades/OcorrenciaGsm';


@Component({
  selector: 'anexar-arquivo',
  templateUrl: './anexar-arquivo.component.html',
  styleUrls: ['./anexar-arquivo.component.scss']
})
export class AnexarArquivoComponent implements OnInit {

    @Input() chamado: OcorrenciaGsm[];
    @Input() filtros: FiltrosPesquisa;
    @Input() ocorrenciaGsm: OcorrenciaGsm;
    idOcorrenciaAnexo: number;
    upAnexo: any;
    downAnexo: string;
    dsAnexo: string;
    dsExtensao: string;
    anexo: OcorrenciaGsmAnexo = new OcorrenciaGsmAnexo();
    // ocorrencia: OcorrenciaGsm = new OcorrenciaGsm();

  constructor(private loadingCtrl: LoadingController,
    private ocorrenciaService: OcorrenciaService,
    private alertCtrl: AlertController) {

        this.filtros = new FiltrosPesquisa();
        this.ocorrenciaGsm = new OcorrenciaGsm();

    }


  ngOnInit() {

  }

downloadAnexo(idOcorrencia: number, anexo) {
    // console.log('downloadAnexo', anexo);
    const load = this.loadingCtrl.create({
        content: 'Baixando Arquivo...'
    });
    load.present().then(() => {
        this.ocorrenciaService.downloadAnexo(idOcorrencia, anexo.idOcorrenciaAnexo, anexo.dsAnexo)
            .then(resposta => {
                load.dismiss();
                // AppGsmModule.injector.get(SmAlertController).sucesso("", resposta.msgResponse);
                // console.log("downloadAnexo: ", resposta);
            }).catch((err) => {
                AppGsmModule.injector.get(SmAlertController).error("", "Não foi possível concluir a operação.");
            });
    }).catch(erro => {
        load.dismiss();
    });
}

removerAnexo(idOcorrenciaAnexo: number, idOcorrencia: number) {
    this.ocorrenciaService.excluirAnexo(idOcorrencia, idOcorrenciaAnexo)
        .then((resposta) => {
            AppGsmModule.injector.get(SmAlertController).sucesso("", resposta.msgResponse);
            // this.filtrarPorStatus(this.status);
        }).catch((err) => {
            AppGsmModule.injector.get(SmAlertController).error("", "Não foi possível concluir a operação.");
        });
}

 addAnexos() {
    const obj = <any>JSON.parse(JSON.stringify(this.ocorrenciaGsm));
    obj.dtAbertura = null;
    obj.dtLimiteAtendimento = null;
    delete obj["exibe"];
    delete obj["cor"];
    if (obj && obj.listHistorico && obj.listHistorico.length > 0) {
        obj.listHistorico.forEach(o => {
            o.dtInicioAtendimento = null;
            o.dtFinalAtendimento = null;
        });
    }
    this.ocorrenciaService.manterAnexo(this.anexo)
        .then(resposta => {
            // console.log("resposta adicionar:", resposta);
            AppGsmModule.injector.get(SmAlertController).sucesso("", resposta.msgResponse);
            this.ocorrenciaService.obterAnexoOcorrencia(this.ocorrenciaGsm.idOcorrencia).then((result) => {
                this.ocorrenciaGsm.anexos = result;
            });
            $("#modalAddAnexo").hide();
        }).catch((err) => {
            AppGsmModule.injector.get(SmAlertController).error("", "Não foi possível concluir a operação.");
        });
}

lerUrlImagem(event) {
    console.log("this.ocorrencia: " + JSON.stringify(this.ocorrenciaGsm));
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
                // const anexo = {
                //     idOcorrencia: this.ocorrenciaGsm.idOcorrencia,
                //     idOcorrenciaAnexo: null,
                //     upAnexo: this.upAnexo,
                //     dsAnexo: fileName,
                //     dsExtensao: this.dsExtensao,
                //     cdUsuarioAtendimento: null
                // };
                this.anexo = new OcorrenciaGsmAnexo();
                this.anexo.cdOcorrencia = this.ocorrenciaGsm.idOcorrencia;
                this.anexo.upAnexo = this.upAnexo;
                this.anexo.dsNome = fileName;
                this.anexo.dsExtensao = this.dsExtensao;
                console.log("anexo: " + JSON.stringify(this.anexo));
                const arq = this.ocorrenciaGsm.anexos.find(a => a.dsNome === fileName);
                // console.log('ARQ', arq);
                console.log("arq" + JSON.stringify(arq));
                if (!arq && this.anexo.dsNome && this.anexo.dsExtensao) {
                    this.ocorrenciaGsm.anexos.push(this.anexo);
                    this.addAnexos();
                } else if (arq) {
                    this.msgAnexoExiste();
                }
                // console.log("anexo: " + JSON.stringify(this.ocorrencia.anexos));
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

removeList(index) {
    this.ocorrenciaGsm.anexos.splice(index, 1);
}

preRemove(index: number) {
    const anexo = this.ocorrenciaGsm.anexos[index];
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

obterAnexoOcorrencia(chamado) {
    this.ocorrenciaService.obterAnexoOcorrencia(chamado.idOcorrencia).then((result) => {
        chamado.anexos = result;
    });
}

}
