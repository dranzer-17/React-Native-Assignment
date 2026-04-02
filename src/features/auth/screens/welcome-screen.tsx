import { StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button } from "@/components/ui/button";
import { ReadyAiLogo } from "@/components/ui/ready-brand";
import type { RootStackParamList } from "@/navigation/types";
import { remoteImageWithHeaders } from "@/utils/remote-image";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

/** README Screen 2 — illustrated hero; swap for Figma export via `assets/` when you add it. */
const HERO_URI =
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80";

type Props = NativeStackScreenProps<RootStackParamList, "Welcome">;

export function WelcomeScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[styles.root, { paddingTop: insets.top + spacing.m, paddingBottom: insets.bottom + spacing.l }]}
    >
      <ReadyAiLogo variant="landing" centered style={styles.headerLogo} />
      <View style={styles.heroWrap}>
        <Image
          source={remoteImageWithHeaders(HERO_URI)}
          style={styles.hero}
          contentFit="cover"
          cachePolicy="memory-disk"
          accessibilityIgnoresInvertColors
        />
      </View>
      <Text style={styles.title}>
        <Text style={styles.titleBase}>Practice Top Interview Questions </Text>
        <Text style={styles.titleAccent}>with AI</Text>
      </Text>
      <Text style={styles.subtitle}>
        Build confidence with realistic prompts, feedback, and a path that feels like the real loop.
      </Text>
      <View style={styles.footer}>
        <Button label="Get started" onPress={() => navigation.navigate("Login")} />
        <Text style={styles.legal}>
          By continuing you agree to our Terms of service and Privacy policy.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.screenPadding,
  },
  headerLogo: {
    marginBottom: spacing.l,
  },
  heroWrap: {
    borderRadius: spacing.cardRadius,
    overflow: "hidden",
    marginBottom: spacing.xl,
    backgroundColor: colors.backgroundSecondary,
    ...{
      shadowColor: colors.textPrimary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.06,
      shadowRadius: 12,
      elevation: 2,
    },
  },
  hero: {
    width: "100%",
    height: 220,
  },
  title: {
    fontFamily: typography.fonts.inter.bold,
    fontSize: typography.sizes.xxl,
    marginBottom: spacing.s,
    lineHeight: 32,
  },
  titleBase: {
    color: colors.textPrimary,
  },
  titleAccent: {
    color: colors.primary,
  },
  subtitle: {
    fontFamily: typography.fonts.inter.normal,
    fontSize: typography.sizes.m,
    color: colors.textSecondary,
    lineHeight: 22,
    flex: 1,
  },
  footer: {
    gap: spacing.m,
  },
  legal: {
    fontFamily: typography.fonts.inter.normal,
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 16,
  },
});
