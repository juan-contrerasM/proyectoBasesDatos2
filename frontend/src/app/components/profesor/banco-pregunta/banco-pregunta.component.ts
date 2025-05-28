import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { Router } from '@angular/router';
import { SessionService } from '../../../services/session-manage.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-banco-pregunta',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './banco-pregunta.component.html',
  styleUrl: './banco-pregunta.component.css'
})
export class BancoPreguntaComponent implements OnInit {
  temas: any[]=[];

 constructor(
  private api: ApiService,
    private router: Router,
    private session: SessionService) { }
  ngOnInit(): void {
    this.getAdditionalData();
  
    
  }
  getAdditionalData() {
    this.api.get<any[]>('temas').subscribe(data => {
      this.temas = data.map(t => ({
        ...t,
        imagen: this.obtenerImagenPorNombre(t.NOMBRE)
      }));
    });
  }

  irAPreguntas(temaId: number) {
    this.router.navigate(['/banco-preguntas', temaId]);
  }

obtenerImagenPorNombre(nombre: string): string {
  const nombreNormalizado = nombre
    .toLowerCase()
    .normalize("NFD") // elimina tildes
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, '-');

   return `assets/img/${nombreNormalizado}.png`;
}
}