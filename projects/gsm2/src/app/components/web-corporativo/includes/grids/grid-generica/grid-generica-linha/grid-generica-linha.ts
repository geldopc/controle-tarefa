import { Component, Input } from '@angular/core';

@Component({
  selector: 'grid-generica-linha',
  templateUrl: 'grid-generica-linha.html',
})
export class GridGenericaLinhaComponent {

  @Input() avatar: string = 'user';

  constructor() {
  }

}
