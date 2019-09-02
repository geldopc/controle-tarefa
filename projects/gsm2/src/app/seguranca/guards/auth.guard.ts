import { AuthService } from './../../services/AuthService';
import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  CanLoad,
  Route
} from "@angular/router";

import { Observable } from "rxjs/Observable";

@Injectable()
export class AuthGuard implements CanActivate, CanLoad {
  constructor(private authService: AuthService, private router: Router) {}

  private verificarAcesso() {
    // this.authService.usuarioEstaAutenticado().then(
    //   (autenticado) => {
    //     return true;
    //   }).catch((erro) => {
    //     parent.parent.window.location.href = "/siapec3/login.wsp"; //quando expirar a sessao e precisar refazer o login.
    //     return false;
    // });
    return this.authService.usuarioEstaAutenticado();
  }

  canLoad(route: Route): Observable<boolean> | Promise<boolean> | boolean {
    return this.verificarAcesso();
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    return this.verificarAcesso();
  }
}
