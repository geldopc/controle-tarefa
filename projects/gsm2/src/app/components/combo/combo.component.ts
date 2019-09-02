import { Instance } from './../../objects/entidades/Instance';
import { Form } from './../../objects/entidades/Form';
import { Tuple } from "./../../objects/entidades/Tuple";
import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";
import * as $ from 'jquery';

@Component({
    selector: "combo",
    templateUrl: "./combo.component.html",
    styleUrls: ["./combo.component.css"]
})
export class ComboComponent implements OnInit {

    @Input() itens: any[] = [];
    @Input() label;
    @Input() required: boolean;
    @Input() self: Instance;
    @Input() campoDesc: string;
    @Input() campoValor: string;
    @Input() id: string;
    @Input() value: any;
    @Output() change = new EventEmitter();

    selectedValue: any;
    msgValue: string;
    descricao: string = 'Selecione...';
    reqMsg: string;


    constructor() {
        console.log("constructor...", this);
    }

    ngOnInit() {
        console.log("ngOnInit...", this);
        if (this.self) {
            this.self.instance = this;
        }
    }

    valueChanged() {
        console.log("valudeChanged... ", this);
        this.change.emit(this.selectedValue);
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
            if (!this.selectedValue) {
                return "Campo obrigatório";
            }
        }
        return null;
    }

    // retornar mensagem da validacao do campo
    get msg() {
        return this.msgValue;
    }

    setValue(item) {
        console.log("setValue...", this);
        this.value = item[this.campoValor];
        this.selectedValue = item[this.campoValor];
        this.descricao = item[this.campoDesc];
        this.valueChanged();
    }

    getDesc(item): string {
        // console.log("getValue...", this);
        return item[this.campoDesc];
    }
}
