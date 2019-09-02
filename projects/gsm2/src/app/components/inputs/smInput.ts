import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Form } from '../../objects/entidades/Form';

@Component({
    selector: 'smInput',
    templateUrl: 'smInput.html'
})
export class smInput {
    @Output() onChange: EventEmitter<any> = new EventEmitter<string>();
    @Input() class: string = 'input-group col-xs-12';
    @Input() type: string = 'text';
    @Input() incorreto: boolean = false;
    invalido: boolean = false;
    @Input() id: string = 'id';
    @Input() label: string = 'label';
    @Input() name: string = this.id;
    innerValue;
    @Output() valueChange = new EventEmitter();
    @Output() onBlurChange = new EventEmitter();
    @Input() placeholder: string = '';
    @Input() required: boolean = false;
    @Input() maxlength: number;
    @Input() minlength: number;
    @Input() formulario: Form;
    @Input() rendered: boolean = true;
    @Input() forceMaxLength: boolean = true;
    @Input() maxValue: number;
    @Input() minValue: number;
    @Input() readonly: boolean;
    private validador;
    private msgValue: string;

    ngOnInit() {
        if (this.formulario) {
            this.formulario.validadores.push(this);
        }
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
    }

    public isValid() {
        if (this.value && this.type != "email" && this.type != "password" && this.type != "number" && this.type != "tel") {
            this.value = this.value.toUpperCase();
        }

        if (this.forceMaxLength && this.value && this.value.length > this.maxlength) {
            this.value = this.value.substring(0, this.maxlength);
        }
        return this.val();
    }

    private val = function () {
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
    }

    onBlur(){
        this.onBlurChange.emit(this.value);
    }

    validar() {
        //é isso mesmo, não mecher
        if (String(this.required) == 'true') {
            if (!this.value) {
                return "Campo obrigatório";
            }
        }
        if (this.value) {
            if (this.value.length < this.minlength) {
                return "O campo deve ter ao menos " + this.minlength + " caracteres";
            }
            if (this.value.length > this.maxlength) {
                return "O campo deve ter no maximo " + this.maxlength + " caracteres";
            }
            if (this.maxValue != null && this.maxValue != undefined) {
                if (isNaN(Number(this.value))) {
                    return "Valor inválido, Somente números são aceitos";
                }
                if (Number(this.value) > this.maxValue) {
                    return "O valor informado não pode ser maior que " + this.maxValue;
                }
            }
            if (this.minValue != null && this.minValue != undefined) {
                if (isNaN(Number(this.value))) {
                    return "Valor inválido, Somente números são aceitos";
                }
                if (Number(this.value) < this.minValue) {
                    return "O valor informado não pode ser menor que " + this.minValue;
                }
            }
            if (this.validador) {
                return this.validador(this.value);
            }
            if (this.type.toLowerCase() == 'email') {
                var regexp = new RegExp('^([a-zA-Z0-9_\\-\\.]+)@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.)|(([a-zA-Z0-9\\-]+\\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})$');
                if (!regexp.test(this.value)) {
                    return "E-mail inválido"
                }
            }
        }
        return null;
    }

}
