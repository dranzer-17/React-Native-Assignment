import { memo, useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { Image } from "expo-image";
import { Button } from "@/components/ui/button";
import type { Question } from "@/types/mock-data";
import { remoteImageWithHeaders } from "@/utils/remote-image";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

export interface QuestionDetailSheetProps {
  sheetRef: React.RefObject<BottomSheet | null>;
  question: Question | null;
  onFeedback: () => void;
  onClose: () => void;
}

export const QuestionDetailSheet = memo(function QuestionDetailSheet({
  sheetRef,
  question,
  onFeedback,
  onClose,
}: QuestionDetailSheetProps) {
  const snapPoints = useMemo(() => ["72%"], []);

  const socialLine = question
    ? `${question.completedTodayCount.toLocaleString()} users completed Question ${question.questionNumber} today`
    : "";

  return (
    <BottomSheet
      ref={sheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      onClose={onClose}
      backgroundStyle={styles.sheetBg}
      handleIndicatorStyle={styles.handle}
    >
      <BottomSheetView style={styles.content}>
        {question ? (
          <>
        <Text style={styles.question}>{question.text}</Text>
        <View style={styles.askedRow}>
          <Image
            source={remoteImageWithHeaders(question.companyLogoUrl)}
            style={styles.companyLogo}
            contentFit="contain"
            cachePolicy="memory-disk"
            accessibilityIgnoresInvertColors
          />
          <Text style={styles.askedText}>
            Asked by <Text style={styles.companyName}>{question.companyName}</Text>
          </Text>
        </View>
        <Text style={styles.duration}>{question.durationMinutes} mins</Text>
        <View style={styles.actions}>
          <Button label="FEEDBACK" variant="secondary" onPress={onFeedback} style={styles.half} />
          <Button
            label="AI VS AI (LISTEN)"
            variant="secondary"
            disabled
            style={[styles.half, styles.dummy]}
          />
        </View>
        <Text style={styles.social}>{socialLine}</Text>
          </>
        ) : null}
      </BottomSheetView>
    </BottomSheet>
  );
});

const styles = StyleSheet.create({
  sheetBg: {
    backgroundColor: colors.cardBackground,
    borderTopLeftRadius: spacing.xl,
    borderTopRightRadius: spacing.xl,
  },
  handle: {
    backgroundColor: colors.border,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.xxl,
  },
  question: {
    fontFamily: typography.fonts.inter.semiBold,
    fontSize: typography.sizes.l,
    color: colors.textPrimary,
    lineHeight: 24,
    marginBottom: spacing.m,
  },
  askedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.s,
    marginBottom: spacing.xs,
  },
  companyLogo: {
    width: 28,
    height: 28,
    borderRadius: spacing.xxs,
    backgroundColor: colors.backgroundSecondary,
  },
  askedText: {
    fontFamily: typography.fonts.inter.normal,
    fontSize: typography.sizes.m,
    color: colors.textSecondary,
    flex: 1,
  },
  companyName: {
    fontFamily: typography.fonts.inter.semiBold,
    color: colors.textPrimary,
  },
  duration: {
    fontFamily: typography.fonts.inter.medium,
    fontSize: typography.sizes.s,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  actions: {
    flexDirection: "row",
    gap: spacing.s,
    marginBottom: spacing.l,
  },
  half: {
    flex: 1,
    minHeight: 48,
  },
  dummy: {
    opacity: 0.55,
  },
  social: {
    fontFamily: typography.fonts.inter.normal,
    fontSize: typography.sizes.s,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
});
