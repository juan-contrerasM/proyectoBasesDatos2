import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PreguntaTempService {

   private pregunta: any = null;

  constructor() { }

  guardarPregunta(data: any): void {
    this.pregunta = data;
  }

  obtenerPregunta(): any {
    return this.pregunta;
  }

  limpiarPregunta(): void {
    this.pregunta = null;
  }
}
