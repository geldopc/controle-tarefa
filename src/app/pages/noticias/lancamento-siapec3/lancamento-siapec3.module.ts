import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LancamentoSiapec3Component } from './lancamento-siapec3.component';
import { ComponentesModule } from '../../../components/components.module';
import { AppRoutingModule } from '../../../app.routing.module';

@NgModule({
  declarations: [
    LancamentoSiapec3Component,
  ],
  imports: [
    CommonModule,
    ComponentesModule,
    AppRoutingModule
  ],
  exports: [
    LancamentoSiapec3Component
  ]
})
export class LancamentoSiapec3Module { }
