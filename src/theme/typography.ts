import { Platform } from "react-native";

/**
 * Typography
 *
 * Font family definitions using the Inter font loaded via expo-font.
 * See README for how to load fonts in App.tsx.
 */

export const typography = {
  fonts: {
    inter: {
      light: "Inter_300Light",
      normal: "Inter_400Regular",
      medium: "Inter_500Medium",
      semiBold: "Inter_600SemiBold",
      bold: "Inter_700Bold",
    },
    /** Loaded in App.tsx via @expo-google-fonts/manrope (internal names Manrope_*). */
    manrope: {
      regular: "Manrope_400Regular",
      medium: "Manrope_500Medium",
      semiBold: "Manrope_600SemiBold",
      bold: "Manrope_700Bold",
      extraBold: "Manrope_800ExtraBold",
    },
    system: Platform.select({
      ios: "System",
      android: "Roboto",
      default: "System",
    }),
  },

  sizes: {
    /** Bottom tab label */
    tabLabel: 10,
    xs: 11,
    s: 13,
    /** Figma body copy 14px */
    body: 14,
    m: 15,
    /** Figma section / tab labels 16px */
    section: 16,
    l: 17,
    /** Popover question title */
    popoverTitle: 18,
    xl: 20,
    xxl: 24,
    xxxl: 30,
    /** Welcome marketing title */
    welcomeTitle: 28,
    /** Login heading */
    loginHeading: 30,
    display: 36,
    /** Large badge number on question cards */
    badgeNumber: 36,
  },

  lineHeights: {
    xs: 14,
    sm: 18,
    md: 20,
    relaxed: 22,
    popoverQuestion: 26,
    sessionQuestion: 26,
    loginHeading: 38,
    welcomeTitle: 37,
    legal: 18,
  },

  /** Use with `fontWeight` when not using Inter named faces */
  weights: {
    regular: "400",
    medium: "500",
    semiBold: "600",
    bold: "700",
  } as const,

  letterSpacing: {
    companyNameTight: -0.14,
    headingTight: -0.3,
    feedbackCta: 0.5,
    aiListen: 0.3,
    socialProof: 0.2,
  } as const,
} as const;

export type Typography = typeof typography;
