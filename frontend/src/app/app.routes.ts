import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegistroComponent } from './components/registro/registro.component';
import { DashboardProfesorComponent } from './components/profesor/dashboard-profesor/dashboard-profesor.component';
import { DashboardAlumnoComponent } from './components/alumno/dashboard-alumno/dashboard-alumno.component';
import { AddQuestionComponent } from './components/profesor/add-question/add-question.component';
import { ViewQuestionsComponent } from './components/profesor/view-questions/view-questions.component';
import { AddQuizComponent } from './components/profesor/add-quiz/add-quiz.component';
import { ViewQuizComponent } from './components/profesor/view-quiz/view-quiz.component';
import { RegistrarRespuestaComponent } from './components/registrar-respuesta/registrar-respuesta.component';
import { BancoPreguntaComponent } from './components/profesor/banco-pregunta/banco-pregunta.component';
import { TablaBancoPreguntaComponent } from './components/profesor/tabla-banco-pregunta/tabla-banco-pregunta.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'dashboard-profesor', component: DashboardProfesorComponent },
  { path: 'dashboard-alumno', component: DashboardAlumnoComponent },
  { path: 'add-question', component: AddQuestionComponent},
  { path: 'view-questions', component: ViewQuestionsComponent},
  { path: 'add-quiz', component: AddQuizComponent},
  { path: 'view-quiz', component: ViewQuizComponent},
  { path: 'registrar-respuesta', component: RegistrarRespuestaComponent},
  { path: "banco-pregunta", component: BancoPreguntaComponent },
  {path: 'banco-preguntas/:temaId',component: TablaBancoPreguntaComponent},
  { path: "**", pathMatch: "full", redirectTo: "login" },
  

];
