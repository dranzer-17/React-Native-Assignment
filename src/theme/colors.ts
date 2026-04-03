/**
 * ReadyU Brand Color Palette
 *
 * Use these tokens throughout your components.
 * Do NOT use hardcoded hex values in component files.
 */

export const palette = {
  // Brand
  orange10: "#FFF7ED",
  orange20: "#FFEDD5",
  orange30: "#FED7AA",
  orange40: "#FB923C",
  orange50: "#F97316",
  orange60: "#EA580C",
  orange70: "#C2410C",

  // Greens (used on Feedback / Highlights screens)
  green10: "#F0FDF4",
  green20: "#DCFCE7",
  green30: "#86EFAC",
  green40: "#4ADE80",
  green50: "#22C55E",
  green60: "#16A34A",

  // Grays
  gray10: "#F9FAFB",
  gray15: "#F6F7F8",
  gray20: "#F3F4F6",
  gray30: "#E5E7EB",
  gray40: "#D1D5DB",
  gray50: "#9CA3AF",
  gray60: "#6B7280",
  gray70: "#4B5563",
  gray80: "#374151",
  gray90: "#1F2937",

  // Utility
  white: "#FFFFFF",
  black: "#000000",
  transparent: "transparent",

  /** Near-black body ink (Figma session / cards) */
  ink: "#0B0B0D",
  /** Locked-state text on light popover */
  inkMuted: "#111827",

  // Shadows & overlays (RN string form)
  shadow: "#000000",
  overlayModal: "rgba(0,0,0,0.38)",
  overlaySheet: "rgba(0,0,0,0.35)",
  whiteAlpha40: "rgba(255,255,255,0.4)",
  whiteAlpha45: "rgba(255,255,255,0.45)",
  whiteAlpha90: "rgba(255,255,255,0.9)",
  blackAlpha60: "rgba(0,0,0,0.6)",

  // Home — question cards (Figma)
  homeQuestionActiveLime: "#79D634",
  homeQuestionActiveMint: "#D8F7C2",
  homeQuestionActiveDeep: "#325E0F",
  homeQuestionActiveLabel: "#0B2100",

  homeQuestionNextGold: "#FFD033",
  homeQuestionNextCream: "#FFF0BF",
  homeQuestionNextDeep: "#7B6009",
  homeQuestionNextLabel: "#2B1E00",

  homeQuestionLockedRing: "#d1d1d6",
  homeQuestionLockedCard: "#efeff4",

  homeNotifGreen: "#3EBD70",
  homePracticeYellow: "#FFF3CD",
  homePracticeShadow: "#B8860B",

  socialProofAmber: "#BF9C26",
  homeCompanyRule: "#ECECEC",

  // Popover / feedback CTA
  feedbackBrand: "#13BF69",

  // Auth CTA (Figma gradient approximation)
  authCtaFace: "#FF6D00",
  authCtaDepth: "#FF3900",

  // Session result
  sessionPageMint: "#DAF2E6",
  sessionGreenAccent: "#1A8F50",
  sessionCloseMint: "#2DB56B",
  sessionAvatarMint: "#D4F4E1",
  sessionCardGreen: "#13BF69",
  sessionBridgeGreen: "#13BF69",

  keyMomentBlue: "#2563EB",
  keyMomentBorder: "#93C5FD",

  // Store tab
  storeCircleBlue: "#e2f3ff",
  storeIconNavy: "#082f49",

  // Settings
  profileDownloadTint: "#DCFCE7",

  // Status
  error: "#EF4444",
  errorLight: "#FEF2F2",
} as const;

export const colors = {
  // Backgrounds
  background: palette.white,
  backgroundSecondary: palette.gray10,
  backgroundFeedback: palette.green10,
  backgroundHighlights: palette.green10,

  // Brand
  primary: palette.orange50,
  primaryLight: palette.orange10,
  primaryDark: palette.orange60,

  // Text
  textPrimary: palette.gray90,
  textSecondary: palette.gray60,
  textDisabled: palette.gray40,
  textInverse: palette.white,
  textLink: palette.orange50,
  textInk: palette.ink,

  // Border
  border: palette.gray30,
  borderFocused: palette.orange50,

  // Feedback / status
  success: palette.green50,
  successLight: palette.green10,
  error: palette.error,
  errorLight: palette.errorLight,

  // Cards
  cardBackground: palette.white,
  cardBorder: palette.gray30,

  // Button
  buttonPrimary: palette.orange50,
  buttonPrimaryText: palette.white,
  buttonDisabled: palette.gray30,
  buttonDisabledText: palette.gray50,

  // Shared chrome
  shadow: palette.shadow,
  overlayModal: palette.overlayModal,
} as const;

export type Colors = typeof colors;
