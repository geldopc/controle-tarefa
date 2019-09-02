import { Input } from '@angular/core';
import { Component } from '@angular/core';

@Component({
  selector: 'grid-generica-column',
  templateUrl: 'grid-generica-column.html',
})
export class GridGenericaColumnComponent {

  @Input() largura: number = 12;
  @Input() coltitulo: string;
  @Input() colconteudo: string;

  constructor() {
    
  }

}
