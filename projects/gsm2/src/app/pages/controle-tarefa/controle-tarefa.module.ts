import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { CountUpModule } from 'countup.js-angular2';
import { IonicPageModule } from "ionic-angular";
import { NgxPaginationModule } from 'ngx-pagination';
import { WebCorporativoComponentModule } from "../../components/web-corporativo/web-corporativo.module";
import { ControleTarefaComponent } from "./controle-tarefa";

@NgModule({
    declarations: [
        ControleTarefaComponent,
    ],
    imports: [
        BrowserModule, NgxPaginationModule, WebCorporativoComponentModule, CountUpModule, RouterModule,
        IonicPageModule.forChild(ControleTarefaComponent),
    ],
    exports: [
        ControleTarefaComponent
    ],
    providers: [

    ]
})
export class ControleTarefaComponentModule { }
