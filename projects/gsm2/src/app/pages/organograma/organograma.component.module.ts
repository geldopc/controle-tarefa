import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WebCorporativoComponentModule } from '../../components/web-corporativo/web-corporativo.module';
import { OrganogramaPage } from './organograma.component';
import { GraficosModule } from '../../components/graficos/graficos.module';
import { PainelOcorrenciaService } from '../../services/PainelOcorrenciaGsmService';
import { PainelOcorrenciaGsmProvider } from '../../providers/PainelOcorrenciaGsmProvider';
import { RouterModule } from '@angular/router';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { GridModule } from '@progress/kendo-angular-grid';

@NgModule({
    declarations: [
        OrganogramaPage,
    ],
    imports: [
        RouterModule,
        WebCorporativoComponentModule,
        GraficosModule,
        Ng4LoadingSpinnerModule.forRoot(),
        IonicPageModule.forChild(OrganogramaPage),
        GridModule,
    ],
    exports: [
        OrganogramaPage
    ],
    providers: [
        PainelOcorrenciaService,
        PainelOcorrenciaGsmProvider
    ]
})
export class OrganogramaPageModule { }
