import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'sm-button',
  templateUrl: './sm-button.component.html',
  styleUrls: ['./sm-button.component.scss']
})
export class SmButtonComponent implements OnInit {

  @Output() simpleClick: EventEmitter<string> = new EventEmitter<string>();
  @Input() color: String = 'default'; // default, warning, success, danger, primary
  @Input() label: String = '';
  @Input() faIcon: String = '';
  @Input() selecionado: String;
  @Input() processando: Boolean = false;

  constructor() { }

  ngOnInit() {
  }

  public funcao() {
    this.simpleClick.emit('');
  }

}
