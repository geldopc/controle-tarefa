import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SmAlertController } from 'projects/gsm2/src/app/components/sm-alert-controller/sm-alert-controller.component';
import { TrabalheConoscoProvider } from 'projects/gsm2/src/app/providers/TrabalheConoscoProvider';
import { TrabalheConoscoService } from 'projects/gsm2/src/app/services/TrabalheConoscoService';
import { Util } from 'projects/gsm2/src/app/services/util/Util';
import { AppModule } from 'src/app/app.module';
import { TrabalheConosco } from '../../objects/entidades/TabalheConosco';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-modal-faca-parte-sm',
  templateUrl: './modal-faca-parte-sm.component.html',
  styleUrls: ['./modal-faca-parte-sm.component.css'],
  providers: [TrabalheConoscoService, TrabalheConoscoProvider, SmAlertController],
})

export class ModalFacaParteSmComponent implements OnInit {

  public reactiveForm: FormGroup;
  estados: Array<{ descricao: string, sigla: string }> = [];
  trabalheConosco: TrabalheConosco = new TrabalheConosco();
  mensagem: string;

  constructor(private util: Util,
    private loading: Ng4LoadingSpinnerService,
    public trabalheConoscoService: TrabalheConoscoService,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.trabalheConosco.dsSiglaEstado = null;
    this.estados = this.util.getEstados();
    this.reactiveForm = this.fb.group({
      dsNome: new FormControl(),
      dsEmail: new FormControl(),
      nrTelefoneResidencial: new FormControl(),
      nrTelefoneCelular: new FormControl(),
      dsFormacao: new FormControl(),
      dsCidade: new FormControl(),
      dsSiglaEstado: new FormControl(),
      // curriculoAnexado: new FormControl(),
      recaptchaReactive: new FormControl(null, Validators.required)
    });
  }

  public submit(captchaResponse: string): void {
    this.trabalheConosco.dsNome = this.reactiveForm.value.dsNome;
    this.trabalheConosco.dsEmail = this.reactiveForm.value.dsEmail;
    this.trabalheConosco.nrTelefoneResidencial = this.reactiveForm.value.nrTelefoneResidencial;
    this.trabalheConosco.nrTelefoneCelular = this.reactiveForm.value.nrTelefoneCelular;
    this.trabalheConosco.dsFormacao = this.reactiveForm.value.dsFormacao;
    this.trabalheConosco.dsCidade = this.reactiveForm.value.dsCidade;
    this.trabalheConosco.dsSiglaEstado = this.reactiveForm.value.dsSiglaEstado;
    // this.reactiveForm.value.curriculoAnexado = this.trabalheConosco.curriculoAnexado;

  }

  cadastrar(): Promise<any> {
    this.loading.show();
    return this.trabalheConoscoService.enviarTrabalheConosco(this.trabalheConosco).then((resposta) => {
      this.loading.hide();
      this.trabalheConosco = new TrabalheConosco();
      AppModule.injector.get(SmAlertController).sucesso("", resposta.msgResponse);
      this.reactiveForm.reset();
    }).catch((err) => {
      this.loading.hide();
      AppModule.injector.get(SmAlertController).error("", err.msgResponse);
    });
  }

  lerUrlImagem(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.onload = (event: any) => {
        // tslint:disable-next-line:max-line-length
        // this.trabalheConosco.curriculoAnexado = event.target.result.replace(/^data:image\/[a-z]+;base64,/, "").replace("data:application/pdf;base64,", "").replace("data:application/vnd.oasis.opendocument.text;base64,", "").replace("data:application/vnd.oasis.opendocument.text;base64,", "");// data:application/msword-template;base64  remove a parte inicial da string, que não deve ser enviada p/ o web service
        if (String(event.target.result).indexOf('/') == -1 || String(event.target.result).indexOf(';') == -1) {
          AppModule.injector.get(SmAlertController).info("Aviso", "Informe um documento do tipo pdf.");
          return;
        }
        if (event.target.result) {
          let extensao: string = event.target.result.split("/")[1].split(";")[0];
          if (!extensao || extensao.toLowerCase() != 'pdf') {
            AppModule.injector.get(SmAlertController).info("Aviso", "Informe um documento do tipo pdf.");
            return;
          }
          this.trabalheConosco.curriculoAnexado = event.target.result.split(",")[1];
        }
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  isValid(): boolean {
    this.trabalheConosco.dsNome = this.reactiveForm.value.dsNome;
    this.trabalheConosco.dsEmail = this.reactiveForm.value.dsEmail;
    this.trabalheConosco.nrTelefoneResidencial = this.reactiveForm.value.nrTelefoneResidencial;
    this.trabalheConosco.nrTelefoneCelular = this.reactiveForm.value.nrTelefoneCelular;
    this.trabalheConosco.dsFormacao = this.reactiveForm.value.dsFormacao;
    this.trabalheConosco.dsCidade = this.reactiveForm.value.dsCidade;
    this.trabalheConosco.dsSiglaEstado = this.reactiveForm.value.dsSiglaEstado;
    if (!this.trabalheConosco.dsNome) {
      AppModule.injector.get(SmAlertController).info("", "Preencha todos os campos obrigatórios!");
      return false;
    } else
      if (!this.trabalheConosco.dsEmail) {
        AppModule.injector.get(SmAlertController).info("", "Preencha todos os campos obrigatórios!");
        return false;
      } else
        if (!this.trabalheConosco.nrTelefoneResidencial && !this.trabalheConosco.nrTelefoneCelular) {
          AppModule.injector.get(SmAlertController).info("", "Preencha todos os campos obrigatórios!");
          return false;
        } else
          // if (!this.trabalheConosco.dsFormacao) {
          //   return false;
          // }
          // if (!this.trabalheConosco.dsCidade) {
          //   return false;
          // }
          // if (!this.trabalheConosco.dsSiglaEstado) {
          //   return false;
          // }
          if (!this.trabalheConosco.curriculoAnexado) {
            AppModule.injector.get(SmAlertController).error("", "Preencha todos os campos obrigatórios!");
            return false;
          } else {
            this.cadastrar();
            return true;
          }
  }

}
