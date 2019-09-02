import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NgxMaskModule } from 'ngx-mask';
import { FuncionalidadeService } from 'projects/gsm2/src/app/services/FuncionalidadeService';
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
import { HomePage } from './home';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { HttpClientModule} from '@angular/common/http';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { GridModule, ExcelModule } from "@progress/kendo-angular-grid";

@NgModule({
    declarations: [
        HomePage,
    ],
    imports: [
        SmInputModule,
        SmMaskedInputModule,
        RegistrarOcorrenciasPageModule,
        WebCorporativoComponentModule,
        Ng4LoadingSpinnerModule.forRoot(),
        IonicPageModule.forChild(HomePage),
        NgxMaskModule.forRoot(),
        HttpClientModule,
        AngularEditorModule,
        GridModule,
        ExcelModule,
    ],
    exports: [
        HomePage
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
export class HomePageModule { }
