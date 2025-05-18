import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SessionService } from '../../services/session-manage.service';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})

export class NavBarComponent implements OnInit {

  @Input() tipoUsuario: 'PROFESOR' | 'ALUMNO' | 'ADMIN'| 'INVITADO' = 'INVITADO';

  constructor(private session: SessionService, private router: Router) { }

  ngOnInit() {
  }

  logout() {
    this.session.limpiar();
    this.router.navigate(['/login']);
  }

}
