import { Router, NavigationEnd } from "@angular/router";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "page-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          (<any>window).gtag("set", "page", event.urlAfterRedirects);
          (<any>window).gtag("send", "pageview");
        }
      }); }

  ngOnInit() {
  }

}
