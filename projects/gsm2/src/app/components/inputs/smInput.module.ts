import { smInput } from './smInput';
import { IonicPageModule } from "ionic-angular";
import { NgModule } from "@angular/core";

@NgModule({
  declarations: [
      smInput
  ],
  imports: [
    IonicPageModule.forChild(smInput),
  ],
  exports: [ 
      smInput 
  ]
})
export class SmInputModule { }