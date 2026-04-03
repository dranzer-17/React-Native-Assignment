# Ready! — React Native Take-Home Assignment

Welcome! This is your take-home assignment for the **React Native Engineer** role at [Grapevine](https://grapevine.in).

You will be building **Ready!** — an AI-powered interview practice app — from a clean Expo base. The goal is to assess your ability to build production-quality React Native screens with attention to UI fidelity, code architecture, and TypeScript correctness.

**Time estimate:** ~2 days (12–16 hours)

---

## The Design

All screens you need to implement are in the Figma file below. Use it as the single source of truth for layout, colors, and interactions.

**Figma:** https://www.figma.com/design/8i6wNZ6dafxTh5Zl9jbgu3/Grapevine-Internship-Program?node-id=2-16244&p=f&m=dev

> **Figma tip:** On the Login screen, any phone number and OTP combination works — there is no real authentication. Mock the verification flow with local state.

---

## Getting Started

### Prerequisites

**Common:**
- Node.js 18+
- Yarn (`npm install -g yarn`)
- Java 17+ (for Android builds — bundled with Android Studio)

**Android:**
- Android Studio with at least one emulator configured, **or** a physical Android device with USB debugging enabled
- `ANDROID_HOME` environment variable set (Android Studio sets this automatically)

**iOS (macOS only):**
- Xcode installed with iOS Simulator available
- CocoaPods (`sudo gem install cocoapods`)

---

### First-time Setup

This app uses a **custom native dev client** — it does not run in Expo Go. Run these commands once to build and install the native app:

```bash
# 1. Install JS dependencies
yarn

# 2. Generate native android/ and ios/ folders
yarn prebuild:clean

# 3a. Build and run on a connected Android device or emulator
yarn android --device

# 3b. Build and run on iOS simulator (macOS only)
yarn ios --device
```

> `yarn prebuild:clean` generates the `android/` and `ios/` folders from `app.json`. These folders are git-ignored — every developer generates them locally. The first build takes a few minutes; subsequent runs are much faster.

### Subsequent Runs

After the native app is installed on your device, you only need:

```bash
yarn android --device   # Android
yarn ios --device       # iOS
```

If you change `app.json`, add a new native library, or hit native build issues, re-run prebuild:

```bash
yarn prebuild:clean
yarn android --device
```

---

## What's Already Provided

| Item | Location | Purpose |
|---|---|---|
| Expo project config | `app.json`, `tsconfig.json`, `babel.config.js` | Ready to run — do not modify |
| EAS config | `eas.json` | Cloud build profiles (dev / preview / production) |
| Path alias `@/` | `tsconfig.json` + `babel.config.js` | Maps to `src/` — use absolute imports |
| Theme tokens | `src/theme/` | Brand colors, spacing scale, typography |
| Mock data skeletons | `src/mock-data/` | Data shape — **you must populate with realistic content** |
| Native folders | `android/` `ios/` | **Git-ignored** — generated locally via `yarn prebuild:clean` |

### Mock Data

The `src/mock-data/` folder contains skeleton JSON files that define the **shape** of the data. They contain minimal placeholder content — **it is your job to fill them with realistic mock data** that makes the app look like the Figma.

```
src/mock-data/
├── companies.json       # List of companies shown on the Home screen
├── questions.json       # Interview questions per company
├── session-result.json  # Feedback + key moments for a completed session
└── user.json            # User profile for the Settings screen
```

You are free to add new fields, create additional JSON files, or restructure the data — as long as the screens look right.

### Theme

The theme files in `src/theme/` define the Ready! brand tokens. **Do not use hardcoded hex values or magic numbers** in your components — always reference the theme:

```typescript
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

// Example usage
backgroundColor: colors.primary          // orange brand color
padding: spacing.screenPadding           // 20
fontFamily: typography.fonts.inter.semiBold
```

---

## Your Task

Implement all screens from the Figma design so the app navigates end-to-end. All data must come from your mock JSON files — no backend or API calls.

### Screen 1 — Splash

- Display the **Ready!** logo centered on a white background
- Auto-navigate to the Welcome screen after ~2 seconds

### Screen 2 — Welcome

- Ready! branding with the illustrated character from the Figma
- Tagline: "Practice Top Interview Questions with AI"
- A primary CTA button that navigates to Login

### Screen 3 — Login

- "Kickstart your journey" heading
- Mobile number input field
- 4-digit OTP input — **any number works**, mock the verification
- Submit button navigates to the main app (Home)
- Back navigation to Welcome

### Screen 4 — Home

Refer to the Figma's **Home** screen.

- **Header:** "Ready!" brand logo (left), notification badge (right), hamburger menu icon
- **Practice set card:** A card at the top showing the current practice set title (e.g. "Practicing Top 50 Questions for Big Tech Companies") with a chevron for expand/collapse
- **Question list:** A numbered list of company question cards loaded from `questions.json`
  - Each card shows: company logo, company name, question number badge
  - The first card has a **"START"** button
- **Bottom tab bar:** Three tabs — Home, Settings, Store (refer to Figma for exact icons)

> The list must use `@shopify/flash-list`, not `FlatList`.

### Screen 5 — Home (Open State)

Refer to the Figma's **Home – Open State** screen.

This is the expanded/detail state triggered by tapping a question card on the Home screen. It can be implemented as a **modal / anchored popover**, a bottom sheet, or an inline expansion — match the Figma. (This project uses `question-popover.tsx` with React Native `Modal`.)

- Question text (e.g. "API latency is variable & app is sluggish. How do you design UI safely?")
- "Asked by [Company Name]" with company logo
- Session duration estimate (e.g. "2 mins")
- **FEEDBACK** button — navigates to the Session Result screen
- **AI VS AI (LISTEN)** button — can be a dummy/disabled button
- Social proof text: "X users completed Question N today" (from mock data)

### Screen 6 — Session Result (Feedback + Highlights)

Refer to the Figma's **Feedback** and **Highlights** screens — these are the two tabs of a single **Session Result** screen.

**Header (shared across both tabs):**
- Two illustrated avatar characters side by side
- Question card: question text + company logo + company name

**Tab 1 — Smart Summary** (Figma: "Feedback" screen)
- "What worked well" section with bullet-point list
- "Overall takeaways" section with bullet-point list
- Data from `session-result.json → smartSummary`

**Tab 2 — Key Moments** (Figma: "Highlights" screen)
- A mock audio player bar showing session duration (non-functional UI is fine)
- A scrollable list of timestamped key moments
  - Each item: timestamp (e.g. "01:37"), description text
- Data from `session-result.json → keyMoments`

> Populate `session-result.json` with realistic content — look at the Figma for the actual text used.

### Screen 7 — Settings

Refer to the Figma's **Settings Screen**.

- Profile section: avatar image, user name, phone number (from `user.json`)
- A "Sign up / Continue" style CTA button
- Menu list with items (refer to Figma for exact labels and icons)
- **Log Out** item at the bottom navigates back to the Welcome screen

---

## Mock Data You Must Create

The skeleton files in `src/mock-data/` are starting points. You must populate them with realistic data that makes the app look like the Figma. Here is the expected shape for each file:

### `companies.json`
```typescript
interface Company {
  id: string;
  name: string;         // "PhonePe", "Amazon", "Google", etc.
  logoUrl: string;      // Remote URL or local asset
}
```

### `questions.json`
```typescript
interface Question {
  id: string;
  questionNumber: number;       // Displayed as the numbered badge on the card
  companyId: string;
  companyName: string;
  companyLogoUrl: string;
  text: string;                 // The interview question
  durationMinutes: number;      // Shown in the open state
  completedTodayCount: number;  // "X users completed this today"
}
```

### `session-result.json`
```typescript
interface SessionResult {
  questionId: string;
  questionText: string;
  companyName: string;
  smartSummary: {
    whatWorkedWell: string[];     // Bullet points for Smart Summary tab
    overallTakeaways: string[];
  };
  keyMoments: {
    timestamp: string;            // "01:37"
    description: string;
    type: "positive" | "negative";
  }[];
  audioDurationSeconds: number;   // For the mock audio player
}
```

### `user.json`
```typescript
interface User {
  id: string;
  name: string;
  phone: string;
  avatarUrl: string;
}
```

Fill in the actual content by referencing the Figma — the text visible in the Figma screenshots is the data your app should display.

---

## Technical Requirements

These are non-negotiable. Your submission will be evaluated against them.

- **TypeScript:** Strict mode is enabled. No `any` types. Define interfaces for all props and data shapes.
- **Architecture:** Follow a feature-based folder structure:
  ```
  src/
  ├── components/            # Shared UI components
  ├── features/
  │   ├── auth/              # Splash, Welcome, Login
  │   ├── home/              # Home screen + open state
  │   ├── session-result/    # Feedback (Smart Summary) + Highlights (Key Moments) tabs
  │   └── settings/          # Settings screen
  ├── navigation/            # Navigator files + centralized types
  ├── theme/                 # Already provided — do not modify
  └── mock-data/             # Populate these with your data
  ```
- **No hardcoded values:** Colors from `colors`, spacing from `spacing`, font weights from `typography`.
- **Images:** Use `expo-image` (not the RN `Image`) with `cachePolicy="memory-disk"`.
- **Lists:** Use `@shopify/flash-list` (not `FlatList`) for any scrollable lists.
- **Navigation:** React Navigation v7 — Stack navigator for auth, Bottom Tabs for main app. Centralize navigation types in `navigation/types.ts`.
- **Absolute imports:** Use the `@/` alias throughout. No `../../` relative imports across feature boundaries.
- **File naming:** `kebab-case` for files (e.g. `home-screen.tsx`, `question-card.tsx`). Exports stay PascalCase/camelCase.

### Libraries (already in `package.json`)

| Library | Use for |
|---|---|
| `@react-navigation/native-stack` | Stack navigator (auth flow) |
| `@react-navigation/bottom-tabs` | Main tab navigator |
| `@shopify/flash-list` | All scrollable lists |
| `expo-image` | All images (`cachePolicy="memory-disk"`) |
| `react-native-reanimated` | Animations |
| `@expo-google-fonts/inter` | Inter font |

---

## Evaluation Criteria

| Dimension | Weight | What we look for |
|---|---|---|
| **UI Fidelity** | 30% | How closely does the app match the Figma? We expect **pixel-perfect implementation** — spacing, typography, colors, component sizing, and interactions must match the design precisely. |
| **Code Quality** | 25% | Clean, readable, DRY code. Consistent naming. No dead code. |
| **Architecture** | 20% | Feature-based structure, separation of concerns, no business logic in UI components. |
| **TypeScript** | 15% | Proper typing for all props, data shapes, and navigation. No `any`. |
| **Bonus** | 10% | Animations, smooth transitions, empty states, accessibility. |

### What we are NOT looking for

- Complex state management — `useState` and `useContext` are sufficient
- Backend integration — all data is local

---

## Bonus Points

Entirely optional — but they separate good submissions from great ones.

- Smooth screen transitions using `react-native-reanimated`
- Animated bottom sheet for the Home open state
- Skeleton/shimmer loading states
- Haptic feedback on button presses (`expo-haptics`)
- Accessibility labels (`accessibilityLabel`, `accessibilityRole`)
- `React.memo` on list items, `useMemo` for derived data

---

## Submission

1. Push your code to a **public GitHub repository**
2. **Record a short screen-recording video** (1–3 minutes) walking through all screens — we want to see it in action. Upload to [Loom](https://loom.com), YouTube (unlisted), Google Drive, or any shareable link.
3. **Build an APK** (Android) and host it so we can install and test on a real device:
   - Upload to Google Drive, Dropbox, or use EAS Build (which gives you a direct download link)
4. Email the following to **internships@grapevine.in** with subject line `RN Assignment — [Your Name]`:
   - GitHub repository link
   - Video demonstration link
   - APK download link
5. Include a `NOTES.md` at the root of your repo with:
   - Trade-offs or decisions you made
   - What you would improve with more time
   - Any assumptions about the Figma design

**Deadline: 2 days from when you received this assignment.**

### Building the APK for Submission

```bash
# Option A — EAS Build (recommended — cloud build, gives a shareable download link)
npm install -g eas-cli
eas login
eas build --platform android --profile preview
# When done, EAS prints a direct APK download URL — share that link

# Option B — Local release build
yarn prebuild:clean
cd android && ./gradlew assembleRelease
# APK → android/app/build/outputs/apk/release/app-release.apk
```

> For the video, a simulator or phone screen recording is perfectly fine. [Loom](https://loom.com) is free and generates a shareable link instantly.

---

## Project Structure (Suggested)

```
src/
├── components/
│   └── ui/
│       ├── button.tsx
│       └── ready-brand.tsx
├── features/
│   ├── auth/
│   │   └── screens/
│   │       ├── splash-screen.tsx
│   │       ├── welcome-screen.tsx
│   │       └── login-screen.tsx
│   ├── home/
│   │   ├── components/
│   │   │   ├── question-card.tsx
│   │   │   └── question-popover.tsx
│   │   ├── hooks/
│   │   │   └── use-home-question-popover.ts
│   │   └── screens/
│   │       └── home-screen.tsx
│   ├── session-result/
│   │   └── screens/
│   │       └── session-result-screen.tsx
│   ├── settings/
│   │   └── screens/
│   │       └── settings-screen.tsx
│   └── store/
│       └── screens/
│           └── store-screen.tsx
├── navigation/
│   ├── custom-tab-bar.tsx
│   ├── root-navigation-ref.ts
│   ├── root-navigator.tsx
│   ├── main-navigator.tsx
│   └── types.ts                  ← centralize all navigation param types here
├── theme/
│   ├── colors.ts                 ← already provided
│   ├── spacing.ts                ← already provided
│   ├── typography.ts             ← already provided
│   └── index.ts                  ← already provided
└── mock-data/
    ├── companies.json            ← populate with your data
    ├── questions.json            ← populate with your data
    ├── session-result.json       ← populate with your data
    └── user.json                 ← populate with your data
```

---

## FAQ

**Q: Should the repository be public or private?**
Public is fine — just share the link directly.

**Q: Can I use additional libraries?**
Yes, as long as they are justified. Avoid large UI component kits (e.g. NativeBase, Tamagui) — we want to see you build UI from scratch.

**Q: Can I use Expo Router instead of React Navigation?**
Yes, but React Navigation v7 is preferred since it is what we use in production.

**Q: The Figma has some screens that are unclear — what should I do?**
Use your best judgment and document your assumptions in `NOTES.md`. Good designers are not always available, and we value engineers who make sensible decisions independently.

**Q: Do I need to handle orientation changes or tablets?**
No — portrait-only on phone is sufficient (already set in `app.json`).

**Q: Should I commit `node_modules`?**
No. The `.gitignore` already excludes it.

---

Good luck! We are excited to see what you build.

— The Grapevine Team
