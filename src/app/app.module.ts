import { Injector, NgModule } from "@angular/core";
import { NgForm } from '@angular/forms';
import { HttpModule } from "@angular/http";
import { BrowserModule } from "@angular/platform-browser";
import { ServiceWorkerModule } from '@angular/service-worker';
import { ActionSheetController, AlertController, App, Config, LoadingController, Platform } from 'ionic-angular';
import { RecaptchaModule, RecaptchaSettings, RECAPTCHA_LANGUAGE, RECAPTCHA_SETTINGS } from "ng-recaptcha";
import { CookieModule, CookieOptionsProvider, CookieService } from 'ngx-cookie';
import { VariaveisGlobais } from 'projects/gsm2/src/app/objects/entidades/VariaveisGlobais';
import { EstadoProvider } from 'projects/gsm2/src/app/providers/estadoLocal/EstadoProvider';
import { AutenticacaoPersistenciaProvider } from 'projects/gsm2/src/app/providers/login/AutenticacaoPersistenciaProvider';
import { MunicipioProvider } from 'projects/gsm2/src/app/providers/municipioLocal/MunicipioProvider';
import { ServicoProvider } from 'projects/gsm2/src/app/providers/ServicoProvider';
import { Util } from '../../projects/gsm2/src/app/services/util/Util';
import { environment } from '../environments/environment';
import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app.routing.module";
import { ComponentesModule } from "./components/components.module";
import { InicioModule } from "./pages/inicio/inicio.module";
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    ComponentesModule,
    HttpModule,
    InicioModule,
    AppRoutingModule,
    CookieModule.forRoot(),
    RecaptchaModule.forRoot(),
    Ng4LoadingSpinnerModule.forRoot(),
    ServiceWorkerModule.register('/novosite/ngsw-worker.js', { enabled: environment.production })
    // ServiceWorkerModule.register('./ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    ServicoProvider,
    AutenticacaoPersistenciaProvider,
    VariaveisGlobais,
    EstadoProvider,
    MunicipioProvider,
    ActionSheetController,
    App,
    Config,
    Platform,
    AlertController,
    LoadingController,


    NgForm, CookieService, CookieOptionsProvider, Util,
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
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  static injector: Injector;

  constructor(injector: Injector) {
    AppModule.injector = injector;
  }
}
