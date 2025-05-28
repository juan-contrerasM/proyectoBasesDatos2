import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../services/api.service'; // Ajusta la ruta si es necesario
import { NavBarComponent } from '../../../shared/nav-bar/nav-bar.component';

@Component({
  selector: 'app-tabla-banco-pregunta',
  standalone: true,
  imports: [CommonModule,NavBarComponent],
  templateUrl: './tabla-banco-pregunta.component.html',
  styleUrl: './tabla-banco-pregunta.component.css'
})
export class TablaBancoPreguntaComponent implements OnInit {
 preguntas: any[] = [];
  temaId!: number;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService
  ) {}

  ngOnInit(): void {
    this.temaId = Number(this.route.snapshot.paramMap.get('temaId'));
    this.getPreguntasPorTema();
  }

  getPreguntasPorTema(): void {
    this.api.get(`preguntas/tema/${this.temaId}`).subscribe((data: any) => {
      this.preguntas = data as any[];
      console.log('Preguntas obtenidas:', this.preguntas);
    });
  }
}
