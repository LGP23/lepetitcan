# Diseño Técnico — Le Petit Can App

> **Versión:** 1.0  
> **Fecha:** 2026-05-16  
> **Propósito:** Arquitectura, componentes, base de datos, API, infraestructura

---

## Índice

1. [Stack Tecnológico](#1-stack-tecnológico)
2. [Arquitectura General](#2-arquitectura-general)
3. [Estructura del Proyecto](#3-estructura-del-proyecto)
4. [Base de Datos](#4-base-de-datos)
5. [API REST](#5-api-rest)
6. [Componentes Frontend](#6-componentes-frontend)
7. [Integraciones](#7-integraciones)
8. [Infraestructura y Despliegue](#8-infraestructura-y-despliegue)

---

## 1. Stack Tecnológico

### 1.1 Frontend & Backend

| Capa | Tecnología | Versión |
|---|---|---|
| **Framework** | Next.js (App Router) | 14.x |
| **Lenguaje** | TypeScript | 5.x |
| **UI / Componentes** | shadcn/ui + Radix + Tailwind CSS | — |
| **Estado global** | Zustand | — |
| **PWA** | next-pwa / Serwist | — |
| **Formularios** | React Hook Form + Zod | — |
| **Autenticación** | NextAuth.js (Auth.js) | 5.x |
| **ORM** | Prisma | 5.x |
| **Base de datos** | PostgreSQL | 16.x |
| **Cache** | Redis (Upstash / Redis Stack) | — |
| **Background Jobs** | Inngest / BullMQ + Redis | — |
| **Internacionalización** | next-intl (es-ES) | — |

### 1.2 Infraestructura

| Servicio | Proveedor |
|---|---|
| **Hosting** | Vercel (web) + Railway / Render (BD) |
| **Storage** | Uploadcare / AWS S3 (fotos mascotas) |
| **Email** | Resend |
| **WhatsApp** | Twilio WhatsApp API |
| **SMS** | Twilio SMS API |
| **Meta (IG/FB)** | Meta Messenger API (Graph API) |
| **Google Calendar** | Google Calendar API v3 |
| **CDN / DDoS / WAF** | Cloudflare |
| **Monitorización** | Sentry (errores) + Logtail (logs) |

---

## 2. Arquitectura General

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         CLIENTES                                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │ Browser  │  │ WhatsApp │  │  Email   │  │Instagram │  │ Facebook │  │
│  │ (PWA)    │  │          │  │          │  │          │  │          │  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘  │
└───────┼──────────────┼────────────┼──────────────┼──────────────┼────────┘
        │              │            │              │              │
        ▼              ▼            ▼              ▼              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      CAPA DE PRESENTACIÓN (Next.js)                     │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  App Router (pages)                                              │   │
│  │  ┌────────────────────────────────────────────────────────────┐  │   │
│  │  │  Server Components (RSC) + Client Components               │  │   │
│  │  │  Layouts → Pages → Route Groups                            │  │   │
│  │  └────────────────────────────────────────────────────────────┘  │   │
│  │  shadcn/ui + Tailwind + Framer Motion                           │   │
│  └──────────────────────────────────────────────────────────────────┘   │
└──────────────────────────┬──────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    CAPA DE API (Next.js Route Handlers)                 │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  REST API v1                                                     │   │
│  │  /api/v1/*                                                       │   │
│  │  - Autenticación (NextAuth.js)                                   │   │
│  │  - Rate Limiting (upstash)                                       │   │
│  │  - Validación (Zod)                                              │   │
│  │  - Auditoría (middleware)                                        │   │
│  └──────────────────────────────────────────────────────────────────┘   │
└──────────────────────────┬──────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    CAPA DE NEGOCIO (Services)                           │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐  │
│  │ Clients  │ │   Pets   │ │Services  │ │ Appoint. │ │  Pricing     │  │
│  │ Service  │ │ Service  │ │ Service  │ │ Service  │ │  Engine      │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────────┘  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐  │
│  │ Tickets  │ │Invoices  │ │Products  │ │ Notific. │ │  Audit       │  │
│  │ Service  │ │ Service  │ │ Service  │ │ Service  │ │  Service     │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────────┘  │
└──────────────────────────┬──────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    CAPA DE DATOS                                        │
│  ┌──────────────────────┐  ┌──────────────────┐  ┌──────────────────┐  │
│  │   PostgreSQL (Prisma) │  │  Redis (Cache)   │  │   S3 (Fotos)     │  │
│  └──────────────────────┘  └──────────────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    INTEGRACIONES EXTERNAS                               │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐  │
│  │ Google   │ │  Twilio  │ │  Resend  │ │  Meta    │ │  OpenAI /    │  │
│  │ Calendar │ │(WA + SMS)│ │ (Email)  │ │(IG + FB) │ │  Claude (IA) │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Estructura del Proyecto

```
lepetitcan/
├── .github/
│   └── workflows/
│       └── ci.yml
├── public/
│   ├── icons/
│   ├── manifest.json
│   └── sw.js
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (staff)/                  # Route group staff
│   │   │   ├── dashboard/
│   │   │   ├── clientes/
│   │   │   ├── mascotas/
│   │   │   ├── servicios/
│   │   │   ├── calendario/
│   │   │   ├── citas/
│   │   │   ├── tickets/
│   │   │   ├── facturas/
│   │   │   ├── productos/
│   │   │   ├── notificaciones/
│   │   │   ├── equipo/
│   │   │   ├── configuracion/
│   │   │   └── auditoria/
│   │   ├── (cliente)/                # Route group client
│   │   │   ├── mis-datos/
│   │   │   ├── mis-mascotas/
│   │   │   ├── citas/
│   │   │   ├── historial/
│   │   │   ├── facturas/
│   │   │   └── notificaciones/
│   │   ├── (auth)/                   # Route group auth
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── recuperar-password/
│   │   ├── api/
│   │   │   └── v1/
│   │   │       ├── auth/
│   │   │       ├── clients/
│   │   │       ├── pets/
│   │   │       ├── services/
│   │   │       ├── appointments/
│   │   │       ├── tickets/
│   │   │       ├── invoices/
│   │   │       ├── products/
│   │   │       ├── notifications/
│   │   │       ├── calendar/
│   │   │       ├── team/
│   │   │       ├── audit/
│   │   │       └── webhooks/
│   │   ├── layout.tsx
│   │   ├── page.tsx                  # Landing / redirect
│   │   ├── globals.css
│   │   ├── error.tsx
│   │   ├── loading.tsx
│   │   └── not-found.tsx
│   ├── components/
│   │   ├── ui/                       # shadcn/ui components
│   │   ├── forms/                    # Form components
│   │   ├── layouts/                  # Sidebar, navbar, etc.
│   │   ├── calendar/                 # Calendar components
│   │   ├── chat/                     # AI Chat widget
│   │   └── shared/                   # Shared components
│   ├── lib/
│   │   ├── services/                 # Business logic layer
│   │   │   ├── client.service.ts
│   │   │   ├── pet.service.ts
│   │   │   ├── service-catalog.service.ts
│   │   │   ├── appointment.service.ts
│   │   │   ├── pricing.service.ts
│   │   │   ├── ticket.service.ts
│   │   │   ├── invoice.service.ts
│   │   │   ├── notification.service.ts
│   │   │   ├── calendar.service.ts
│   │   │   ├── audit.service.ts
│   │   │   └── ai-agent.service.ts
│   │   ├── integrations/             # External integrations
│   │   │   ├── google-calendar.ts
│   │   │   ├── twilio.ts
│   │   │   ├── resend.ts
│   │   │   ├── meta.ts
│   │   │   └── openai.ts
│   │   ├── middleware/               # Express-like middleware
│   │   │   ├── auth.ts
│   │   │   ├── audit.ts
│   │   │   ├── rate-limit.ts
│   │   │   └── validate.ts
│   │   ├── utils/
│   │   │   ├── pricing.ts
│   │   │   ├── dates.ts
│   │   │   ├── formats.ts
│   │   │   └── crypto.ts
│   │   ├── validators/               # Zod schemas
│   │   │   ├── client.schema.ts
│   │   │   ├── pet.schema.ts
│   │   │   ├── appointment.schema.ts
│   │   │   ├── ticket.schema.ts
│   │   │   └── invoice.schema.ts
│   │   ├── types/                    # TypeScript types
│   │   │   ├── models.ts
│   │   │   ├── api.ts
│   │   │   └── enums.ts
│   │   ├── constants.ts
│   │   └── db.ts                     # Prisma client singleton
│   ├── hooks/
│   │   ├── use-auth.ts
│   │   ├── use-calendar.ts
│   │   ├── use-notifications.ts
│   │   └── use-media-query.ts
│   ├── providers/
│   │   ├── auth-provider.tsx
│   │   ├── theme-provider.tsx
│   │   └── calendar-provider.tsx
│   └── middleware.ts                  # Next.js edge middleware (auth, redirect)
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── jobs/                              # Background jobs (Inngest/BullMQ)
│   ├── appointment-reminder.ts
│   ├── six-weeks-followup.ts
│   ├── birthday-reminder.ts
│   └── google-calendar-sync.ts
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── .env.example
├── .env.local
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## 4. Base de Datos

### 4.1 Schema Prisma

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─── ENUMS ───────────────────────────────────────

enum Role {
  admin
  peluquero
  cliente
}

enum PetSize {
  toy
  pequeno
  mediano
  grande
  gigante
}

enum AppointmentStatus {
  pending
  confirmed
  in_progress
  completed
  cancelled
}

enum PriceType {
  fixed
  hourly
}

enum OwnerSource {
  web
  whatsapp
  instagram
  facebook
  sms
  phone
  presencial
}

enum NotificationChannel {
  whatsapp
  email
  sms
  instagram
  facebook
}

enum NotificationType {
  appointment_confirmation
  appointment_reminder
  pickup_reminder
  six_weeks_followup
  birthday
  custom
}

enum NotificationStatus {
  pending
  sent
  failed
}

enum PaymentMethod {
  cash
  card
  bizum
}

enum PaymentStatus {
  pending
  paid
  refunded
}

// ─── MODELS ──────────────────────────────────────

model User {
  id            String   @id @default(cuid())
  email         String   @unique
  passwordHash  String
  name          String
  role          Role     @default(cliente)
  twoFactorEnabled Boolean @default(false)
  twoFactorSecret String?
  isActive      Boolean  @default(true)
  lastLoginAt   DateTime?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  owner         Owner?           @relation(fields: [ownerId], references: [id])
  ownerId       String?          @unique
  staffAppointments Appointment[] @relation("StaffAppointments")
  auditLogs     AuditLog[]
  calendarTokens GoogleCalendarToken?

  @@map("users")
}

model Owner {
  id            String   @id @default(cuid())
  name          String
  email         String?
  phone         String?
  address       String?
  notes         String?
  source        OwnerSource @default(presencial)
  prefChannel   NotificationChannel @default(whatsapp)
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt

  user          User?
  pets          PetOwner[]
  appointments  Appointment[]
  productSales  ProductSale[]
  notifications Notification[]

  @@map("owners")
}

model Pet {
  id        String   @id @default(cuid())
  name      String
  breed     String?
  size      PetSize
  birthDate DateTime?
  photoUrl  String?
  notes     String?
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  owners      PetOwner[]
  appointments Appointment[]

  @@map("pets")
}

model PetOwner {
  petId       String
  ownerId     String
  isPrimary   Boolean @default(false)
  relationship String? // "propietario", "familiar", etc.

  pet   Pet   @relation(fields: [petId], references: [id], onDelete: Cascade)
  owner Owner @relation(fields: [ownerId], references: [id], onDelete: Cascade)

  @@id([petId, ownerId])
  @@map("pet_owners")
}

model ServiceCatalog {
  id             String    @id @default(cuid())
  name           String
  description    String?
  durationMin    Int       @default(60)
  pricingModel   PriceType @default(fixed)
  // Toy + Pequeño + Mediano → fixed prices
  priceToy       Decimal?  @db.Decimal(10, 2)
  pricePequeno   Decimal?  @db.Decimal(10, 2)
  priceMediano   Decimal?  @db.Decimal(10, 2)
  // Grande → puede ser fixed u hourly
  priceGrandeFixed Decimal? @db.Decimal(10, 2)
  priceGrandeHourly Decimal? @db.Decimal(10, 2)
  // Gigante → siempre hourly
  priceGiganteHourly Decimal? @db.Decimal(10, 2)
  isActive       Boolean   @default(true)
  sortOrder      Int       @default(0)
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt

  appointments Appointment[]

  @@map("service_catalog")
}

model Appointment {
  id             String            @id @default(cuid())
  status         AppointmentStatus @default(pending)
  startDateTime  DateTime
  endDateTime    DateTime
  priceType      PriceType         @default(fixed)
  estimatedHours Decimal?          @db.Decimal(4, 1)
  actualHours    Decimal?          @db.Decimal(4, 1)
  totalAmount    Decimal?          @db.Decimal(10, 2)
  notes          String?
  googleEventId  String?           // ID del evento en Google Calendar
  createdAt      DateTime          @default(now())
  updatedAt      DateTime          @updatedAt

  ownerId   String
  petId     String
  serviceId String
  staffId   String

  owner   Owner          @relation(fields: [ownerId], references: [id])
  pet     Pet            @relation(fields: [petId], references: [id])
  service ServiceCatalog @relation(fields: [serviceId], references: [id])
  staff   User           @relation("StaffAppointments", fields: [staffId], references: [id])

  ticket Ticket?

  @@index([staffId, startDateTime])
  @@index([ownerId])
  @@index([petId])
  @@index([startDateTime])
  @@map("appointments")
}

model Ticket {
  id            String        @id @default(cuid())
  totalAmount   Decimal       @db.Decimal(10, 2)
  paymentMethod PaymentMethod
  paymentStatus PaymentStatus @default(pending)
  createdAt     DateTime      @default(now())

  appointmentId String @unique
  appointment   Appointment @relation(fields: [appointmentId], references: [id])

  invoice Invoice?

  @@map("tickets")
}

model Invoice {
  id         String   @id @default(cuid())
  number     String   @unique // F-2026-00001
  companyName String
  cif        String
  address    String?
  subtotal   Decimal  @db.Decimal(10, 2)
  ivaRate    Decimal  @db.Decimal(4, 2) @default(21.00)
  ivaAmount  Decimal  @db.Decimal(10, 2)
  total      Decimal  @db.Decimal(10, 2)
  createdAt  DateTime @default(now())

  ticketId String @unique
  ticket   Ticket  @relation(fields: [ticketId], references: [id])

  @@map("invoices")
}

model ProductSale {
  id            String        @id @default(cuid())
  productName   String
  quantity      Int           @default(1)
  unitPrice     Decimal       @db.Decimal(10, 2)
  totalAmount   Decimal       @db.Decimal(10, 2)
  paymentMethod PaymentMethod
  createdAt     DateTime      @default(now())

  ownerId String
  owner   Owner @relation(fields: [ownerId], references: [id])

  @@map("product_sales")
}

model Notification {
  id        String             @id @default(cuid())
  type      NotificationType
  channel   NotificationChannel
  recipient String             // email, teléfono, etc.
  title     String?
  body      String
  status    NotificationStatus @default(pending)
  sentAt    DateTime?
  metadata  Json?              // datos adicionales para templates
  createdAt DateTime           @default(now())

  ownerId String
  owner   Owner @relation(fields: [ownerId], references: [id])

  @@index([status])
  @@index([createdAt])
  @@map("notifications")
}

model AuditLog {
  id         String   @id @default(cuid())
  action     String   // "appointment.create", "client.update", etc.
  entityType String   // "appointment", "client", "pet", etc.
  entityId   String?
  details    Json?
  ipAddress  String?
  userAgent  String?
  createdAt  DateTime @default(now())

  userId String?
  user   User? @relation(fields: [userId], references: [id])

  @@index([userId])
  @@index([entityType, entityId])
  @@index([createdAt])
  @@map("audit_logs")
}

model GoogleCalendarToken {
  id          String   @id @default(cuid())
  accessToken String
  refreshToken String
  expiryDate  DateTime
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  userId String @unique
  user   User   @relation(fields: [userId], references: [id])

  @@map("google_calendar_tokens")
}
```

### 4.2 Índices y Performance

| Tabla | Índices |
|---|---|
| `appointments` | `(staffId, startDateTime)`, `(ownerId)`, `(petId)`, `(startDateTime, status)` |
| `notifications` | `(status, createdAt)` donde `status = pending` (para jobs) |
| `audit_logs` | `(entityType, entityId)`, `(createdAt)` |
| `owners` | `(email)` (unique partial), `(phone)` |
| `pets` | `(name)` |
| `invoices` | `(number)` (unique) |

---

## 5. API REST

### 5.1 Convenciones

- Base: `/api/v1`
- Formato: JSON siempre
- Autenticación: `Authorization: Bearer <token>` (JWT)
- Paginación: `?page=1&limit=20` → `{ data: [], meta: { page, limit, total, totalPages } }`
- Errores: `{ error: { code, message, details? } }`
- Auditoría automática vía middleware para mutaciones

### 5.2 Endpoints

#### Auth (`/api/v1/auth`)

| Método | Ruta | Descripción | Roles |
|---|---|---|---|
| POST | `/auth/register` | Registro cliente | público |
| POST | `/auth/login` | Login (email+password) | público |
| POST | `/auth/2fa/setup` | Configurar 2FA | auth |
| POST | `/auth/2fa/verify` | Verificar código 2FA | auth |
| POST | `/auth/refresh` | Refresh token | auth |
| POST | `/auth/logout` | Cerrar sesión | auth |
| POST | `/auth/forgot-password` | Solicitar recuperación | público |
| POST | `/auth/reset-password` | Reset password con token | público |
| GET  | `/auth/me` | Perfil actual | auth |

#### Clients (`/api/v1/clients`)

| Método | Ruta | Descripción | Roles |
|---|---|---|---|
| GET | `/clients` | Listar clientes (búsqueda por nombre/tlf/email) | staff |
| POST | `/clients` | Crear cliente | staff |
| GET | `/clients/:id` | Obtener cliente + mascotas + última cita | staff, owner |
| PUT | `/clients/:id` | Actualizar cliente | staff, owner |
| DELETE | `/clients/:id` | Borrado lógico cliente | admin |
| GET | `/clients/:id/history` | Historial completo de citas | staff, owner |

#### Pets (`/api/v1/pets`)

| Método | Ruta | Descripción | Roles |
|---|---|---|---|
| GET | `/pets` | Listar mascotas (filtro: ownerId, búsqueda) | staff |
| POST | `/pets` | Crear mascota | staff, owner |
| GET | `/pets/:id` | Obtener mascota + dueños + citas | staff, owner |
| PUT | `/pets/:id` | Actualizar mascota | staff, owner |
| DELETE | `/pets/:id` | Borrado lógico | staff |
| POST | `/pets/:id/photo` | Subir foto | staff, owner |
| POST | `/pets/:id/owners` | Vincular dueño | staff |
| DELETE | `/pets/:id/owners/:ownerId` | Desvincular dueño | staff |

#### Services (`/api/v1/services`)

| Método | Ruta | Descripción | Roles |
|---|---|---|---|
| GET | `/services` | Listar servicios activos | todos |
| POST | `/services` | Crear servicio | admin |
| GET | `/services/:id` | Obtener servicio + precios | todos |
| PUT | `/services/:id` | Actualizar servicio (precios incluidos) | admin |
| DELETE | `/services/:id` | Desactivar servicio | admin |

#### Appointments (`/api/v1/appointments`)

| Método | Ruta | Descripción | Roles |
|---|---|---|---|
| GET | `/appointments` | Listar citas (filtro: fecha, staff, owner, status) | staff, owner |
| POST | `/appointments` | Crear cita | staff, owner |
| GET | `/appointments/:id` | Obtener cita | staff, owner |
| PUT | `/appointments/:id` | Actualizar cita (fecha, servicio, notas) | staff |
| PATCH | `/appointments/:id/status` | Cambiar estado | staff |
| POST | `/appointments/:id/complete` | Completar cita (calcula precio, genera ticket) | staff |
| POST | `/appointments/check-availability` | Ver slots disponibles | staff, owner, público |
| GET | `/appointments/upcoming` | Próximas citas del cliente | owner |

#### Tickets (`/api/v1/tickets`)

| Método | Ruta | Descripción | Roles |
|---|---|---|---|
| GET | `/tickets` | Listar tickets (filtro: fecha, staff) | staff |
| GET | `/tickets/:id` | Obtener ticket | staff, owner |
| POST | `/tickets/:id/pay` | Registrar pago | staff |
| POST | `/tickets/:id/refund` | Anular/reembolsar pago | admin |

#### Invoices (`/api/v1/invoices`)

| Método | Ruta | Descripción | Roles |
|---|---|---|---|
| GET | `/invoices` | Listar facturas | staff, owner |
| POST | `/invoices` | Crear factura a partir de ticket | staff |
| GET | `/invoices/:id` | Obtener factura | staff, owner |
| GET | `/invoices/:id/pdf` | Descargar PDF | staff, owner |

#### Products (`/api/v1/products/sales`)

| Método | Ruta | Descripción | Roles |
|---|---|---|---|
| POST | `/products/sales` | Registrar venta de producto | staff |
| GET | `/products/sales` | Listar ventas de productos | staff |

#### Calendar (`/api/v1/calendar`)

| Método | Ruta | Descripción | Roles |
|---|---|---|---|
| GET | `/calendar/slots` | Slots disponibles para una fecha y staff | staff, owner |
| POST | `/calendar/connect` | Conectar Google Calendar | staff |
| DELETE | `/calendar/disconnect` | Desconectar Google Calendar | staff |
| POST | `/calendar/sync` | Forzar sincronización | staff |

#### Notifications (`/api/v1/notifications`)

| Método | Ruta | Descripción | Roles |
|---|---|---|---|
| GET | `/notifications/config` | Obtener configuración de notificaciones del owner | staff, owner |
| PUT | `/notifications/config` | Actualizar preferencias de notificación | staff, owner |
| POST | `/notifications/send` | Enviar notificación manual (recogida, custom) | staff |
| GET | `/notifications/history` | Historial de notificaciones | staff, owner |

#### Team (`/api/v1/team`)

| Método | Ruta | Descripción | Roles |
|---|---|---|---|
| GET | `/team` | Listar staff | admin |
| POST | `/team` | Invitar nuevo miembro staff | admin |
| PUT | `/team/:id` | Actualizar rol/permisos | admin |
| DELETE | `/team/:id` | Desactivar miembro | admin |

#### Audit (`/api/v1/audit`)

| Método | Ruta | Descripción | Roles |
|---|---|---|---|
| GET | `/audit` | Listar logs (filtro: fecha, userId, acción) | admin |

#### AI Agent (`/api/v1/agent`)

| Método | Ruta | Descripción | Roles |
|---|---|---|---|
| POST | `/agent/chat` | Enviar mensaje al agente IA | público (con rate limit) |
| POST | `/agent/webhook/whatsapp` | Webhook de WhatsApp | público (Twilio) |
| POST | `/agent/webhook/meta` | Webhook de Meta (IG/FB) | público (Meta) |

---

## 6. Componentes Frontend

### 6.1 Componentes Globales (shadcn/ui)

```
Button, Input, Select, Calendar (cita),
Dialog, Sheet, DropdownMenu, Popover,
Table, DataTable, Card, Badge, Avatar,
Tabs, Separator, Command (search),
Toast, Sonner, Skeleton, Tooltip,
Form (React Hook Form wrapper)
```

### 6.2 Componentes de Negocio

```
CalendarView (día/semana/mes)
├── DayView
├── WeekView
├── MonthView
└── AppointmentCard (drag & drop para recolocar)

AppointmentForm
├── ClientSearch (Command + debounce)
├── PetSelector
├── ServiceSelector (con precio dinámico)
├── DateTimePicker (slots disponibles)
├── PriceSummary
└── ConfirmButton

ClientForm
├── PersonalDataFields
├── SourceSelector
└── NotificationPrefs

PetForm
├── BasicInfoFields
├── SizeSelector (imagen visual tallas)
├── PhotoUpload (drag & drop)
├── OwnerSelector (multi-select)
└── NotesField

TicketInvoicePanel
├── TicketSummary
├── PaymentMethodSelector
├── InvoiceForm (CIF, datos fiscales)
├── PDFPreview
└── PrintButton

NotificationConfigurator
├── ChannelToggleGroup
├── TypeCheckboxList
├── TestNotificationButton
└── ChannelStatusBadge

ChatWidget (AI Agent)
├── ChatHeader (avatar + status)
├── MessagesList
├── MessageBubble (texto + acciones)
├── QuickReplies
└── InputBar

StatsCards (Dashboard)
├── TodayAppointmentsCard
├── PendingPickupsCard
├── DailyRevenueCard
└── UpcomingWeekCard
```

### 6.3 Layouts

```
StaffLayout
├── Sidebar (navegación principal)
├── TopBar (búsqueda global, notificaciones, perfil)
├── Breadcrumbs
└── MainContent

ClientLayout
├── BottomNav (mobile) / Sidebar (desktop)
├── TopBar
└── MainContent

AuthLayout
└── CenteredCard (login/register/forgot-password)
```

---

## 7. Integraciones

### 7.1 Google Calendar

```
Flujo de conexión OAuth 2.0:
1. Staff hace clic en "Conectar Google Calendar"
2. Redirige a Google OAuth (scope: calendar.events)
3. Google devuelve authorization code
4. Backend canjea por access + refresh token
5. Tokens guardados en GoogleCalendarToken (cifrados)
6. Por cada creación/modificación de cita:
   → Crear/actualizar/eliminar evento en Google Calendar
7. Sincronización periódica (cron cada 15 min):
   → Buscar eventos modificados en Google Calendar
   → Actualizar citas correspondientes en la app

Servicio: lib/integrations/google-calendar.ts
Jobs: jobs/google-calendar-sync.ts
```

### 7.2 WhatsApp (Twilio)

```
Flujo de notificación:
1. NotificationService.create({ type, channel: "whatsapp", ... })
2. Job worker recoge notificaciones pendientes
3. Twilio.messages.create({
     from: process.env.TWILIO_WHATSAPP_NUMBER,
     body: template_message,
     to: `whatsapp:${owner.phone}`
   })
4. Si éxito → status = "sent", sentAt = now()
   Si fallo → status = "failed", log error

Webhook entrante (para IA Agent):
POST /api/v1/agent/webhook/whatsapp
→ Twilio envía aquí los mensajes entrantes
→ Se procesan con el orquestador IA

Servicio: lib/integrations/twilio.ts
```

### 7.3 Email (Resend)

```
Flujo de envío:
1. NotificationService.create({ type, channel: "email", ... })
2. Resend.emails.send({
     from: "Le Petit Can <no-reply@lepetitcan.es>",
     to: owner.email,
     subject: "Tu cita está confirmada",
     react: EmailTemplate({ ... })
   })
3. Seguimiento de entregas vía webhook Resend

Plantillas email en: src/emails/
├── appointment-confirmation.tsx
├── appointment-reminder.tsx
├── pickup-reminder.tsx
├── six-weeks-followup.tsx
├── birthday.tsx
└── invoice.tsx

Servicio: lib/integrations/resend.ts
```

### 7.4 Meta (Instagram / Facebook)

```
Chat entrante (IA Agent):
1. Usuario escribe en Instagram DM o Facebook Messenger
2. Meta envía webhook a POST /api/v1/agent/webhook/meta
3. Se procesa con el orquestador IA
4. Respuesta se envía de vuelta vía Meta Graph API

Notificaciones salientes:
- Meta no permite mensajes salientes no iniciados por usuario
- Solo se usa para responder en el chat entrante
- Para notificaciones proactivas: usar WhatsApp o Email

Servicio: lib/integrations/meta.ts
```

### 7.5 AI Agent (OpenAI / Claude)

```
Arquitectura del orquestador:

Cliente → Mensaje → API Gateway (Webhook o chat widget)
                        │
                        ▼
            ┌──────────────────────┐
            │  Context Builder     │
            │  - Historial chat    │
            │  - Datos cliente     │
            │  - Próximas citas    │
            └──────────┬───────────┘
                       │
                       ▼
            ┌──────────────────────┐
            │  LLM (GPT-4o/Claude)│
            │  System Prompt:     │
            │  "Eres Le Petit Can │
            │   Asistente virtual"│
            └──────────┬───────────┘
                       │
                       ▼
            ┌──────────────────────┐
            │  Action Executor     │
            │  - Function Calling  │
            │  - createAppointment │
            │  - cancelAppointment │
            │  - getAvailability   │
            │  - getServices       │
            └──────────┬───────────┘
                       │
                       ▼
            ┌──────────────────────┐
            │  Response Formatter  │
            │  → Texto + acciones  │
            └──────────────────────┘

Functions disponibles para el LLM:
- get_availability(date, staffId?) → slots[]
- get_services() → service[]
- get_my_pets(ownerId) → pet[]
- create_appointment(ownerId, petId, serviceId, startDateTime) → appointment
- cancel_appointment(appointmentId) → boolean
- reschedule_appointment(appointmentId, newDateTime) → appointment
- get_my_appointments(ownerId) → appointment[]
- search_clients(query) → client[]

Servicio: lib/integrations/openai.ts
         lib/services/ai-agent.service.ts
```

---

## 8. Infraestructura y Despliegue

### 8.1 Diagrama de Infraestructura

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Cloudflare                                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────────────────┐  │
│  │   DNS    │  │  CDN     │  │   WAF    │  │  DDOS Protection  │  │
│  └──────────┘  └──────────┘  └──────────┘  └────────────────────┘  │
└─────────────────────────────┬───────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         Vercel                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Next.js App                                                  │  │
│  │  - Server Components (Edge/Serverless)                        │  │
│  │  - API Routes (Serverless Functions)                          │  │
│  │  - Static Assets                                              │  │
│  │  - ISR / SSR                                                  │  │
│  └──────────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Cron Jobs (Vercel Cron)                                     │  │
│  │  - 6-semanas followup (daily)                                │  │
│  │  - Cumpleaños (daily)                                        │  │
│  │  - Recordatorio 24h (hourly)                                 │  │
│  │  - Sync Google Calendar (15 min)                             │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────┬───────────────────────────────────────┘
                              │
          ┌───────────────────┼───────────────────┐
          ▼                   ▼                   ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│   PostgreSQL    │  │     Redis       │  │  S3 (Fotos)     │
│   (Railway)     │  │  (Upstash)      │  │  (Uploadcare)   │
│                 │  │                 │  │                 │
│  - Datos app    │  │  - Cache        │  │  - Fotos pets   │
│  - Relacional   │  │  - Rate limit   │  │  - Temp uploads │
│  - Cifrado      │  │  - Queue (jobs)  │  │                 │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

### 8.2 Variables de Entorno

```env
# App
NEXT_PUBLIC_APP_URL=https://app.lepetitcan.es
NODE_ENV=production

# Database
DATABASE_URL=postgresql://...
DATABASE_URL_DIRECT=postgresql://...

# Auth
AUTH_SECRET=...
AUTH_URL=...

# Google Calendar
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_CALENDAR_ID=...

# Twilio (WhatsApp + SMS)
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_WHATSAPP_NUMBER=...
TWILIO_SMS_NUMBER=...

# Resend (Email)
RESEND_API_KEY=...

# Meta (Instagram / Facebook)
META_APP_ID=...
META_APP_SECRET=...
META_WEBHOOK_VERIFY_TOKEN=...
META_PAGE_ID=...
META_IG_ID=...

# OpenAI (AI Agent)
OPENAI_API_KEY=...

# Storage (Fotos)
UPLOADCARE_PUBLIC_KEY=...
UPLOADCARE_SECRET_KEY=...

# Redis (Upstash)
UPSTASH_REDIS_URL=...
UPSTASH_REDIS_TOKEN=...

# Sentry (Errores)
SENTRY_DSN=...

# Rate limiting
RATE_LIMIT_MAX=10
RATE_LIMIT_WINDOW=60
```

### 8.3 CI/CD Pipeline

```yaml
# .github/workflows/ci.yml

name: CI/CD
on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck

  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_DB: lepetitcan_test
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
        ports: [5432:5432]
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npx prisma migrate deploy
      - run: npm run test:unit
      - run: npm run test:integration

  deploy:
    if: github.ref == 'refs/heads/main'
    needs: [lint, test]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npx vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

---

> **Fin del Diseño Técnico v1.0**
>
> Próximo paso: Fase 4 — Plan de Desarrollo (módulos, sprints, estimaciones)
