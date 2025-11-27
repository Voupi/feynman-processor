import { Injectable, signal } from '@angular/core'; //Signal sirve para crear variables reactivas
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Documento } from '../interfaces/Documento';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  public supabase: SupabaseClient;

  // --- ESTADO GLOBAL (La memoria de la App) ---
  // Esta señal guardará el documento que el usuario seleccionó.
  // Empieza en null (ninguno seleccionado).
  selectedDoc = signal<Documento | null>(null);

  constructor() {
    this.supabase = createClient(
      environment.supabase.url, 
      environment.supabase.key
    )
  }
  // MÉTODOS DE ACCIÓN (SETTERS INTELIGENTES)

  // 1. Actualizar solo el Título en memoria (Signal)
  updateTitulo(nuevoTitulo: string) {
    this.selectedDoc.update(doc => {
      // Si no hay doc, retornamos null. Si hay, creamos una copia con el nuevo título
      return doc ? { ...doc, titulo: nuevoTitulo } : null;
    });
  }

  // 2. Actualizar solo el Contenido en memoria (Signal)
  updateContenido(nuevoContenido: string) {
    this.selectedDoc.update(doc => {
      return doc ? { ...doc, contenido_md: nuevoContenido } : null;
    });
  }
  updateResumen(nuevoContenido: string) {
    this.selectedDoc.update(doc => {
      return doc ? { ...doc, resumen_md: nuevoContenido } : null;
    });
  }
  async seleccionarDocumentoPorId(id: string) {
    try {
      // 1. Pedimos a la base de datos el documento fresco
      const { data, error } = await this.supabase
        .from('documentos')
        .select('*')
        .eq('id', id)
        .single(); // .single() es clave, devuelve un objeto, no un array

      if (error) throw error;

      // 2. Actualizamos la señal con la DATA NUEVA
      if (data) {
        this.selectedDoc.set(data);
      }
    } catch (error) {
      console.error("Error al refrescar documento:", error);
    }
  }
}
