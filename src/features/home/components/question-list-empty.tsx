import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ShimmerPlaceholder } from "@/components/ui/shimmer-placeholder";
import { palette } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

/** FlashList empty state — shimmer rows suggest loaded question cards (README bonus). */
export const QuestionListEmpty = memo(function QuestionListEmpty() {
  return (
    <View style={styles.wrap} accessibilityRole="none">
      <Text style={styles.title}>Loading questions…</Text>
      {[0, 1, 2, 3].map((i) => (
        <View key={String(i)} style={[styles.row, { marginLeft: 8 + i * 12 }]}>
          <ShimmerPlaceholder style={styles.cardShim} />
          <ShimmerPlaceholder style={styles.badgeShim} />
        </View>
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: {
    paddingVertical: spacing.l,
    gap: spacing.m,
  },
  title: {
    fontFamily: typography.fonts.inter.medium,
    fontSize: typography.sizes.s,
    color: palette.gray50,
    marginBottom: spacing.xs,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.s,
    marginBottom: spacing.s,
  },
  cardShim: {
    width: 206,
    height: 72,
    backgroundColor: palette.gray20,
  },
  badgeShim: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginTop: -6,
  },
});
