import { EsqueceuSenhaComponent } from './components/modal-gsm/esqueceu-senha/esqueceu-senha.component';
import { NgModule } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';
import { AdministracaoPage } from './pages/administracao/administracao.component';
import { AtualizacaoPage } from './pages/atualizacao/atualizacao';
import { HomeTecnicoPage } from './pages/home-tecnico/home-tecnico';
import { HomePage } from './pages/home/home';
import { LoginComponent } from './pages/login/login.component';
import { RegistrarOcorrenciasPage } from './pages/registrar-ocorrencias/registrar-ocorrencias';
import { OcorrenciasFinalizadasPage } from './pages/tecnico/ocorrencias-paralisadas/ocorrencias-paralisadas.component';
import { AuthGuard } from './seguranca/guards/auth.guard';
import { OrganogramaPage } from './pages/organograma/organograma.component';
import { GrupoGestorPage } from './pages/grupo-gestor/grupo-gestor.component';
import { InfoEstadoPage } from './pages/infoEstado/info-estado.component';
import { GrupoGestorClientePage } from './pages/grupo-gestor-clientes/grupo-gestor-cliente.component';
import { OcorrenciasAguardandoViabilidadePage } from './pages/tecnico/ocorrencias-aguardando-viabilidade/ocorrencias-aguardando-viabilidade.component';
import { AgendaComponent } from './pages/agenda/agenda.component';
import { HomeOcorrenciaFinalizadaPage } from './pages/home-ocorrencia-finalizada/home-ocorrencia-finalizada';
import { ControleTarefaComponent } from './pages/controle-tarefa/controle-tarefa';

const appRoutes: Routes = [
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'esqueceu-senha',
        component: EsqueceuSenhaComponent
    },
    {
        path: 'painel/administracao',
        component: AdministracaoPage,
        canActivate: [AuthGuard]
    },
    {
        path: 'painel/organograma',
        component: OrganogramaPage,
        canActivate: [AuthGuard]
    },
    {
        path: 'painel/info-estado',
        component: InfoEstadoPage,
        canActivate: [AuthGuard]
    },
    {
        path: 'painel/agenda',
        component: AgendaComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'painel/grupoGestor',
        component: GrupoGestorPage,
        canActivate: [AuthGuard]
    },
    {
        path: 'painel/grupoGestorCliente',
        component: GrupoGestorClientePage,
        canActivate: [AuthGuard]
    },
    {
        path: 'cadastros',
        loadChildren: './pages/cadastros/cadastros.routing.module#CadastrosRoutingModule',
        canActivate: [AuthGuard]
    },
    {
        path: 'home',
        component: HomePage,
        canActivate: [AuthGuard]
    },
    {
        path: 'home-ocorrencia-finalizada',
        component: HomeOcorrenciaFinalizadaPage,
        canActivate: [AuthGuard]
    },
    {
        path: 'home-tecnico',
        component: HomeTecnicoPage,
        canActivate: [AuthGuard]
    },
    {
        path: 'controle-tarefa',
        component: ControleTarefaComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'painel/atualizacao',
        component: AtualizacaoPage,
        canActivate: [AuthGuard]
    },
    {
        path: 'tecnico-ocorrencias-finalizadas',
        component: OcorrenciasFinalizadasPage,
        canActivate: [AuthGuard]
    },
    {
        path: 'tecnico-aguardando-viabilidade',
        component: OcorrenciasAguardandoViabilidadePage,
        canActivate: [AuthGuard]
    },
    {
        path: 'registrar',
        component: RegistrarOcorrenciasPage,
        canActivate: [AuthGuard]
    },
    {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'
    },
    { path: '**', component: LoginComponent }
];

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes, { useHash: true, enableTracing: false })
    ],
    exports: [RouterModule],
    providers: [AuthGuard]
})
export class AppGsmRoutingModule {
    constructor(private router: Router) {
        this.router.errorHandler = (error: any) => {
            console.log('............................. Error router', error);
            // this.router.navigate(['/paginanaoencontrada']); // quando houver erros de rotas
        };
    }
}
