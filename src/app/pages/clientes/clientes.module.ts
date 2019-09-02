import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentesModule } from '../../components/components.module';
import { ClientesComponent } from './clientes.component';
import { AppRoutingModule } from '../../app.routing.module';

@NgModule({
  declarations: [
    ClientesComponent
  ],
  imports: [
    CommonModule,
    ComponentesModule,
    AppRoutingModule
  ],
  exports: [
    ClientesComponent
  ]
})
export class ClientesModule { }
