import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { AlertService } from '../../services/alert.service';
import { SessionService } from '../../services/session-manage.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  public loginForm: FormGroup;
  verClave: boolean = false;
  constructor(private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private alertService: AlertService,
    private session: SessionService) {
    this.loginForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      clave: ['', Validators.required]
    });
  }


  toggleClave() {
    this.verClave = !this.verClave;
  }

  ngOnInit(): void {
    this.session.limpiar();
  }

  onSubmit() {
    this.auth.login(this.loginForm.value).subscribe({
      next: (res: any) => {
        const tipo = res.user?.TIPO_USUARIO;
        this.session.setUsuario(res.user);
        console.log('Usuario logueado:', res.user);
        if (tipo === 'PROFESOR') {
          this.router.navigate(['/dashboard-profesor']);
          this.alertService.alert('success', `Bienvenido ${res.user.PRIMER_NOMBRE}`, false);
        } else if (tipo === 'ALUMNO') {
          this.router.navigate(['/dashboard-alumno']);
          this.alertService.alert('success', `Bienvenido ${res.user.PRIMER_NOMBRE}`, false);
        }
      },
      error: () => this.alertService.alert('error', 'Credenciales incorrectas', true)
    });
  }
}
