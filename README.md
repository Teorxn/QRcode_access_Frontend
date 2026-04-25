# Sistema de Control de Acceso - Frontend

Este es el repositorio del Frontend para el Sistema de Control de Acceso de la Institución Universitaria Pascual Bravo, construido con [Next.js](https://nextjs.org/).

## 📝 Nota Importante sobre la Integración con Backend

El frontend se encuentra **preparado y estructurado para integrarse con un backend real**. Sin embargo, para efectos de calificación y siguiendo las instrucciones dadas ("_se permite usar /data para quemar datos_"), actualmente **la aplicación consume datos simulados (mock data)** desde la carpeta `/data`.

Por esta razón, **no verás llamadas a APIs externas mediante `fetch` o el uso del directorio `/api`**. Toda la interfaz, los componentes y las vistas están completamente desarrollados y listos para que, cuando el backend esté disponible, solo sea necesario cambiar las importaciones locales de JSON por las peticiones reales a la API.

---

## 🌳 Estructura de Carpetas (Árbol)

A continuación se explica la estructura del proyecto y el propósito de cada directorio y archivo principal:

```text
qrs_frontend/
├── data/                  # Datos simulados (Mock Data)
│   ├── areas.json         # Datos quemados de las áreas de la universidad
│   ├── codigos_qr.json    # Datos de códigos QR generados
│   ├── empleados.json     # Información simulada de los empleados
│   ├── employments.json   # Datos de cargos/puestos de trabajo
│   ├── history.json       # Historial de accesos (entradas/salidas)
│   ├── registros_acceso.json
│   └── usuarios_sistema.json
│
├── public/                # Archivos estáticos y públicos
│   └── (imágenes, iconos, etc., accesibles directamente desde la raíz del sitio)
│
├── src/                   # Código fuente principal de la aplicación
│   ├── app/               # App Router de Next.js (Rutas y páginas principales)
│   │   ├── components/    # Componentes UI reutilizables (ej. Sidebar, Header, Tablas)
│   │   ├── Employees/     # Ruta '/Employees' - Vista del directorio de empleados
│   │   │   └── page.tsx   # Página que muestra la lista y gestión de empleados
│   │   ├── Record/        # Ruta '/Record' - Vista del historial de accesos
│   │   │   └── page.tsx   # Página que muestra el registro de entradas y salidas
│   │   ├── Scan/          # Ruta '/Scan' - Vista del escáner de QR
│   │   │   └── page.tsx   # Página diseñada para la lectura de códigos QR
│   │   ├── favicon.ico    # Icono de la página
│   │   ├── globals.css    # Estilos globales (Tailwind CSS, variables CSS)
│   │   ├── layout.tsx     # Layout principal (contiene la estructura base como el Sidebar)
│   │   └── page.tsx       # Ruta '/' - Página de inicio / Dashboard principal
│   │
│   ├── lib/               # Capa de datos (API, mock y repositorios)
│   │   ├── api/           # Clientes HTTP por dominio para backend real
│   │   │   ├── employees.ts
│   │   │   ├── endpoints.ts
│   │   │   ├── history.ts
│   │   │   ├── scan.ts
│   │   │   ├── index.ts
│   │   │   └── README.md
│   │   ├── http/          # Infraestructura HTTP compartida
│   │   │   ├── api-client.ts
│   │   │   ├── api-error.ts
│   │   │   └── index.ts
│   │   ├── mock/          # Adaptador de datos locales (JSON) a modelos tipados
│   │   │   └── database.ts
│   │   └── repositories/  # Funciones consumidas por las paginas
│   │       ├── access.repository.ts
│   │       ├── areas.repository.ts
│   │       ├── dashboard.repository.ts
│   │       ├── employees.repository.ts
│   │       ├── scan.repository.ts
│   │       ├── index.ts
│   │       └── README.md
│   └── types/             # Definiciones de tipos de TypeScript (interfaces, types)
│
├── .next/                 # Carpeta generada automáticamente por Next.js en desarrollo/producción
├── node_modules/          # Dependencias de npm/pnpm
├── .env.example           # Ejemplo de variables de entorno requeridas
├── eslint.config.mjs      # Configuración de linting para mantener calidad del código
├── next.config.ts         # Configuración del framework Next.js
├── package.json           # Lista de dependencias y scripts del proyecto
├── pnpm-lock.yaml         # Archivo de bloqueo de versiones de pnpm
├── postcss.config.mjs     # Configuración para PostCSS (usado por Tailwind)
└── tsconfig.json          # Configuración del compilador de TypeScript
```

## 🛠️ Para qué sirve cada cosa (Detalle)

### `/data`

Como se mencionó, esta carpeta contiene los archivos `.json` que actúan como nuestra "base de datos temporal". Esto nos permite tener la aplicación 100% funcional y visualmente completa sin depender del backend. Aquí viven los registros de empleados, historial de escaneos y otros datos necesarios para renderizar las tablas y gráficos.

### `/src/app`

Utilizamos el **App Router** de Next.js. Cada subcarpeta aquí dentro representa una ruta en el navegador:

- **`/src/app/page.tsx`**: Es el Dashboard principal que ves al entrar a la raíz (`localhost:3000/`).
- **`/src/app/Employees`**: Es la ruta que muestra el listado de empleados o directorio.
- **`/src/app/Hystorial`**: Muestra la tabla con el historial de quienes han entrado y salido.
- **`/src/app/Scan`**: La interfaz dedicada a leer los códigos QR.

### `/src/app/components`

Aquí guardamos las piezas de Lego de nuestra interfaz. Cosas como el menú lateral (`Sidebar.tsx`), botones personalizados, tarjetas de información o tablas. Al estar separados, podemos reutilizarlos en múltiples vistas sin repetir código.

### `/src/app/layout.tsx`

Es el cascarón de nuestra aplicación. Aquí definimos que, sin importar en qué ruta estés (Dashboard, Empleados, Historial), siempre se mantenga visible el menú lateral (`Sidebar`) y la estructura básica de la página.

### `/src/app/globals.css`

Aquí viven nuestros estilos globales de Tailwind CSS y configuraciones de temas (como el modo oscuro o colores institucionales de Pascual Bravo).

### `/src/lib`

Esta carpeta concentra la capa de datos. La UI no consume JSON directo ni detalles de red: solo usa las funciones de repositorio.

#### `/src/lib/api`

Clientes HTTP por dominio para cuando el backend este disponible.

- `endpoints.ts`: mapa de rutas del backend.
- `employees.ts`: operaciones de empleados (listado, detalle, crear, editar, eliminar).
- `history.ts`: listado de historial de accesos con filtros.
- `scan.ts`: validacion de QR y estadisticas del dashboard.
- `index.ts`: exportaciones publicas del modulo.
- `README.md`: guia breve de uso y variables de entorno.

#### `/src/lib/http`

Infraestructura HTTP compartida para consumir el backend.

- `api-client.ts`: wrapper de `fetch` con base URL, query params y parseo de respuesta.
- `api-error.ts`: error tipado para respuestas no exitosas.
- `index.ts`: exportaciones publicas del modulo.

#### `/src/lib/mock`

Adaptador de datos locales (archivos JSON) a modelos tipados.

- `database.ts`: normaliza los datos de `/data` y expone funciones de lectura/escritura en memoria.

#### `/src/lib/repositories`

Funciones que consumen las paginas y componentes, aislando el origen de datos.

- `access.repository.ts`: compone el historial de accesos con datos de empleados, areas y QR.
- `areas.repository.ts`: lista areas ordenadas.
- `dashboard.repository.ts`: agrega metricas, tendencia y accesos recientes.
- `employees.repository.ts`: lista empleados con filtros y campos derivados.
- `scan.repository.ts`: valida QR y registra accesos, y expone QR de demo.
- `index.ts`: exportaciones publicas del modulo.
- `README.md`: explica el modo de datos actual y como migrar al backend.

## 🚀 Cómo ejecutar el proyecto

Para correr este proyecto en tu máquina local:

1. Instala las dependencias:

```bash
npm install
# o
pnpm install
```

2. Ejecuta el servidor de desarrollo:

```bash
npm run dev
# o
pnpm dev
```

3. Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación.
