import { Component, Input } from "@angular/core";

@Component({
  selector: "sm-mensagem",
  templateUrl: "smMensagem.html",
  styleUrls: ["./smMensagem.scss"]
})
export class SmMensagem {
  @Input() mensagem: string;
  @Input() esconderQuandoVazio: Boolean = true;

  private _cor: string;

  set cor(value) {
    // verifica se a cor é uma cor válida!
    switch (value) {
      case "red":
      case "blue":
      case "green":
        this._cor = value;
        break;
      default:
        console.log(new Error("Cor inválida: " + value));
    }
  }

  @Input()
  get esconder() {
    return this.esconderQuandoVazio ? this.mensagem == null : false;
  }

  @Input()
  get cor() {
    return this._cor;
  }
}
