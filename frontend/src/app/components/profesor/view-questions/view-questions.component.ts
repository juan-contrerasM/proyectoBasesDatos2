import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from '../../../shared/nav-bar/nav-bar.component';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-view-questions',
  standalone: true,
  imports: [CommonModule, NavBarComponent],
  templateUrl: './view-questions.component.html'
})
export class ViewQuestionsComponent implements OnInit {

  preguntas: any[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.getPreguntas();
  }

  getPreguntas() {
      this.apiService.get<any[]>('preguntas').subscribe({
      next: data => this.preguntas = data,
      error: () => alert('Error al cargar preguntas')
    });
  }
}
