import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { Router } from '@angular/router';
import { SessionService } from '../../../services/session-manage.service';
import { CommonModule } from '@angular/common';
import { RutaDTO } from '../../../services/RutaDTO.dto';
import { NavBarComponent } from '../../../shared/nav-bar/nav-bar.component';

@Component({
  selector: 'app-banco-pregunta',
  standalone: true,
  imports: [CommonModule, NavBarComponent],
  templateUrl: './banco-pregunta.component.html',
  styleUrl: './banco-pregunta.component.css'
})


export class BancoPreguntaComponent implements OnInit {
  temas: any;
  rutas: RutaDTO[] = [];

constructor(
  private api: ApiService,
  private router: Router,
  private session: SessionService) { }

ngOnInit(): void {
  this.getAdditionalData();

}

getAdditionalData() {
  this.api.get('temas').subscribe(data => {
    this.temas = data;
    for (const tema of this.temas) {
      const ruta = this.obtenerImagenPorNombre(tema.NOMBRE);
      const id = tema.ID_TEMA;
      const nombre = tema.NOMBRE;
      this.rutas.push(new RutaDTO(id, ruta, nombre));
    }
  });
}

irAPreguntas(temaId: number) {
  this.router.navigate(['banco-preguntas/', temaId]);
}

obtenerImagenPorNombre(nombre: string): string {
  const nombreNormalizado = nombre
    .toLowerCase()
    .normalize("NFD") // elimina tildes
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, '-');

  const ruta = 'assets/img/' + nombreNormalizado + '.png';
  return ruta;
}
}