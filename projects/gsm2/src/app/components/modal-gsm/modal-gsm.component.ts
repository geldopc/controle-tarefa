import { SmAlertController } from "./../sm-alert-controller/sm-alert-controller.component";
import { AppGsmModule } from "./../../app.gsm.module";
import { Usuario } from "./../../objects/entidades/Usuario";
import { AuthService } from "./../../services/AuthService";

import { Http } from "@angular/http";
import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import {
    FormGroup,
    FormControl,
    Validators,
    FormBuilder
} from "@angular/forms";
import * as $ from "jquery";
import { ALogin } from "./ALogin";

@Component({
    selector: "app-modal-gsm",
    templateUrl: "./modal-gsm.component.html",
    styleUrls: ["./modal-gsm.component.css"]
})
export class ModalGsmComponent extends ALogin implements OnInit {
    public reactiveForm: FormGroup;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private http: Http,
        private fb: FormBuilder,
        protected authService: AuthService
    ) {
        super(authService);
    }

    ngOnInit() {
        this.reactiveForm = this.fb.group({
            username: new FormControl(null, Validators.required),
            password: new FormControl(null, Validators.required),
            recaptchaReactive: new FormControl(null)
        });
    }

    fechar() {
        window.location.href = "/novosite/index.html";
    }

    public atualizaDadosPage(senha: string, usuario: Usuario) {
        throw new Error("Method not implemented.");
    }
    public atualizaEmailPage(senha: string, usuario: Usuario) {
        throw new Error("Method not implemented.");
    }

    public esqueceuSenha(){
        console.log( "username:::" , this.reactiveForm.value.username );
        this.router.navigate(["/esqueceu-senha"], {queryParams: { "username": this.reactiveForm.value.username }});
    }

    public submit(captchaResponse: string): void {
        if(!this.reactiveForm.valid){
            this.mensagem = "Preencha os campos obrigatórios";
            return;
        }
        this.efetuarLogin(this.reactiveForm.value.username, this.reactiveForm.value.password)
        .then(response => {
            // $("#fecharmodal").click();
            // this.router.navigate(["/pesquisar"]); // redirecionar para a página de destino
            // window.location.href = '/gsm/index.html?usuario=' + GerenciadorSessao.sessao.usuario;
        }).catch(err => {
            console.log("Erro: " + err);
            this.mensagem = err.msgResponse;
            AppGsmModule.injector.get(SmAlertController).warning("Aviso", err.msgResponse);
        });
    }
}
