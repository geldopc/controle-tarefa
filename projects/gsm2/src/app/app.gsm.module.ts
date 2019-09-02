import { Injector, NgModule } from "@angular/core";
import { FormsModule, NgForm } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { BrowserModule } from "@angular/platform-browser";
import { ServiceWorkerModule } from "@angular/service-worker";
import { IonicStorageModule } from "@ionic/storage";
import { TextMaskModule } from "angular2-text-mask";
import { IonicApp, IonicModule } from "ionic-angular";
import { RecaptchaModule, RecaptchaSettings, RECAPTCHA_LANGUAGE, RECAPTCHA_SETTINGS } from "ng-recaptcha";
import { CookieModule, CookieOptionsProvider, CookieService } from "ngx-cookie";
import { environment } from "../environments/environment";
import { AppGsmComponent } from "./app.component";
import { AppGsmRoutingModule } from "./app.gsm.routing.module";
import { WebCorporativoComponentModule } from "./components/web-corporativo/web-corporativo.module";
import { VariaveisGlobais } from "./objects/entidades/VariaveisGlobais";
import { HomeTecnicoPageModule } from "./pages/home-tecnico/home-tecnico.module";
import { HomePageModule } from "./pages/home/home.module";
import { LoginModule } from "./pages/login/login.module";
// import { PesquisarOcorrenciasPageModule } from "./pages/pesquisar-ocorrencias/pesquisar-ocorrencias.module";
import { EstadoProvider } from "./providers/estadoLocal/EstadoProvider";
import { AutenticacaoPersistenciaProvider } from "./providers/login/AutenticacaoPersistenciaProvider";
import { MunicipioProvider } from "./providers/municipioLocal/MunicipioProvider";
import { AuthService } from "./services/AuthService";
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AdministracaoPageModule } from "./pages/administracao/administracao.component.module";
import { Ng4LoadingSpinnerModule } from "ng4-loading-spinner";
import { OcorrenciasFinalizadasPageModule } from "./pages/tecnico/ocorrencias-paralisadas/ocorrencias-paralisadas.component.module";
import { AtualizacaoPageModule } from "./pages/atualizacao/atualizacao.module";
import { OrganogramaPageModule } from "./pages/organograma/organograma.component.module";
import { GrupoGestorPageModule } from "./pages/grupo-gestor/grupo-gestor.component.module";
import { InfoEstadoPageModule } from "./pages/infoEstado/info-estado.component.module";
import { GrupoGestorClientePageModule } from "./pages/grupo-gestor-clientes/grupo-gestor-cliente.component.module";
import { OcorrenciasAguardandoViabilidadePageModule } from "./pages/tecnico/ocorrencias-aguardando-viabilidade/ocorrencias-aguardando-viabilidade.component.module";
import { AgendaComponentModule } from "./pages/agenda/agenda.component.module";
import { HomeOcorrenciaFinalizadaPageModule } from "./pages/home-ocorrencia-finalizada/home-ocorrencia-finalizada.module";
import { ControleTarefaComponentModule } from "./pages/controle-tarefa/controle-tarefa.module";

@NgModule({
    declarations: [AppGsmComponent],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        AdministracaoPageModule,
        OrganogramaPageModule,
        InfoEstadoPageModule,
        AgendaComponentModule,
        GrupoGestorPageModule,
        GrupoGestorClientePageModule,
        HomePageModule,
        HomeOcorrenciaFinalizadaPageModule,
        HomeTecnicoPageModule,
        TextMaskModule,
        WebCorporativoComponentModule,
        AppGsmRoutingModule,
        LoginModule,
        AtualizacaoPageModule,
        OcorrenciasFinalizadasPageModule,
        OcorrenciasAguardandoViabilidadePageModule,
        ControleTarefaComponentModule,
        NgMultiSelectDropDownModule.forRoot(),
        Ng4LoadingSpinnerModule.forRoot(),
        CookieModule.forRoot(),
        IonicModule.forRoot(AppGsmComponent),
        IonicStorageModule.forRoot({
            name: "--l0f1m.sqlite",
            driverOrder: ["indexeddb", "websql"]
        }),
        RecaptchaModule.forRoot(),
        ServiceWorkerModule.register('/gsm/ngsw-worker.js', { enabled: environment.production })
    ],
    providers: [
        EstadoProvider,
        MunicipioProvider,
        VariaveisGlobais,
        NgForm,
        AuthService,
        AutenticacaoPersistenciaProvider,
        CookieService,
        CookieOptionsProvider,
        // { provide: LOCALE_ID, useValue: "pt" },
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
    bootstrap: [IonicApp]
})
export class AppGsmModule {
    static injector: Injector;

    constructor(injector: Injector) {
        AppGsmModule.injector = injector;
    }
}
