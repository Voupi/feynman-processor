import { Component, effect } from '@angular/core'; // Importamos effect
import { SupabaseService } from '../services/supabase';
import { FormsModule } from '@angular/forms';
import { Documento } from '../interfaces/Documento';
import { CommonModule } from '@angular/common'; // Necesario para el loop
import { pregunta } from '../interfaces/pregunta';

@Component({
  selector: 'app-doc-editor',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './doc-editor.html',
  styleUrl: './doc-editor.css',
})
export class DocEditor {

  // Esta es la variable NUEVA para la lista de abajo
  hijos: Documento[] = [];
  nuevaPregunta: string = "";
  nuevaRespuesta: string = "";
  listaPreguntas: pregunta[] = [];

  // Agregamos "| null" y así TypeScript nos deja iniciarlo en null tranquilamente
  preguntaEnEdicion: pregunta | null = null;

  constructor(public supabaseService: SupabaseService) {
    // --- EFECTO AUTOMÁTICO ---
    // Esto se ejecuta cada vez que seleccionas un documento distinto en el árbol principal
    effect(() => {
      const docActual = this.supabaseService.selectedDoc();

      if (docActual) {
        // Si hay un documento seleccionado, vamos a buscar sus hijos
        console.log("Cargando hijos y preguntas para:", docActual.titulo);
        this.cargarHijos(docActual.id);
        this.listarPreguntas(docActual.id);
      } else {
        // Si no hay nada seleccionado, limpiamos la lista
        this.hijos = [];
        this.listaPreguntas = [];
      }
    });
  }

  // MÉTODOS

  // 1. BUSCAR HIJOS (SELECT)
  async cargarHijos(padreId: string) {
    try {
      const { data, error } = await this.supabaseService.supabase
        .from('documentos')
        .select('*')
        .eq('parent_id', padreId); // Trae todos los que tengan este ID como padre

      if (error) throw error;

      // Guardamos los resultados en nuestra variable array
      this.hijos = data || [];

    } catch (error: any) {
      console.error('Error cargando hijos:', error.message);
    }
  }

  // 2. GUARDAR (UPDATE)
  async guardarCambios() {
    // Usamos directo la señal del servicio, es más seguro
    const docActual = this.supabaseService.selectedDoc();
    if (!docActual) return;

    try {
      const { error } = await this.supabaseService.supabase
        .from('documentos')
        .update({
          titulo: docActual.titulo,
          contenido_md: docActual.contenido_md
        })
        .eq('id', docActual.id);

      if (error) throw error;
      alert('✅ Guardado en Supabase');

      // Opcional: Si cambias el título, deberíamos recargar los hijos también
      // pero por ahora déjalo así.
    } catch (error: any) {
      console.error('Error:', error.message);
    }
  }
  async guardarCambiosResumen() {
    // Usamos directo la señal del servicio, es más seguro
    const docActual = this.supabaseService.selectedDoc();
    if (!docActual) return;

    try {
      const { error } = await this.supabaseService.supabase
        .from('documentos')
        .update({
          resumen_md: docActual.resumen_md
        })
        .eq('id', docActual.id);

      if (error) throw error;
      alert('✅ Guardado en Supabase');

      // Opcional: Si cambias el título, deberíamos recargar los hijos también
      // pero por ahora déjalo así.
    } catch (error: any) {
      console.error('Error:', error.message);
    }
  }
  // 3. CREAR NUEVO HIJO (INSERT)
  async nuevoSubHijo() {
    const padre = this.supabaseService.selectedDoc();
    if (!padre) return;

    const tituloHijo = prompt(`Crear nuevo sub-tema dentro de "${padre.titulo}":`);
    if (!tituloHijo) return;

    try {
      const { error } = await this.supabaseService.supabase
        .from('documentos')
        .insert({
          titulo: tituloHijo,
          parent_id: padre.id, // El hijo apunta al padre actual
          contenido_md: ''
        });

      if (error) throw error;

      // ¡TRUCO! Recargamos la lista de hijos inmediatamente para ver el cambio
      this.cargarHijos(padre.id);

    } catch (error: any) {
      console.error('Error creando hijo:', error.message);
    }
  }

  // 4. NAVEGAR A UN HIJO (Profundizar)
  seleccionarDocumento(doc: Documento) {
    // Al setear esto, el effect() se disparará de nuevo y cargará los hijos de ESTE nuevo doc
    this.supabaseService.selectedDoc.set(doc);
  }
  async guardarPregunta() {
    const padre = this.supabaseService.selectedDoc();
    if (!padre) return;

    const tituloPregunta = this.nuevaPregunta.trim();
    const contenidoRespuesta = this.nuevaRespuesta.trim();
    try {
      if (!tituloPregunta || !contenidoRespuesta) return;
      if (this.preguntaEnEdicion) {
        const { data, error} = await this.supabaseService.supabase
        .from("preguntas")
        .update({pregunta: this.nuevaPregunta, respuesta: this.nuevaRespuesta})
        .eq("id", this.preguntaEnEdicion.id)
      } else {
        const { data, error } = await this.supabaseService.supabase
          .from("preguntas")
          .insert({ documento_id: padre.id, pregunta: this.nuevaPregunta, respuesta: this.nuevaRespuesta })
          .select();
        if (error) {
          console.error("Hubo un error al insertar los datos")
        } else {
          console.log("Datos Insertados correctamente", data)
          this.nuevaPregunta = "";
          this.nuevaRespuesta = "";
        }
      }
    } catch (error) {
      console.log("Error inesperado al guardar el documento", error)
    }
    this.listarPreguntas(padre.id);
    this.cancelarEdicion();
  }
  async listarPreguntas(padreId: string) {
    try {
      const { data, error } = await this.supabaseService.supabase
        .from("preguntas")
        .select("*")
        .eq("documento_id", padreId)
      if (error) throw error;
      this.listaPreguntas = data || [];
    } catch (error) {
      console.log("Error al cargar la lista de preguntas del documento")
    }
  }
  async eliminarPregunta(idPregunta: string) {
    if (!confirm("¿Borrar la pregunta seleccionada?")) return;
    try {
      const { error } = await this.supabaseService.supabase
        .from("preguntas")
        .delete()
        .eq('id', idPregunta)
      if (error) throw error;
      const padre = this.supabaseService.selectedDoc();
      if (!padre) return;
      this.listarPreguntas(padre.id);

    } catch (error) {
      console.log("Hubo un error al eliminar la pregunta", error)
    }
  }
  cargarPreguntaParaEditar(pregunta: pregunta) {
    this.preguntaEnEdicion = pregunta;
    this.nuevaPregunta = pregunta.pregunta;
    this.nuevaRespuesta = pregunta.respuesta;
  }
  // Función cancelar (para limpiar si te arrepientes)
  cancelarEdicion() {
    this.preguntaEnEdicion = null;
    this.nuevaPregunta = '';
    this.nuevaRespuesta = '';
  }
}