export interface Documento{
  id: string; //Supabase genera el id automaticamente
  titulo: string;
  parent_id: number | null; //null si es raiz
  contenido_md?: string; // El '?' significa que es opcional (puede venir o no)
  resumen_md?: string
}