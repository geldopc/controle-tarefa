import { Router, NavigationEnd } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ContatoCadastro } from '../../objects/entidades/Contato';
import { ContatoService } from 'projects/gsm2/src/app/services/ContatoService';
import { AppModule } from '../../app.module';
import { SmAlertController } from 'projects/gsm2/src/app/components/sm-alert-controller/sm-alert-controller.component';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';


@Component({
  selector: 'app-contato',
  templateUrl: './contato.component.html',
  styleUrls: ['./contato.component.css']
})
export class ContatoComponent implements OnInit {

  public reactiveForm: FormGroup;
  contato: ContatoCadastro = new ContatoCadastro();

  constructor(public contatoService: ContatoService,
    private loading: Ng4LoadingSpinnerService,
    private fb: FormBuilder,
    private router: Router) {
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
              (<any>window).gtag("set", "page", event.urlAfterRedirects);
              (<any>window).gtag("send", "pageview");
            }
          });
     }

  ngOnInit() {
    this.reactiveForm = this.fb.group({
      dsNome: new FormControl(),
      dsAssunto: new FormControl(),
      nrTelefone: new FormControl(),
      dsEmail: new FormControl(),
      dsMensagem: new FormControl(),
      recaptchaReactive: new FormControl(null, Validators.required)
    });

  }

  public submit(captchaResponse: string): void {
    this.contato.dsNome = this.reactiveForm.value.dsNome;
    this.contato.dsAssunto = this.reactiveForm.value.dsAssunto;
    this.contato.nrTelefone = this.reactiveForm.value.nrTelefone;
    this.contato.dsEmail = this.reactiveForm.value.dsEmail;
    this.contato.dsMensagem = this.reactiveForm.value.dsMensagem;
  }

  cadastrarContato() {
    AppModule.injector.get(SmAlertController).info("Aviso", "Opção indisponível no momento, estará disponível em breve...");
    // this.loading.show();
    // this.contatoService.enviarContato(this.contato).then((resposta) => {
    //   this.loading.hide();
    //   this.contato = new ContatoCadastro();
    //   AppModule.injector.get(SmAlertController).sucesso("", resposta.msgResponse);
    //   this.reactiveForm.reset();
    // }).catch((err) => {
    //   this.loading.hide();
    //   AppModule.injector.get(SmAlertController).error("", err.msgResponse);
    // });
  }

  isValid(): boolean {
    this.contato.dsNome = this.reactiveForm.value.dsNome;
    this.contato.dsAssunto = this.reactiveForm.value.dsAssunto;
    this.contato.nrTelefone = this.reactiveForm.value.nrTelefone;
    this.contato.dsEmail = this.reactiveForm.value.dsEmail;
    this.contato.dsMensagem = this.reactiveForm.value.dsMensagem;
    if (!this.contato.dsNome) {
      AppModule.injector.get(SmAlertController).info("", "Preencha todos os campos obrigatórios!");
      return false;
    } else
      if (!this.contato.dsAssunto) {
        AppModule.injector.get(SmAlertController).info("", "Preencha todos os campos obrigatórios!");
        return false;
      } else
        // if (!this.contato.nrTelefone) {
        //   return false;
        // } else
        if (!this.contato.dsEmail) {
          AppModule.injector.get(SmAlertController).info("", "Preencha todos os campos obrigatórios!");
          return false;
        } else
          if (!this.contato.dsMensagem) {
            AppModule.injector.get(SmAlertController).info("", "Preencha todos os campos obrigatórios!");
            return false;
          } else {
            this.cadastrarContato();
            return true;
          }
  }


}

