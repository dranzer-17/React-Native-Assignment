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
    xs: 11,
    s: 13,
    m: 15,
    l: 17,
    xl: 20,
    xxl: 24,
    xxxl: 30,
    display: 36,
  },
} as const;

export type Typography = typeof typography;
