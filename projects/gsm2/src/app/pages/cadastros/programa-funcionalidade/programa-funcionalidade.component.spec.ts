import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramaFuncionalidadeComponent } from './programa-funcionalidade.component';

describe('ProgramaFuncionalidadeComponent', () => {
  let component: ProgramaFuncionalidadeComponent;
  let fixture: ComponentFixture<ProgramaFuncionalidadeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProgramaFuncionalidadeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgramaFuncionalidadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
