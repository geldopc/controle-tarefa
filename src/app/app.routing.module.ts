import { Router } from '@angular/router';
import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { EmpresaComponent } from './pages/empresa/empresa.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import { ProdutosComponent } from './pages/produtos/produtos.component';
import { ClientesComponent } from './pages/clientes/clientes.component';
import { ContatoComponent } from './pages/contato/contato.component';
import { NoticiasComponent } from './pages/noticias/noticias.component';
import { LancamentoSiapec3Component } from './pages/noticias/lancamento-siapec3/lancamento-siapec3.component';
import { LeituraComponent } from './components/noticias/leitura/leitura.component';
import { CasesdesucessoComponent } from './pages/casesdesucesso/casesdesucesso.component';


const appRoutes: Routes = [
  {
    path: 'inicio',
    component: InicioComponent
  },
  {
    path: 'quemsomos',
    component: EmpresaComponent
  },
  {
    path: 'produtos',
    component: ProdutosComponent
  },
  {
    path: 'clientes',
    component: ClientesComponent
  },
  {
    path: 'casosdesucesso',
    component: CasesdesucessoComponent
  },
  {
    path: 'noticias',
    component: NoticiasComponent
  },
  {
    path: 'noticias/leitura',
    component: LancamentoSiapec3Component
  },
  {
    path: 'contato',
    component: ContatoComponent
  },
  {
    path: '',
    redirectTo: '/inicio',
    pathMatch: 'full'
   },
  // { path: '**', component: AppAuthComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, { useHash: true, enableTracing: false })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
  constructor(private router: Router) {
    this.router.errorHandler = (error: any) => {
      console.log('............................. Error router', error);
      // this.router.navigate(['/paginanaoencontrada']); // quando houver erros de rotas
    };
  }
}
