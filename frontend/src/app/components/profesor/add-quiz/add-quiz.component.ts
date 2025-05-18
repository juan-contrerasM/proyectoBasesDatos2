import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from '../../../shared/nav-bar/nav-bar.component';

@Component({
  selector: 'app-add-quiz',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavBarComponent],
  templateUrl: './add-quiz.component.html'
})
export class AddQuizComponent {

  public form: FormGroup;


  constructor(private fb: FormBuilder, private http: HttpClient) {
  this.form = this.fb.group({
    nombre: ['', Validators.required],
    descripcion: ['', Validators.required],
    curso_id: [1, Validators.required],
    profesor_id: ['', Validators.required],
    config_id: [1, Validators.required],
    categoria_id: [1, Validators.required]
  });

  }

  onSubmit() {
    this.http.post('http://localhost:3000/api/quiz', this.form.value).subscribe({
      next: () => alert('Quiz creado'),
      error: () => alert('Error al crear quiz')
    });
  }
}
