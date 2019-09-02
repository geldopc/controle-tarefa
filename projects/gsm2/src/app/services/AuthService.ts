import { ServicoProvider } from './../providers/ServicoProvider';
import { LoginProvider } from './../providers/login/loginProvider';
import { EventEmitter, Injectable } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { CookieService } from "ngx-cookie";
import { Usuario } from "../objects/entidades/Usuario";
import { GerenciadorSessao } from "./util/GerenciadorSessao";

@Injectable()
export class AuthService {
    private liberarAcessoApp = new EventEmitter<Boolean>();

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private _cookieService: CookieService,
        private loginProvider: LoginProvider,
        private servicoProvider: ServicoProvider
    ) { }

    fazerLoginWS(cpfCnpj, senha): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            const consultar = true; // TODO consultar webservice de login
            this.loginProvider.login(cpfCnpj, senha)
            .then((resposta) => {
                GerenciadorSessao.sessao.usuarioAutenticado = true;
                this.liberarAcessoApp.emit(GerenciadorSessao.sessao.usuarioAutenticado); // caso o Token ainda esteja ativo
                resolve(resposta);
            }).catch((err) => {
                GerenciadorSessao.sessao.usuarioAutenticado = false;
                // caso o Token ainda esteja ativo
                this.liberarAcessoApp.emit(GerenciadorSessao.sessao.usuarioAutenticado);
                this.router.navigate(["/login"]);
                reject(err);
            });
        });
    }

    consultarEmailUsuario(usuario): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            const consultar = true; // TODO consultar webservice de login
            this.loginProvider.consultarEmailUsuario(usuario)
            .then((resposta) => {
                resolve(resposta);
            }).catch((err) => {
                reject(err);
            });
        });
    }
    validarEmail(email): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            const consultar = true; // TODO consultar webservice de login
            this.loginProvider.validarEmail(email)
            .then((resposta) => {
                resolve(resposta);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    destruirSessao() {
        GerenciadorSessao.sessao.usuarioAutenticado = false;
        this.liberarAcessoApp.emit(GerenciadorSessao.sessao.usuarioAutenticado);
    }

    usuarioEstaAutenticado(): boolean {
        return GerenciadorSessao.sessao.usuarioAutenticado.valueOf();
    }
}
