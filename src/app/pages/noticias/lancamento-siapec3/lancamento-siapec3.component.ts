import { Component, OnInit } from '@angular/core';
import { Noticia } from '../../../objects/entidades/Noticia';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-lancamento-siapec3',
  templateUrl: './lancamento-siapec3.component.html',
  styleUrls: ['./lancamento-siapec3.component.css']
})
export class LancamentoSiapec3Component implements OnInit {

  noticiaRecebida: Noticia;

  constructor(private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe((param: Noticia) => {
      this.noticiaRecebida = param;
    });
  }

}
