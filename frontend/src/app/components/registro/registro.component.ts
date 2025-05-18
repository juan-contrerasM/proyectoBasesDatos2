import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, Validators, FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ModalComponent } from '../../shared/modal/modal.component';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FormsModule, ModalComponent],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {

  mostrarModal = false;
  nivelEstudios = '';
  tipoContrato = '';
  programaAcademico = '';
  public registroForm: FormGroup;


  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.registroForm = this.fb.group({
      num_identificacion: ['', Validators.required],
      primer_nombre: ['', Validators.required],
      segundo_nombre: ['', Validators.required],
      primer_apellido: ['', Validators.required],
      segundo_apellido: ['', Validators.required],
      fecha_nacimiento: ['', Validators.required],
      genero: ['', Validators.required],
      departamento: ['', Validators.required],
      direccion: ['', Validators.required],
      fecha_ingreso: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      clave: ['', Validators.required],
      tipo_usuario: ['', Validators.required], // o PROFESOR
      nivel_estudios: [''],
      tipo_contrato: [''],
      programa_academico: ['']
    });

    // 👇 Esto detecta si se seleccionó ALUMNO o PROFESOR
    this.registroForm.get('tipo_usuario')?.valueChanges.subscribe(value => {
      if (value === 'ALUMNO' || value === 'PROFESOR') {
        this.abrirModal();
      }
    });
  }

  onSubmit() {
    this.auth.registro(this.registroForm.value).subscribe({
      next: () => {
        alert('Usuario registrado con éxito');
        this.router.navigate(['/login']);
      },
      error: () => alert('Error al registrar usuario')
    });
  }

  abrirModal() {
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
  }

  guardarDatosProfesor(profesorFlag: boolean) {
    console.log(profesorFlag);
    if (profesorFlag) {
      this.registroForm.patchValue({
        nivel_estudios: this.nivelEstudios,
        tipo_contrato: this.tipoContrato,
        programa_academico: null
      });
    } else {
      this.registroForm.patchValue({
        nivel_estudios: null,
        tipo_contrato: null,
        programa_academico: this.programaAcademico
      });
    }

    this.cerrarModal();
  }
}
