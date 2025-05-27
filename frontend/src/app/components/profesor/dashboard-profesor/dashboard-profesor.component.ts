import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NavBarComponent } from '../../../shared/nav-bar/nav-bar.component';
import { SessionService } from '../../../services/session-manage.service';

@Component({
  selector: 'app-dashboard-profesor',
  standalone: true,
  imports: [CommonModule, RouterModule, NavBarComponent],
  templateUrl: './dashboard-profesor.component.html',
  styleUrls: ['./dashboard-profesor.component.css']
})
export class DashboardProfesorComponent implements OnInit {
  nombre = '';
  tipoUsuario = '';

  acciones = [
    { nombre: 'Registrar Pregunta', ruta: '/add-question' },
    { nombre: 'Ver Preguntas', ruta: '/view-questions' },
    { nombre: 'Crear Examen', ruta: '/add-quiz' },
    { nombre: 'Ver Exámenes', ruta: '/view-quiz' },
    { nombre: 'Bancos de preguntas', ruta: '/banco-pregunta' },
  ];

  constructor(private session: SessionService, private router: Router) {
    this.nombre = this.session.getNombre();
    this.tipoUsuario = this.session.getTipoUsuario();
    this.redirect();
  }

  navigate(ruta: string) {
    this.router.navigate([ruta]);
  }

  ngOnInit() {
    //this.redirect();
  }

  redirect() {
    if (this.session.getUsuario() === null) {
      this.router.navigate(['/login']);
    }

  }

}
