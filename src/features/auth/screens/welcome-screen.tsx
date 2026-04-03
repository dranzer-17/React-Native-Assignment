import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ReadyAiLogo } from "@/components/ui/ready-brand";
import type { RootStackParamList } from "@/navigation/types";
import { colors, palette } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

const HERO = require("../../../../assets/get-started-hero.png") as number;

/**
 * Figma CTA: face + depth using `palette.authCtaFace` / `palette.authCtaDepth`;
 * dimensions from `spacing.authCtaFaceHeight`, `spacing.authCtaDepth`, `spacing.inputRadius`.
 */
type Props = NativeStackScreenProps<RootStackParamList, "Welcome">;

export function WelcomeScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.root,
        { paddingTop: insets.top + spacing.l, paddingBottom: insets.bottom + spacing.l },
      ]}
    >
      {/* Logo */}
      <ReadyAiLogo variant="landing" centered style={styles.logo} />

      {/* Hero illustration — circular layout built into the PNG */}
      <View style={styles.heroWrap}>
        <Image
          source={HERO}
          style={styles.hero}
          contentFit="contain"
          cachePolicy="memory-disk"
          accessibilityIgnoresInvertColors
        />
      </View>

      {/* Title */}
      <Text style={styles.title}>
        <Text style={styles.titleBase}>Practice Top Interview{"\n"}Questions </Text>
        <Text style={styles.titleAccent}>with AI</Text>
      </Text>

      <View style={styles.flex1} />

      {/* 3-D CTA button */}
      <View style={styles.ctaWrapper}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Let's go"
          onPress={() => navigation.navigate("Login")}
        >
          {({ pressed }) => (
            <View style={[styles.ctaFace, pressed && styles.ctaFacePressed]}>
              <Ionicons name="checkmark-circle-outline" size={spacing.iconLg} color={palette.white} />
              <Text style={styles.ctaLabel}>{"  "}Let's go</Text>
            </View>
          )}
        </Pressable>
      </View>

      {/* Legal */}
      <Text style={styles.legal}>
        By continuing, you acknowledge agreeing to our{"\n"}
        <Text style={styles.legalLink}>terms of service</Text>
        <Text style={styles.legalBase}> and </Text>
        <Text style={styles.legalLink}>privacy policy</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.screenPadding,
    alignItems: "center",
  },
  logo: {
    marginBottom: spacing.xl,
  },
  heroWrap: {
    width: "100%",
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  hero: {
    width: spacing.welcomeHero,
    height: spacing.welcomeHero,
  },
  title: {
    fontSize: typography.sizes.welcomeTitle,
    lineHeight: typography.lineHeights.welcomeTitle,
    textAlign: "center",
    fontFamily: typography.fonts.inter.bold,
    paddingHorizontal: spacing.xs,
  },
  titleBase: {
    color: colors.textPrimary,
  },
  titleAccent: {
    color: colors.primary,
  },
  flex1: {
    flex: 1,
  },

  /* ── 3D button ─────────────────────────────────────────────── */

  ctaWrapper: {
    width: "100%",
    height: spacing.authCtaFaceHeight + spacing.authCtaDepth,
    backgroundColor: palette.authCtaDepth,
    borderRadius: spacing.inputRadius,
    marginBottom: spacing.m,
    ...Platform.select({
      ios: {
        shadowColor: palette.shadow,
        shadowOffset: { width: 0, height: spacing.xs },
        shadowOpacity: 0.2,
        shadowRadius: spacing.xxxs,
      },
      android: { elevation: 8 },
      default: {},
    }),
  },

  ctaFace: {
    height: spacing.authCtaFaceHeight,
    backgroundColor: palette.authCtaFace,
    borderRadius: spacing.inputRadius,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.s,
    paddingVertical: spacing.m,
    gap: spacing.tabLabelGap,
  },

  ctaFacePressed: {
    transform: [{ translateY: spacing.authCtaDepth }],
  },

  ctaLabel: {
    fontFamily: typography.fonts.inter.semiBold,
    fontSize: typography.sizes.m,
    color: palette.white,
  },

  /* ── Legal ──────────────────────────────────────────────────── */
  legal: {
    fontFamily: typography.fonts.inter.normal,
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: typography.lineHeights.legal,
  },
  legalBase: {
    color: colors.textSecondary,
  },
  legalLink: {
    color: colors.textPrimary,
    textDecorationLine: "underline",
    fontFamily: typography.fonts.inter.medium,
  },
});
