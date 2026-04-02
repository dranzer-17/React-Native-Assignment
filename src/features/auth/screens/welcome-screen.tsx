import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ReadyAiLogo } from "@/components/ui/ready-brand";
import type { RootStackParamList } from "@/navigation/types";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

const HERO = require("../../../../assets/get-started-hero.png") as number;

/**
 * Figma button spec:
 *   height 58 · radius 12 · padding 16 12 · gap 2
 *   fill: linear-gradient(180deg, #FF6D00 → #FF3900)
 *   shadow: 0 8px 0 rgba(0,0,0,.2) + 0 8px 0 #FF3900  ← the "3D depth" effect
 *
 * We replicate the depth by sitting the face (58px, #FF6D00) on top of a
 * dark-orange wrapper (66px total = 58 face + 8 depth, #FF3900).
 * On press the face translates down 8px → depth "disappears" → button looks pushed.
 * Gradient requires expo-linear-gradient native rebuild; we use solid #FF6D00 top-face
 * with the depth layer giving the darker bottom feel.
 */
const BTN_FACE_H = 58;
const BTN_DEPTH = 8;
const BTN_RADIUS = 12;
const BTN_ORANGE = "#FF6D00"; // gradient start / face colour
const BTN_DEEP = "#FF3900"; // gradient end / depth / shadow colour

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
              <Ionicons name="checkmark-circle-outline" size={22} color="#fff" />
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
    width: 310,
    height: 310,
  },
  title: {
    fontSize: 28,
    lineHeight: 37,
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

  /** Depth / shadow layer: same radius, solid #FF3900, height = face + depth */
  ctaWrapper: {
    width: "100%",
    height: BTN_FACE_H + BTN_DEPTH,
    backgroundColor: BTN_DEEP,
    borderRadius: BTN_RADIUS,
    marginBottom: spacing.m,
    // iOS + Android black ambient shadow (rgba(0,0,0,.2) offset 8px)
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
      android: { elevation: 8 },
      default: {},
    }),
  },

  /** Button face: sits at top of wrapper, leaves BTN_DEPTH px of dark orange below */
  ctaFace: {
    height: BTN_FACE_H,
    backgroundColor: BTN_ORANGE,
    borderRadius: BTN_RADIUS,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 16,
    gap: 2,
  },

  /** On press: face slides down 8 px → depth "closes" → pressed-in feel */
  ctaFacePressed: {
    transform: [{ translateY: BTN_DEPTH }],
  },

  ctaLabel: {
    fontFamily: typography.fonts.inter.semiBold,
    fontSize: typography.sizes.m,
    color: "#fff",
  },

  /* ── Legal ──────────────────────────────────────────────────── */
  legal: {
    fontFamily: typography.fonts.inter.normal,
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 18,
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
