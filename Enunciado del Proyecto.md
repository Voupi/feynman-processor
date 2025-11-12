### Enunciado del Proyecto: "Feynman Processor" (Nombre Provisional)

**1. Propósito (El Porqué)**
Crear una aplicación web de aprendizaje activo, diseñada para uso personal, que transforme el estudio pasivo (leer) en un proceso activo (procesar y recordar). El sistema se basa en la **Técnica Feynman** (explicar con palabras propias) y la **Recuperación Activa** (active recall) para maximizar la retención del conocimiento.

**2. Módulos Principales (El Qué)**

* **Módulo 1: El Anotador (Frontend)**
    * Una interfaz web de dos paneles (split-view) y responsiva.
    * **Panel Izquierdo (Lector):** Renderiza archivos Markdown (`.md`). Debe mostrar la jerarquía estructural (títulos, listas, negritas) de forma limpia y sin distracciones (evitando la "carga cognitiva extrínseca").
    * **Panel Derecho (Procesador):** Un editor de texto simple donde el usuario escribe sus resúmenes y explicaciones (la aplicación de la Técnica Feynman) basados en el texto del Panel Izquierdo.
* **Módulo 2: El Generador de Preguntas (UI-Logic)**
    * Un "modo de creación" que **oculta el Panel Izquierdo** (el texto original), forzando al usuario a trabajar solo desde su entendimiento (su resumen del Panel Derecho).
    * Una interfaz simple (un formulario) que permite al usuario seleccionar texto de su resumen (Panel Derecho) y crear una "Flashcard" (Pregunta + Respuesta + Feedback Opcional).
    * Esta acción guarda la nueva pregunta en la base de datos.
* **Módulo 3: El Motor de Quizzes (Backend-Logic)**
    * Un módulo (que será la nueva versión de tu script de Python) que presenta al usuario las preguntas guardadas.
    * Debe implementar **lógica de repetición**: si el usuario falla una pregunta, esta debe reaparecer más pronto. Si la acierta, su intervalo de aparición se alarga (Repetición Espaciada).
    * Debe registrar el progreso del usuario por cada pregunta.

**3. Stack Técnico Propuesto (El Con Qué)**

* **Frontend:** **Angular** (compilado a archivos estáticos).
* **Backend (BaaS):** **Firebase** (Plan Spark) o **Supabase** (Capa Gratuita).
* **Base de Datos:** **PostgreSQL** (en Supabase).
* **Hosting:** Firebase Hosting, Vercel, o Netlify (para el frontend estático).
* **Lógica de Backend (Quizzer):** **Firebase Functions** o **Supabase Functions** (corriendo en Node.js, aquí re-implementarás la lógica de Python).
