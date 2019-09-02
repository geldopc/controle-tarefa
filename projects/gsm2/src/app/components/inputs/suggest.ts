import { Component, Input, Output, EventEmitter } from "@angular/core";
import { ModalController } from "ionic-angular";
import { Tuple } from "../../objects/entidades/Tuple";
import { Form } from "../../objects/entidades/Form";
import { Instance } from "../../objects/entidades/Instance";
import { SuggestSearch } from "./suggestSearch";

@Component({
    selector: "smSuggest",
    templateUrl: "./suggest.html"
})
export class Suggest {

  @Input() id: number;
    @Output() onChange: EventEmitter<Tuple> = new EventEmitter<Tuple>();
    @Input() values: Tuple[];
    @Input() label = "label";
    @Input() required = true;
    @Input() formulario: Form;
    @Input() self: Instance;
    @Input() placeholder: string;
    @Input() initHidden: Boolean = true;
    @Output() valueChange = new EventEmitter();
    msgValue: string;
    innerValue: Tuple;

    private modalOpen: Boolean = false;

    constructor(private modalCtrl: ModalController) {
    }

    ngOnInit() {
      if (this.formulario) {
        this.formulario.validadores.push(this);
      }
      if (this.self) {
        this.self.instance = this;
      }
      if (this.initHidden === false) {
        this.showModal();
      }
    }

    @Input()
    get value(): Tuple {
        return this.innerValue;
    }

    set value(val: Tuple) {
        if (!val) {
            this.innerValue = new Tuple("", "");
        } else {
            this.innerValue = val;
        }
        this.valueChange.emit(this.innerValue);
    }

    get msg() {
        return this.msgValue;
    }

    disabled(): boolean {
        if (this.values) {
            return false;
        }
        return true;
    }

    showModal() {
      if (this.values && !this.modalOpen) {
        this.modalOpen = true;
        const modal = this.modalCtrl.create(SuggestSearch, { autocomplete: this.value.show, baseItens: this.values, placeholder: this.placeholder });
        modal.onDidDismiss(data => {
            if (data) {
                this.value = data;
                this.onChange.emit(this.value);
            }
            this.isValid();
            this.modalOpen = false;
        });
        modal.present();
      }
    }

    isValid() {
        if (this.required === true || String(this.required) === "true") {
          if (!this.value.show) {
              this.msgValue = "Campo obrigatório";
              return false;
          }
        }
        this.msgValue = null;
        return true;
    }

}
