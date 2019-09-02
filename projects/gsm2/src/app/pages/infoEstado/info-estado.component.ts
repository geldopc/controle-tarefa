import { Component, OnInit } from "@angular/core";

@Component({
    selector: "page-infoEstado",
    templateUrl: "./info-estado.component.html",
    styleUrls: ["./info-estado.component.scss"]
})
// tslint:disable-next-line:component-class-suffix
export class InfoEstadoPage implements OnInit {

    aguardAt: number = 0;
    aguardDist: number = 0;
    aguardViab: number = 0;
    desenvolvimento: number = 0;
    homoBeta: number = 0;
    gerandoVersaoAlfa: number = 0;

    constructor() {}

    ngOnInit() {

    }

    numRand(): number {
        return Math.floor(Math.random() * 100);
    }

    updateNumbers() {
        this.aguardAt = this.numRand();
        this.aguardDist = this.numRand();
        this.aguardViab = this.numRand();
        this.desenvolvimento = this.numRand();
        this.homoBeta = this.numRand();
        this.gerandoVersaoAlfa = this.numRand();
    }

    info(estado) {
        console.log("Informação de ", estado);
    }
}
