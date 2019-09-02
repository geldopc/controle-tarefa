import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentesModule } from '../../components/components.module';
import { CasesdesucessoComponent } from './casesdesucesso.component';
import { AppRoutingModule } from '../../app.routing.module';

@NgModule({
  declarations: [
    CasesdesucessoComponent
  ],
  imports: [
    CommonModule,
    ComponentesModule,
    AppRoutingModule
  ],
  exports: [
    CasesdesucessoComponent
  ]
})
export class CasesdesucessoModule { }
