import { RecaptchaModule } from 'ng-recaptcha';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CabecalhoComponent } from './cabecalho/cabecalho.component';
import { RodapeComponent } from './rodape/rodape.component';
import { BannerComponent } from './banner/banner.component';
import { OndeEstamosComponent } from './onde-estamos/onde-estamos.component';
import { AppRoutingModule } from '../app.routing.module';
import { ModalFacaParteSmComponent } from './modal-faca-parte-sm/modal-faca-parte-sm.component';
import { LeituraComponent } from './noticias/leitura/leitura.component';
import { NoticiasMiniaturaComponent } from './noticias/noticias-miniatura/noticias-miniatura.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RecaptchaSmComponent } from './recaptcha-sm/recaptcha-sm.component';
import { RecaptchaFormsModule } from 'ng-recaptcha/forms';

@NgModule({
  declarations: [
    CabecalhoComponent,
    RodapeComponent,
    BannerComponent,
    OndeEstamosComponent,
    ModalFacaParteSmComponent,
    LeituraComponent,
    NoticiasMiniaturaComponent,
    RecaptchaSmComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RecaptchaFormsModule,
    AppRoutingModule,
    RecaptchaModule.forRoot(),
  ],
  exports: [
    CabecalhoComponent,
    RodapeComponent,
    BannerComponent,
    OndeEstamosComponent,
    LeituraComponent,
    NoticiasMiniaturaComponent,
  ],
  providers: [],
})
export class ComponentesModule { }
