# Control Acceso — I.U. Pascual Bravo

Dashboard web para el control de acceso de empleados mediante códigos QR.  
**Frontend:** Next.js 16 + Tailwind CSS  
**Backend (pendiente):** ASP.NET Core Web API en C#

---

## Tabla de contenido

1. [Visión general del proyecto](#1-visión-general-del-proyecto)
2. [Estructura del frontend](#2-estructura-del-frontend)
3. [Capa de datos mock (temporal)](#3-capa-de-datos-mock-temporal)
4. [Esquema de base de datos](#4-esquema-de-base-de-datos)
5. [Contrato de la API — endpoints requeridos](#5-contrato-de-la-api--endpoints-requeridos)
6. [Cómo conectar el frontend al backend real](#6-cómo-conectar-el-frontend-al-backend-real)
7. [Stack recomendado para el backend en C#](#7-stack-recomendado-para-el-backend-en-c)

---

## 1. Visión general del proyecto

El sistema permite a un vigilante o portero escanear el código QR de un empleado con una cámara web. El sistema valida el QR contra la base de datos y registra automáticamente la **entrada o salida**, mostrando el resultado en pantalla en tiempo real.

### Rutas del frontend

| Ruta          | Descripción                                                   |
|---------------|---------------------------------------------------------------|
| `/`           | Dashboard con estadísticas del día y accesos recientes        |
| `/Scan`       | Escáner QR en vivo (cámara) + validación de acceso            |
| `/Employees`  | Listado de empleados con búsqueda y filtros                   |
| `/Record`     | Historial completo de accesos con filtros por área y estado   |

---

## 2. Estructura del frontend

```
src/
├── app/
│   ├── layout.tsx              # Layout raíz con Sidebar persistente
│   ├── page.tsx                # Dashboard (/)
│   ├── Scan/page.tsx           # Escáner QR (/Scan)
│   ├── Employees/page.tsx      # Empleados (/Employees)
│   ├── Record/page.tsx         # Historial (/Record)
│   └── components/
│       ├── Sidebar.tsx         # Navegación lateral
│       └── QrScanner.tsx       # Componente de cámara en vivo (html5-qrcode)
├── types/                      # Contratos TypeScript (equivalen a DTOs del backend)
│   ├── area.ts
│   ├── employee.ts
│   ├── history.ts
│   ├── qr.ts
│   ├── scan.ts
│   └── user.ts
└── lib/
    ├── mock/
    │   └── database.ts         # Base de datos en memoria (TEMPORAL - reemplazar por API)
    └── repositories/           # Lógica de acceso a datos (llamar API real aquí)
        ├── access.repository.ts
        ├── areas.repository.ts
        ├── dashboard.repository.ts
        ├── employees.repository.ts
        ├── scan.repository.ts
        └── index.ts            # Re-exports públicos
data/                           # JSONs que simulan la BD (TEMPORAL)
    ├── areas.json
    ├── empleados.json
    ├── codigos_qr.json
    ├── registros_acceso.json
    └── usuarios_sistema.json
```

---

## 3. Capa de datos mock (temporal)

Mientras el backend de C# no esté disponible, el frontend usa una **base de datos en memoria** (`src/lib/mock/database.ts`) que carga los JSON de `/data` al inicio.

> **Importante:** Esta capa es completamente temporal. Cuando el backend esté listo, los archivos en `src/lib/repositories/` deben reemplazar sus implementaciones mock por llamadas `fetch` a los endpoints de la API REST.

### Flujo actual (mock)

```
Página React
    └── llama función del repositorio  (ej: validateAccess)
            └── mockDb.getQrCodes()   (lee JSON en memoria)
            └── mockDb.appendAccessRecord()  (escribe en estado en memoria)
```

### Flujo futuro (backend real)

```
Página React
    └── llama función del repositorio  (ej: validateAccess)
            └── fetch("POST /api/access/validate", body)
                    └── ASP.NET Core Controller
                            └── SQL Server / base de datos real
```

---

## 4. Esquema de base de datos

El esquema está inferido directamente de los tipos TypeScript en `src/types/` y los JSONs en `/data`. Las columnas en los JSON usan `snake_case` (convención SQL), mientras que el frontend los convierte a `camelCase`.

### Tabla: `areas`

| Columna        | Tipo          | Descripción                     |
|----------------|---------------|---------------------------------|
| `id_area`      | INT PK        | Identificador único             |
| `nombre_area`  | VARCHAR(100)  | Nombre del área (ej: "Biblioteca") |
| `descripcion`  | TEXT NULL     | Descripción opcional            |
| `activa`       | BIT           | Si el área está habilitada      |

### Tabla: `empleados`

| Columna           | Tipo                         | Descripción                            |
|-------------------|------------------------------|----------------------------------------|
| `id_empleado`     | INT PK                       | Identificador único                    |
| `num_documento`   | VARCHAR(20) UNIQUE           | Número de cédula / pasaporte           |
| `tipo_documento`  | ENUM('CC','CE','PASAPORTE')  | Tipo de documento de identidad         |
| `nombres`         | VARCHAR(100)                 | Nombres del empleado                   |
| `apellidos`       | VARCHAR(100)                 | Apellidos del empleado                 |
| `email`           | VARCHAR(150) NULL            | Correo electrónico                     |
| `cargo`           | VARCHAR(100) NULL            | Cargo o rol laboral                    |
| `id_area`         | INT FK → areas               | Área a la que pertenece                |
| `id_usuario`      | INT FK → usuarios NULL       | Cuenta de usuario del sistema (opcional) |
| `foto_url`        | TEXT NULL                    | URL de foto de perfil                  |
| `activo`          | BIT                          | Si el empleado está habilitado         |
| `fecha_registro`  | DATETIME                     | Fecha de creación del registro         |

### Tabla: `codigos_qr`

| Columna            | Tipo         | Descripción                                    |
|--------------------|--------------|------------------------------------------------|
| `id_qr`            | INT PK       | Identificador único                            |
| `id_empleado`      | INT FK       | Empleado al que pertenece el QR                |
| `codigo_hash`      | VARCHAR(255) UNIQUE | Hash único que se codifica en el QR     |
| `fecha_generacion` | DATETIME     | Cuándo se generó el código                     |
| `activo`           | BIT          | Si el código QR es válido actualmente          |

> Un empleado puede tener varios QRs en la historia, pero solo uno activo a la vez.

### Tabla: `registros_acceso`

| Columna           | Tipo                       | Descripción                             |
|-------------------|----------------------------|-----------------------------------------|
| `id_registro`     | INT PK                     | Identificador único (autoincremental)   |
| `id_qr`           | INT FK → codigos_qr        | QR que fue escaneado                    |
| `fecha_hora`      | DATETIME                   | Timestamp exacto del escaneo            |
| `tipo_movimiento` | ENUM('ENTRADA','SALIDA')   | Tipo de movimiento registrado           |
| `resultado`       | ENUM('EXITOSO','FALLIDO')  | Si el acceso fue aprobado o denegado    |

### Tabla: `usuarios_sistema`

| Columna           | Tipo                            | Descripción                          |
|-------------------|---------------------------------|--------------------------------------|
| `id_usuario`      | INT PK                          | Identificador único                  |
| `username`        | VARCHAR(50) UNIQUE              | Nombre de usuario para login         |
| `password_hash`   | VARCHAR(255)                    | Hash bcrypt de la contraseña         |
| `rol`             | ENUM('ADMIN','OPERADOR')        | Rol del usuario en el sistema        |
| `nombre_completo` | VARCHAR(150)                    | Nombre para mostrar en la UI         |
| `activo`          | BIT                             | Si la cuenta está habilitada         |
| `ultimo_acceso`   | DATETIME NULL                   | Timestamp del último login           |

---

## 5. Contrato de la API — endpoints requeridos

Base URL sugerida: `https://localhost:5001/api`  
Todos los endpoints devuelven JSON. Los errores deben retornar `{ "mensaje": "descripción" }` con el código HTTP correspondiente.

---

### `GET /api/areas`

Devuelve la lista de todas las áreas activas. Usado en el filtro del historial.

**Response `200`:**
```json
[
  { "idArea": 1, "nombreArea": "Administración", "descripcion": null, "activa": true },
  { "idArea": 2, "nombreArea": "Biblioteca",     "descripcion": null, "activa": true }
]
```

---

### `GET /api/employees`

Lista de empleados con soporte de búsqueda y filtros opcionales por query string.

**Query params opcionales:**

| Param      | Tipo    | Descripción                                    |
|------------|---------|------------------------------------------------|
| `search`   | string  | Filtra por nombre, apellido o documento        |
| `idArea`   | int     | Filtra por área                                |
| `activo`   | bool    | Filtra por estado activo/inactivo              |

**Response `200`:**
```json
[
  {
    "idEmpleado": 1,
    "numDocumento": "1234567890",
    "tipoDocumento": "CC",
    "nombres": "María",
    "apellidos": "González Pérez",
    "email": "mgonzalez@pascualbravo.edu.co",
    "cargo": "Directora",
    "idArea": 1,
    "idUsuario": null,
    "fotoUrl": null,
    "activo": true,
    "fechaRegistro": "2024-01-15T08:00:00Z"
  }
]
```

---

### `POST /api/access/validate`

**Endpoint principal.** Recibe el hash del QR escaneado, valida si pertenece a un empleado activo con QR activo, registra el movimiento en `registros_acceso` y devuelve el resultado.

**Request body:**
```json
{
  "codigoHash": "QR-HASH-ABC123...",
  "tipoMovimiento": "ENTRADA"
}
```

**Lógica de validación:**
1. Buscar `codigoHash` en `codigos_qr`
2. Si no existe → `FALLIDO`, mensaje: `"QR no reconocido"`
3. Si `codigos_qr.activo = false` → `FALLIDO`, mensaje: `"QR inactivo"`
4. Buscar el empleado asociado al QR
5. Si `empleados.activo = false` → `FALLIDO`, mensaje: `"Empleado inactivo"`
6. Si todo OK → `EXITOSO`
7. En todos los casos (menos QR no encontrado), insertar en `registros_acceso`

**Response `200` — Acceso exitoso:**
```json
{
  "permitido": true,
  "resultado": "EXITOSO",
  "mensaje": "Acceso validado correctamente",
  "empleado": {
    "idEmpleado": 1,
    "nombres": "María",
    "apellidos": "González Pérez",
    "cargo": "Directora",
    "fotoUrl": null
  },
  "registro": {
    "idRegistro": 42,
    "idQr": 1,
    "fechaHora": "2026-04-24T18:45:00Z",
    "tipoMovimiento": "ENTRADA",
    "resultado": "EXITOSO"
  }
}
```

**Response `200` — Acceso denegado** (siempre 200, el campo `resultado` indica el estado):
```json
{
  "permitido": false,
  "resultado": "FALLIDO",
  "mensaje": "QR no reconocido"
}
```

---

### `GET /api/access/history`

Historial de accesos con filtros opcionales. Usado en la ruta `/Record`.

**Query params opcionales:**

| Param             | Tipo    | Descripción                           |
|-------------------|---------|---------------------------------------|
| `search`          | string  | Busca por nombre, apellido o documento |
| `idArea`          | int     | Filtra por área del empleado          |
| `idEmpleado`      | int     | Filtra por empleado específico        |
| `tipoMovimiento`  | string  | `ENTRADA` o `SALIDA`                  |
| `resultado`       | string  | `EXITOSO` o `FALLIDO`                 |
| `from`            | string  | Fecha de inicio ISO 8601              |
| `to`              | string  | Fecha de fin ISO 8601                 |

**Response `200`:**  
Array de objetos enriquecidos (JOIN entre `registros_acceso`, `codigos_qr`, `empleados`, `areas`):

```json
[
  {
    "idRegistro": 42,
    "fechaHora": "2026-04-24T18:45:00Z",
    "tipoMovimiento": "ENTRADA",
    "resultado": "EXITOSO",
    "qrCodeHash": "QR-HASH-ABC123",
    "employeeId": 1,
    "employeeName": "María González Pérez",
    "employeeDocument": "1234567890",
    "areaName": "Administración",
    "fotoUrl": null
  }
]
```

> Debe devolver los registros ordenados por `fecha_hora` descendente (más recientes primero).

---

### `GET /api/access/history/export/excel`

Exporta el historial filtrado como archivo `.xlsx`. Acepta los mismos query params que el endpoint anterior.

**Response:** archivo binario `Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`  
**Librería recomendada en C#:** `ClosedXML`

---

### `GET /api/access/history/export/pdf`

Exporta el historial filtrado como archivo `.pdf`. Acepta los mismos query params que el endpoint anterior.

**Response:** archivo binario `Content-Type: application/pdf`  
**Librería recomendada en C#:** `QuestPDF`

---

### `GET /api/dashboard/stats`

Estadísticas del día actual para las tarjetas del Dashboard.

**Response `200`:**
```json
{
  "totalRegistrosHoy": 24,
  "entradasHoy": 18,
  "salidasHoy": 6,
  "fallidosHoy": 2,
  "empleadosActivos": 5,
  "tiempoPromedioValidacionMs": 8300
}
```

---

### `GET /api/dashboard/trend`

Puntos de datos para el gráfico de tendencia del Dashboard (entradas/salidas por hora del día actual).

**Response `200`:**
```json
[
  { "time": "08:00", "entradas": 5, "salidas": 0 },
  { "time": "09:00", "entradas": 3, "salidas": 1 },
  { "time": "12:00", "entradas": 2, "salidas": 4 }
]
```

---

## 6. Cómo conectar el frontend al backend real

Cuando el backend de C# esté listo, **no hay que tocar las páginas de React**. Solo hay que modificar los archivos en `src/lib/repositories/`.

### Ejemplo — `scan.repository.ts` con API real

```typescript
// ANTES (mock)
export async function validateAccess(payload: ScanValidationInput) {
  const qr = mockDb.getQrCodes().find(row => row.codigoHash === payload.codigoHash);
  // ...lógica mock
}

// DESPUÉS (API real)
export async function validateAccess(payload: ScanValidationInput) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/access/validate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json() as Promise<ScanValidationResult>;
}
```

Agrega en `.env.local`:
```
NEXT_PUBLIC_API_URL=https://localhost:5001
```

---

## 7. Stack recomendado para el backend en C#

| Capa              | Tecnología recomendada                           |
|-------------------|--------------------------------------------------|
| Framework         | ASP.NET Core 8 Web API                           |
| ORM               | Entity Framework Core 8                          |
| Base de datos     | SQL Server (o PostgreSQL)                        |
| Autenticación     | ASP.NET Core Identity + JWT                      |
| Exportar Excel    | **ClosedXML** (open source, fácil de usar)       |
| Exportar PDF      | **QuestPDF** (moderno, fluent API)               |
| CORS              | Configurar para permitir `http://localhost:3000` |

### Estructura sugerida del proyecto C#

```
QRAccessApi/
├── Controllers/
│   ├── AccessController.cs      # POST /api/access/validate, GET /api/access/history
│   ├── EmployeesController.cs   # GET /api/employees
│   ├── AreasController.cs       # GET /api/areas
│   └── DashboardController.cs   # GET /api/dashboard/stats, GET /api/dashboard/trend
├── Models/                      # Entidades EF Core (mapean directamente al esquema de BD)
│   ├── Area.cs
│   ├── Empleado.cs
│   ├── CodigoQr.cs
│   ├── RegistroAcceso.cs
│   └── UsuarioSistema.cs
├── DTOs/                        # Objetos de transferencia (lo que se serializa a JSON)
│   ├── AccessValidateRequest.cs
│   ├── AccessValidateResponse.cs
│   ├── AccessHistoryItemDto.cs
│   └── DashboardStatsDto.cs
├── Services/
│   ├── AccessService.cs         # Lógica de validación del QR
│   └── ExportService.cs         # Generación de Excel y PDF
└── Data/
    └── AppDbContext.cs           # DbContext de Entity Framework
```
