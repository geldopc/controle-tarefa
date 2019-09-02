import { Component, Input, Output, EventEmitter } from "@angular/core";
import { Form } from "../../objects/entidades/Form";
import { Masks } from "../validators/masks";

@Component({
    selector: "smMaskedInput",
    templateUrl: "smMaskedInput.html"
})
export class SmMaskedInput {
    @Output() onChange: EventEmitter<any> = new EventEmitter<string>();
    @Input() class: string = "input-group col-xs-12";
    @Input() type: string = "text";
    @Input() incorreto: boolean = false;
    @Input() id: string = "id";
    @Input() label: string = "label";
    @Input() name: string = this.id;
    @Input() maxlength: number;
    _screenValue: string;
    innerValue: any;
    @Output() valueChange = new EventEmitter();
    @Input() placeholder: string = "";
    @Input() required: boolean = false;
    @Input() formulario: Form;
    @Input() mascara: String;
    @Input() rendered: boolean = true;
    minlength: number;
    private masks: Masks;
    private msgValue: string;
    invalido: boolean;

    ngOnInit() {
        if (this.formulario) {
            this.formulario.validadores.push(this);
        }
        this.masks = new Masks(this.mascara);
        if (this.value) {
            this.screenValue = this.masks.inserirMascara(this.value.toString());
        }
    }

    private formatarMascara(valor: string): string {
        this.masks = new Masks(this.mascara);
        return this.masks.inserirMascara(valor);
    }

    get msg() {
        return this.msgValue;
    }

    @Input()
    get value() {
        return this.innerValue;
    }

    set value(val) {
        this.innerValue = val;
        this.valueChange.emit(this.innerValue);
        if (!this.value) {
            this.screenValue = "";
        }
    }

    get screenValue() {
        return this._screenValue;
    }

    set screenValue(valor: string) {
        this.masks = new Masks(this.mascara);
        if (valor) {
            let tempVal = valor.replace(/\D+/g, "");
            this.masks.ajustMask(tempVal.length);
            if (tempVal.length > this.masks.maxLength) {
                tempVal = tempVal.substring(0, this.masks.maxLength);
            }
            this.value = tempVal;
        }
        this.isValid();
        this._screenValue = this.formatarMascara(this.value);
    }

    public isValid() {
        return this.val();
    }

    private val = function() {
        var valid = this.validar();
        if (valid) {
            this.msgValue = valid;
            return false;
        } else {
            this.msgValue = null;
            //Envia o evento de mudança de valor/focus/blur para o componente que chamou o input em questão, caso seja um valor valido.
            this.onChange.emit(this.value);
            return true;
        }
    };

    validar() {
        this.invalido = true;
        //é isso mesmo, não mecher
        if (String(this.required) == "true") {
            if (!this.value) {
                return "Campo obrigatório";
            }
        }
        if (this.value) {
            if (this.value.length < this.masks.minLength) {
                return (
                    "O campo deve ter ao menos " +
                    this.masks.minLength +
                    " caracteres"
                );
            } else if (this.value.length > this.masks.maxLength) {
                return (
                    "O campo deve ter no maximo " +
                    this.masks.maxLength +
                    " caracteres"
                );
            } else {
                var invalid: String = this.masks.validar(this.value);
                if (invalid) {
                    return invalid;
                }
            }
        }
        this.invalido = false;
        this.minlength = 0;
        return null;
    }
}
