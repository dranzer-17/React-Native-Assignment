import { memo, useMemo } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import type { Question } from "@/types/mock-data";
import { remoteImageWithHeaders } from "@/utils/remote-image";
import { colors, palette } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

export interface QuestionDetailSheetProps {
  sheetRef: React.RefObject<BottomSheet | null>;
  question: Question | null;
  onFeedback: () => void;
  onClose: () => void;
}

/** Figma: dark 3D "AI VS AI" button — same depth technique as CTA buttons */
const AI_BTN_ORANGE = "#1C1C1E";
const AI_BTN_DEEP = "#080900";
const AI_BTN_H = 52;
const AI_BTN_DEPTH = 6;
const AI_BTN_RADIUS = 14;

export const QuestionDetailSheet = memo(function QuestionDetailSheet({
  sheetRef,
  question,
  onFeedback,
  onClose,
}: QuestionDetailSheetProps) {
  const snapPoints = useMemo(() => ["65%"], []);

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
            {/* Question text — Figma: bold, #080900, 18px */}
            <Text style={styles.question}>{question.text}</Text>

            {/* Asked by row: company logo + name + duration */}
            <View style={styles.metaRow}>
              <Image
                source={remoteImageWithHeaders(question.companyLogoUrl)}
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

            {/* FEEDBACK — Figma: Inter Bold 15 / #13BF69 */}
            <Pressable
              style={styles.feedbackBtn}
              onPress={onFeedback}
              accessibilityRole="button"
              accessibilityLabel="Feedback"
            >
              <Text style={styles.feedbackLabel}>FEEDBACK</Text>
            </Pressable>

            {/* AI VS AI (LISTEN) — Figma: dark 3D button */}
            <View style={styles.aiWrapper}>
              <Pressable
                style={styles.aiPressable}
                disabled
                accessibilityLabel="AI vs AI listen — coming soon"
              >
                {({ pressed }) => (
                  <View style={[styles.aiFace, pressed && styles.aiFacePressed]}>
                    <Ionicons name="headset" size={18} color="#fff" />
                    <Text style={styles.aiLabel}>{"  "}AI VS AI (LISTEN)</Text>
                  </View>
                )}
              </Pressable>
            </View>

            {/* Social proof banner */}
            <View style={styles.proofBanner}>
              <Ionicons name="flag" size={13} color="#B8860B" />
              <Text style={styles.proofText}>{socialLine}</Text>
            </View>
          </>
        ) : null}
      </BottomSheetView>
    </BottomSheet>
  );
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
  content: {
    flex: 1,
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.s,
    paddingBottom: spacing.xxl,
  },

  /* ── Question text ── Figma: Manrope Bold 18 / #080900 ─── */
  question: {
    fontFamily: typography.fonts.inter.bold,
    fontSize: 18,
    color: "#080900",
    lineHeight: 26,
    marginBottom: spacing.m,
  },

  /* ── Meta row: logo + askedBy + duration ─────────────────  */
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

  /* ── FEEDBACK ── Figma: Inter Bold 15 / #13BF69 ────────── */
  feedbackBtn: {
    height: AI_BTN_H,
    borderRadius: AI_BTN_RADIUS,
    borderWidth: 1.5,
    borderColor: "#13BF69",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.s,
  },
  feedbackLabel: {
    fontFamily: typography.fonts.inter.bold,
    fontSize: 15,
    color: "#13BF69",
    letterSpacing: 0.5,
  },

  /* ── AI VS AI ── Figma: dark 3D with 🎧 ────────────────── */
  aiWrapper: {
    width: "100%",
    height: AI_BTN_H + AI_BTN_DEPTH,
    backgroundColor: AI_BTN_DEEP,
    borderRadius: AI_BTN_RADIUS,
    marginBottom: spacing.l,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 2,
      },
      android: { elevation: 6 },
      default: {},
    }),
  },
  aiPressable: { width: "100%" },
  aiFace: {
    height: AI_BTN_H,
    backgroundColor: AI_BTN_ORANGE,
    borderRadius: AI_BTN_RADIUS,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  aiFacePressed: { transform: [{ translateY: AI_BTN_DEPTH }] },
  aiLabel: {
    fontFamily: typography.fonts.inter.bold,
    fontSize: typography.sizes.m,
    color: "#fff",
    letterSpacing: 0.3,
  },

  /* ── Social proof banner ────────────────────────────────── */
  proofBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    backgroundColor: "#FFF3CD",
    borderRadius: spacing.xs,
    paddingHorizontal: spacing.s,
    paddingVertical: spacing.xs,
  },
  proofText: {
    fontFamily: typography.fonts.inter.semiBold,
    fontSize: typography.sizes.xs,
    color: "#B8860B",
    flex: 1,
    letterSpacing: 0.2,
  },
});
