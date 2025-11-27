# Feynman Processor

> Una aplicación web de aprendizaje activo basada en la Técnica Feynman y recuperación espaciada.

[![Angular](https://img.shields.io/badge/Angular-20.3-DD0031?style=flat&logo=angular)](https://angular.io/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=flat&logo=supabase)](https://supabase.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)

---

## 📋 Tabla de Contenidos

- [Acerca del Proyecto](#-acerca-del-proyecto)
- [Características](#-características)
- [Arquitectura](#-arquitectura)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Uso](#-uso)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Tecnologías](#-tecnologías)
- [Decisiones de Diseño](#-decisiones-de-diseño)
- [Roadmap](#-roadmap)
- [Licencia](#-licencia)

---

## 🎯 Acerca del Proyecto

**Feynman Processor** es una herramienta personal de aprendizaje que transforma el estudio pasivo en un proceso activo y efectivo. Combina:

- **La Técnica Feynman**: Explica conceptos con tus propias palabras
- **Recuperación Activa**: Genera preguntas a partir de tus notas
- **Repetición Espaciada**: Repite contenido basándose en tu desempeño

Decidí crear esta aplicación para mejorar mi propio proceso de aprendizaje, retención de la información y comprensión profunda de temas complejos. Se puede guardar la información original del tema, luego hacer tu propio resumen con tus palabras (Técnica Feynman) y finalmente puedes crear tus preguntas para practicar (Recuperación Activa). La idea es que al repetir estas preguntas en intervalos espaciados, puedas consolidar el conocimiento a largo plazo. Y así lograr sacar 100 en los exámenes.

---

## ✨ Características

### Gestión de Documentos
- 📁 **Estructura jerárquica**: Organiza tus notas en árbol (documentos padre-hijo)
- ✍️ **Editor Markdown**: Escribe y visualiza contenido en formato Markdown
- 🌳 **Navegación interactiva**: Explora documentos anidados dinámicamente

### Sistema de Quiz
- ❓ **Creación de preguntas**: Genera flashcards desde tus notas
- 🎯 **Quiz por documento**: Practica solo el contenido que necesitas
- 🔁 **Asociación inteligente**: Las preguntas se vinculan automáticamente a sus documentos

### Seguridad y Usuarios
- 🔐 **Autenticación completa**: Sistema de registro e inicio de sesión
- 🛡️ **Row Level Security (RLS)**: Cada usuario solo ve sus propios datos
- 🚧 **Rutas protegidas**: Acceso restringido mediante guards de Angular

---

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────────────┐
│                    ANGULAR FRONTEND                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Tree Viewer  │  │  Doc Editor  │  │   Quizzer    │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│           │                │                 │           │
│           └────────────────┴─────────────────┘           │
│                           │                              │
│                  ┌────────▼────────┐                     │
│                  │  Auth Service   │                     │
│                  │ Supabase Client │                     │
│                  └────────┬────────┘                     │
└───────────────────────────┼──────────────────────────────┘
                            │ HTTPS
┌───────────────────────────▼──────────────────────────────┐
│                    SUPABASE (BaaS)                        │
│  ┌─────────────────────────────────────────────────────┐ │
│  │          PostgreSQL Database (RLS enabled)          │ │
│  │  ┌────────────────┐      ┌────────────────┐        │ │
│  │  │  documentos    │      │   preguntas    │        │ │
│  │  │  - id          │──┐   │  - id          │        │ │
│  │  │  - titulo      │  └──▶│  - documento_id│        │ │
│  │  │  - contenido   │      │  - pregunta    │        │ │
│  │  │  - parent_id   │      │  - respuesta   │        │ │
│  │  │  - user_id     │      │  - user_id     │        │ │
│  │  └────────────────┘      └────────────────┘        │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                           │
│  ┌─────────────────────────────────────────────────────┐ │
│  │              Auth (Magic Links/Email)                │ │
│  └─────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────┘
```

### Flujo de Datos

1. **Autenticación**: Usuario → Auth Service → Supabase Auth
2. **CRUD Documentos**: Tree Viewer/Editor → Supabase Client → PostgreSQL (RLS)
3. **Quiz**: Quizzer → Query filtrado por `documento_id` → PostgreSQL

---

## 📦 Requisitos Previos

- **Node.js**: v20.x o superior
- **npm**: v10.x o superior
- **Angular CLI**: v20.3 o superior
- **Cuenta en Supabase**: [Crear una cuenta gratuita](https://supabase.com)

---

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/Voupi/feynman-processor.git
cd feynman-processor/feynman-processor
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea los archivos de entorno en `src/environments/`:

**`environment.development.ts`**:
```typescript
export const environment = {
  production: false,
  supabaseUrl: 'TU_SUPABASE_URL',
  supabaseKey: 'TU_SUPABASE_ANON_KEY'
};
```

**`environment.ts`**:
```typescript
export const environment = {
  production: true,
  supabaseUrl: 'TU_SUPABASE_URL',
  supabaseKey: 'TU_SUPABASE_ANON_KEY'
};
```

> **📌 Nota**: Las claves se encuentran en tu proyecto de Supabase en `Settings > API`

### 4. Configurar la Base de Datos en Supabase

Ejecuta el siguiente script SQL en el **SQL Editor** de Supabase:

```sql
-- Crear tabla de documentos
CREATE TABLE documentos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  contenido_md TEXT,
  parent_id UUID REFERENCES documentos(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de preguntas
CREATE TABLE preguntas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pregunta_texto TEXT NOT NULL,
  respuesta_texto TEXT NOT NULL,
  documento_id UUID REFERENCES documentos(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar Row Level Security
ALTER TABLE documentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE preguntas ENABLE ROW LEVEL SECURITY;

-- Políticas para documentos
CREATE POLICY "Los usuarios solo ven sus documentos" 
  ON documentos FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios crean sus documentos" 
  ON documentos FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Los usuarios actualizan sus documentos" 
  ON documentos FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios eliminan sus documentos" 
  ON documentos FOR DELETE 
  USING (auth.uid() = user_id);

-- Políticas para preguntas
CREATE POLICY "Los usuarios solo ven sus preguntas" 
  ON preguntas FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios crean sus preguntas" 
  ON preguntas FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Los usuarios actualizan sus preguntas" 
  ON preguntas FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios eliminan sus preguntas" 
  ON preguntas FOR DELETE 
  USING (auth.uid() = user_id);
```

### 5. Iniciar el servidor de desarrollo

```bash
npm start
```

Abre tu navegador en `http://localhost:4200`

---

## ⚙️ Configuración

### Autenticación

Supabase está configurado con autenticación por email. Para personalizar:

1. Ve a `Authentication > Providers` en Supabase
2. Configura proveedores adicionales (Google, GitHub, etc.)
3. Actualiza `auth.service.ts` según necesites

### Markdown

El proyecto usa `ngx-markdown` para renderizar contenido. Configuración en `app.config.ts`:

```typescript
provideMarkdown()
```

---

## 💻 Uso

### 1. Registro e Inicio de Sesión

- Accede a `/login`
- Regístrate con tu email
- Confirma tu cuenta (revisa tu correo)
- Inicia sesión

### 2. Crear Documentos

- En la vista principal (`/home`), haz clic en "Nuevo Documento"
- Escribe un título
- Opcionalmente, selecciona un documento padre para crear jerarquía

### 3. Editar Contenido

- Haz clic en un documento del árbol
- Edita el contenido en formato Markdown en el panel derecho
- Los cambios se guardan automáticamente

### 4. Crear Preguntas

- Desde el editor de documentos, haz clic en "Crear Pregunta"
- Escribe tu pregunta y respuesta
- La pregunta se asocia al documento actual

### 5. Practicar con Quiz

- Haz clic en "Iniciar Quiz" desde un documento
- Responde las preguntas asociadas
- (Próximamente: sistema de repetición espaciada)

---

## 📁 Estructura del Proyecto

```
feynman-processor/
├── src/
│   ├── app/
│   │   ├── guards/
│   │   │   └── auth-guard.ts          # Protección de rutas
│   │   ├── interfaces/
│   │   │   ├── Documento.ts           # Modelo de datos
│   │   │   └── pregunta.ts
│   │   ├── services/
│   │   │   ├── auth.ts                # Gestión de autenticación
│   │   │   └── supabase.ts            # Cliente de Supabase
│   │   ├── tree-viewer/               # Componente árbol de docs
│   │   ├── doc-editor/                # Componente editor
│   │   ├── quizzer/                   # Componente quiz
│   │   ├── login/                     # Componente login
│   │   ├── home/                      # Página principal
│   │   ├── app.routes.ts              # Rutas de la app
│   │   └── app.config.ts              # Configuración global
│   └── environments/
│       ├── environment.ts             # Config producción
│       └── environment.development.ts # Config desarrollo
├── angular.json
├── package.json
└── README.md
```

---

## 🛠️ Tecnologías

| Categoría | Tecnología | Propósito |
|-----------|-----------|-----------|
| **Frontend** | Angular 20.3 | Framework principal |
| **Lenguaje** | TypeScript 5.6 | Tipado estático |
| **Backend** | Supabase | BaaS (Base de Datos + Auth) |
| **Base de Datos** | PostgreSQL | Almacenamiento relacional |
| **Renderizado** | ngx-markdown | Visualización de Markdown |
| **Estilos** | CSS3 | Diseño personalizado |
| **Routing** | Angular Router | Navegación SPA |

---

## 💡 Decisiones de Diseño

### ¿Por qué crear Temas en estructura de árbol?
- _"Para organizar la información de manera jerárquica, facilitando la navegación y el contexto entre temas relacionados..."_

### Jerarquía de Documentos
- _"El modelo parent-child me permite organizar documentos de forma natural, reflejando cómo los temas se subdividen en subtemas y así sucesivamente..."_

### ¿Por las preguntas no es un cuestionario?
- _"Era por que aquí estás estudiando a conciencia, y tu decides si tu respuesta con la respuesta que dejaste está bien o necesitas seguir aprendiendo"_

## 🗺️ Roadmap

### ✅ Fase 0-5 (Completadas)
- [x] Configuración inicial (Angular + Supabase)
- [x] CRUD de documentos jerárquicos
- [x] Editor con soporte Markdown
- [x] Sistema de preguntas vinculadas
- [x] Autenticación completa
- [x] Row Level Security (RLS)

### 🚧 Próximas Funcionalidades
- [ ] **Repetición Espaciada**: Algoritmo SM-2 para priorizar preguntas
- [ ] **Estadísticas**: Dashboard de progreso y métricas de aprendizaje
- [ ] **Exportar/Importar**: Respaldo de datos en JSON/Markdown
- [ ] **Búsqueda Full-Text**: Buscar dentro de documentos
- [ ] **Tags/Etiquetas**: Categorización flexible de documentos
- [ ] **Modo Oscuro**: Tema dark para estudio nocturno
- [ ] **PWA**: Funcionalidad offline con Service Workers

---

## 📄 Licencia

Este proyecto es de uso personal. Si deseas usarlo o modificarlo, siéntete libre de hacerlo bajo tu propia responsabilidad.

---

## 🤝 Contacto

**Voupi** - [GitHub](https://github.com/Voupi)

**Link del Proyecto**: [https://github.com/Voupi/feynman-processor](https://github.com/Voupi/feynman-processor)

---

<p align="center">
  Hecho con 🧠 y la Técnica Feynman
</p>
