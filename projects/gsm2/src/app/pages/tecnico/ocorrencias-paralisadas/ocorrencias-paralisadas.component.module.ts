
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OcorrenciasFinalizadasPage } from './ocorrencias-paralisadas.component';
import { WebCorporativoComponentModule } from '../../../components/web-corporativo/web-corporativo.module';
import { HomeTecnicoPageModule } from '../../home-tecnico/home-tecnico.module';



@NgModule({
  declarations: [
    OcorrenciasFinalizadasPage,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    WebCorporativoComponentModule,
    HomeTecnicoPageModule,
    IonicPageModule.forChild(OcorrenciasFinalizadasPage),
  ],
  providers: [
  ]
})
export class OcorrenciasFinalizadasPageModule {}
