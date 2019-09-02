import { ConfiguracaoService } from "./Config";
import { Sessao } from "../../objects/entidades/Sessao";
import { Usuario } from "../../objects/entidades/Usuario";
import { Estado } from "../../objects/entidades/Estado";
import { Parametros } from "./../../objects/entidades/Parametros";
import { Injectable } from "@angular/core";

@Injectable()
export class GerenciadorSessao {

    public static sessao: Sessao = new Sessao();
    public static parametros: Parametros = new Parametros();

    public static salvarSessao(usuario: Usuario): Promise<any> {
        return new Promise<any>((resolve) => {
            GerenciadorSessao.sessao.usuario = usuario;
            GerenciadorSessao.sessao.dataUltimoLogin = new Date();
            resolve();
        });
    }

    public static salvarParametros(p: any, pagina_destino: string) {
        GerenciadorSessao.parametros.dsUf = p.estado;
        GerenciadorSessao.parametros.inAtivaArrecadacaoSefaz =
            p.in_ativa_arrecadacao_sefaz === "S" ? true : false;
        GerenciadorSessao.parametros.dsEnderecoWs = p.ds_enderecows;
        GerenciadorSessao.parametros.dsPaginaInicial = pagina_destino;
        GerenciadorSessao.parametros.caminhoRaizProjeto = "gsm";
    }

    public static carregarWi(modo: boolean, destino?: string): Promise<any> {
        return new Promise<any>(resolve => {

        });
    }

    public static get cdGrupoEspecieAves(): number {
        return 6;
    }

    public static get cdGrupoEspecieSuinos(): number {
        return 7;
    }
    public static get usuario(): Usuario {
        return GerenciadorSessao.sessao.usuario;
    }

    public static get usuarioSindicato(): Usuario {
        return GerenciadorSessao.sessao.usuarioSindicato;
    }

    public static get usuarioCrea(): Usuario {
        return GerenciadorSessao.sessao.usuarioCrea;
    }

    public static get sync(): boolean {
        const sinc = GerenciadorSessao.sessao.sync;
        if (GerenciadorSessao.sessao.sync) {
            GerenciadorSessao.sessao.sync = false;
        }
        return sinc;
    }

    public static get estado(): Estado {
        return GerenciadorSessao.sessao.estado;
    }

    public static get dataLogin() {
        return GerenciadorSessao.sessao.dataUltimoLogin;
    }

    public static limparSessao() {
        GerenciadorSessao.sessao = new Sessao();
    }

    public static get possuiSessaoAtiva(): boolean {
        return GerenciadorSessao.sessao.usuario !== null;
    }
}
