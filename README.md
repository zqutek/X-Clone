# X Clone

Starter mobile app for an X / Twitter clone built with React Native, Expo Router, Clerk, and Convex.

## Team

- Team Lead / Project Setup
- Auth Developer
- Backend Developer
- UI Developer

## Features

- Expo Router app structure
- Clerk Google OAuth login
- Protected routes for signed-in and signed-out users
- Convex client setup with Clerk auth
- Dark themed tab navigation
- Placeholder screens for Feed, Create, Notifications, and Profile

## Tech Stack

- React Native
- Expo
- Expo Router
- Clerk
- Convex
- TypeScript

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env` and fill in your Clerk and Convex values.

3. Start Convex in one terminal:

```bash
npx convex dev
```

4. Start the Expo app in another terminal:

```bash
npm start
```

## Required Environment Variables

```bash
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=
EXPO_PUBLIC_CONVEX_URL=
```

## Notes

- In Clerk Dashboard, enable Google OAuth.
- In Clerk Dashboard, create a JWT Template named `convex`.
- In Convex Dashboard, make sure the Clerk domain in `convex/auth.config.ts` matches your Clerk project.
