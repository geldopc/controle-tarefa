import { Tuple } from "./../../../../objects/entidades/Tuple";
import { Component, Input, Output, EventEmitter, ViewChild, ChangeDetectionStrategy } from "@angular/core";
import { Form } from "./../../../../objects/entidades/Form";
import { Instance } from "./../../../../objects/entidades/Instance";
// import { setTimeout } from "timers";
import { Select, Events } from "ionic-angular";
// import { Subject } from "rxjs/Subject";

@Component({
    selector: "sm-select-corporativo",
    templateUrl: "sm-select-corporativo.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SmSelectCorporativoComponent {

    @Input() id: string = "id";
    @Input() itensOptions: Tuple[];
    @Input() label = "label";
    @Input() required: boolean = true;
    @Input() formulario: Form;
    @Input() self: Instance;
    @Input() multiple: false;

    @Output() selectedValueChange = new EventEmitter();
    @Output() onChange = new EventEmitter();
    @Output() expandirChange = new EventEmitter();

    msgValue: string;
    // private validador;
    private _selectedValue; //valor selecionado
    private _expandir: boolean;
    @ViewChild("combo") select: Select;
    // subscription: Subject<void> = new Subject();

    constructor(private events: Events) {

    }

    ngOnInit() {
        if (this.formulario) {
            this.formulario.validadores.push(this);
        }
        if (this.self) {
            this.self.instance = this;
        }
    }

    ngAfterViewInit() {
        if (String(this.expandir) == "true" || this.expandir == true) {
            setTimeout(() => {
                this.select.open();
            }, 300);
        }
        this.events.subscribe('expandirCombo'+ this.id, () => {
            setTimeout(() => {
                // console.log("expandirCombo type: " + typeof this.expandir,' String(this.expandir):', String(this.expandir) + ' | ' + this.id);
                // É isso mesmo não mexer a variavel convert na tela para o tipo 'String'
                if (String(this.expandir) == "true" || this.expandir == true) {
                    this.select.open()
                }
            }, 500);
        });
        // let elem:Element = document.getElementById("combo" + this.id);
        // força a seleção do item no ion-select
        // this.select.ionFocus.subscribe(() => {
        //     console.log("ionFocus type: ");
        //     setTimeout(() => {
        //         this.select.open();
        //     }, 500);
        // });
        this.select.ionChange.subscribe(() => {
            this.events.publish('expandirCombo'+this.id, []);
        });
    }

    ngOnDestroy() {
        //Add 'implements OnDestroy' to the class.
        // this.subscription.unsubscribe();
    }

    @Input()
    get selectedValue() {
        return this._selectedValue;
    }
    set selectedValue(value) {
        this._selectedValue = value;
    }

    valueChanged() {
        this.selectedValueChange.emit(this._selectedValue);
        this.onChange.emit(this._selectedValue);
    }

    isValid() {
        return this.val();
    }

    @Input()
    get expandir(): boolean {
        return this._expandir;
    }
    set expandir(val: boolean) {
        this._expandir = val;
        this.expandirChange.emit(this._expandir);
    }

    private val = function () {
        var valid = this.validar();
        if (valid) {
            this.msgValue = valid;
            return false;
        } else {
            this.msgValue = null;
            //Envia o evento de mudança de valor/focus/blur para o componente que chamou o input em questão, caso seja um valor valido.
            return true;
        }
    }

    validar() {
        if (String(this.required) == "true") {
            if (!this._selectedValue) {
                return "Campo obrigatório";
            }
        }
        return null;
    }

    //retornar mensagem da validacao do campo
    get msg() {
        return this.msgValue;
    }

    disabled(): boolean {
        setTimeout(() => {
            if (this.itensOptions) {
                return false;
            }
        }, 300);
        return true;
    }

}
