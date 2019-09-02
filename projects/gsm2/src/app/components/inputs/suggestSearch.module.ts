import { SuggestSearch } from './suggestSearch';
import { IonicPageModule } from "ionic-angular";
import { NgModule } from "@angular/core";

@NgModule({
  declarations: [
      SuggestSearch
  ],
  imports: [
    IonicPageModule.forChild(SuggestSearch),
  ],
  exports: [ 
      SuggestSearch 
  ]
})
export class SmSuggestSearchModule { }