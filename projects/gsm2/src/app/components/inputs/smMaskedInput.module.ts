import { SmMaskedInput } from './smMaskedInput';
import { IonicPageModule } from "ionic-angular";
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [
    SmMaskedInput
  ],
  imports: [
    IonicPageModule.forChild(SmMaskedInput),
  ],
  exports: [
    SmMaskedInput
  ],
})
export class SmMaskedInputModule { }