import { GerenciadorSessao } from './../../services/util/GerenciadorSessao';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as $ from 'jquery';
import { Tuple } from '../../objects/entidades/Tuple';
import { Usuario } from '../../objects/entidades/Usuario';

@Component({
    selector: 'dropdown-multiselect',
    templateUrl: './dropdown-multiselect.component.html',
    styleUrls: ['./dropdown-multiselect.component.scss']
})
export class DropdownMultiselectComponent implements OnInit {

    name = "comboMultiple";
    @Input() listaCombo: Tuple[];
    @Input() label: String = "";
    @Input() singleSelection: boolean = false;
    funcionalidade: Tuple;
    private _listaSelecionados: Tuple[] = [];
    id: string;
    aberto: String = "fechado";
    dropdownSettings = {};
    usuarioSessao: Usuario = GerenciadorSessao.sessao.usuario;
    private controleFiltro: Boolean = true;
    @Input() tempo: number = 1000;
    @Input() disabled: false;

    @Output()
    private listaSelecionadosChange: EventEmitter<Tuple[]> = new EventEmitter<Tuple[]>();

    @Output()
    private itemSelectChange: EventEmitter<string> = new EventEmitter<string>();

    constructor() {
    }

    ngOnInit() {
        // console.log("listaCombo ngOnInit ", this.listaCombo);
        this.id = this.label.replace(/^\s*/, "").replace(/\s*$/, "");
        this.dropdownSettings = {
            singleSelection: this.singleSelection,
            idField: 'select',
            textField: 'show',
            selectAllText: 'Marcar todos...',
            unSelectAllText: 'Desmarcar todos...',
            itemsShowLimit: 1,
            allowSearchFilter: true,
            searchPlaceholderText: "Pesquisar...",
            noDataAvailablePlaceholderText: "Nenhum dado encontrado..."
          };
    }


    onItemSelect (item: any) {
        if (this.controleFiltro) {
            this.controleFiltro = !this.controleFiltro;
            setTimeout(() => { this.itemSelectChange.emit(); }, this.tempo);
        }
    }

    onSelectAll (items: any) {
        this.controleFiltro = !this.controleFiltro;
        // setTimeout(() => { this.itemSelectChange.emit(); }, 500);
    }

    @Input()
    onDeSelectAll (items: any) {
        this.controleFiltro = !this.controleFiltro;
        setTimeout(() => { this.itemSelectChange.emit(); }, 100);
    }

    setFiltro(funcionalidade, event) {

        // this.aberto = "open";
        // let component = event.parentElement.parentElement.parentElement;
        // console.log(component);
        // component.classList.add('open');
        // console.log(component);
        // $("#" + this.id).addClass("open");
        if (funcionalidade.select) {
            if (!this.listaSelecionados.find(f => f.select === funcionalidade.select)) {
                this._listaSelecionados.push(funcionalidade);
            } else {
                this._listaSelecionados.splice(this._listaSelecionados.indexOf(funcionalidade), 1);
            }
            this.listaSelecionados = this._listaSelecionados;
        } else {
            if (this._listaSelecionados && this._listaSelecionados.length === 0) {
                this.listaCombo.forEach(f => {
                    // if (f.select) {
                    this.listaSelecionados.push(f);
                    // }
                });
                // this._listaSelecionados = <any> JSON.parse(JSON.stringify(this.listaCombo));
            } else {
                this.listaSelecionados = [];
            }
        }
        // $("div#" + this.name + this.id).addClass("open");
        setTimeout(() => {
            $("div#" + this.name + this.id).addClass("open");
        }, 1);
    }


    getAdd(id): string {
        if (this.listaSelecionados.find(f => f.select === id)) {
            return "fa-check-square";
        } else {
            return "fa-square-o";
        }
    }

    getAllSelected(): number {
        return this.listaSelecionados.filter(f => f.select).length;
    }

    @Input()
    get listaSelecionados(): Tuple[] {
        return this._listaSelecionados;
    }

    set listaSelecionados(value: Tuple[]) {
        this._listaSelecionados = value;
        // console.log("listaSelecionados:: " + JSON.stringify(this.listaSelecionados));
        this.listaSelecionadosChange.emit(value);
    }

    close() {
        $("div#" + this.name + this.id).removeClass("open");
    }
}
