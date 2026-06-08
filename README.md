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
- Convex storage upload URL generation
- Create Post screen with image picker, image preview, caption input, upload state, and post creation
- Feed screen with stories, post list, author info, relative time, and sign out
- Like, bookmark, comment, and delete-post interactions backed by Convex
- Notifications created for likes and comments on another user's post
- Bookmarks tab with a 3-column grid of saved posts
- Notifications tab with enriched like, comment, and follow notifications
- Cascading post deletion for likes, comments, bookmarks, and related notifications
- Editable Profile tab with avatar, stats, bio, posts grid, post preview modal, and profile edit modal
- User profile pages for other users with follow/unfollow and posts grid
- Profile links from post authors and notification senders
- Local font loading with Expo Splash Screen
- Dark themed tab navigation

## Tech Stack

- React Native
- Expo
- Expo Router
- Clerk
- Convex
- Expo Image Picker
- Expo File System
- Expo Image
- Expo Font
- Expo Splash Screen
- date-fns
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
EXPO_PUBLIC_CONVEX_SITE_URL=
```

## Notes

- In Clerk Dashboard, enable Google OAuth.
- In Clerk Dashboard, create a JWT Template named `convex`.
- In Convex Dashboard, make sure the Clerk domain in `convex/auth.config.ts` matches your Clerk project.
- After signing in with Google, check the `users` table in Convex Dashboard.
- To test posting, open the Create tab, select an image, add an optional caption, press Share, and check the `posts` table in Convex Dashboard.
- To test the feed, create at least one post and use the Feed tab to like, bookmark, comment, or delete your own post.
- To test bookmarks, tap the bookmark icon on a post and open the Bookmarks tab.
- To test notifications, like or comment on another user's post and open the Notifications tab from that user's account.
- To test your profile, open the Profile tab, edit name/bio, and tap a grid post to preview it.
- To test user profiles, tap a post author's avatar or a notification sender avatar, then use Follow/Following.
