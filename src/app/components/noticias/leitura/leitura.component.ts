import { Component, OnInit, Input } from '@angular/core';
import { Noticia } from '../../../objects/entidades/Noticia';

@Component({
  selector: 'app-leitura',
  templateUrl: './leitura.component.html',
  styleUrls: ['./leitura.component.css']
})
export class LeituraComponent implements OnInit {

  @Input() noticia: Noticia;

  constructor() { }

  ngOnInit() {
  }

}
