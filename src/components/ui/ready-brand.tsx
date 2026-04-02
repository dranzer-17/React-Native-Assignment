import { Platform, StyleSheet, Text, View, type ViewProps } from "react-native";
import { colors, palette } from "@/theme/colors";
import { spacing } from "@/theme/spacing";

/**
 * Figma logo: "Ready" (Onest ExtraBold, orange — gradient when native modules are linked)
 * + gap + "ai" tile (Surface/90, white lowercase "ai").
 *
 * Variants:
 * - **splash** — pre–Get Started: Ready 46.96, ai square 31.3×31.3
 * - **landing** — Welcome (first starting): Ready 36, ai 31.3×31.3
 * - **header** — Home / Store bar: Ready 36 & ai 26×26 at HEADER_SCALE
 */

const ONEST_EXTRA_BOLD = "Onest_800ExtraBold";

const LOGO_GAP = spacing.xxs;
const AI_RADIUS = 9;

const HEADER_SCALE = 0.62;

/** Splash: only logo, exact Figma-style sizes */
const SPLASH = {
  readySize: 46.96,
  readyLineHeight: (60 * 46.96) / 47,
  readyWidth: (142 * 46.96) / 47,
  readyLetterSpacing: -0.94,
  aiBox: 31.3,
  aiSize: (17 * 31.3) / 26,
  aiLetterSpacing: -0.31,
} as const;

/** Welcome / first starting: Ready 36, ai tile 31.3×31.3 */
const LANDING = {
  readySize: 36,
  readyLineHeight: (60 * 36) / 47,
  readyWidth: (142 * 36) / 47,
  readyLetterSpacing: -0.94,
  aiBox: 31.3,
  aiSize: (17 * 31.3) / 26,
  aiLetterSpacing: -0.31,
} as const;

/** Header row: Ready 36 + ai 26×26 before scale */
const HEADER_BASE = {
  readySize: 36,
  readyLineHeight: (60 * 36) / 47,
  readyWidth: (142 * 36) / 47,
  readyLetterSpacing: -0.94,
  aiBox: 26,
  aiSize: 17,
  aiLetterSpacing: -0.31,
} as const;

type LogoVariant = "splash" | "landing" | "header";

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function headerSpec() {
  const s = HEADER_SCALE;
  return {
    readySize: round2(HEADER_BASE.readySize * s),
    readyLineHeight: round2(HEADER_BASE.readyLineHeight * s),
    readyWidth: round2(HEADER_BASE.readyWidth * s),
    readyLetterSpacing: round2(HEADER_BASE.readyLetterSpacing * s),
    aiBox: round2(HEADER_BASE.aiBox * s),
    aiSize: round2(HEADER_BASE.aiSize * s),
    aiLetterSpacing: round2(HEADER_BASE.aiLetterSpacing * s),
  };
}

function getSpec(variant: LogoVariant) {
  if (variant === "splash") {
    return { ...SPLASH };
  }
  if (variant === "landing") {
    return { ...LANDING };
  }
  return headerSpec();
}

interface ReadyAiLogoProps extends ViewProps {
  variant?: LogoVariant;
  centered?: boolean;
}

export function ReadyAiLogo({ variant = "landing", centered = false, style, ...rest }: ReadyAiLogoProps) {
  const spec = getSpec(variant);
  const { readySize: rs, readyLineHeight: rlh, readyWidth: rw, readyLetterSpacing: rls } = spec;
  const { aiBox, aiSize: as, aiLetterSpacing: als } = spec;
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
        <Text
          style={[
            styles.aiText,
            {
              fontSize: as,
              letterSpacing: als,
              lineHeight: as,
            },
          ]}
        >
          ai
        </Text>
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
      android: {
        elevation: 3,
      },
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
    textTransform: "lowercase",
  },
});
