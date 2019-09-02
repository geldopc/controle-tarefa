import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridAtualizacaoOcorrenciasComponent } from './grid-atualizacao-ocorrencias.component';

describe('GridAtualizacaoOcorrenciasComponent', () => {
  let component: GridAtualizacaoOcorrenciasComponent;
  let fixture: ComponentFixture<GridAtualizacaoOcorrenciasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridAtualizacaoOcorrenciasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridAtualizacaoOcorrenciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
