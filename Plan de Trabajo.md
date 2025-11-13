## Plan de Desarrollo Ágil (Modo Híbrido + Árbol)

Este es el plan de Fases (Sprints) basado en "rebanadas verticales". Cada fase es un objetivo funcional que atraviesa *todas* las capas (Front, Back y DB) y se basa en tu idea del **Árbol de Conocimiento**.

### Fase 0: Configuración y "Hola, Nube"
* **Objetivo:** Preparar el terreno y confirmar la conexión básica.
* **Tareas:**
    1.  **GitHub:** Crear tu repositorio `feynman-processor` en tu cuenta personal (¡Hecho!).
    2.  **Supabase:**
        * Crear tu cuenta gratuita en [supabase.com](https://supabase.com).
        * Crear un "Nuevo Proyecto" (ej. "feynman-processor").
        * Guardar tus "Project Keys" (la `URL` y la `anon key`). Las necesitarás en un minuto.
    3.  **Front-End (Angular):**
        * En tu terminal local, crear el proyecto: `ng new feynman-processor`
    4.  **Conexión:**
        * Instalar el cliente de Supabase en tu proyecto de Angular: `npm install @supabase/supabase-js`
        * Crear un servicio en Angular (`supabase.service.ts`) e inicializar la conexión usando las *Keys* que guardaste.
    5.  **Commit:** `chore: configurar proyecto inicial angular y supabase`

---

### Fase 1: El Árbol (MVP de Documentos)
* **Objetivo:** Poder crear un documento "raíz" y verlo en una lista.
* **Tareas:**
    1.  **DB (Supabase):**
        * Ir al "Table Editor" en tu panel de Supabase.
        * Crear la tabla `documentos` con las columnas: `id` (uuid), `titulo` (text), `contenido_md` (text), y `parent_id` (uuid, con permiso para ser `NULL`).
    2.  **Front-End (Angular):**
        * Crear un componente `tree-viewer` (Visor de Árbol).
        * Por ahora, que solo muestre una lista simple (`<ul>`) de los `documentos` donde `parent_id` es `NULL`. (Usarás `supabase.from('documentos').select('*').is('parent_id', null)`).
    3.  **Front-End (Angular):**
        * Crear un componente `doc-creator` (Creador de Documentos) con un `<input>` para `titulo` y un botón "Guardar".
    4.  **Back-End (Conexión):**
        * Hacer que el botón "Guardar" llame a la función `supabase.from('documentos').insert({ titulo: 'Mi Título', parent_id: null })`.
    5.  **Commit:** `feat(docs): implementar creación y vista de documentos raíz (full-stack)`

---

### Fase 2: El Árbol Interactivo
* **Objetivo:** Poder anidar documentos y editar su contenido.
* **Tareas:**
    1.  **Front-End (Angular):**
        * Modificar `tree-viewer` para que al hacer clic en un documento (ej. "Arquitectura") se haga una *nueva* consulta a Supabase para buscar "hijos" (ej. `...select('*').eq('parent_id', 'id-del-padre')`).
        * Mostrar esos hijos anidados debajo del padre.
    2.  **Front-End (Angular):**
        * Crear un componente `doc-editor` (Editor de Documentos).
        * Al hacer clic en un documento del `tree-viewer`, este editor debe mostrar el `titulo` en un `<input>` y el `contenido_md` en un `<textarea>`.
    3.  **Back-End (Conexión):**
        * Añadir un botón "Guardar Cambios" al `doc-editor` que llame a `supabase.from('documentos').update({ ... }).eq('id', 'id-del-documento')`.
    4.  **Commit:** `feat(docs): implementar anidación y edición de documentos`

---

### Fase 3: Conexión con el Quiz
* **Objetivo:** Poder crear una pregunta que *pertenezca* a un documento.
* **Tareas:**
    1.  **DB (Supabase):**
        * Crear la tabla `preguntas` con las columnas: `id` (uuid), `pregunta_texto` (text), `respuesta_texto` (text), y **`documento_id` (uuid, Foreign Key a `documentos.id`)**.
    2.  **Front-End (Angular):**
        * En el componente `doc-editor`, añadir un pequeño formulario (dos `<textarea>` y un botón "Añadir Pregunta").
    3.  **Back-End (Conexión):**
        * Hacer que ese botón guarde la nueva pregunta en la tabla `preguntas`, asegurándose de incluir el `documento_id` del documento que se está editando.
    4.  **Commit:** `feat(quiz): implementar creación de preguntas asociadas a un documento`

---

### Fase 4: El Quizzer Funcional
* **Objetivo:** Poder iniciar un quiz basado en el documento que estoy viendo.
* **Tareas:**
    1.  **Front-End (Angular):**
        * Crear un componente `quizzer`.
        * Añadir un botón "Iniciar Quiz" en la vista del `doc-editor`.
    2.  **Back-End (Conexión):**
        * Al hacer clic, llamar a Supabase y pedir *todas* las preguntas donde `documento_id` sea el del documento actual. (ej. `...select('*').eq('documento_id', 'id-del-documento')`).
    3.  **Front-End (Angular):**
        * Implementar la lógica simple en el `quizzer` para mostrar la primera pregunta, y un botón para "Mostrar Respuesta".
    4.  **Commit:** `feat(quiz): implementar quizzer básico por documento (full-stack)`

---

### Fase 5 y Más Allá:
* Implementar la lógica de repetición espaciada (Fase 4 del plan anterior).
* Añadir la librería de Markdown (`ngx-markdown`) para que el `doc-editor` sea más bonito.
* Implementar el "Modo Creación" (ocultar el original).