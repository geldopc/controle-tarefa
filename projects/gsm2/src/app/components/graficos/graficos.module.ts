import { GraficoTemplateComponent } from './grafico-template.component';
import { GraficoLinhaComponent } from './grafico-linha/grafico-linha.component';
import { CaixaInformacoesComponent } from './caixa-informacoes/caixa-informacoes.component';
import { GraficoBarraComponent } from './grafico-barra/grafico-barra.component';
import { GraficoRadarComponent } from './grafico-radar/grafico-radar.component';
import { GraficoDinamicoComponent } from './grafico-dinamico/grafico-dinamico.component';
import { GraficoPizzaComponent } from './grafico-pizza/grafico-pizza.component';
import { ChartsModule } from 'ng2-charts';
import { GraficoDoughnutComponent } from './grafico-doughnut/grafico-doughnut.component';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [
    GraficoDoughnutComponent,
    GraficoPizzaComponent,
    GraficoDinamicoComponent,
    GraficoRadarComponent,
    GraficoBarraComponent,
    CaixaInformacoesComponent,
    GraficoLinhaComponent,
    GraficoTemplateComponent
  ],
  imports: [
    ChartsModule
    , IonicPageModule.forChild(GraficoTemplateComponent),
  ],
  exports: [
    GraficoDoughnutComponent,
    GraficoPizzaComponent,
    GraficoDinamicoComponent,
    GraficoRadarComponent,
    GraficoBarraComponent,
    CaixaInformacoesComponent,
    GraficoLinhaComponent,
    GraficoTemplateComponent
  ],
  providers: [

  ]
})
export class GraficosModule { }
