# Offshore Rotation Planner

LIVE URL >>>  https://myoffshorerotation.web.app/   <<<

**My_Offshore_Calendar** is an offline-first planner designed for offshore crews to manage ON/OFF rotations, travel days, earnings, and Myanmar tax obligations while syncing securely across devices through Firebase. (Offshore worker များအတွက် ON/OFF rotation, ခရီးရက်, ဝင်ငွေ နှင့် မြန်မာအခွန် တွက်ချက်နိုင်သည့် offline-first application ဖြစ်သည်။)

## Feature Highlights

- **Custom Rotation Engine** – Configure anchor date, ON/OFF durations, travel overrides, and manual extra work days with double-tap prevention for accidental changes.
- **Holiday Intelligence** – Myanmar fixed + lunar holidays and optional region sets (e.g. Thailand) built into `src/holidays.js`.
- **Earnings & Myanmar Tax** – Monthly gross, travel allowances, and progressive Myanmar tax calculation with the latest brackets.
- **Secure Multi-user Sync** – Firebase Authentication (Email/Password) with Firestore per-user documents and strong security rules.
- **Offline-first PWA** – Service worker + persistent Firestore cache for full functionality without network access.

## Architecture Overview

```
My_Offshore_Calendar/
│
├── src/
│   ├── App.jsx             # Shell, tab navigation, auth state listener, sync triggers
│   ├── Login.jsx           # Firebase email/password registration & sign-in
│   ├── store.js            # Zustand store with persist + Firestore sync middleware
│   ├── Calendar.jsx        # Calendar UI, rotation logic, double-tap travel toggle
│   ├── Dashboard.jsx       # Monthly stats cards, Myanmar tax summary, travel/work counts
│   ├── AnnualProjection.jsx# 12-month projection using rotation/tax utilities
│   ├── Settings.jsx        # Anchor date + financial inputs, profile, sign-out
│   ├── rotationUtils.js    # Rotation maths, Myanmar tax brackets, stats helpers
│   ├── holidays.js         # Holiday dataset and utility functions per year
│   ├── firebase.js         # Firebase initialization, offline Firestore cache setup
│   └── ...                 # Styling (index.css), helper files, icons
│
├── public/
│   ├── manifest.json       # PWA manifest (icons, theme, standalone display)
│   └── icons/              # Maskable SVG icons for installs
├── sw.js                   # Custom cache-first service worker for fallback assets
├── vite.config.js          # Vite config with vite-plugin-pwa (build-time service worker)
├── firebase.json           # Hosting + rewrites + Firestore deploy settings
├── firestore.rules         # Security rules enforcing user-based document access
├── .firebaserc             # Maps default Firebase CLI project to myoffshorerotation
└── package.json            # Scripts and dependency graph
```

### Firebase Services
- **Authentication**: Email/Password (enabled in console) keeps identities separate.
- **Cloud Firestore**: `users/{uid}` documents store serialized Zustand state. Offline persistence uses `initializeFirestore` with `persistentLocalCache`.
- **Hosting**: Serves the production PWA build from Firebase CDN with SPA rewrites.

## State & Sync Flow
1. On load, `src/firebase.js` initializes Firebase, Auth, and Firestore offline cache.
2. `App.jsx` subscribes to `onAuthStateChanged`. When a user signs in, it hydrates the Zustand store with the remote snapshot.
3. `src/store.js` persists state locally (Zustand `persist`) and merges Firestore updates using timestamps (last-write-wins).
4. Firestore listeners keep remote changes in sync across devices, even when users reconnect after offline usage.
5. Service workers and Firestore cache ensure calendar, dashboard, and settings remain usable with no network.

## PWA & Offline Behavior
- `vite-plugin-pwa` generates the production service worker with precache + runtime caching strategies.
- `sw.js` provides an additional cache-first layer for the basic shell during bootstrap.
- Users can install the app from supported browsers (Chrome, Edge, Android) via the “Install” prompt.
- Offline mode: all UI logic runs locally, Firestore queues writes until connectivity resumes.

## Environment Setup (Windows)

1. Clone or download the repo into `G:\000 My Data\About Vibe Coding\Rotation-Planner_Manager\My-Offshore_Calendar_v1.0`.
2. Open a terminal in that folder (Shift + Right Click → “Open PowerShell window here”).
3. Install dependencies:
   ```powershell
   npm install
   ```
4. Start the dev server:
   ```powershell
   npm run dev
   ```
   Vite hosts at `http://localhost:5173`.

## Firebase Configuration Steps

1. Copy the Firebase config block from **Project Settings → General** and paste into `src/firebase.js`. Use exact characters (beware of lowercase `o` vs uppercase `O`).
2. Enable **Authentication → Sign-in method → Email/Password** (not email link).
3. Enable **Firestore Database** in production mode.
4. Deploy `firestore.rules` so each user only reads/writes their own document:
   ```powershell
   firebase deploy --only firestore:rules
   ```
5. Confirm hosting site domain (e.g., `https://myoffshorerotation.web.app`).

## Deployment Workflow (Firebase Hosting)

> Always run commands from the project folder: `G:\000 My Data\About Vibe Coding\Rotation-Planner_Manager\My-Offshore_Calendar_v1.0`

1. Build the production bundle:
   ```powershell
   npm.cmd run build
   ```
2. Deploy hosting + Firestore rules (and functions if ever added):
   ```powershell
   firebase.cmd deploy
   ```
   If you only changed hosting assets: `firebase.cmd deploy --only hosting`
3. Refresh the live site with **Ctrl + Shift + R** (or open Incognito) to bypass cached bundles after each deploy.

## User Manual

1. **Sign Up / Sign In**
   - Visit the hosted URL. Register with email & password to create a secure Firebase account.
   - Returning users log in from the same screen.

2. **Set Anchor Date & Rotation Pattern**
   - Go to **Settings → Rotation Preset** and enter anchor date, ON/OFF lengths, travel allowances, and currency.
   - The calendar immediately recalculates based on the new pattern.

3. **Manage Travel & Extra Work Days**
   - Tap/Click a day twice quickly (double-tap) to toggle travel status. Single taps open the detail panel.
   - Use the panel buttons to mark off-duty days as **Extra Work** (adds to ON count without shifting the base rotation).
   - Travel toggles always win over extra-work status if both are selected.

4. **View Calendar Details**
   - Color legend distinguishes ON duty, OFF duty, weekends, and Myanmar holidays (bold crimson text).
   - Navigate months with the header arrows or keyboard shortcuts (`←/→`, `Home` for today).

5. **Dashboard & Annual Projection**
   - Dashboard shows current cycle countdown, monthly gross USD/MMK breakdown, and Myanmar monthly tax (when applicable).
   - Annual Projection tab (if enabled) summarizes 12-month totals and day counts.

6. **Sync & Offline Use**
   - Data persists locally; the app works offline automatically.
   - When you reconnect, changes upload to Firestore and appear on every signed-in device.

7. **Settings & Account**
   - Update pay rates, allowances, or reset the planner from the Settings tab.
   - Use the profile section to sign out safely on shared devices.

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| `auth/api-key-not-valid` | Clear browser cache or hard refresh to ensure the latest `firebaseConfig` is loaded. Verify config in `src/firebase.js`. |
| `auth/configuration-not-found` | Enable Email/Password provider under Firebase Authentication. |
| `npm ERR! enoent` when building | Run `npm run build` **inside the project directory** where `package.json` lives. |
| PWA shows old data after deploy | Use **Ctrl + Shift + R** or clear site data (Service Worker cache) to fetch the newest bundle. |
| Offline changes missing on other devices | Confirm you stayed signed in; Firestore sync runs only while authenticated. Check network icon before expecting updates elsewhere. |

## Future Roadmap

1. **Android APK (Trusted Web Activity)** – Package the hosted PWA using Bubblewrap and add `.well-known/assetlinks.json` for store-ready distribution.
2. **Expanded Holiday Feeds** – Automate Myanmar government holiday updates via annual data imports and allow user-selected regions.
3. **Push Notifications** – Reminders for travel days or upcoming crew changes using Firebase Cloud Messaging.
4. **Role-based Sharing** – Optional supervisor view for team rotations while keeping individual privacy control.
5. **Offline Data Exports** – Generate PDF/CSV summaries for payroll submissions.

## Contributing & License

- Codebase uses React 18 with modern hooks; follow existing formatting and state patterns when contributing.
- Add a LICENSE file before public release to clarify distribution terms.
- Pull requests should include tests or manual verification steps for rotation and sync logic.

---

ဒီ application ကို offline ရော online ရောသုံးပြီး မိမိ rotation ကို စိတ်ကြိုက် ပြင်ဆင်အသုံးပြုနိုင်ပါသည်။ Support လိုအပ်ပါက issues tab (သို့) Firebase console logs ဖြင့် အချက်အလက်များကိုသုံးပြီး debug ပြုလုပ်နိုင်သည်။
