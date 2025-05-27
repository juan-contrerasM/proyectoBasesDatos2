import { Component, OnInit } from '@angular/core';
import { PreguntaTempService } from '../../services/pregunta-temp.service';
import { ApiService } from '../../services/api.service';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AlertService } from '../../services/alert.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registrar-respuesta',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ReactiveFormsModule],
  templateUrl: './registrar-respuesta.component.html',
  styleUrl: './registrar-respuesta.component.css'
})
export class RegistrarRespuestaComponent implements OnInit {
  pregunta: any;
  respuestaForm!: FormGroup;
  totalRespuestas: number = 2;
  respuesta: any;
  constructor(
    private fb: FormBuilder,
    private preguntaTempService: PreguntaTempService,
    private apiService: ApiService,
    private alertService: AlertService,
    private router: Router, 
  ) { }
  ngOnInit(): void {
    this.pregunta = this.preguntaTempService.obtenerPregunta();
    console.log('Pregunta obtenida:', this.pregunta);
    if (!this.pregunta) {
      alert('No hay pregunta registrada. Redirigiendo...');
      // redirigir si quieres
      return;
    }
    this.initForm();
  }
  initForm() {
    console.log('Pregunta obtenida:', this.pregunta.tipo_pregunta_id_tipo_pregunta);
    const tipo = Number(this.pregunta.tipo_pregunta_id_tipo_pregunta);
    switch (tipo) {
      case 3:
        this.respuestaForm = this.fb.group({
          respuestas: this.fb.array([
            this.fb.control('Verdadero', Validators.required),
            this.fb.control('Falso', Validators.required)
          ]),
          correcta: [0, Validators.required] // índice 0 o 1
        });
        break;
      case 4:
        this.respuestaForm = this.fb.group({
          respuestaAbierta: ['', Validators.required]
        });
        break;
      case 1:
      case 2:
        this.respuestaForm = this.fb.group({
          respuestas: this.fb.array([
            this.fb.control('', Validators.required),
            this.fb.control('', Validators.required)
          ]),
          correctas: this.fb.array([
            this.fb.control(false),
            this.fb.control(false)
          ])
        });
        break;
    }
  }
  get respuestas() {
    return this.respuestaForm.get('respuestas') as FormArray;
  }
  get correctas() {
    return this.respuestaForm.get('correctas') as FormArray;
  }
  getRespuestaControl(index: number): FormControl {
    return this.respuestas.at(index) as FormControl;
  }
  seleccionarRespuesta(index: number): void {
    const current = this.respuestaForm.get('correcta')?.value;
    if (current === index) {
      this.respuestaForm.get('correcta')?.setValue(null);
    } else {
      this.respuestaForm.get('correcta')?.setValue(index);
    }
  }
  deseleccionar(): void {
    this.correctas.controls.forEach(ctrl => ctrl.setValue(false));
  }
  agregarOpcion() {
    this.respuestas.push(this.fb.control('', Validators.required));
    this.correctas.push(this.fb.control(false));
    this.totalRespuestas++;
  }
  toggleCorrecta(index: number): void {
    const tipo = Number(this.pregunta.tipo_pregunta_id_tipo_pregunta);

    if (tipo === 1) {
      // Selección ÚNICA -> Solo una puede estar activa
      this.correctas.controls.forEach((ctrl, i) => {
        ctrl.setValue(i === index ? !ctrl.value : false);
      });
    } else if (tipo === 2) {
      // Selección MÚLTIPLE -> Alterna true/false
      const current = this.correctas.at(index).value;
      this.correctas.at(index).setValue(!current);
    }
  }
  get cantidadSeleccionadas(): number {
    return this.correctas.controls.filter(ctrl => ctrl.value).length;
  }
  registrarTodo() {
    if (this.respuestaForm.invalid) {
      alert('Completa los campos correctamente');
      return;
    }
    this.pregunta.numero_respuestas = this.totalRespuestas;
    // Obtener las respuestas desde el formulario
    const respuestasTexto = this.respuestaForm.value.respuestas;
    const correctas = this.respuestaForm.value.correctas;
    let respuestas = [];
    // Pregunta tipo 1 o 2: opción múltiple o única
    if (+this.pregunta.tipo_pregunta_id_tipo_pregunta === 1 || +this.pregunta.tipo_pregunta_id_tipo_pregunta === 2) {
      respuestas = respuestasTexto.map((contenido: string, index: number) => ({
        contenido,
        es_correcta: correctas[index] ? 1 : 0
      }));
    }
    // Pregunta tipo 3: verdadero / falso
    else if (+this.pregunta.tipo_pregunta_id_tipo_pregunta === 3) {
      const esCorrecta = this.respuestaForm.value.correcta; // 0 o 1
      respuestas = [
        { contenido: 'Verdadero', esCorrecta: esCorrecta === 0 },
        { contenido: 'Falso', esCorrecta: esCorrecta === 1 }
      ];
    }
    const data = {
      pregunta: this.pregunta,
      respuestas
    };
    this.respuesta = this.respuestaForm.value;
    this.apiService.post('pregunta', data).subscribe({
      next: () => {
        this.alertService.alert('success', 'Pregunta y respuestas registradas correctamente', false);
        this.router.navigate(['/dashboard-profesor']);
        this.preguntaTempService.limpiarPregunta();
      },
      error: () => this.alertService.alert('error', 'Error al registrar la pregunta y respuestas', false)
    });
  }
}



