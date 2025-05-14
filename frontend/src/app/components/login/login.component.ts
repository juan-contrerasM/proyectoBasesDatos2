import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  public loginForm: FormGroup;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
    correo: ['', [Validators.required, Validators.email]],
    clave: ['', Validators.required]
  });
  }

  onSubmit() {
    this.auth.login(this.loginForm.value).subscribe({
      next: (res: any) => {
        alert(`Bienvenido ${res.user.PRIMER_NOMBRE}`);
        this.router.navigate(['/dashboard']);
      },
      error: () => alert('Credenciales inválidas')
    });
  }
}
