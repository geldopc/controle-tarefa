import { Component } from '@angular/core';
import { AuthService } from './services/AuthService';
import { GerenciadorSessao } from './services/util/GerenciadorSessao';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppGsmComponent {
  constructor(private authService: AuthService) {
    // redirecionar para fazer login com WI
    if (!GerenciadorSessao.sessao.usuarioAutenticado) {
      this.authService.usuarioEstaAutenticado();
    }
  }
}
