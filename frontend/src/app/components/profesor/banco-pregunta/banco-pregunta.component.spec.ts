import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BancoPreguntaComponent } from './banco-pregunta.component';

describe('BancoPreguntaComponent', () => {
  let component: BancoPreguntaComponent;
  let fixture: ComponentFixture<BancoPreguntaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BancoPreguntaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BancoPreguntaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
