import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/button";
import { navigateToWelcome } from "@/navigation/root-navigation-ref";
import userData from "@/mock-data/user.json";
import type { User } from "@/types/mock-data";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

const user = userData as User;

interface MenuRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  showDot?: boolean;
  onPress?: () => void;
}

function MenuRow({ icon, label, value, showDot, onPress }: MenuRowProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.menuRow, pressed && styles.menuRowPressed]}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <View style={styles.menuIconWrap}>
        <Ionicons name={icon} size={22} color={colors.textPrimary} />
      </View>
      <View style={styles.menuTextWrap}>
        <Text style={styles.menuLabel}>{label}</Text>
        {value ? <Text style={styles.menuValue}>{value}</Text> : null}
      </View>
      {showDot ? <View style={styles.menuDot} /> : null}
      <Ionicons name="chevron-forward" size={18} color={colors.textDisabled} />
    </Pressable>
  );
}

export function SettingsScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + spacing.m, paddingBottom: insets.bottom + spacing.xl },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.screenTitle}>Your Profile</Text>
      <View style={styles.profileCard}>
        <Image
          source={{ uri: user.avatarUrl }}
          style={styles.avatar}
          cachePolicy="memory-disk"
          accessibilityIgnoresInvertColors
        />
        <View style={styles.profileMeta}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.phone}>{user.phone}</Text>
        </View>
      </View>
      <Button label="Sign up / Continue" onPress={() => undefined} style={styles.cta} />
      <View style={styles.promo}>
        <Text style={styles.promoTitle}>3 days free trial for ₹1</Text>
        <Text style={styles.promoSub}>Unlock full paths and detailed AI feedback.</Text>
        <Button label="START 3 DAYS TRIAL @ ₹1" onPress={() => undefined} style={styles.promoBtn} />
      </View>
      <View style={styles.menu}>
        <MenuRow icon="sparkles-outline" label="New update available" showDot />
        <MenuRow icon="call-outline" label="Phone number" value={user.phone} />
        <MenuRow icon="time-outline" label="Last log in" value="August 17, 2023" />
        <MenuRow icon="chatbubble-ellipses-outline" label="Chat with us" />
        <MenuRow icon="share-social-outline" label="Share the app" />
        <MenuRow icon="star-outline" label="Rate the app" />
      </View>
      <Pressable
        onPress={() => navigateToWelcome()}
        style={({ pressed }) => [styles.logout, pressed && styles.menuRowPressed]}
        accessibilityRole="button"
        accessibilityLabel="Log out"
      >
        <Ionicons name="log-out-outline" size={22} color={colors.error} />
        <Text style={styles.logoutText}>Log Out</Text>
      </Pressable>
      <Text style={styles.footer}>App version 2.0.1 · Made with care in India</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.screenPadding,
  },
  screenTitle: {
    fontFamily: typography.fonts.inter.bold,
    fontSize: typography.sizes.xl,
    color: colors.textPrimary,
    marginBottom: spacing.l,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.m,
    marginBottom: spacing.l,
  },
  avatar: {
    width: spacing.avatarSize,
    height: spacing.avatarSize,
    borderRadius: spacing.avatarSize / 2,
    backgroundColor: colors.backgroundSecondary,
  },
  profileMeta: {
    flex: 1,
  },
  name: {
    fontFamily: typography.fonts.inter.semiBold,
    fontSize: typography.sizes.l,
    color: colors.textPrimary,
    marginBottom: spacing.xxxs,
  },
  phone: {
    fontFamily: typography.fonts.inter.normal,
    fontSize: typography.sizes.m,
    color: colors.textSecondary,
  },
  cta: {
    marginBottom: spacing.xl,
  },
  promo: {
    backgroundColor: colors.textPrimary,
    borderRadius: spacing.cardRadius,
    padding: spacing.cardPadding,
    marginBottom: spacing.xl,
  },
  promoTitle: {
    fontFamily: typography.fonts.inter.semiBold,
    fontSize: typography.sizes.m,
    color: colors.textInverse,
    marginBottom: spacing.xs,
  },
  promoSub: {
    fontFamily: typography.fonts.inter.normal,
    fontSize: typography.sizes.s,
    color: colors.textInverse,
    opacity: 0.72,
    marginBottom: spacing.m,
    lineHeight: 18,
  },
  promoBtn: {
    backgroundColor: colors.primary,
  },
  menu: {
    borderRadius: spacing.cardRadius,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    marginBottom: spacing.l,
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.m,
    paddingHorizontal: spacing.cardPadding,
    gap: spacing.s,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    backgroundColor: colors.cardBackground,
  },
  menuRowPressed: {
    backgroundColor: colors.backgroundSecondary,
  },
  menuIconWrap: {
    width: 32,
    alignItems: "center",
  },
  menuTextWrap: {
    flex: 1,
  },
  menuLabel: {
    fontFamily: typography.fonts.inter.medium,
    fontSize: typography.sizes.m,
    color: colors.textPrimary,
  },
  menuValue: {
    fontFamily: typography.fonts.inter.normal,
    fontSize: typography.sizes.s,
    color: colors.textSecondary,
    marginTop: spacing.xxxs,
  },
  menuDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  logout: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.s,
    paddingVertical: spacing.m,
    marginBottom: spacing.l,
  },
  logoutText: {
    fontFamily: typography.fonts.inter.semiBold,
    fontSize: typography.sizes.m,
    color: colors.error,
  },
  footer: {
    fontFamily: typography.fonts.inter.normal,
    fontSize: typography.sizes.xs,
    color: colors.textDisabled,
    textAlign: "center",
    lineHeight: 16,
  },
});
