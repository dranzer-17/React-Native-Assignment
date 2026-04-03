import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Question } from "@/types/mock-data";
import { palette } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

export interface SocialProofBannerProps {
  question: Question;
}

/** Figma: "X users completed Question N today" strip — no bg, dashed line below */
export const SocialProofBanner = memo(function SocialProofBanner({ question }: SocialProofBannerProps) {
  return (
    <View style={styles.proofWrap}>
      <View style={styles.proofBanner}>
        <Ionicons name="flag" size={spacing.iconSm} color={palette.socialProofAmber} style={styles.proofIcon} />
        <Text style={styles.proofText}>
          {question.completedTodayCount.toLocaleString()} users completed Question{" "}
          {question.questionNumber} today
        </Text>
        <Ionicons name="flag" size={spacing.iconSm} color={palette.socialProofAmber} style={styles.proofIcon} />
      </View>
      <View style={styles.proofDash} />
    </View>
  );
});

const styles = StyleSheet.create({
  proofWrap: {
    marginBottom: spacing.s,
  },
  proofBanner: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.s,
    paddingVertical: spacing.xs,
    gap: spacing.xxs,
  },
  proofIcon: { marginHorizontal: spacing.xxxs },
  proofText: {
    fontFamily: typography.fonts.inter.semiBold,
    fontSize: typography.sizes.xs,
    color: palette.socialProofAmber,
    letterSpacing: typography.letterSpacing.socialProof,
    flex: 1,
    textAlign: "center",
  },
  proofDash: {
    height: 0,
    borderBottomWidth: spacing.dashedRuleWidth,
    borderBottomColor: palette.socialProofAmber,
    borderStyle: "dashed",
    marginHorizontal: spacing.s,
  },
});
