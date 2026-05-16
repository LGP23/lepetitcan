# Le Petit Can — Expo App (WebView wrapper)

Este directorio contiene un wrapper de Expo que carga la app de Le Petit Can
(Next.js) dentro de un WebView. Permite visualizar la app con Expo Go.

## Requisitos

- Node.js 18+
- Expo CLI: `npm install -g expo-cli`
- App Expo Go en tu móvil (iOS/Android)

## Uso

1. Primero, arranca el servidor Next.js:

```bash
cd ..
npm install
npx prisma migrate dev --name init
npx tsx prisma/seed.ts
npm run dev
```

2. En otra terminal, arranca Expo:

```bash
cd expo-app
npm install
npx expo start
```

3. Escanea el código QR con Expo Go desde tu móvil.

## Notas

- En iOS con emulador: usa `http://localhost:3000`
- En Android emulador: usa `http://10.0.2.2:3000`
- En dispositivo físico: cambia la IP en `App.js` por la IP local de tu PC
