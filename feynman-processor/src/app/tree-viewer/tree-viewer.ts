
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Importamos FormsModule para el two-way binding
import { CommonModule } from '@angular/common'; // Importamos CommonModule para poder iterar listas
import { SupabaseService} from '../services/supabase';
import { Documento } from '../interfaces/Documento';
@Component({
  selector: 'app-tree-viewer',
  imports: [CommonModule, FormsModule], // Importamos CommonModule para poder iterar listas
  templateUrl: './tree-viewer.html',
  styleUrl: './tree-viewer.css',
})
export class TreeViewer implements OnInit {
  // 1 Aquí se guarda lo local
  docsRaiz: Documento [] = [];
  NuevoTitulo: string = "";

  // Angular inyecta el servicio de Supabase mediante el constructor
  constructor(private supabase: SupabaseService) {}

  // Que es lo que se hace apenas se carga el componente
  ngOnInit() {
    this.cargarDocumento();
  }
  //Métodos de lógica
  //Método para cargar la información de la base de datos
  async cargarDocumento(){
    try {
      const {data, error} = await this.supabase.supabase
      .from('documentos')
      .select('*')
      .is('parent_id', null); // Cargar solo documentos raíz

      if (error) {console.error('Error al momento de cargar los documentos:', error.message);}
      else {
        this.docsRaiz = data || [];  
        console.log("Documentos cargados correctamente", this.docsRaiz);
      }
    } catch (error) {
      console.error('Error inesperado al cargar los documentos:', error);
    }
  }
  //Metodo para guardar
  async guardarDocumento() {
    // Validar no guardar titulos vacios
    if(this.NuevoTitulo.trim() === ""){
      console.error("El título no puede estar vacío.");
      return;
    }
    try {
      const { data, error } = await this.supabase.supabase
        .from('documentos')
        .insert({ titulo: this.NuevoTitulo, parent_id: null })
        .select(); // Usar .select() para obtener el registro insertado

      if (error) {
        console.error('Error al guardar el documento:', error.message);
      } else {
        console.log('Documento guardado correctamente:', data);
        this.NuevoTitulo = ""; // Limpiar el campo de entrada 
        this.cargarDocumento(); // Recargar la lista de documentos
      }
    } catch (error) {
      console.error('Error inesperado al guardar el documento:', error);
    }
  }
  async seleccionarDocumento(doc: Documento){
    this.supabase.selectedDoc.set(doc);
    console.log("Documento seleccionado:", doc);
  }
}
