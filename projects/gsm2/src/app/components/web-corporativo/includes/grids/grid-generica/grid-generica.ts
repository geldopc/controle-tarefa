import { Tuple } from './../../../../../objects/entidades/Tuple';
import { Component, EventEmitter, ContentChild, TemplateRef } from '@angular/core';
import { Output, Input } from '@angular/core';

export class GridGenericaCustomizado {
  titulo: string;
  labelEvidencia: any;
  textoEvidencia: any;
  objeto: any;
  grupoDeColuna: Tuple[]
  constructor(){ }

  convert(titulo:string, evidencia: {label: any, texto:any}, objeto: any, grupoDeColuna?: Array<Tuple> ) : GridGenericaCustomizado{
    this.titulo = titulo;
    this.labelEvidencia = evidencia.label;
    this.textoEvidencia = evidencia.texto;
    this.objeto = objeto;
    this.grupoDeColuna = grupoDeColuna;
    return this;
  }
}
@Component({
  selector: 'grid-generica',
  templateUrl: 'grid-generica.html',
})
export class GridGenericaComponent {

  private _grid: GridGenericaCustomizado[];
  @Output() gridChange = new EventEmitter();

  @ContentChild('lineHeader') lineHeaderTmpl: TemplateRef<any>;
  @ContentChild('lineContent') lineContentTmpl: TemplateRef<any>;

  constructor() {
  }

  fecharAbrirModulo(divHeader) {
    let divModulo = divHeader.parentElement;
    let contemClasseFechado = divModulo.className.indexOf('fechado') > -1;
    var els = document.querySelectorAll('.corpo-grid');
    for (var i = 0; i < els.length; i++) {
        els[i].setAttribute("class", "corpo-grid fechado");
    }
    if (contemClasseFechado) {
        divModulo.classList.toggle('fechado');
    }
  }

  @Input()
  get grid(): GridGenericaCustomizado[]{
    return this._grid;
  }

  set grid(arr: GridGenericaCustomizado[]){
    this._grid = arr;
    this.gridChange.emit(this._grid);
  }

}
