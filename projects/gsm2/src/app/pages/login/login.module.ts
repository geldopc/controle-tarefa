import { LoginProvider } from './../../providers/login/loginProvider';
import { LoginService } from './../../services/LoginService';
import { CookieService, CookieOptionsProvider } from 'ngx-cookie';
import { AutenticacaoPersistenciaProvider } from './../../providers/login/AutenticacaoPersistenciaProvider';
import { AuthService } from './../../services/AuthService';
import { NgForm } from '@angular/forms';
import { VariaveisGlobais } from './../../objects/entidades/VariaveisGlobais';
import { MunicipioProvider } from './../../providers/municipioLocal/MunicipioProvider';
import { EstadoProvider } from './../../providers/estadoLocal/EstadoProvider';
import { Util } from './../../services/util/Util';
import { ServicoProvider } from './../../providers/ServicoProvider';
import { WebCorporativoComponentModule } from './../../components/web-corporativo/web-corporativo.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { RECAPTCHA_LANGUAGE, RECAPTCHA_SETTINGS, RecaptchaSettings } from 'ng-recaptcha';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    WebCorporativoComponentModule
  ],
  exports: [LoginComponent],
  providers: [
    ServicoProvider, Util, EstadoProvider, MunicipioProvider, VariaveisGlobais, NgForm, CookieService, CookieOptionsProvider,
    LoginService, LoginProvider, AuthService, AutenticacaoPersistenciaProvider,
    {
      provide: RECAPTCHA_LANGUAGE,
      useValue: "pt-BR"
    },
    {
      provide: RECAPTCHA_SETTINGS,
      // useValue: { siteKey: '6Leab10UAAAAAIDj7HJ-bMlL1onGr9DUvn2T2q5-' } as RecaptchaSettings,
      useValue: {
        siteKey: "6LcJcl0UAAAAAEpJiG872WLgRstF-OGa1PNejNoX"
      } as RecaptchaSettings
    }
  ]
})
export class LoginModule { }
