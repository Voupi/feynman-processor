import { Component, effect } from '@angular/core'; // Importamos effect
import { SupabaseService } from '../services/supabase';
import { FormsModule } from '@angular/forms';
import { Documento } from '../tree-viewer/tree-viewer';
import { CommonModule } from '@angular/common'; // Necesario para el loop

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

  constructor(public supabaseService: SupabaseService) {
    // --- EFECTO AUTOMÁTICO ---
    // Esto se ejecuta cada vez que seleccionas un documento distinto en el árbol principal
    effect(() => {
      const docActual = this.supabaseService.selectedDoc();
      
      if (docActual) {
        // Si hay un documento seleccionado, vamos a buscar sus hijos
        console.log("Cargando hijos para:", docActual.titulo);
        this.cargarHijos(docActual.id);
      } else {
        // Si no hay nada seleccionado, limpiamos la lista
        this.hijos = [];
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
  seleccionarDocumento(doc: Documento){
    // Al setear esto, el effect() se disparará de nuevo y cargará los hijos de ESTE nuevo doc
    this.supabaseService.selectedDoc.set(doc);
  }
}