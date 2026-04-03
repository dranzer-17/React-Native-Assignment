import { useCallback } from "react";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { FlashList, type ListRenderItemInfo } from "@shopify/flash-list";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { navigateToWelcome } from "@/navigation/root-navigation-ref";
import type { MainTabParamList } from "@/navigation/types";
import userData from "@/mock-data/user.json";
import type { User } from "@/types/mock-data";
import { colors, palette } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

const user = userData as User;

// Full promo card asset (background, copy, character, CTA) — 714×406
// eslint-disable-next-line @typescript-eslint/no-var-requires
const TRIAL_BANNER_PNG = require("../../../../assets/profile.png") as number;
const TRIAL_BANNER_ASPECT = 714 / 406;

type TabNav = BottomTabNavigationProp<MainTabParamList>;

type SettingsRow =
  | { type: "header"; key: string }
  | { type: "trial"; key: string }
  | { type: "update"; key: string }
  | { type: "info"; key: string }
  | { type: "actions"; key: string }
  | { type: "footer"; key: string };

const SETTINGS_ROWS: SettingsRow[] = [
  { type: "header", key: "header" },
  { type: "trial", key: "trial" },
  { type: "update", key: "update" },
  { type: "info", key: "info" },
  { type: "actions", key: "actions" },
  { type: "footer", key: "footer" },
];

interface ActionRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress?: () => void;
  destructive?: boolean;
}

function ActionRow({ icon, label, onPress, destructive }: ActionRowProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.actionRow, pressed && styles.rowPressed]}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <View style={styles.actionIconWrap}>
        <Ionicons
          name={icon}
          size={20}
          color={destructive ? colors.error : palette.gray70}
        />
      </View>
      <Text
        style={[styles.actionLabel, destructive && styles.actionLabelDestructive]}
      >
        {label}
      </Text>
      <Ionicons name="chevron-forward" size={18} color={palette.gray40} />
    </Pressable>
  );
}

export function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<TabNav>();

  const onTrialCta = useCallback(() => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<SettingsRow>) => {
      switch (item.type) {
        case "header":
          return (
            <View style={styles.header}>
              <Pressable
                onPress={() => navigation.navigate("HomeTab")}
                style={({ pressed }) => [styles.headerSide, pressed && styles.headerPressed]}
                accessibilityRole="button"
                accessibilityLabel="Back"
              >
                <Ionicons name="chevron-back" size={26} color={palette.gray90} />
              </Pressable>
              <Text style={styles.headerTitle} numberOfLines={1}>
                Your Profile
              </Text>
              <View style={styles.headerSide} />
            </View>
          );
        case "trial":
          return (
            <Pressable
              onPress={onTrialCta}
              style={({ pressed }) => [styles.trialBannerPress, pressed && styles.trialBannerPressed]}
              accessibilityRole="button"
              accessibilityLabel="Start 3 days trial for 1 rupee"
            >
              <Image
                source={TRIAL_BANNER_PNG}
                style={styles.trialBannerImage}
                contentFit="cover"
                cachePolicy="memory-disk"
                accessibilityIgnoresInvertColors
              />
            </Pressable>
          );
        case "update":
          return (
            <View style={styles.outlineCard}>
              <Ionicons name="grid-outline" size={22} color={palette.gray70} />
              <Text style={styles.updateLabel}>New update available</Text>
              <Pressable
                style={({ pressed }) => [
                  styles.downloadBtn,
                  pressed && styles.downloadBtnPressed,
                ]}
                accessibilityRole="button"
                accessibilityLabel="Download update"
              >
                <Ionicons name="download-outline" size={18} color={palette.green60} />
              </Pressable>
            </View>
          );
        case "info":
          return (
            <View style={styles.outlineCardStack}>
              <View style={styles.infoRow}>
                <Ionicons name="call-outline" size={20} color={palette.gray70} />
                <Text style={styles.infoLabel}>Phone number</Text>
                <Text style={styles.infoValue}>{user.phone}</Text>
              </View>
              <View style={styles.rowDivider} />
              <View style={styles.infoRow}>
                <Ionicons name="calendar-outline" size={20} color={palette.gray70} />
                <Text style={styles.infoLabel}>Learning since</Text>
                <Text style={styles.infoValue}>{user.learningSince}</Text>
              </View>
            </View>
          );
        case "actions":
          return (
            <View style={styles.outlineCardStack}>
              <ActionRow icon="chatbubble-ellipses-outline" label="Chat with us" />
              <View style={styles.rowDivider} />
              <ActionRow icon="share-outline" label="Share the app" />
              <View style={styles.rowDivider} />
              <ActionRow icon="star-outline" label="Rate the app" />
              <View style={styles.rowDivider} />
              <ActionRow
                icon="log-out-outline"
                label="Log out"
                destructive
                onPress={() => navigateToWelcome()}
              />
            </View>
          );
        case "footer":
          return (
            <Text style={styles.footer}>
              App version v2.14.2{"\n"}Made with ❤️ from India
            </Text>
          );
        default:
          return null;
      }
    },
    [navigation, onTrialCta],
  );

  return (
    <FlashList
      data={SETTINGS_ROWS}
      renderItem={renderItem}
      keyExtractor={(row) => row.key}
      style={styles.root}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: insets.top + spacing.s,
          paddingBottom: insets.bottom + spacing.xl,
        },
      ]}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: palette.gray15,
  },
  content: {
    paddingHorizontal: spacing.screenPadding,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.m,
  },
  headerSide: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerPressed: {
    opacity: 0.6,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontFamily: typography.fonts.manrope.bold,
    fontSize: 18,
    color: palette.gray90,
  },

  trialBannerPress: {
    width: "100%",
    borderRadius: 22,
    overflow: "hidden",
    marginBottom: spacing.m,
  },
  trialBannerPressed: {
    opacity: 0.96,
  },
  trialBannerImage: {
    width: "100%",
    aspectRatio: TRIAL_BANNER_ASPECT,
  },

  outlineCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.s,
    backgroundColor: colors.cardBackground,
    borderRadius: spacing.cardRadius,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: palette.gray30,
    paddingVertical: spacing.m,
    paddingHorizontal: spacing.cardPadding,
    marginBottom: spacing.m,
  },
  updateLabel: {
    flex: 1,
    fontFamily: typography.fonts.manrope.medium,
    fontSize: 15,
    color: palette.gray80,
  },
  downloadBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: palette.profileDownloadTint,
    alignItems: "center",
    justifyContent: "center",
  },
  downloadBtnPressed: {
    opacity: 0.85,
  },

  outlineCardStack: {
    backgroundColor: colors.cardBackground,
    borderRadius: spacing.cardRadius,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: palette.gray30,
    overflow: "hidden",
    marginBottom: spacing.m,
  },
  rowDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: palette.gray20,
    marginLeft: spacing.cardPadding + 32 + spacing.s,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.s,
    paddingVertical: spacing.m,
    paddingHorizontal: spacing.cardPadding,
  },
  infoLabel: {
    flex: 1,
    fontFamily: typography.fonts.manrope.medium,
    fontSize: 15,
    color: palette.gray80,
  },
  infoValue: {
    fontFamily: typography.fonts.manrope.regular,
    fontSize: 14,
    color: palette.gray50,
    textAlign: "right",
    maxWidth: "52%",
  },

  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.s,
    paddingVertical: spacing.m,
    paddingHorizontal: spacing.cardPadding,
  },
  rowPressed: {
    backgroundColor: palette.gray10,
  },
  actionIconWrap: {
    width: 28,
    alignItems: "center",
  },
  actionLabel: {
    flex: 1,
    fontFamily: typography.fonts.manrope.medium,
    fontSize: 15,
    color: palette.gray80,
  },
  actionLabelDestructive: {
    color: colors.error,
  },

  footer: {
    marginTop: spacing.s,
    fontFamily: typography.fonts.manrope.regular,
    fontSize: typography.sizes.xs,
    color: palette.gray50,
    textAlign: "center",
    lineHeight: 18,
  },
});
