import { RegistrarOcorrenciasPageModule } from '../registrar-ocorrencias/registrar-ocorrencias.module';
import { ServicoProvider } from '../../providers/ServicoProvider';
import { VariaveisGlobais } from '../../objects/entidades/VariaveisGlobais';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SmInputModule } from '../../components/inputs/smInput.module';
import { SmMaskedInputModule } from '../../components/inputs/smMaskedInput.module';
import { WebCorporativoComponentModule } from '../../components/web-corporativo/web-corporativo.module';
import { OcorrenciaService } from '../../services/OcorrenciaService';
import { OcorrenciaProvider } from '../../providers/OcorrenciaProvider';
import { NgxMaskModule } from 'ngx-mask';
import { HomeTecnicoPage } from './home-tecnico';
import { HttpClientModule} from '@angular/common/http';
import { AngularEditorModule } from '@kolkov/angular-editor';

@NgModule({
    declarations: [
        HomeTecnicoPage,
    ],
    imports: [
        SmInputModule,
        SmMaskedInputModule,
        RegistrarOcorrenciasPageModule,
        WebCorporativoComponentModule,
        IonicPageModule.forChild(HomeTecnicoPage),
        NgxMaskModule.forRoot(),
        HttpClientModule,
        AngularEditorModule
    ],
    exports: [
        HomeTecnicoPage
    ],
    providers: [
        OcorrenciaService,
        OcorrenciaProvider,
        VariaveisGlobais,
        ServicoProvider,
    ]
})
export class HomeTecnicoPageModule { }
