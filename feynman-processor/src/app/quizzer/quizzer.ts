import { Component, Input, Output, EventEmitter, OnInit, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { pregunta } from '../interfaces/pregunta';
@Component({
  selector: 'app-quizzer',
  imports: [CommonModule],
  templateUrl: './quizzer.html',
  styleUrl: './quizzer.css',
})
export class Quizzer implements OnInit {
  @Input() preguntasEntrada: pregunta[] = [];
  @Output() cerrarQuiz = new EventEmitter<void>(); // Para avisar al padre que terminamos

  // Estado del Juego
  colaDePreguntas: pregunta[] = [];
  preguntaActual: pregunta | null = null;
  mostrarRespuesta: boolean = false;
  juegoTerminado: boolean = false;
  // Contadores
  totalInicial: number = 0;
  aciertos: number = 0;
  ngOnInit(): void {
    this.iniciarJuego()
  }
  iniciarJuego() {
    // 1. Copiamos la lista para no modificar la original del padre
    // 2. La barajamos (shuffle) para que el orden sea aleatorio
    this.colaDePreguntas = [...this.preguntasEntrada].sort(() => Math.random() - 0.5); //Explicar esto
    this.totalInicial = this.colaDePreguntas.length;
    this.aciertos = 0;
    this.juegoTerminado = false;
    this.siguienteCarta();
  }
  siguienteCarta() {
    if (this.colaDePreguntas.length === 0)
    {
      this.juegoTerminado= true;
      this.preguntaActual=null;
      return;
    }
    // Tomamos la primera de la fila (FIFO)
    this.preguntaActual = this.colaDePreguntas[0];
    this.mostrarRespuesta = false; // Se oculta la respuesta de la pregunta
  }
  revelarCarta() {
    this.mostrarRespuesta = true;
  }
  calificarCarta(esCorrecta: boolean) {
    if (!this.preguntaActual) return; //Si es nula

    if (esCorrecta) {
      this.aciertos++
      this.colaDePreguntas.shift() //Shift es para eliminar el primero de la lista
    }
    else {
      // Si es incorrecta entonces se saca de la lista y se pone al final
      const carta= this.colaDePreguntas.shift();
      if (carta) this.colaDePreguntas.push(carta);
    }
    //Pasamos a la siguiente carta
    this.siguienteCarta();
  }
  salir() {
    this.cerrarQuiz.emit();
  }
}