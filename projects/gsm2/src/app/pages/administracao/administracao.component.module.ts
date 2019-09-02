import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WebCorporativoComponentModule } from '../../components/web-corporativo/web-corporativo.module';
import { AdministracaoPage } from './administracao.component';
import { GraficosModule } from '../../components/graficos/graficos.module';
import { PainelOcorrenciaService } from '../../services/PainelOcorrenciaGsmService';
import { PainelOcorrenciaGsmProvider } from '../../providers/PainelOcorrenciaGsmProvider';
import { RouterModule } from '@angular/router';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';

@NgModule({
    declarations: [
        AdministracaoPage,
    ],
    imports: [
        RouterModule,
        WebCorporativoComponentModule,
        GraficosModule,
        Ng4LoadingSpinnerModule.forRoot(),
        IonicPageModule.forChild(AdministracaoPage),
    ],
    exports: [
        AdministracaoPage
    ],
    providers: [
        PainelOcorrenciaService,
        PainelOcorrenciaGsmProvider
    ]
})
export class AdministracaoPageModule { }
