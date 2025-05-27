import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarRespuestaComponent } from './registrar-respuesta.component';

describe('RegistrarRespuestaComponent', () => {
  let component: RegistrarRespuestaComponent;
  let fixture: ComponentFixture<RegistrarRespuestaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrarRespuestaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrarRespuestaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
