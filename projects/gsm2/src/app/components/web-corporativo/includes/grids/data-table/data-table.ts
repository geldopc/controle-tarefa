import { Component, ContentChild, TemplateRef, Output, EventEmitter } from '@angular/core';
import { Input } from '@angular/core';

@Component({
	selector: 'data-table',
	templateUrl: 'data-table.html',
})
export class DataTableComponent {

	@Input() titulo: string;
	@Input() subTitulo: string;
	@Input() columnsHeader: string[];
	@Input() values: any[];
	@Input() rendered: boolean;
	@Output() row: any;

	@ContentChild('lineContent') lineContentTmpl: TemplateRef<any>; 
	
	constructor() {
	}

	@Output() actionClick = new EventEmitter();

	clickRow(row: any) {
		this.row = row;
		this.actionClick.emit(row);
	}
}
