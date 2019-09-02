import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WebCorporativoComponentModule } from '../../components/web-corporativo/web-corporativo.module';
import { GraficosModule } from '../../components/graficos/graficos.module';
import { PainelOcorrenciaService } from '../../services/PainelOcorrenciaGsmService';
import { PainelOcorrenciaGsmProvider } from '../../providers/PainelOcorrenciaGsmProvider';
import { RouterModule } from '@angular/router';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { InfoEstadoPage } from './info-estado.component';

@NgModule({
    declarations: [
        InfoEstadoPage,
    ],
    imports: [
        RouterModule,
        WebCorporativoComponentModule,
        GraficosModule,
        Ng4LoadingSpinnerModule.forRoot(),
        IonicPageModule.forChild(InfoEstadoPage),
    ],
    exports: [
        InfoEstadoPage
    ],
    providers: [
        PainelOcorrenciaService,
        PainelOcorrenciaGsmProvider
    ]
})
export class InfoEstadoPageModule { }
