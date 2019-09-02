import { Instance } from './../../objects/entidades/Instance';
import { Form } from './../../objects/entidades/Form';
import { Tuple } from "./../../objects/entidades/Tuple";
import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";
import * as $ from 'jquery';

@Component({
    selector: "sm-dropdown",
    templateUrl: "./sm-dropdown.component.html",
    styleUrls: ["./sm-dropdown.component.css"]
})
export class SmDropdownComponent implements OnInit {
    @Input() listaItens: Tuple[];
    @Input() descricao = "label";
    @Input() required: Boolean = true;
    @Input() formulario: Form;
    @Input() self: Instance;
    @Input() multiple: false;

    @Output() selectedValueChange = new EventEmitter();
    @Output() onChange = new EventEmitter();

    private _selectedValue; //valor selecionado
    msgValue: string;

    constructor() {}

    ngOnInit() {
        if (this.formulario) {
            this.formulario.validadores.push(this);
        }
        if (this.self) {
            this.self.instance = this;
        }
    }

    ngAfterViewChecked() {
        //Called after every check of the component's view. Applies to components only.
        //Add 'implements AfterViewChecked' to the class.

    }

    @Input()
    get selectedValue() {
        return this._selectedValue;
    }
    set selectedValue(value) {
        this._selectedValue = value;
    }

    valueChanged() {
        console.log("valudeChanged... ");
        this.selectedValueChange.emit(this._selectedValue);
        this.onChange.emit(this._selectedValue);
    }

    isValid() {
        return this.val();
    }

    private val(): Boolean {
        const valid = this.validar();
        if (valid) {
            this.msgValue = valid;
            return false;
        } else {
            this.msgValue = null;
            // Envia o evento de mudança de valor/focus/blur para o componente que chamou o input em questão, caso seja um valor valido.
            return true;
        }
    }

    validar() {
        if (String(this.required) === "true") {
            if (!this._selectedValue) {
                return "Campo obrigatório";
            }
        }
        return null;
    }

    // retornar mensagem da validacao do campo
    get msg() {
        return this.msgValue;
    }

    disabled(): boolean {
        setTimeout(() => {
            if (this.listaItens) {
                return false;
            }
        }, 300);
        return true;
    }
}
