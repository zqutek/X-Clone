#X Clone

клон X або ж Twitter на React Native + Expo Router

## Встановлення

```bash
npm install
npx expo start
```

## Технології

- Expo Router
- Clerk
- Convex
- React Native
- TypeScript

## Налаштування

1. Скопіюйте `.env.example` у `.env`.
2. Заповніть `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` та `EXPO_PUBLIC_CONVEX_URL`.
3. Для webhook додайте секрет у Convex:

```bash
npx convex env set CLERK_WEBHOOK_SECRET whsec_xxxxx
```
