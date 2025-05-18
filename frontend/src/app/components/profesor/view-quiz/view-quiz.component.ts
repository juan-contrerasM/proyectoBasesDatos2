import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from '../../../shared/nav-bar/nav-bar.component';

@Component({
  selector: 'app-view-quiz',
  standalone: true,
  imports: [CommonModule, NavBarComponent],
  templateUrl: './view-quiz.component.html'
})
export class ViewQuizComponent implements OnInit {
  quizzes: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<any[]>('http://localhost:3000/api/quizzes').subscribe({
      next: data => this.quizzes = data,
      error: () => alert('Error al cargar quizzes')
    });
  }
}
