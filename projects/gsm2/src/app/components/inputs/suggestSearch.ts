import { Component } from '@angular/core';
import { ViewController, NavParams, Platform } from 'ionic-angular';
import { Tuple } from '../../objects/entidades/Tuple';

@Component({
  selector: 'suggest-search',
  templateUrl: './suggestSearch.html'
})

export class SuggestSearch {
  baseItens: Tuple[];
  autocompleteItems: Tuple[];
  autocomplete: string;
  placeholder: string = "Buscar";
  public unregisterBackButtonAction: any;

  constructor(public viewCtrl: ViewController, params: NavParams, private platform: Platform) {
    this.autocomplete = params.get("autocomplete");
    this.baseItens = params.get("baseItens");
    this.placeholder = params.get("placeholder");
    this.updateSearch();
  }

  ionViewDidEnter() {
    this.initializeBackButtonCustomHandler();
  }

  ionViewWillLeave() {
    // Unregister the custom back button action for this page
    this.unregisterBackButtonAction && this.unregisterBackButtonAction();
  }

  public initializeBackButtonCustomHandler(): void {
    this.unregisterBackButtonAction = this.platform.registerBackButtonAction(() => {
      this.customHandleBackButton();
    }, 10);
  }

  private customHandleBackButton(): void {
    this.dismiss();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  chooseItem(item: Tuple) {
    this.viewCtrl.dismiss(item);
  }

  updateSearch() {
    if (this.baseItens) {
      this.autocompleteItems = this.baseItens.filter(
        item => {
          return this.searchRecursive(item);
        }
      );
    }
  }

  private searchRecursive(tupla: Tuple): boolean {

    if (tupla.show.toLowerCase().includes(this.autocomplete.toLowerCase())) {
      return true;
    } else if (tupla.select instanceof Tuple) {
      return this.searchRecursive(tupla.select);
    } else {
      return String(tupla.select).toLowerCase().includes(this.autocomplete.toLowerCase())
    }
  }

}
