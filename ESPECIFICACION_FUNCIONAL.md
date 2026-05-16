# Especificación Funcional — Le Petit Can App

> **Versión:** 1.0  
> **Fecha:** 2026-05-16  
> **Propósito:** Documento de especificación funcional para la app SaaS de gestión de Le Petit Can (peluquería canina, Narón).

---

## Índice

1. [Visión General](#1-visión-general)
2. [Historias de Usuario](#2-historias-de-usuario)
3. [Árbol de Navegación](#3-árbol-de-navegación)
4. [Diagrama de Entidades y Relaciones](#4-diagrama-de-entidades-y-relaciones)
5. [Reglas de Negocio](#5-reglas-de-negocio)
6. [Flujos Críticos](#6-flujos-críticos)
7. [Agente IA — Alcance y Recomendación](#7-agente-ia--alcance-y-recomendación)
8. [Requisitos de Seguridad](#8-requisitos-de-seguridad)
9. [Notificaciones y Recordatorios](#9-notificaciones-y-recordatorios)

---

## 1. Visión General

App SaaS para **Le Petit Can**, salón boutique de estética canina en Narón (A Coruña). Permite al staff gestionar clientes, mascotas, servicios, citas, pagos y facturación, y a los clientes autogestionar sus citas y datos. Incluye agente IA conversacional, sincronización con Google Calendar y recordatorios automatizados multicanal.

### Perfiles de usuario

| Perfil | Acceso | Autenticación |
|---|---|---|
| **Admin** | Todo el sistema | Email+password + 2FA configurable |
| **Peluquero** | Gestión de citas, clientes, mascotas, tickets | Email+password + 2FA configurable |
| **Cliente** | Autogestión (perfil, mascotas, citas, facturas) | Email+password + 2FA configurable |

### Plataforma

- Web App (PWA) responsive — funciona en navegador de escritorio y móvil.
- Instalable como app en móvil (Android/iOS) sin pasar por tienda.
- Stack: **Next.js 14+ / TypeScript / Prisma / PostgreSQL** (recomendado).

---

## 2. Historias de Usuario

### 2.1 Staff — Prioridad Alta (MVP)

| ID | Historia | Prioridad |
|---|---|---|
| S01 | Como staff, quiero un dashboard con resumen del día: citas hoy, pendientes, en curso, ingresos del día | Crítica |
| S02 | Como staff, quiero gestionar clientes (alta, edición, búsqueda, ver historial) | Crítica |
| S03 | Como staff, quiero gestionar mascotas: nombre, raza, tamaño, foto, cumpleaños, notas médicas, dueños vinculados | Crítica |
| S04 | Como staff, quiero que una mascota pueda tener varios dueños y un dueño varias mascotas (N:N) | Crítica |
| S05 | Como staff, quiero crear/modificar el catálogo de servicios con precios por talla | Crítica |
| S06 | Como staff, quiero crear citas seleccionando cliente, mascota, servicio, staff y horario | Crítica |
| S07 | Como staff, quiero ver el calendario en vista día/semana/mes con todas las citas | Crítica |
| S08 | Como staff, quiero cambiar el estado de una cita: pendiente → confirmada → en curso → completada / cancelada | Crítica |
| S09 | Como staff, quiero registrar el pago (efectivo/tarjeta/bizum) al finalizar el servicio | Crítica |
| S10 | Como staff, quiero generar ticket de venta simple al completar un servicio | Crítica |
| S11 | Como staff, quiero generar factura formal (con CIF, IVA, datos fiscales) a petición del cliente | Crítica |
| S12 | Como staff, quiero vender productos sin control de stock (champús, accesorios) | Alta |

### 2.2 Staff — Prioridad Media

| ID | Historia | Prioridad |
|---|---|---|
| S13 | Como staff, quiero sincronizar citas bidireccionalmente con Google Calendar | Alta |
| S14 | Como staff, quiero enviar notificación manual de "mascota lista para recoger" al cliente | Alta |
| S15 | Como staff, quiero ver el historial completo de servicios por mascota | Alta |
| S16 | Como staff, quiero registrar notas internas en cada cita | Alta |
| S17 | Como staff, quiero gestionar usuarios del equipo (altas, roles, permisos) | Alta |
| S18 | Como staff, quiero configurar los recordatorios automáticos (activar/desactivar por tipo) | Media |
| S19 | Como staff, quiero ver logs de auditoría del sistema | Media |
| S20 | Como staff, quiero registrar el origen del cliente (web, WhatsApp, Instagram, Facebook, SMS, teléfono, presencial) | Media |

### 2.3 Staff — Prioridad Baja

| ID | Historia | Prioridad |
|---|---|---|
| S21 | Como staff, quiero generar informes de ingresos por período | Baja |
| S22 | Como staff, quiero exportar datos de clientes y citas a CSV | Baja |
| S23 | Como staff, quiero gestionar promociones y descuentos | Baja |

### 2.4 Cliente — Prioridad Alta

| ID | Historia | Prioridad |
|---|---|---|
| C01 | Como cliente, quiero registrarme con email y contraseña | Crítica |
| C02 | Como cliente, quiero gestionar mi perfil y datos de contacto | Crítica |
| C03 | Como cliente, quiero dar de alta mis mascotas con foto y datos | Crítica |
| C04 | Como cliente, quiero ver el historial de servicios de mis mascotas | Crítica |
| C05 | Como cliente, quiero reservar una cita online seleccionando mascota, servicio y horario disponible | Crítica |
| C06 | Como cliente, quiero cancelar o reprogramar mis citas | Alta |
| C07 | Como cliente, quiero recibir recordatorios de cita (WhatsApp/email) | Alta |
| C08 | Como cliente, quiero recibir aviso cuando mi mascota esté lista para recoger | Alta |
| C09 | Como cliente, quiero ver y descargar mis facturas/tickets | Alta |
| C10 | Como cliente, quiero configurar mi nivel de seguridad (2FA opcional) | Alta |

### 2.5 Cliente — Prioridad Media

| ID | Historia | Prioridad |
|---|---|---|
| C11 | Como cliente, quiero recibir recordatorio de cumpleaños de mi mascota | Media |
| C12 | Como cliente, quiero recibir recordatorio para próxima cita (6 semanas post-servicio) | Media |
| C13 | Como cliente, quiero cambiar mi contraseña | Media |

---

## 3. Árbol de Navegación

### 3.1 Staff App

```
/
├── /login
├── /dashboard                    # Resumen del día
│   ├── Citas hoy (listado + timeline)
│   ├── Próximas citas (próximos 7 días)
│   ├── Ingresos del día
│   └── Mascotas en curso
├── /clientes
│   ├── /clientes                 # Listado con búsqueda
│   ├── /clientes/nuevo           # Alta de cliente
│   └── /clientes/:id             # Ficha cliente
│       ├── Datos personales
│       ├── Mascotas vinculadas
│       ├── Historial de citas
│       └── Facturas/Tickets
├── /mascotas
│   ├── /mascotas                 # Listado con búsqueda
│   ├── /mascotas/nueva           # Alta de mascota
│   └── /mascotas/:id             # Ficha mascota
│       ├── Datos básicos + foto
│       ├── Dueños vinculados
│       ├── Historial de servicios
│       └── Notas
├── /servicios
│   ├── /servicios                # Catálogo de servicios
│   └── /servicios/:id            # Configurar precios por talla
├── /calendario
│   ├── Vista día
│   ├── Vista semana
│   └── Vista mes
│       └── Click en cita → detalle + cambiar estado
├── /citas
│   ├── /citas/nueva              # Crear cita (con selección de cliente, mascota, servicio, precio)
│   └── /citas/:id                # Detalle de cita
│       ├── Cambiar estado
│       ├── Registrar pago
│       ├── Generar ticket/factura
│       └── Enviar notificaciones
├── /tickets
│   └── /tickets/:id              # Detalle + imprimir
├── /facturas
│   ├── /facturas                 # Listado
│   └── /facturas/nueva           # Crear factura
├── /productos
│   └── /ventas/nueva             # Registrar venta de producto
├── /notificaciones               # Centro de notificaciones
│   └── Configuración de recordatorios automáticos
├── /equipo                       # Gestión de staff (solo admin)
│   ├── Listado de usuarios
│   └── /equipo/:id               # Editar rol/permisos
├── /configuracion
│   ├── Perfil (mi cuenta)
│   ├── Seguridad (2FA, cambiar contraseña)
│   └── Google Calendar (conectar/desconectar)
└── /auditoria                    # Logs de actividad (solo admin)
```

### 3.2 Cliente App

```
/
├── /login
├── /register
├── /recuperar-password
├── /mis-datos                    # Perfil
│   ├── Información personal
│   └── Configuración de seguridad (2FA, cambio contraseña)
├── /mis-mascotas
│   ├── Listado
│   ├── /mis-mascotas/nueva       # Dar de alta mascota
│   └── /mis-mascotas/:id         # Ficha + historial
├── /citas
│   ├── /citas/nueva              # Reservar cita
│   │   ├── Seleccionar mascota
│   │   ├── Seleccionar servicio
│   │   └── Seleccionar horario disponible
│   └── /citas/:id                # Detalle + cancelar/reprogramar
├── /historial                    # Historial de servicios (todas las mascotas)
├── /facturas                     # Facturas y tickets
├── /notificaciones               # Preferencias de notificación (canales y tipos)
└── /configuracion
    └── Preferencias de comunicación
```

---

## 4. Diagrama de Entidades y Relaciones

```
┌─────────────────────────────────────────────────────────────────────┐
│                        MODELO DE DATOS                              │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────┐     ┌──────────────────┐     ┌──────────────┐
│    User      │     │    Owner         │     │    Pet       │
│──────────────│     │──────────────────│     │──────────────│
│ id (PK)      │     │ id (PK)          │     │ id (PK)      │
│ email (UQ)   │     │ name             │     │ name         │
│ password     │◄───►│ email            │     │ breed        │
│ role         │     │ phone            │     │ size (enum)  │
│ 2fa_enabled  │     │ address          │     │ birth_date   │
│ 2fa_secret   │     │ notes            │     │ photo_url    │
│ is_active    │     │ source (enum)    │     │ notes        │
│ created_at   │     │ pref_channel     │     │ is_active    │
│ updated_at   │     │ user_id (FK)     │     │ created_at   │
└──────────────┘     │ created_at       │     └──────┬───────┘
       │             └──────────────────┘            │
       │                    │                        │
       │                    │  ┌──────────────────┐  │
       │                    │  │   PetOwner       │  │
       │                    │  │──────────────────│  │
       │                    │  │ pet_id (FK)      │  │
       │                    │  │ owner_id (FK)    │  │
       │                    │  │ is_primary (bool)│  │
       │                    │  │ relationship     │  │
       │                    │  └──────────────────┘  │
       │                    │         N:N            │
       │                    │                        │
       │              ┌─────┴──────────┐             │
       │              │                │             │
       │     ┌────────────────┐  ┌──────────────────┐
       │     │ ProductSale    │  │  Appointment     │
       │     │────────────────│  │──────────────────│
       │     │ id (PK)        │  │ id (PK)          │
       │     │ owner_id (FK)  │  │ owner_id (FK)    │
       │     │ product_name   │  │ pet_id (FK)      │
       │     │ quantity       │  │ service_id (FK)  │
       │     │ unit_price     │  │ staff_id (FK) ◄──┤
       │     │ total          │  │ start_datetime   │
       │     │ payment_method │  │ end_datetime     │
       │     │ created_at     │  │ status (enum)    │
       └──────┘               │  │                  │
                              │  │ price_type (enum)│
                              │  │ estimated_hours  │
                              │  │ actual_hours     │
 ┌──────────────┐             │  │ total_amount     │
 │   Service    │             │  │ notes            │
 │──────────────│             │  │ google_event_id  │
 │ id (PK)      │◄────────────┤  │ created_at       │
 │ name         │             │  │ updated_at       │
 │ description  │             └───┬────────────────┘
 │ duration_min │                 │
 │ pricing_model│                 │
 │ price_toy    │          ┌──────┴───────┐
 │ price_peq    │          │              │
 │ price_med    │    ┌──────────┐  ┌──────────┐
 │ price_gr_fix │    │Ticket    │  │Invoice   │
 │ price_gr_hr  │    │──────────│  │──────────│
 │ price_gi_hr  │    │id (PK)   │  │id (PK)   │
 │ is_active    │    │appoint_id│  │ticket_id │
 └──────────────┘    │amount    │  │inv_number│
                     │pay_method│  │cif       │
 ┌──────────────┐    │pay_status│  │company    │
 │ Notification │    │created_at│  │address    │
 │──────────────│    └──────────┘  │subtotal   │
 │ id (PK)      │                  │iva        │
 │ type (enum)  │                  │total      │
 │ channel (enum)│                 │created_at │
 │ recipient    │                  └──────────┘
 │ status (enum)│
 │ sent_at      │  ┌──────────────┐
 │ metadata     │  │ AuditLog     │
 │ created_at   │  │──────────────│
 └──────────────┘  │ id (PK)      │
                   │ user_id (FK) │
                   │ action       │
                   │ entity_type  │
                   │ entity_id    │
                   │ details (JSON)│
                   │ ip_address   │
                   │ created_at   │
                   └──────────────┘
```

### Enumerados

| Campo | Valores |
|---|---|
| `User.role` | `admin`, `peluquero`, `cliente` |
| `Pet.size` | `toy`, `pequeno`, `mediano`, `grande`, `gigante` |
| `Appointment.status` | `pending`, `confirmed`, `in_progress`, `completed`, `cancelled` |
| `Appointment.price_type` | `fixed`, `hourly` |
| `Owner.source` | `web`, `whatsapp`, `instagram`, `facebook`, `sms`, `phone`, `presencial` |
| `Owner.pref_channel` | `whatsapp`, `email`, `sms`, `instagram`, `facebook` |
| `PaymentMethod` | `cash`, `card`, `bizum` |
| `Ticket.pay_status` | `pending`, `paid`, `refunded` |
| `Notification.type` | `appointment_confirmation`, `pickup_reminder`, `six_weeks_followup`, `birthday`, `custom` |
| `Notification.channel` | `whatsapp`, `email`, `sms`, `instagram`, `facebook` |
| `Notification.status` | `pending`, `sent`, `failed` |

---

## 5. Reglas de Negocio

### 5.1 Pricing (Cálculo de Precio)

```
SI tamaño = "toy" | "pequeno" | "mediano"
    → PRECIO = service.price_[tamaño] (fijo, siempre)

SI tamaño = "grande"
    → SI service.pricing_model = "fixed"
        → PRECIO = service.price_grande_fixed
    → SI service.pricing_model = "hourly"
        → PRECIO = service.price_grande_hourly × horas_reales
    → (El modelo de pricing está predefinido en la configuración del servicio)

SI tamaño = "gigante"
    → PRECIO = service.price_gigante_hourly × horas_reales
    → (Siempre por horas)
```

### 5.2 Estados de una Cita (Máquina de Estados)

```
pending ──► confirmed ──► in_progress ──► completed
   │            │                              │
   └──► cancelled    └──► cancelled            │
                                               │
                                        [genera ticket]
                                        [registra pago]
                                        [opcional: genera factura]
                                        [dispara notificación recogida]
```

- **Transiciones permitidas:**
  - `pending` → `confirmed` | `cancelled`
  - `confirmed` → `in_progress` | `cancelled`
  - `in_progress` → `completed`
  - `completed` → (estado final, no se puede cambiar)

### 5.3 Facturación

- **Ticket**: se genera siempre al completar un servicio. Incluye: servicio, mascota, importe, método de pago.
- **Factura**: se genera solo a petición del cliente. Requiere: CIF, nombre fiscal, dirección fiscal. Desglosa: base imponible, IVA (21%), total.
- Numeración de facturas automática: `F-{YYYY}-{NNNNN}`.

### 5.4 Vinculación Dueño ↔ Mascota

- Un **dueño** puede tener N mascotas.
- Una **mascota** puede tener N dueños.
- Relación N:N gestionada vía tabla `PetOwner`.
- Un dueño puede marcarse como `is_primary` (solo 1 por mascota).
- Cualquier dueño vinculado puede reservar citas para la mascota.
- Todos los dueños vinculados reciben notificaciones de la mascota.

### 5.5 Agenda y Bloques de Tiempo

- El horario laboral se configura en la app (ej: L-V 09:30-16:00).
- Las citas se crean en bloques según la duración estimada del servicio.
- No se permiten solapamientos de citas para un mismo staff.
- El sistema muestra solo horarios disponibles al cliente al reservar.

---

## 6. Flujos Críticos

### 6.1 Flujo: Reserva de Cita (Staff)

```
Staff abre calendario
    → Selecciona fecha y hora
    → Busca o crea cliente
        → Si nuevo: alta rápida (nombre, teléfono, email)
    → Busca o crea mascota vinculada a ese cliente
        → Si nueva: alta rápida (nombre, raza, tamaño)
    → Selecciona servicio del catálogo
        → Sistema calcula precio según tamaño + pricing_model
        → Si hourly para grande: staff introduce horas estimadas
    → Confirma cita
        → Sistema: crea Appointment (status: confirmed)
        → Sistema: crea evento en Google Calendar (si conectado)
        → Sistema: envía notificación de confirmación al cliente
```

### 6.2 Flujo: Reserva de Cita (Cliente online)

```
Cliente login
    → "Nueva cita"
    → Selecciona mascota (de las suyas)
    → Selecciona servicio
        → Sistema muestra precio estimado
    → Selecciona fecha en calendario
        → Sistema muestra slots disponibles (según horario laboral y citas existentes)
    → Confirma
        → Sistema: crea Appointment (status: pending)
        → Sistema: bloquea el slot temporalmente (15 min para confirmar)
        → Notificación al staff: "nueva cita pendiente"
        → Staff confirma → status pasa a "confirmed"
        → Cliente recibe confirmación
```

### 6.3 Flujo: Check-in / Servicio / Check-out

```
[Check-in]
    → Staff marca cita como "in_progress"
    → Se registra hora de inicio real

[Servicio]
    → Staff ve datos de la mascota, notas, servicios contratados
    → Staff puede añadir notas durante el servicio

[Check-out]
    → Staff marca cita como "completed"
    → Se registra hora de fin real
    → Si pricing_model = hourly → precio final = horas_reales × tarifa
    → Staff genera ticket
    → Staff registra pago
    → Si procede: genera factura
    → Automático: se envía notificación "recoge a tu mascota" al cliente
```

### 6.4 Flujo: Recordatorio 6 Semanas

```
→ Sistema ejecuta tarea programada (cron) diariamente
→ Busca citas completadas hace exactamente 6 semanas (42 días)
→ Para cada una: crea Notification tipo "six_weeks_followup"
→ Envía al cliente: "Hace 6 semanas visitaste Le Petit Can. ¿Quieres reservar tu próxima cita?"
→ Incluye enlace directo para reservar
```

### 6.5 Flujo: Cumpleaños Mascota

```
→ Sistema ejecuta tarea programada diariamente
→ Busca mascotas cuyo birth_date = hoy (sin año)
→ Para cada dueño vinculado: crea Notification tipo "birthday"
→ Envía: "¡Feliz cumpleaños [nombre_mascota]! 🐾"
→ Opcional: incluye código descuento (a configurar)
```

---

## 7. Agente IA — Alcance y Recomendación

### 7.1 Alcance

El agente IA estará presente en:
1. **Web** (widget chat en lepetitcan.es)
2. **WhatsApp** (vía WhatsApp Business API)
3. **Instagram / Facebook** (vía Meta Messenger API)

### 7.2 Capacidades

| Capacidad | Descripción |
|---|---|
| Responder FAQs | Horario, servicios, precios, ubicación, etc. |
| Reservar citas | Flujo completo: identificar cliente/mascota → seleccionar servicio → buscar slot → confirmar |
| Recolocar citas | Cambiar fecha/hora de citas existentes |
| Cancelar citas | Cancelar cita con confirmación |
| Recordatorios proactivos | "Tu cita es mañana a las 10:00" |

### 7.3 Recomendación de enfoque

**Opción recomendada: Híbrido (plataforma especializada + API)**

| Componente | Solución |
|---|---|
| **Orquestación del diálogo** | OpenAI (GPT-4o) o Claude (Sonnet) — manejo de lenguaje natural |
| **WhatsApp / Meta channels** | WATI o Twilio + Meta Business API |
| **Web widget** | Construido a medida en Next.js (componente Chat) |
| **Backend de acciones** | API propia en Next.js (crear citas, consultar disponibilidad) |
| **Knowledge Base** | RAG sobre documentación de la web + FAQs |

**Por qué no un chatbot simple:**
- Necesita reservar/recolocar/cancelar citas (CRUD en tiempo real)
- Debe funcionar en múltiples canales (web, WhatsApp, Instagram, Facebook)
- La lógica de negocio (precios por talla, disponibilidad) requiere integración con el backend

### 7.4 Arquitectura propuesta

```
Cliente (Web/WhatsApp/IG/FB)
    │
    ▼
Plataforma Mensajería (Twilio / WATI)
    │
    ▼
Orquestador IA (OpenAI / Claude) ← Knowledge Base (FAQs + servicios)
    │
    ▼
API Backend (Next.js) → Base de datos (citas, clientes, mascotas)
```

---

## 8. Requisitos de Seguridad (Nivel Bancario)

### 8.1 Autenticación y Acceso

| Requisito | Implementación |
|---|---|
| **2FA configurable** | TOTP (Google Authenticator, Authy). Staff y cliente eligen si activarlo |
| **Política de contraseñas** | Mín. 12 caracteres, mayúscula, minúscula, número, especial. Hash con bcrypt (cost 12) |
| **Rate limiting** | 5 intentos fallidos → bloqueo 15 min. Por IP y por usuario |
| **JWT + Refresh Tokens** | Access token: 15 min. Refresh token: 7 días (rotación en cada uso) |
| **Session management** | Cerrar sesión en todos los dispositivos desde configuración |
| **Session timeout** | Staff: 30 min inactividad. Cliente: 60 min (configurable) |
| **Account recovery** | Email con enlace temporal (15 min). Solo a email verificado |

### 8.2 Cifrado

| Capa | Estándar |
|---|---|
| **En tránsito** | TLS 1.3 (HTTPS obligatorio, HSTS preload) |
| **En reposo (BD)** | AES-256-GCM. Columnas sensibles cifradas: email, teléfono, dirección |
| **En reposo (archivos)** | Fotos de mascotas cifradas en disco (AES-256) |
| **API Keys / Secrets** | En variables de entorno, nunca en código. Cifradas en BD |

### 8.3 Protección de Datos (GDPR)

| Requisito | Implementación |
|---|---|
| **Consentimiento** | Registro de aceptación de privacidad con timestamp |
| **Derecho al olvido** | Borrado lógico + anonimización física programada (30 días) |
| **Portabilidad** | Exportación JSON/CSV de todos los datos del cliente |
| **Minimización** | Solo datos necesarios para el servicio |
| **Logs de acceso** | Quién accedió a qué dato y cuándo (auditoría) |
| **Notificación brechas** | Sistema de alerta al admin ante accesos sospechosos |

### 8.4 API y Aplicación

| Requisito | Implementación |
|---|---|
| **CORS** | Solo orígenes permitidos (lepetitcan.es, app.lepetitcan.es) |
| **CSRF** | Tokens dobles (Double Submit Cookie Pattern) |
| **XSS** | CSP headers, sanitización output, React JSX escapa por defecto |
| **SQL Injection** | Prisma ORM (parametriza automáticamente) |
| **Helmet headers** | CSP, X-Frame-Options, X-Content-Type-Options, HSTS |
| **Auditoría** | Log de cada acción del staff: quién, qué, cuándo, IP, user-agent |
| **Backups** | Diarios automatizados. Retención: 7 días (diario), 4 semanas (semanal), 12 meses (mensual) |

### 8.5 Infraestructura

| Requisito | Implementación |
|---|---|
| **DDOS Protection** | Cloudflare o similar |
| **WAF** | Web Application Firewall |
| **VPC / Red** | Base de datos en red privada, no accesible desde internet |
| **Actualizaciones** | Dependencias auditadas semanalmente (Dependabot / Snyk) |

---

## 9. Notificaciones y Recordatorios

### 9.1 Tipos de Notificación

| Tipo | Disparador | Contenido |
|---|---|---|
| `appointment_confirmation` | Al confirmar cita (staff o IA) | "Tu cita para [mascota] el [fecha] a las [hora] está confirmada" |
| `appointment_reminder` | 24h antes de la cita | "Recuerda: mañana tienes cita en Le Petit Can a las [hora]" |
| `pickup_reminder` | Al completar servicio (auto) o manual | "[Mascota] está lista para recoger. ¡Te esperamos! 🐾" |
| `six_weeks_followup` | 42 días post-servicio (cron) | "Hace 6 semanas visitaste Le Petit Can. ¿Reservas próxima cita?" |
| `birthday` | Cumpleaños de la mascota (cron) | "¡Feliz cumpleaños [mascota]! 🎂" |

### 9.2 Canales Configurables

Por cada cliente se configura:
- Canal preferido principal: WhatsApp / Email / SMS / Instagram / Facebook
- Qué tipos de notificación recibe en cada canal

### 9.3 Integraciones de Canal

| Canal | Integración |
|---|---|
| **WhatsApp** | WhatsApp Business API (Meta). Recomendado: WATI o Twilio |
| **Email** | Resend / SendGrid / AWS SES |
| **SMS** | Twilio SMS API |
| **Instagram** | Meta Messenger API (Mensajes) |
| **Facebook** | Meta Messenger API (Mensajes) |

---

> **Fin de la Especificación Funcional v1.0**
>
> Próximo paso: Fase 3 — Diseño Técnico (arquitectura, componentes, base de datos, API)
