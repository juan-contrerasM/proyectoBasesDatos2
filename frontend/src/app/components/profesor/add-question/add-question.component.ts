import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NavBarComponent } from '../../../shared/nav-bar/nav-bar.component';

@Component({
  selector: 'app-add-question',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavBarComponent],
  templateUrl: './add-question.component.html'
})


export class AddQuestionComponent {

  public form: FormGroup;
  constructor(private fb: FormBuilder, private http: HttpClient) {

    this.form = this.fb.group({
    porcentaje: [0, Validators.required],
    numero_respuestas: [1, Validators.required],
    tiempo_respuesta: [30, Validators.required],
    respuesta: ['', Validators.required],
    requiereRevision: [0],
    esPublica: [1],
    contenido: ['', Validators.required],
    justificacion: ['', Validators.required],
    estado: [1],
    tema_id_tema: [1],
    tipo_dificultad_id_dificultad: [1],
    tipo_pregunta_id_tipo_pregunta: [1]
  });

  }

  onSubmit() {
    this.http.post('http://localhost:3000/api/pregunta', this.form.value).subscribe({
      next: () => alert('Pregunta creada'),
      error: () => alert('Error al crear pregunta')
    });
  }
}
