import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NavBarComponent } from '../../../shared/nav-bar/nav-bar.component';
import { ApiService } from '../../../services/api.service';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-add-question',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavBarComponent],
  templateUrl: './add-question.component.html'
})


export class AddQuestionComponent implements OnInit {

  public form: FormGroup;
  public dificultades: any[] = [];
  public tiposPregunta: any[] = [];
  public temas: any[] = [];

  constructor(private fb: FormBuilder,
    private http: HttpClient,
    private apiService: ApiService, 
    private alertService: AlertService) {

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
  ngOnInit(): void {
    this.getDificultades();
    this.getTiposPregunta();
    this.getTemas();
  }

  onSubmit() {
    this.http.post('http://localhost:3000/api/pregunta', this.form.value).subscribe({
      next: () => alert('Pregunta creada'),
      error: () => alert('Error al crear pregunta')
    });
  }

  getDificultades() {
      this.apiService.get<any[]>('dificultad').subscribe({
      next: data => this.dificultades = data,
      error: err => this.alertService.alert('error','Error al cargar dificultades', false)
    });
  }

  getTiposPregunta() {
      this.apiService.get<any[]>('tipospregunta').subscribe({
      next: data => this.tiposPregunta = data,
      error: err => this.alertService.alert('error','Error al cargar tipos de pregunta', false)
    });
  }


    getTemas() {
      this.apiService.get<any[]>('temas').subscribe({
      next: data => this.temas = data,
      error: err => this.alertService.alert('error','Error al cargar temas', false)
    });
  }



}
