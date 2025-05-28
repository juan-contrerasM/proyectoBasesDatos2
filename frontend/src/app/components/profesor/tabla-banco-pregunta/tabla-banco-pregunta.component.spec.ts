import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaBancoPreguntaComponent } from './tabla-banco-pregunta.component';

describe('TablaBancoPreguntaComponent', () => {
  let component: TablaBancoPreguntaComponent;
  let fixture: ComponentFixture<TablaBancoPreguntaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablaBancoPreguntaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablaBancoPreguntaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
