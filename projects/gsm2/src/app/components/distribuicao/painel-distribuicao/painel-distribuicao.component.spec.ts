import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PainelDistribuicaoComponent } from './painel-distribuicao.component';

describe('PainelDistribuicaoComponent', () => {
  let component: PainelDistribuicaoComponent;
  let fixture: ComponentFixture<PainelDistribuicaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PainelDistribuicaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PainelDistribuicaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
