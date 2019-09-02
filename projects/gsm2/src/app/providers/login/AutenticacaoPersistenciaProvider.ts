import { Injectable } from "@angular/core";
import { CookieService } from "ngx-cookie";
import { Autenticacao } from "../../objects/entidades/Autenticacao";

@Injectable()
export class AutenticacaoPersistenciaProvider {

  constructor(private _cookieService: CookieService) {

  }

  obter(chave: any): Promise<Autenticacao> {
    return new Promise<Autenticacao>((resolve, reject) => {
      const aut = new Autenticacao().init(
        1,
        this._cookieService.get("tmp_usr_access_token"),
        this._cookieService.get("tmp_usr_refresh_token"),
        null,
        null
      );
      resolve(aut);
    });
  }

  inserir(objeto: Autenticacao): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this._cookieService.put("tmp_usr_access_token", objeto.accessToken, {
        path: "gsmweb"
      });
      this._cookieService.put("tmp_usr_refresh_token", objeto.refreshToken, {
        path: "gsmweb"
      });
      resolve(true);
    });
  }

  removerTodos(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this._cookieService.remove("tmp_usr_access_token");
      this._cookieService.remove("tmp_usr_refresh_token");
      resolve(true);
    });
  }
}
