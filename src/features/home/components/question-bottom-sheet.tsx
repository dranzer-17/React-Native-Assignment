import { memo, useCallback, useMemo } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import type { ImageSource } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
  type BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import type { Question } from "@/types/mock-data";
import { remoteImageWithHeaders } from "@/utils/remote-image";
import { colors, palette } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

export interface QuestionBottomSheetProps {
  sheetRef: React.RefObject<BottomSheetModal | null>;
  question: Question | null;
  onFeedback: () => void;
  onClose: () => void;
}

const LOCAL_LOGOS: Record<string, number> = {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  phonepe: require("../../../../assets/phone-pay.png") as number,
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  amazon: require("../../../../assets/amazon.png") as number,
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  google: require("../../../../assets/google.png") as number,
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  microsoft: require("../../../../assets/microsoft.png") as number,
};

function getLogoSource(item: Question): ImageSource {
  const local = LOCAL_LOGOS[item.companyId];
  if (local) return local as ImageSource;
  return remoteImageWithHeaders(item.companyLogoUrl);
}

const AI_BTN_FACE = palette.gray90;
const AI_BTN_DEPTH_BG = palette.black;
const BTN_FACE_H = 52;
const BTN_DEPTH = 6;
const BTN_RADIUS = 14;

export const QuestionBottomSheet = memo(function QuestionBottomSheet({
  sheetRef,
  question,
  onFeedback,
  onClose,
}: QuestionBottomSheetProps) {
  const snapPoints = useMemo(() => ["58%", "88%"], []);

  const socialLine = useMemo(
    () =>
      question
        ? `${question.completedTodayCount.toLocaleString()} users completed Question ${question.questionNumber} today`
        : "",
    [question],
  );

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.45}
        pressBehavior="close"
      />
    ),
    [],
  );

  const handleFeedback = useCallback(() => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onFeedback();
  }, [onFeedback]);

  return (
    <BottomSheetModal
      ref={sheetRef}
      snapPoints={snapPoints}
      enablePanDownToClose
      onDismiss={onClose}
      backdropComponent={renderBackdrop}
      backgroundStyle={styles.sheetBg}
      handleIndicatorStyle={styles.handle}
    >
      <BottomSheetScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {question ? (
          <>
            <Text style={styles.question} accessibilityRole="header">
              {question.text}
            </Text>

            <View style={styles.metaRow}>
              <Image
                source={getLogoSource(question)}
                style={styles.companyLogo}
                contentFit="contain"
                cachePolicy="memory-disk"
                accessibilityIgnoresInvertColors
              />
              <View style={styles.metaText}>
                <Text style={styles.askedBy}>
                  Asked by{" "}
                  <Text style={styles.companyName}>{question.companyName}</Text>
                </Text>
              </View>
              <View style={styles.durationPill}>
                <Ionicons name="time-outline" size={13} color={palette.gray60} />
                <Text style={styles.durationText}>
                  {question.durationMinutes} mins
                </Text>
              </View>
            </View>

            <Pressable
              style={styles.feedbackBtn}
              onPress={handleFeedback}
              accessibilityRole="button"
              accessibilityLabel="Open feedback for this question"
            >
              <Text style={styles.feedbackLabel}>FEEDBACK</Text>
            </Pressable>

            <View style={styles.aiWrapper}>
              <Pressable
                style={styles.aiPressable}
                disabled
                accessibilityRole="button"
                accessibilityLabel="AI versus AI listen — coming soon"
              >
                {({ pressed }) => (
                  <View style={[styles.aiFace, pressed && styles.aiFacePressed]}>
                    <Ionicons name="headset" size={18} color={palette.white} />
                    <Text style={styles.aiLabel}>{"  "}AI VS AI (LISTEN)</Text>
                  </View>
                )}
              </Pressable>
            </View>

            <View style={styles.proofBanner}>
              <Ionicons name="flag" size={13} color={palette.orange60} />
              <Text style={styles.proofText}>{socialLine}</Text>
            </View>
          </>
        ) : null}
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
});

const shadow = Platform.select({
  ios: {
    shadowColor: palette.black,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
  },
  android: { elevation: 6 },
  default: {},
});

const styles = StyleSheet.create({
  sheetBg: {
    backgroundColor: colors.cardBackground,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  handle: {
    backgroundColor: palette.gray30,
    width: 40,
  },
  scrollContent: {
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.s,
    paddingBottom: spacing.xxl,
  },

  question: {
    fontFamily: typography.fonts.inter.bold,
    fontSize: 18,
    color: palette.gray90,
    lineHeight: 26,
    marginBottom: spacing.m,
  },

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.s,
    marginBottom: spacing.l,
  },
  companyLogo: {
    width: 32,
    height: 32,
    borderRadius: spacing.xs,
    backgroundColor: palette.gray20,
  },
  metaText: { flex: 1 },
  askedBy: {
    fontFamily: typography.fonts.inter.normal,
    fontSize: typography.sizes.s,
    color: palette.gray60,
  },
  companyName: {
    fontFamily: typography.fonts.inter.semiBold,
    color: palette.gray90,
  },
  durationPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: palette.gray10,
    borderRadius: 20,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xxs,
  },
  durationText: {
    fontFamily: typography.fonts.inter.medium,
    fontSize: typography.sizes.xs,
    color: palette.gray60,
  },

  feedbackBtn: {
    height: BTN_FACE_H,
    borderRadius: BTN_RADIUS,
    borderWidth: 1.5,
    borderColor: palette.green50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.s,
  },
  feedbackLabel: {
    fontFamily: typography.fonts.inter.bold,
    fontSize: 15,
    color: palette.green50,
    letterSpacing: 0.5,
  },

  aiWrapper: {
    width: "100%",
    height: BTN_FACE_H + BTN_DEPTH,
    backgroundColor: AI_BTN_DEPTH_BG,
    borderRadius: BTN_RADIUS,
    marginBottom: spacing.l,
    ...shadow,
  },
  aiPressable: { width: "100%" },
  aiFace: {
    height: BTN_FACE_H,
    backgroundColor: AI_BTN_FACE,
    borderRadius: BTN_RADIUS,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.m,
  },
  aiFacePressed: { transform: [{ translateY: BTN_DEPTH }] },
  aiLabel: {
    fontFamily: typography.fonts.inter.bold,
    fontSize: typography.sizes.m,
    color: palette.white,
    letterSpacing: 0.3,
  },

  proofBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    backgroundColor: palette.orange20,
    borderRadius: spacing.xs,
    paddingHorizontal: spacing.s,
    paddingVertical: spacing.xs,
  },
  proofText: {
    fontFamily: typography.fonts.inter.semiBold,
    fontSize: typography.sizes.xs,
    color: palette.orange60,
    flex: 1,
    letterSpacing: 0.2,
  },
});
