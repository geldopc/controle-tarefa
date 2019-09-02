import { SmAlertController } from './../../components/sm-alert-controller/sm-alert-controller.component';
import { OcorrenciaTipoProvider } from './../../providers/OcorrenciaTipoProvider';
import { OcorrenciaProdutoProvider } from './../../providers/OcorrenciaProdutoProvider';
import { OcorrenciaTipoService } from './../../services/OcorrenciaTipoService';
import { OcorrenciaProdutoService } from './../../services/OcorrenciaProdutoService';
import { Ocorrencia } from './../../objects/entidades/Ocorrencia';
import { ServicoProvider } from './../../providers/ServicoProvider';
import { VariaveisGlobais } from './../../objects/entidades/VariaveisGlobais';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegistrarOcorrenciasPage } from './registrar-ocorrencias';
import { OcorrenciaService } from '../../services/OcorrenciaService';
import { OcorrenciaProvider } from '../../providers/OcorrenciaProvider';
import { WebCorporativoComponentModule } from '../../components/web-corporativo/web-corporativo.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';



@NgModule({
  declarations: [
    RegistrarOcorrenciasPage,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    WebCorporativoComponentModule,
    IonicPageModule.forChild(RegistrarOcorrenciasPage),
  ],
  providers: [
    Ocorrencia,
    SmAlertController,
    OcorrenciaService,
    OcorrenciaProdutoService,
    OcorrenciaProdutoProvider,
    OcorrenciaTipoService,
    OcorrenciaTipoProvider,
    OcorrenciaProvider,
    VariaveisGlobais,
    ServicoProvider,
  ]
})
export class RegistrarOcorrenciasPageModule {}
