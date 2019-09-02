import { AuthService } from "./../../../services/AuthService";
import { Component, OnInit } from "@angular/core";
import {
    FormGroup,
    FormControl,
    Validators,
    FormBuilder
} from "@angular/forms";
import { Http } from "@angular/http";
import { Router, ActivatedRoute } from "@angular/router";
import { ALogin } from "../ALogin";
import { AppGsmModule } from "../../../app.gsm.module";
import { SmAlertController } from "../../sm-alert-controller/sm-alert-controller.component";
import { Usuario } from "../../../objects/entidades/Usuario";

@Component({
    selector: "page-esqueceu-senha",
    templateUrl: "./esqueceu-senha.component.html",
    styleUrls: ["./esqueceu-senha.component.css"]
})
export class EsqueceuSenhaComponent extends ALogin implements OnInit {
    public reactiveForm: FormGroup;
    public mensagem: string;
    public email: string;
    textoBotao: string;
    private _usuario: string;
    public maskedEmail: string;
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private http: Http,
        private fb: FormBuilder,
        protected authService: AuthService
    ) {
        super(authService);
        this.textoBotao = "Verificar usuário";
    }

    ngOnInit() {
        this.reactiveForm = this.fb.group({
            username: new FormControl(null, Validators.required),
            recaptchaReactive: new FormControl(null, Validators.required)
        });
        this.route.queryParams.subscribe((param: any) => {
            if (param) {
                this.reactiveForm = this.fb.group({
                    username: new FormControl(param.username, Validators.required),
                    recaptchaReactive: new FormControl(null, Validators.required)
                });
            }
        });
    }

    public consultarUsuario(captchaResponse: string): void {
        if (!this.reactiveForm.valid) {
            this.mensagem = "Preencha os campos obrigatórios";
            return;
        }
        if ( this.reactiveForm.valid && !this.reactiveForm.value.email){
            this._usuario = this.reactiveForm.value.username;
            // quando ainda nao aparece o email mascarado;
            this.consultarEmailUsuario(
                this.reactiveForm.value.username
            )
                .then(response => {
                    this.reactiveForm = this.fb.group({
                        username: new FormControl(this._usuario, Validators.required),
                        email: new FormControl(response.usuario.dsEmail, Validators.required),
                        confirmEmail: new FormControl(null, Validators.required),
                        recaptchaReactive: new FormControl(null, Validators.required)
                    });
                    this.maskedEmail = response.usuario.dsEmail;
                    this.textoBotao = "Confirme o e-mail cadastrado";
                })
                .catch(err => {
                    console.log("Erro: " + err);
                    this.mensagem = err.msgResponse;
                    AppGsmModule.injector
                        .get(SmAlertController)
                        .warning("Aviso", err.msgResponse);
                });
        } else {
            this.validarEmail(
                this.reactiveForm.value.confirmEmail
            )
                .then(response => {
                    this.mensagem = response.msgResponse;
                    this.renderedBotao = false;
                    if (response.valido){
                        this.cor = "green";
                        this.router.navigate(['login']);
                    } else {
                        this.cor = "red";
                    }
                })
                .catch(err => {
                    console.log("Erro: " + err);
                    this.mensagem = err.msgResponse;
                    AppGsmModule.injector
                        .get(SmAlertController)
                        .warning("Aviso", err.msgResponse);
                });
        }
    }

    public atualizaDadosPage(
        senha: string,
        usuario: Usuario
    ) {
        //throw new Error("Method not implemented.");
    }
    public atualizaEmailPage(
        senha: string,
        usuario: Usuario
    ) {
        //throw new Error("Method not implemented.");
    }
}
