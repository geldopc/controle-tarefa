import { NgModule } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../seguranca/guards/auth.guard';
import { ProgramaFuncionalidadePage } from './programa-funcionalidade/programa-funcionalidade.component';
import { WebCorporativoComponentModule } from '../../components/web-corporativo/web-corporativo.module';

const appRoutes: Routes = [

    {
        path: 'programaFuncionalidade',
        component: ProgramaFuncionalidadePage,
        canActivate: [AuthGuard]
    },
];

@NgModule({
    imports: [
        WebCorporativoComponentModule,
        RouterModule.forRoot(appRoutes, { useHash: true, enableTracing: false })
    ],
    declarations:[
        ProgramaFuncionalidadePage
    ],
    exports: [RouterModule],
    providers: [AuthGuard]
})
export class CadastrosRoutingModule {
    constructor(private router: Router) {
        this.router.errorHandler = (error: any) => {
            console.log('............................. Error router', error);
        };
    }
}
