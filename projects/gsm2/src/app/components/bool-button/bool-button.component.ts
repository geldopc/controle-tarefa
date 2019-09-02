import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
    selector: "app-bool-button",
    templateUrl: "./bool-button.component.html",
    styleUrls: ["./bool-button.component.css"]
})
export class BoolButtonComponent implements OnInit {

    @Input() label;
    @Input() labelTrue = 'Sim';
    @Input() labelFalse = 'Não';
    @Input() value: boolean;
    @Output() change = new EventEmitter();


    constructor() {
        // console.log("constructor...", this);
    }

    ngOnInit() {
        // console.log("ngOnInit...", this);
    }

    valueChanged(val) {
        // console.log("valudeChanged... ", this);
        this.value = val;
        this.change.emit(val);
    }
}
