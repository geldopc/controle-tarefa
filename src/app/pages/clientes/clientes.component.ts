import { Router, NavigationEnd } from "@angular/router";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-clientes",
  templateUrl: "./clientes.component.html",
  styleUrls: ["./clientes.component.css"]
})
export class ClientesComponent implements OnInit {

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          (<any>window).gtag("set", "page", event.urlAfterRedirects);
          (<any>window).gtag("send", "pageview");
        }
      });
   }

  ngOnInit() {
  }

}
