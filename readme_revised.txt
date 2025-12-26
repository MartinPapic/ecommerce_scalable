# 🛒 Plataforma E-commerce Escalable

**Arquitectura MVVM · Alta Performance · SEO-First**

## 📌 Descripción General

Este proyecto corresponde a una **plataforma de e-commerce moderna y escalable**, diseñada como **plantilla base** para sitios de **volumen medio a alto de tráfico y ventas**.

Está construida bajo el **patrón arquitectónico MVVM**, con un enfoque en:
- Rendimiento
- Escalabilidad
- Mantenibilidad
- SEO
- Reutilización en distintos proyectos o clientes

El sistema separa claramente las responsabilidades entre frontend, backend, datos y servicios de infraestructura.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 16 (App Router, React 19)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS 4
- **Componentes:** Radix UI, Shadcn/ui
- **Iconos:** Lucide React
- **Animaciones:** Framer Motion
- **Estado:** Zustand
- **Gráficos:** Recharts

### Backend
- **Framework:** FastAPI (Python)
- **Servidor:** Uvicorn
- **Base de Datos:** MySQL (Driver: PyMySQL)
- **ORM:** SQLAlchemy
- **Validación:** Pydantic
- **Manejo de Archivos:** Python-multipart

---

## 📂 Estructura del Proyecto

```text
ecommerce_scalable/
├── backend/                  # API y Lógica de Negocio
│   ├── app/
│   │   ├── auth.py           # Autenticación
│   │   ├── database.py       # Configuración de BD
│   │   ├── main.py           # Entry point (FastAPI app)
│   │   ├── models.py         # Modelos SQLAlchemy
│   │   ├── schemas.py        # Esquemas Pydantic
│   │   └── ...
│   ├── uploads/              # Almacenamiento local de imágenes
│   ├── requirements.txt      # Dependencias de Python
│   ├── migrate_*.py          # Scripts de migración
│   ├── seed_*.py             # Scripts de población de datos
│   ├── create_admin.py       # Creación de superusuario
│   └── ...
│
├── frontend/                 # Cliente Web Next.js
│   ├── src/
│   │   ├── app/              # App Router (Páginas)
│   │   ├── components/       # Componentes React
│   │   ├── lib/              # Utilidades
│   │   └── ...
│   ├── public/               # Assets estáticos
│   ├── package.json          # Dependencias de Node.js
│   └── ...
│
└── readme.md                 # Documentación original
```

---

## 🚀 Guía de Ejecución

### Requisitos Previos
- **Node.js** (v18+ recomendado)
- **Python** (v3.8+)
- **MySQL** (Servidor corriendo y base de datos creada)

### 1. Configuración del Backend

1.  Navega al directorio `backend`:
    ```bash
    cd backend
    ```

2.  Crea y activa un entorno virtual:
    ```bash
    # Windows
    python -m venv venv
    .\venv\Scripts\activate

    # Linux/Mac
    python3 -m venv venv
    source venv/bin/activate
    ```

3.  Instala las dependencias:
    ```bash
    pip install -r requirements.txt
    ```

4.  Configura la conexión a Base de Datos (Revisar `backend/app/database.py` o configurar variables de entorno si aplica).

5.  Ejecuta las migraciones y seeders iniciales:
    ```bash
    python migrate_users.py
    python migrate_inventory.py
    python migrate_admin.py
    python seed_db.py
    ```

6.  (Opcional) Crea un usuario administrador:
    ```bash
    python create_admin.py
    ```

7.  Inicia el servidor de desarrollo:
    ```bash
    uvicorn app.main:app --reload
    ```
    *La API estará disponible en `http://localhost:8000`*
    *Documentación interactiva en `http://localhost:8000/docs`*

### 2. Configuración del Frontend

1.  Navega al directorio `frontend` (en una nueva terminal):
    ```bash
    cd frontend
    ```

2.  Instala las dependencias:
    ```bash
    npm install
    ```

3.  Inicia el servidor de desarrollo:
    ```bash
    npm run dev
    ```
    *La aplicación web estará disponible en `http://localhost:3000`*

---

## 🧱 Arquitectura General & Flujo de Datos

```mermaid
graph TD
    User((Usuario)) --> |Browser| Frontend[Next.js Frontend]
    Frontend --> |HTTP/JSON| Backend[FastAPI Backend]
    Backend --> |SQL| DB[(MySQL Database)]
    Backend --> |Files| Uploads[Local Uploads]
```

### Patrón MVVM en Frontend
| Capa | Responsabilidad |
|---|---|
| **View** | Páginas (`/app`) y componentes visuales (`/components`) |
| **ViewModel** | Lógica de estado, validaciones, llamadas a API (Hooks personalizados) |
| **Model** | Tipos TypeScript, DTOs, interfaces de respuesta de API |

---

## ✨ Características Principales

- **Gestión de Productos:** CRUD completo, carga de imágenes, control de inventario.
- **Carrito de Compras:** Persistencia local y sincronización.
- **Panel de Administración:** Gestión de usuarios, productos y métricas básicas.
- **Autenticación:** Sistema de login/registro (JWT implementado en backend).
- **Diseño Responsivo:** Adaptado a móviles y escritorio con modo oscuro.

---

## 👤 Autor

**Martín Papic**
Ingeniería en Informática – DUOC UC
