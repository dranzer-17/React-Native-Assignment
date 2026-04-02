import { memo } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "@/components/ui/button";
import type { Question } from "@/types/mock-data";
import { remoteImageWithHeaders } from "@/utils/remote-image";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

export interface QuestionCardProps {
  item: Question;
  index: number;
  onPressCard: (item: Question) => void;
  onPressStart?: (item: Question) => void;
}

const cardShadow =
  Platform.OS === "ios"
    ? {
        shadowColor: colors.textPrimary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
      }
    : { elevation: 2 };

export const QuestionCard = memo(function QuestionCard({
  item,
  index,
  onPressCard,
  onPressStart,
}: QuestionCardProps) {
  const showStart = index === 0;
  const locked = index > 0;

  return (
    <Pressable
      onPress={() => onPressCard(item)}
      style={({ pressed }) => [
        styles.card,
        cardShadow,
        locked && styles.cardLocked,
        pressed && styles.cardPressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`Question ${item.questionNumber} ${item.companyName}`}
    >
      <View style={styles.row}>
        <View style={[styles.badge, locked && styles.badgeLocked]}>
          <Text style={[styles.badgeText, locked && styles.badgeTextLocked]}>
            {item.questionNumber}
          </Text>
        </View>
        <Image
          source={remoteImageWithHeaders(item.companyLogoUrl)}
          style={[styles.logo, locked && styles.logoLocked]}
          contentFit="contain"
          cachePolicy="memory-disk"
          accessibilityIgnoresInvertColors
        />
        <View style={styles.meta}>
          <Text style={[styles.company, locked && styles.companyLocked]} numberOfLines={1}>
            {item.companyName}
          </Text>
          <Text style={[styles.preview, locked && styles.previewLocked]} numberOfLines={2}>
            {item.text}
          </Text>
        </View>
        {locked ? (
          <Ionicons name="lock-closed" size={20} color={colors.textDisabled} />
        ) : (
          <Ionicons name="chevron-forward" size={20} color={colors.textDisabled} />
        )}
      </View>
      {showStart && onPressStart ? (
        <View style={styles.startWrap}>
          <Button
            label="START"
            onPress={() => onPressStart(item)}
            style={styles.startBtn}
            labelStyle={styles.startLabel}
          />
        </View>
      ) : null}
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: spacing.cardRadius,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: spacing.cardPadding,
    marginBottom: spacing.m,
  },
  cardLocked: {
    backgroundColor: colors.backgroundSecondary,
    opacity: 0.92,
  },
  cardPressed: {
    opacity: 0.96,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.s,
  },
  badge: {
    minWidth: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xxs,
  },
  badgeLocked: {
    backgroundColor: colors.backgroundSecondary,
  },
  badgeText: {
    fontFamily: typography.fonts.inter.semiBold,
    fontSize: typography.sizes.s,
    color: colors.primaryDark,
  },
  badgeTextLocked: {
    color: colors.textDisabled,
  },
  logo: {
    width: 44,
    height: 44,
    borderRadius: spacing.s,
    backgroundColor: colors.backgroundSecondary,
  },
  logoLocked: {
    opacity: 0.65,
  },
  meta: {
    flex: 1,
    minWidth: 0,
  },
  company: {
    fontFamily: typography.fonts.inter.semiBold,
    fontSize: typography.sizes.m,
    color: colors.textPrimary,
    marginBottom: spacing.xxxs,
  },
  companyLocked: {
    color: colors.textSecondary,
  },
  preview: {
    fontFamily: typography.fonts.inter.normal,
    fontSize: typography.sizes.s,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  previewLocked: {
    color: colors.textDisabled,
  },
  startWrap: {
    marginTop: spacing.m,
    alignItems: "flex-start",
  },
  startBtn: {
    minHeight: 40,
    paddingHorizontal: spacing.m,
    borderRadius: spacing.m,
  },
  startLabel: {
    fontSize: typography.sizes.s,
  },
});
