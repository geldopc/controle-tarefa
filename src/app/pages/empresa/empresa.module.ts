import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmpresaComponent } from './empresa.component';
import { ComponentesModule } from '../../components/components.module';
import { AppRoutingModule } from '../../app.routing.module';

@NgModule({
  declarations: [
    EmpresaComponent
  ],
  imports: [
    CommonModule,
    ComponentesModule,
    AppRoutingModule
  ],
  exports: [
    EmpresaComponent
  ]

})
export class EmpresaModule { }
