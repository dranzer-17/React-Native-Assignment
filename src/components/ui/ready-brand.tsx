import { Platform, StyleSheet, Text, View, type ViewProps } from "react-native";
import { colors, palette } from "@/theme/colors";
import { spacing } from "@/theme/spacing";

/**
 * Figma logo: "Ready" (Onest ExtraBold, orange) + "ai" square tile.
 *
 * Variants:
 * - **splash**  — before Get Started: Ready 46.96 px, ai 31.3 × 31.3
 * - **landing** — Welcome / Get Started page: Ready 36 px, ai 26 × 26
 * - **header**  — Home / Store bar (scaled down from landing at 0.62×)
 */

const ONEST_EXTRA_BOLD = "Onest_800ExtraBold";

const LOGO_GAP = spacing.xxs;
const AI_RADIUS = 9;
const HEADER_SCALE = 0.62;

/* ─── Per-variant specs ─── */

const SPLASH_SPEC = {
  readySize: 46.96,
  readyLineHeight: 59.5,
  readyWidth: 141.8,
  readyLetterSpacing: -0.94,
  aiBox: 31.3,
  aiSize: 20,
} as const;

const LANDING_SPEC = {
  readySize: 36,
  readyLineHeight: 45.8,
  readyWidth: 108.8,
  readyLetterSpacing: -0.72,
  aiBox: 26,
  aiSize: 17,
} as const;

type LogoVariant = "splash" | "landing" | "header";

function getSpec(variant: LogoVariant) {
  if (variant === "splash") return SPLASH_SPEC;
  if (variant === "landing") return LANDING_SPEC;
  // header = landing scaled at 0.62
  return {
    readySize: Math.round(LANDING_SPEC.readySize * HEADER_SCALE * 100) / 100,
    readyLineHeight: Math.round(LANDING_SPEC.readyLineHeight * HEADER_SCALE * 100) / 100,
    readyWidth: Math.round(LANDING_SPEC.readyWidth * HEADER_SCALE * 100) / 100,
    readyLetterSpacing: Math.round(LANDING_SPEC.readyLetterSpacing * HEADER_SCALE * 100) / 100,
    aiBox: Math.round(LANDING_SPEC.aiBox * HEADER_SCALE * 100) / 100,
    aiSize: Math.round(LANDING_SPEC.aiSize * HEADER_SCALE * 100) / 100,
  };
}

interface ReadyAiLogoProps extends ViewProps {
  variant?: LogoVariant;
  centered?: boolean;
}

export function ReadyAiLogo({ variant = "landing", centered = false, style, ...rest }: ReadyAiLogoProps) {
  const spec = getSpec(variant);
  const { readySize: rs, readyLineHeight: rlh, readyWidth: rw, readyLetterSpacing: rls } = spec;
  const { aiBox, aiSize: as } = spec;
  const rCorner = Math.min(AI_RADIUS, Math.floor(aiBox / 2.5));

  return (
    <View
      accessibilityLabel="Ready AI logo"
      style={[styles.row, centered && styles.rowCenter, style]}
      {...rest}
    >
      <View
        style={[
          styles.readyWrap,
          {
            height: rlh,
            width: rw,
            marginRight: LOGO_GAP,
          },
        ]}
      >
        <Text
          style={[
            styles.readyText,
            {
              fontSize: rs,
              lineHeight: rlh,
              letterSpacing: rls,
            },
          ]}
        >
          Ready
        </Text>
      </View>
      <View
        style={[
          styles.aiPill,
          {
            width: aiBox,
            height: aiBox,
            borderRadius: rCorner,
          },
        ]}
      >
        <Text style={[styles.aiText, { fontSize: as }]}>ai</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  rowCenter: {
    alignSelf: "center",
  },
  readyWrap: {
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: palette.gray90,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.18,
        shadowRadius: 4,
      },
      android: { elevation: 3 },
      default: {},
    }),
  },
  readyText: {
    fontFamily: ONEST_EXTRA_BOLD,
    color: colors.primary,
    textAlign: "left",
  },
  aiPill: {
    backgroundColor: palette.gray90,
    justifyContent: "center",
    alignItems: "center",
  },
  aiText: {
    fontFamily: ONEST_EXTRA_BOLD,
    color: colors.textInverse,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
});
