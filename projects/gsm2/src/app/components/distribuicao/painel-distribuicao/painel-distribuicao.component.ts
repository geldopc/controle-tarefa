import { Component, OnInit, Input } from '@angular/core';
import { OcorrenciaGsm } from '../../../objects/entidades/OcorrenciaGsm';
import { FiltrosPesquisaTecnicoComponent, FiltrosPesquisa } from '../../filtros-pesquisa-tecnico/filtros-pesquisa-tecnico.component';

@Component({
  selector: 'painel-distribuicao',
  templateUrl: './painel-distribuicao.component.html',
  styleUrls: ['./painel-distribuicao.component.css']
})
export class PainelDistribuicaoComponent implements OnInit {

  @Input() ocorrenciaSelecionada: OcorrenciaGsm;
  @Input() filtrosPesquisaTecnico: FiltrosPesquisaTecnicoComponent;
  @Input() filtros: FiltrosPesquisa;

  constructor() { }

  ngOnInit() {
  }

  convertNivelSolicitacao(e): String {
        switch (e) {
            case "C":
                return "Correção";
            case "N":
                return "Nova funcionalidade";
            case "A":
                return "Adaptação";
            default:
                return "Não classificado";
        }
    }

}
