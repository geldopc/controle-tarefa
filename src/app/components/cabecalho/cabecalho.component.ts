import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
@Component({
  selector: 'app-cabecalho',
  templateUrl: './cabecalho.component.html',
  styleUrls: ['./cabecalho.component.css']
})
export class CabecalhoComponent {

  esconder: Boolean = true;

  constructor() { }

  ngAfterContentInit() {
    $('.ul_main li').mouseenter(function() {
      $(this).find('ul').fadeIn('fast', function() {});
    })
    .mouseleave(function() {
      $(this).find('ul').fadeOut('fast', function() {});
    });
  }

  aparecer() {
    this.esconder = this.esconder;
  }


}
