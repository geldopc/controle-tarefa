import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { ExcelModule, GridModule } from "@progress/kendo-angular-grid";
import { IonicPageModule } from 'ionic-angular';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { NgxMaskModule } from 'ngx-mask';
import { SmInputModule } from '../../components/inputs/smInput.module';
import { SmMaskedInputModule } from '../../components/inputs/smMaskedInput.module';
import { WebCorporativoComponentModule } from '../../components/web-corporativo/web-corporativo.module';
import { VariaveisGlobais } from '../../objects/entidades/VariaveisGlobais';
import { FuncionalidadeProvider } from '../../providers/FuncionalidadeProvider';
import { OcorrenciaGsmProvider } from '../../providers/OcorrenciaGsmProvider';
import { OcorrenciaProvider } from '../../providers/OcorrenciaProvider';
import { ServicoProvider } from '../../providers/ServicoProvider';
import { OcorrenciaGsmService } from '../../services/OcorrenciaGsmService';
import { OcorrenciaService } from '../../services/OcorrenciaService';
import { RegistrarOcorrenciasPageModule } from '../registrar-ocorrencias/registrar-ocorrencias.module';
import { HomeOcorrenciaFinalizadaPage } from './home-ocorrencia-finalizada';
import { FuncionalidadeService } from '../../services/FuncionalidadeService';

@NgModule({
    declarations: [
        HomeOcorrenciaFinalizadaPage,
    ],
    imports: [
        SmInputModule,
        SmMaskedInputModule,
        RegistrarOcorrenciasPageModule,
        WebCorporativoComponentModule,
        Ng4LoadingSpinnerModule.forRoot(),
        IonicPageModule.forChild(HomeOcorrenciaFinalizadaPage),
        NgxMaskModule.forRoot(),
        HttpClientModule,
        AngularEditorModule,
        GridModule,
        ExcelModule,
    ],
    exports: [
        HomeOcorrenciaFinalizadaPage
    ],
    providers: [
        OcorrenciaService,
        OcorrenciaProvider,
        OcorrenciaGsmService,
        OcorrenciaGsmProvider,
        FuncionalidadeService,
        FuncionalidadeProvider,
        VariaveisGlobais,
        ServicoProvider,
    ]
})
export class HomeOcorrenciaFinalizadaPageModule { }
