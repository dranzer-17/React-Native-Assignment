# NOTES — ReadyAI React Native Assignment

## Trade-offs and decisions

- **Figma workflow:** I used the **Figma MCP** repeatedly to align screens with the file. That helped confirm structure, typography, and component intent without constant context-switching out of the editor.

- **Home screen complexity:** The home / question list layout was the hardest screen to match. Spacing, offsets (e.g. the “staircase” card positions), and nested visuals don’t always map 1:1 from Figma to React Native. I relied on **manual inspection in Figma** (e.g. **Alt** for measuring distances and padding between layers) alongside MCP output to lock in sizes.

- **START control on the Amazon card:** In the design, there was a **START** treatment sitting on top of / overlapping the Amazon question area. In implementation it **confused automated tooling** (layout and codegen suggestions didn’t resolve it cleanly), and it was easy to misread against the rest of the card hierarchy. I **removed that START element** and kept the flow consistent with the other company rows (tap card → detail / popover → feedback), which matched how the rest of the list behaves.

- **Home “open state”:** The brief allows a bottom sheet or similar; I implemented an **anchored modal popover** with `measureInWindow` so the panel sits relative to the pressed card, with Reanimated enter animations. Same product goal (question detail + FEEDBACK + AI row), different surface than a sheet.

- **Audio on Session Result:** Mock interview playback uses **expo-av** with a bundled MP3. Native rebuilds are required after adding `expo-av`; detection uses `expo-modules-core`’s `requireOptionalNativeModule('ExponentAV')` so we don’t false-negative on Expo’s module registration.

- **Lists:** Scrollable lists use **FlashList** per requirements. Some screens (e.g. profile-style content) are implemented as FlashList rows for consistency, even where a ScrollView would also work.

- **Icons:** I didn’t have access to the exact same icon set as in Figma, so I used the closest icons I could source (e.g. from the icon library in the project) and settled on those rather than blocking on a perfect match.

## What I would improve with more time

- Tighten **pixel parity** on the home list (badge overflow, exact staircase offsets) against Figma with another pass and device screenshots side-by-side.

- **Theming:** Move remaining one-off hex values (especially on legacy Figma-specific greens/ambers) into shared tokens where the README allows extending or mapping to the provided palette.

- **Session Result player:** Drive progress and timestamps from real playback status instead of static mock values.

- **Store tab:** Replace the placeholder with real content or remove the tab if out of scope.

- **Tests:** Add a few rendering / navigation smoke tests and CI (lint + typecheck).

## Assumptions about the Figma design

- **Login:** Any phone + OTP combination is accepted; flow is mocked locally (per README).

- **START on Amazon:** Treated as redundant with “tap card to open detail”; omitted for clarity and implementation stability (see above).

- **Assets:** Logos and illustrations use a mix of **local assets** and remote URLs where the mock data specifies URLs; local files are used for known companies to match Figma reliably.

- **Third tab (Store):** Treated as a shell matching the tab bar spec; full store UI was not fully specified in the parts of the file I prioritized.

- **Accessibility:** Labels and roles are added on primary actions; a full audit (screen reader order, live regions) would be the next step.
