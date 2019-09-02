import { Router, NavigationEnd } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-produtos',
  templateUrl: './produtos.component.html',
  styleUrls: ['./produtos.component.css']
})
export class ProdutosComponent implements OnInit {

  constructor(
    private router: Router) {
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
              (<any>window).gtag("set", "page", event.urlAfterRedirects);
              (<any>window).gtag("send", "pageview");
            }
          }); }

  ngOnInit() {
  }

}
