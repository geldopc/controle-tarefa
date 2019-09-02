import { Suggest } from './suggest';
import { IonicPageModule } from "ionic-angular";
import { NgModule } from "@angular/core";

@NgModule({
  declarations: [
      Suggest
  ],
  imports: [
    IonicPageModule.forChild(Suggest),
  ],
  exports: [ 
      Suggest 
  ]
})
export class SmSuggestModule { }