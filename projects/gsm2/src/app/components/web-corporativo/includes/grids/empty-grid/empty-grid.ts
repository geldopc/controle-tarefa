import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-empty-grid',
  templateUrl: 'empty-grid.html'
})
export class EmptyGridComponent {

    @Input() message: string;

}
