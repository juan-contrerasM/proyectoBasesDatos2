import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from '../../../services/session-manage.service';

@Component({
  selector: 'app-dashboard-alumno',
  templateUrl: './dashboard-alumno.component.html',
  styleUrls: ['./dashboard-alumno.component.css']
})
export class DashboardAlumnoComponent implements OnInit {

  nombre = '';
  tipoUsuario = '';

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
