import { Component, effect } from '@angular/core'; // Importamos effect
import { SupabaseService } from '../services/supabase';
import { FormsModule } from '@angular/forms';
import { Documento } from '../interfaces/Documento';
import { CommonModule, formatCurrency } from '@angular/common'; // Necesario para el loop
import { pregunta } from '../interfaces/pregunta';
import { MarkdownModule } from 'ngx-markdown';
import { Quizzer } from '../quizzer/quizzer';

@Component({
  selector: 'app-doc-editor',
  standalone: true,
  imports: [FormsModule, CommonModule, MarkdownModule, Quizzer],
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
  // Bandera para controlar la vista
  // false = Modo Lectura (Se ve bonito)
  // true = Modo Edición (Se ven los textareas)
  isEditing: boolean = false;
  isTemaRaiz: boolean = false;
  quizAbierto: boolean = false;

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
      // Lógica para identificar si el tema actual es un tema raíz
      if (docActual?.parent_id) {
        // Si tiene un padre
        this.isTemaRaiz = false
      } else {
        // Si es null, no tiene padre
        this.isTemaRaiz = true
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
          contenido_md: docActual.contenido_md,
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
    this.toggleEdition();
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
    this.supabaseService.seleccionarDocumentoPorId(doc.id);
    this.subirScrollAlTope();
  }
  async guardarPregunta() {
    const padre = this.supabaseService.selectedDoc();
    if (!padre) return;

    const tituloPregunta = this.nuevaPregunta.trim();
    const contenidoRespuesta = this.nuevaRespuesta.trim();
    try {
      if (!tituloPregunta || !contenidoRespuesta) return;
      if (this.preguntaEnEdicion) {
        const { data, error } = await this.supabaseService.supabase
          .from("preguntas")
          .update({ pregunta: this.nuevaPregunta, respuesta: this.nuevaRespuesta })
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
  toggleEdition() {
    this.isEditing = !this.isEditing;
  }
  async eliminarTema() {
    if (!confirm("¿Borrar el tema seleccionado y todo su contenido?")) return;

    const docActual = this.supabaseService.selectedDoc();
    if (!docActual) return;

    try {
      // 1. VALIDACIÓN DE SEGURIDAD
      // Verificamos si tiene hijos
      const { data: hijos, error: errorHijos } = await this.supabaseService.supabase
        .from("documentos")
        .select("id") // Solo se necesita el ID para contar, es más rápido que *
        .eq("parent_id", docActual.id);

      if (errorHijos) throw errorHijos;

      if (hijos && hijos.length > 0) {
        alert("⚠️ No se puede eliminar: Este tema tiene sub-temas dentro. Elimínalos primero.");
        return;
      }

      // 2. ELIMINACIÓN
      // 2.1 Eliminar todas las preguntas del tema
      // Optimización: Borrar todas de golpe
      if (this.listaPreguntas.length > 0) {
        const { error: errorPreguntas } = await this.supabaseService.supabase
          .from("preguntas")
          .delete()
          .eq("documento_id", docActual.id); // <--- ¡MAGIA! Usamos el ID del padre

        if (errorPreguntas) throw errorPreguntas;
        console.log("Todas las preguntas eliminadas correctamente");
      }
      const { error: errorDelete } = await this.supabaseService.supabase
        .from("documentos")
        .delete()
        .eq("id", docActual.id);

      if (errorDelete) throw errorDelete;

      // --- AQUÍ ESTÁ LA MAGIA DEL RESET ---

      alert("✅ Tema eliminado correctamente.");

      // A. "Volver al inicio": Ponemos la señal en null. 
      // Esto hará que el HTML muestre automáticamente el div class="vacio"
      this.supabaseService.selectedDoc.set(null);

      // B. (Opcional) Si estabas editando, apaga el modo edición
      this.isEditing = false;

      // NOTA: El árbol de la izquierda no se actualizará solo inmediatamente 
      // a menos que implementemos una señal de "recarga" en el servicio, 
      // pero para empezar, esto soluciona tu problema visual del editor.

    } catch (error: any) {
      console.error("Error al eliminar:", error.message);
      alert("Error al eliminar el tema.");
    }
  }

  abrirQuiz() {
    if (this.listaPreguntas.length === 0) {
      alert("No hay preguntas para repasar")
      return;
    }
    this.quizAbierto = true;
  }
  cerrarQuiz() {
    this.quizAbierto = false;
  }
  backTemaSuperior() {
    const docActual = this.supabaseService.selectedDoc();
    if (docActual?.parent_id) {
      this.supabaseService.seleccionarDocumentoPorId(docActual?.parent_id.toString());
      this.subirScrollAlTope();
    }
  }
  // Método auxiliar para no repetir código (opcional, pero recomendado)
  private subirScrollAlTope() {
    // Buscamos el elemento que tiene el scroll
    const panel = document.querySelector('.panel-edicion');
    if (panel) {
      // Le decimos: "Vete a la posición 0 (arriba) suavemente"
      panel.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}