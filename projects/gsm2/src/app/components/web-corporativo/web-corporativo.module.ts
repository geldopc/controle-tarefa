import { AtualizacaoVersaoProvider } from '../../providers/AtualizacaoVersaoProvider';
import { AtualizacaoVersaoService } from '../../services/AtualizacaoVersaoService';
import { EditarOcorrenciasComponent } from '../editar-ocorrencias/editar-ocorrencias.component';
import { SmDropdownComponent } from '../sm-dropdown/sm-dropdown.component';
import { RecaptchaModule } from 'ng-recaptcha';
import { RecaptchaFormsModule } from 'ng-recaptcha/forms';
import { PersistenciaSessaoProvider } from '../../providers/sessao/PersistenciaSessaoProvider';
import { ModalGsmComponent } from '../modal-gsm/modal-gsm.component';
import { EsqueceuSenhaComponent } from '../modal-gsm/esqueceu-senha/esqueceu-senha.component';
import { SmConteudoNaoEncontradoComponent } from './webcomponents/sm-conteudo-nao-encontrado/sm-conteudo-nao-encontrado';
import { SmSelectCorporativoComponent } from './webcomponents/sm-select-corporativo/sm-select-corporativo';
import { GridGenericaColumnComponent } from './includes/grids/grid-generica/grid-generica-column/grid-generica-column';
import { GridGenericaComponent } from './includes/grids/grid-generica/grid-generica';
import { GridGenericaLinhaComponent } from './includes/grids/grid-generica/grid-generica-linha/grid-generica-linha';
import { DataTableComponent } from './includes/grids/data-table/data-table';
import { SmMaskedInputModule } from '../inputs/smMaskedInput.module';
import { SmInputModule } from '../inputs/smInput.module';
import { IonicPageModule } from "ionic-angular";
import { NgModule } from "@angular/core";
import { RecaptchaSmComponent } from '../recaptcha-sm/recaptcha-sm.component';
import { SmMensagemModule } from '../mensagem/smMensagem.module';
import { FiltrosPesquisaTecnicoComponent } from '../filtros-pesquisa-tecnico/filtros-pesquisa-tecnico.component';
import { GridOcorrenciasTecnicoComponent } from '../grid-ocorrencias-tecnico/grid-ocorrencias-tecnico.component';
import { PainelVisualizacaoOcorrenciasComponent } from '../painel-visualizacao-ocorrencias/painel-visualizacao-ocorrencias.component';
import { AnexarArquivoComponent } from '../anexar-arquivo/anexar-arquivo.component';
import { DistribuicaoComponent } from '../distribuicao/distribuicao.component';
import { FinalizarOcorrenciasComponent } from '../finalizar-ocorrencias/finalizar-ocorrencias.component';
import { DropdownMultiselectComponent } from '../dropdown-multiselect/dropdown-multiselect.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ListaAtualizacaoDeVersaoComponent } from '../lista-atualizacao-de-versao/lista-atualizacao-de-versao.component';
import { AlterarTecnicosComponent } from '../alterar-tecnicos/alterar-tecnicos.component';
import { UsuarioService } from '../../services/UsuarioService';
import { UsuarioProvider } from '../../providers/UsuarioProvider';
import { SmButtonComponent } from '../sm-button/sm-button.component';
import { CabecalhoComponent } from '../cabecalho/cabecalho.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { HomologarDistribuicaoComponent } from '../distribuicao/homologar-distribuicao/homologar-distribuicao.component';
import { GridAtualizacaoOcorrenciasComponent } from '../grid-atualizacao-ocorrencias/grid-atualizacao-ocorrencias.component';
import { ComboComponent } from '../combo/combo.component';
import { PainelDistribuicaoComponent } from '../distribuicao/painel-distribuicao/painel-distribuicao.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { PerfilService } from '../../services/PerfilService';
import { PerfilProvider } from '../../providers/PerfilProvider';
import { DetalheOcorrenciaComponent } from '../detalhe-ocorrencia/detalhe-ocorrencia.component';
import { GridModule } from '@progress/kendo-angular-grid';
import { GridDistribuicaoOcorrenciaComponent } from './includes/grids/grid-distribuicao-ocorrencia/grid-distribuicao-ocorrencia';
import { BoolButtonComponent } from '../bool-button/bool-button.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { EditStatusModalComponent } from '../edit-status-modal/edit-status-modal.component';
import { AddOcorrenciaModalComponent } from '../add-ocorrencia-modal/add-ocorrencia-modal.component';
import { GridAnexoOcorrenciaComponent } from './includes/grids/grid-anexo-ocorrencia/grid-anexo-ocorrencia';
import { GridHistoricoOcorrenciaComponent } from './includes/grids/grid-historico-ocorrencia/grid-historico-ocorrencia';
import { EmptyGridComponent } from './includes/grids/empty-grid/empty-grid';
import { NewFeatureComponent } from './includes/grids/new-feature/new-feature';
import { EditPrioridadeModalComponent } from '../edit-prioridade-modal/edit-prioridade-modal.component';
import { GridBuildsOcorrenciaComponent } from './includes/grids/grid-builds-ocorrencia/grid-builds-ocorrencia';
import { GridCommitsComponent } from './includes/grids/grid-commits/grid-commits.component';
import { DashboardTarefaComponent } from '../dashboard-tarefa/dashboard-tarefa.component';
import { ChartsModule } from 'ng2-charts';
import 'chartjs-plugin-labels';

@NgModule({
    declarations: [
        GridGenericaComponent,
        GridGenericaLinhaComponent,
        GridGenericaColumnComponent,
        SmSelectCorporativoComponent,
        DataTableComponent,
        SmConteudoNaoEncontradoComponent,
        ModalGsmComponent,
        RecaptchaSmComponent,
        SmDropdownComponent,
        FiltrosPesquisaTecnicoComponent,
        PainelVisualizacaoOcorrenciasComponent,
        GridOcorrenciasTecnicoComponent,
        EditarOcorrenciasComponent,
        FinalizarOcorrenciasComponent,
        AnexarArquivoComponent,
        DistribuicaoComponent,
        HomologarDistribuicaoComponent,
        DropdownMultiselectComponent,
        ListaAtualizacaoDeVersaoComponent,
        AlterarTecnicosComponent,
        SmButtonComponent,
        CabecalhoComponent,
        GridAtualizacaoOcorrenciasComponent,
        ComboComponent,
        EsqueceuSenhaComponent,
        PainelDistribuicaoComponent,
        DetalheOcorrenciaComponent,
        GridDistribuicaoOcorrenciaComponent,
        GridAnexoOcorrenciaComponent,
        GridHistoricoOcorrenciaComponent,
        BoolButtonComponent,
        EditStatusModalComponent,
        AddOcorrenciaModalComponent,
        EmptyGridComponent,
        NewFeatureComponent,
        EditPrioridadeModalComponent,
        GridBuildsOcorrenciaComponent,
        GridCommitsComponent,
        DashboardTarefaComponent,
    ],
    imports: [
        SmInputModule,
        SmMaskedInputModule,
        RecaptchaFormsModule,
        SmMensagemModule,
        FormsModule,
        RouterModule,
        Ng4LoadingSpinnerModule.forRoot(),
        NgMultiSelectDropDownModule.forRoot(),
        RecaptchaModule.forRoot(),
        AngularEditorModule,
        GridModule,
        ChartsModule,
        NgxPaginationModule,
        IonicPageModule.forChild(GridOcorrenciasTecnicoComponent)
    ],
    exports: [
        SmSelectCorporativoComponent,
        GridGenericaComponent,
        GridGenericaLinhaComponent,
        GridGenericaColumnComponent,
        DataTableComponent,
        SmConteudoNaoEncontradoComponent,
        ModalGsmComponent,
        RecaptchaSmComponent,
        SmDropdownComponent,
        FiltrosPesquisaTecnicoComponent,
        PainelVisualizacaoOcorrenciasComponent,
        GridOcorrenciasTecnicoComponent,
        EditarOcorrenciasComponent,
        FinalizarOcorrenciasComponent,
        AnexarArquivoComponent,
        DistribuicaoComponent,
        HomologarDistribuicaoComponent,
        DropdownMultiselectComponent,
        ListaAtualizacaoDeVersaoComponent,
        AlterarTecnicosComponent,
        SmButtonComponent,
        CabecalhoComponent,
        GridAtualizacaoOcorrenciasComponent,
        ComboComponent,
        EsqueceuSenhaComponent,
        DetalheOcorrenciaComponent,
        GridDistribuicaoOcorrenciaComponent,
        GridAnexoOcorrenciaComponent,
        GridHistoricoOcorrenciaComponent,
        BoolButtonComponent,
        EditStatusModalComponent,
        AddOcorrenciaModalComponent,
        EmptyGridComponent,
        NewFeatureComponent,
        EditPrioridadeModalComponent,
        GridBuildsOcorrenciaComponent,
        GridCommitsComponent,
        DashboardTarefaComponent,
    ],
    providers: [
      PersistenciaSessaoProvider,
      AtualizacaoVersaoService,
      AtualizacaoVersaoProvider,
      UsuarioService,
      UsuarioProvider,
      PerfilProvider,
      PerfilService
    ]
})
export class WebCorporativoComponentModule { }
