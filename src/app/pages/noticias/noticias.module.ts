import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoticiasComponent } from './noticias.component';
import { ComponentesModule } from '../../components/components.module';
import { AppRoutingModule } from '../../app.routing.module';
import { LancamentoSiapec3Module } from './lancamento-siapec3/lancamento-siapec3.module';

import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    NoticiasComponent,
  ],
  imports: [
    CommonModule,
    ComponentesModule,
    AppRoutingModule,
    LancamentoSiapec3Module,
    RouterModule
  ],
  exports: [
    NoticiasComponent
  ]
})
export class NoticiasModule { }
