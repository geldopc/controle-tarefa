import { AppModule } from './../../../../../../src/app/app.module';
import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Estado } from "../../objects/entidades/Estado";
import { HTTPResponse } from "../../objects/entidades/HTTPResponse";

import "rxjs/add/operator/map";

@Injectable()
export class EstadoProvider {

  constructor(private http: Http) {}

  getEstados(): Estado[] {
    const estados: Estado[] = [];
    this.carregarEstados(estados);
    return estados;
  }

  carregarEstados(estados: Estado[]): Promise<Array<Estado>> {
    return;
  }


}
