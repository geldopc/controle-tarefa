import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InicioComponent } from './inicio.component';
import { ComponentesModule } from '../../components/components.module';
import { EmpresaModule } from '../empresa/empresa.module';
import { ProdutosModule } from '../produtos/produtos.component.module';
import { ClientesModule } from '../clientes/clientes.module';
import { NoticiasModule } from '../noticias/noticias.module';
import { ContatoModule } from '../contato/contato.module';
import { RouterModule } from '@angular/router';
import { CasesdesucessoModule } from '../casesdesucesso/casesdesucesso.module';

@NgModule({
  declarations: [InicioComponent],
  imports: [
    CommonModule,
    ComponentesModule,
    EmpresaModule,
    ProdutosModule,
    ClientesModule,
    NoticiasModule,
    ContatoModule,
    CasesdesucessoModule,
    RouterModule
  ],
  providers: [
  ],
  exports: [InicioComponent]
})
export class InicioModule { }
