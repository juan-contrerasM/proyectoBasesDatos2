import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, Validators, FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FormsModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {

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
    tipo_usuario: ['ALUMNO', Validators.required] // o PROFESOR
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
}
