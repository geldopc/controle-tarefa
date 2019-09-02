
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OcorrenciasAguardandoViabilidadePage } from './ocorrencias-aguardando-viabilidade.component';
import { WebCorporativoComponentModule } from '../../../components/web-corporativo/web-corporativo.module';
import { HomeTecnicoPageModule } from '../../home-tecnico/home-tecnico.module';



@NgModule({
  declarations: [
    OcorrenciasAguardandoViabilidadePage,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    WebCorporativoComponentModule,
    HomeTecnicoPageModule,
    IonicPageModule.forChild(OcorrenciasAguardandoViabilidadePage),
  ],
  providers: [
  ]
})
export class OcorrenciasAguardandoViabilidadePageModule {}
