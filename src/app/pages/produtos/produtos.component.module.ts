import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProdutosComponent } from './produtos.component';
import { ComponentesModule } from '../../components/components.module';
import { AppRoutingModule } from '../../app.routing.module';

@NgModule({
  declarations: [
    ProdutosComponent
  ],
  imports: [
    CommonModule,
    ComponentesModule,
    AppRoutingModule
  ],
  exports: [
    ProdutosComponent
  ]
})
export class ProdutosModule { }
