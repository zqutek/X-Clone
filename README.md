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
- Convex schema for users, posts, likes, comments, follows, notifications, and bookmarks
- Clerk webhook that creates Convex users on `user.created`
- Dark themed tab navigation
- Placeholder screens for Feed, Create, Notifications, and Profile
- Sign Out button on the Feed screen

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

4. Add the Clerk webhook signing secret to Convex:

```bash
npx convex env set CLERK_WEBHOOK_SECRET whsec_xxxxx
```

5. In Clerk Dashboard, add a webhook endpoint:

```text
https://your-convex-deployment.convex.site/clerk-webhook
```

Select the `user.created` event.

6. Start the Expo app in another terminal:

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
- After signing in with Google, check the `users` table in Convex Dashboard.
