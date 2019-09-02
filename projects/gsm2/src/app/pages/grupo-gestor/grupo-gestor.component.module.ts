import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GridModule } from '@progress/kendo-angular-grid';
import { IonicPageModule } from 'ionic-angular';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { GraficosModule } from '../../components/graficos/graficos.module';
import { WebCorporativoComponentModule } from '../../components/web-corporativo/web-corporativo.module';
import { GrupoGestorProvider } from '../../providers/GrupoGestorProvider';
import { GrupoGestorService } from '../../services/GrupoGestorService';
import { GrupoGestorPage } from './grupo-gestor.component';
import { ProgramaProvider } from '../../providers/ProgramaProvider';
import { ProgramaService } from '../../services/ProgramaService';

@NgModule({
    declarations: [
        GrupoGestorPage,
    ],
    imports: [
        RouterModule,
        WebCorporativoComponentModule,
        GraficosModule,
        GridModule,
        Ng4LoadingSpinnerModule.forRoot(),
        IonicPageModule.forChild(GrupoGestorPage),
    ],
    exports: [
        GrupoGestorPage
    ],
    providers: [
        GrupoGestorService,
        GrupoGestorProvider,
        ProgramaService,
        ProgramaProvider
    ]
})
export class GrupoGestorPageModule { }
