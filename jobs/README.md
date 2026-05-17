# Background Jobs — Le Petit Can

Estos jobs se ejecutan mediante cron o un worker de cola (Inngest / BullMQ).

Para desarrollo local, se pueden ejecutar manualmente con:

```bash
npx tsx jobs/process-notifications.ts
npx tsx jobs/send-reminders.ts
```

## Jobs programados

| Job | Frecuencia | Descripción |
|---|---|---|
| `send-reminders` | Cada hora | Envía recordatorios de citas próximas (2 días, 1 día, 2 horas) |
| `six-weeks-followup` | Diario (00:00) | Envía recordatorio 6 semanas después del último servicio |
| `birthday-reminder` | Diario (08:00) | Envía felicitación de cumpleaños a mascotas |
| `review-request` | Cada hora | Envía solicitud de reseña 1h después del pago |
| `google-sync` | Cada 15 min | Sincroniza citas con Google Calendar |
| `data-retention` | Diario (03:00) | Anonimiza/elimina datos según plazos RGPD |
