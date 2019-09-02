import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Municipio } from '../../objects/entidades/Municipio';

@Injectable()
export class MunicipioProvider {

	constructor(private http: Http) { }

	getMunicipios(): Municipio[] {
		let municipios: Municipio[] = [];
		this.carregarMunicipios(municipios);
		return municipios;
	}

	private carregarMunicipios(municipios: Municipio[]): Promise<Array<Municipio>> {
	// 	return new Promise<Municipio[]>((resolve, reject) => {
	// 		let url = "assets/dados/municipios.json"
	// 		this.http.request(url).map(res => {
	// 			res.json().municipios.forEach(municipio => {
	// 				municipios.push(municipio);
	// 			});
	// 			municipios.sort(function (a, b) {
	// 				return a.dsMunicipio < b.dsMunicipio ? -1 : a.dsMunicipio == b.dsMunicipio ? 0 : 1;
	// 			});
	// 			return municipios;
	// 		}).subscribe(resolve, reject);
	// 	});
	// }
	return;
	}

}
