import { Router, NavigationEnd } from "@angular/router";
import { Noticia } from "./../../objects/entidades/Noticia";
import { Component, OnInit } from "@angular/core";
import * as $ from "jquery";
import { Http } from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";

@Component({
    selector: "app-inicio",
    templateUrl: "./inicio.component.html",
    styleUrls: ["./inicio.component.css"]
})
export class InicioComponent implements OnInit {
    noticias: Array<Noticia> = [];

    constructor(private http: Http, private router: Router) {
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                (<any>window).gtag("set", "page", event.urlAfterRedirects);
                (<any>window).gtag("send", "pageview");
            }
        });
    }

    ngAfterViewInit() {
        $(".loading").fadeOut("slow");
        $("body").addClass("loaded");
    }

    ngOnInit() {
        this.carregarNoticias();
    }

    carregarNoticias(): Promise<Array<Noticia>> {
        return new Promise<Noticia[]>((resolve, reject) => {
            const url = "assets/dados/noticias.json";
            this.http
                .request(url)
                .map(res => {
                    res.json().noticias.forEach(element => {
                        element.data = new Date(element.data);
                        this.noticias.push(element);
                    });
                    return this.noticias;
                })
                .subscribe(resolve, reject);
        });
    }
}
