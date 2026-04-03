import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Question } from "@/types/mock-data";
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
        <Ionicons name="flag" size={14} color="#BF9C26" style={styles.proofIcon} />
        <Text style={styles.proofText}>
          {question.completedTodayCount.toLocaleString()} users completed Question{" "}
          {question.questionNumber} today
        </Text>
        <Ionicons name="flag" size={14} color="#BF9C26" style={styles.proofIcon} />
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
  proofIcon: { marginHorizontal: 2 },
  proofText: {
    fontFamily: typography.fonts.inter.semiBold,
    fontSize: typography.sizes.xs,
    color: "#BF9C26",
    letterSpacing: 0.2,
    flex: 1,
    textAlign: "center",
  },
  proofDash: {
    height: 0,
    borderBottomWidth: 1.5,
    borderBottomColor: "#BF9C26",
    borderStyle: "dashed",
    marginHorizontal: spacing.s,
  },
});
