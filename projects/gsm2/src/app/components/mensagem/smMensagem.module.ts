import { SmMensagem } from './smMensagem';
import { IonicPageModule } from "ionic-angular";
import { NgModule } from "@angular/core";

@NgModule({
  declarations: [
      SmMensagem
  ],
  imports: [
    IonicPageModule.forChild(SmMensagem),
  ],
  exports: [
      SmMensagem
  ]
})
export class SmMensagemModule { }
