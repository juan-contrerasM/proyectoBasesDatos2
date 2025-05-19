// add-quiz.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { SessionService } from '../../../services/session-manage.service';
import { NavBarComponent } from '../../../shared/nav-bar/nav-bar.component';

@Component({
  standalone: true,
  selector: 'app-add-quiz',
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NavBarComponent],
  templateUrl: './add-quiz.component.html',
})
export class AddQuizComponent implements OnInit {
  // Step forms
  quizForm!: FormGroup;
  configForm!: FormGroup;
  preguntaForm!: FormGroup;

  // Datos desde el backend
  cursos: any[] = [];
  categorias: any[] = [];
  temas: any[] = [];
  bancos: any[] = [];
  preguntas: any[] = [];

  // Estados internos
  step = 1;
  profesorId: string | undefined;

  constructor(private fb: FormBuilder,
    private api: ApiService,
    private router: Router,
    private session: SessionService) { }

  ngOnInit() {
    this.profesorId = this.session.getId();
    this.quizForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      curso_id: ['', Validators.required],
      categoria_id: ['', Validators.required]
    });

    this.configForm = this.fb.group({
      peso: [1, Validators.required],
      umbral: [0.7, Validators.required],
      fecha_realizacion: ['', Validators.required],
      num_preguntas: [10, Validators.required],
      seleccion_Automatica: [true],
      numCanAutomaticas: [10],
      tiempo_limite: [false],
      tiempo_minutos: [60],
      retroalimentacion: ['']
    });

    this.preguntaForm = this.fb.group({
      tema_id: ['', Validators.required],
      banco_id: ['', Validators.required],
      preguntas_ids: [[]]
    });

    this.getAdditionalData();
  }

  avanzar() { this.step++; }
  retroceder() { this.step--; }

  cargarBancos() {
    const tema = this.preguntaForm.value.tema_id;
    this.api.get<any[]>('bancos', { tema }).subscribe(data => this.bancos = data);
  }

  cargarPreguntas() {
    const banco = this.preguntaForm.value.banco_id;
    this.api.get<any[]>(`preguntas`, { banco }).subscribe(data => this.preguntas = data);
  }

  submit() {
    // 1. Crear configuración
    this.api.post('configuracion', this.configForm.value).subscribe(config => {
      const config_id = (config as any).ID_CONFIGURACION;

      // 2. Crear quiz
      const quizData = {
        ...this.quizForm.value,
        profesor_id: this.profesorId,
        config_id
      };

      this.api.post('quiz', quizData).subscribe(quiz => {
        const quiz_id = (quiz as any).ID_QUIZ;
        const { banco_id, tema_id, preguntas_ids } = this.preguntaForm.value;

        // 3. Crear entrada en banco_quiz
        this.api.post('banco_quiz', { banco_id, tema_id, quiz_id }).subscribe(() => {
          // 4. Asociar preguntas
          const payload = preguntas_ids.map((id: number) => ({ banco_id, pregunta_id: id }));
          this.api.post('banco_pregunta_pregunta', payload).subscribe(() => {
            alert('Quiz creado correctamente');
            this.router.navigate(['/dashboard-profesor']);
          });
        });
      });
    });
  }

  onCheckPregunta(id: number, event: Event) {
    const input = event.target as HTMLInputElement;
    const checked = input.checked;

    const preguntas = this.preguntaForm.value.preguntas_ids as number[];
    if (checked) {
      preguntas.push(id);
    } else {
      const index = preguntas.indexOf(id);
      if (index !== -1) preguntas.splice(index, 1);
    }

    this.preguntaForm.patchValue({ preguntas_ids: preguntas });
  }

  getAdditionalData() {
    this.api.get<any[]>('cursos', { profesor: this.profesorId }).subscribe(data => this.cursos = data);
    this.api.get<any[]>('categorias').subscribe(data => this.categorias = data);
    this.api.get<any[]>('temas').subscribe(data => this.temas = data);
  }

}
