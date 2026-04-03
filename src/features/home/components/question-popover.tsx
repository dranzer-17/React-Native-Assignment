import * as Haptics from "expo-haptics";
import { Dimensions, Modal, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import type { Question } from "@/types/mock-data";
import { palette } from "@/theme/colors";
import { typography } from "@/theme/typography";
import { spacing } from "@/theme/spacing";

export interface CardLayout {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface QuestionPopoverProps {
  question: Question | null;
  cardLayout: CardLayout | null;
  onFeedback: () => void;
  onClose: () => void;
}

const SCREEN_W = Dimensions.get("window").width;
const POPOVER_W = Math.min(spacing.popoverMaxWidth, SCREEN_W - spacing.popoverHorizontalInset);
const ARROW_W = spacing.popoverArrowWidth;
const ARROW_H = spacing.popoverArrowHeight;
const BORDER_RADIUS = spacing.cardRadius;
const GAP_FROM_CARD = spacing.popoverGapFromCard;
const POPOVER_ESTIMATED_H = spacing.popoverEstimatedHeight;

/** Per-state colour palette */
const STATE_COLORS = {
  active: {
    bg: palette.homeQuestionActiveLime,
    aiBtn: palette.homeQuestionActiveDeep,
    text: palette.homeQuestionActiveLabel,
  },
  next: {
    bg: palette.homeQuestionNextGold,
    aiBtn: palette.homeQuestionNextDeep,
    text: palette.homeQuestionNextLabel,
  },
  locked: {
    bg: palette.white,
    aiBtn: palette.gray80,
    text: palette.inkMuted,
  },
} as const;

export function QuestionPopover({ question, cardLayout, onFeedback, onClose }: QuestionPopoverProps) {
  if (!question || !cardLayout) return null;

  const state = question.state ?? "locked";
  const stateColors = STATE_COLORS[state];

  // Smart: show ABOVE card if its centre is in the lower half of the screen
  const SCREEN_H = Dimensions.get("window").height;
  const showAbove = (cardLayout.y + cardLayout.height / 2) > SCREEN_H / 2;

  const popoverLeft = (SCREEN_W - POPOVER_W) / 2;

  // Arrow: align horizontally to card centre, clamped inside popover
  const cardCentreX = cardLayout.x + cardLayout.width / 2;
  const arrowOffsetInPop = Math.max(
    BORDER_RADIUS + spacing.xxxs,
    Math.min(
      POPOVER_W - BORDER_RADIUS - ARROW_W - spacing.xxxs,
      cardCentreX - popoverLeft - ARROW_W / 2,
    ),
  );

  const positionStyle = showAbove
    ? { top: cardLayout.y - GAP_FROM_CARD - POPOVER_ESTIMATED_H, left: popoverLeft }
    : { top: cardLayout.y + cardLayout.height + GAP_FROM_CARD, left: popoverLeft };

  return (
    <Modal transparent animationType="none" onRequestClose={onClose}>
      <Animated.View
        entering={FadeIn.duration(200)}
        style={[StyleSheet.absoluteFill, styles.dim]}
      >
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Dismiss question details"
        />
      </Animated.View>

      <Animated.View
        entering={FadeInDown.springify().damping(18).stiffness(220)}
        style={[styles.popover, positionStyle, { backgroundColor: stateColors.bg }]}
      >
        {/* Arrow — DOWN when popover is above card, UP when below */}
        {showAbove ? (
          <View style={[styles.arrowDown, { left: arrowOffsetInPop, borderTopColor: stateColors.bg }]} />
        ) : (
          <View style={[styles.arrowUp, { left: arrowOffsetInPop, borderBottomColor: stateColors.bg }]} />
        )}

        <Text
          style={[styles.questionText, { color: stateColors.text }]}
          accessibilityRole="header"
        >
          {question.text}
        </Text>

        <View style={styles.metaRow}>
          <Text style={[styles.askedBy, { color: stateColors.text, opacity: 0.75 }]}>
            Asked by <Text style={styles.askedByBold}>{question.companyName}</Text>
          </Text>
          <View style={styles.durationRow}>
            <Ionicons name="time-outline" size={typography.sizes.s} color={stateColors.text} style={{ opacity: 0.75 }} />
            <Text style={[styles.durationText, { color: stateColors.text, opacity: 0.75 }]}>
              {question.durationMinutes} mins
            </Text>
          </View>
        </View>

        <Pressable
          style={styles.feedbackBtn}
          onPress={() => {
            void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            onFeedback();
          }}
          accessibilityRole="button"
          accessibilityLabel="Open feedback for this question"
        >
          <Text style={styles.feedbackLabel}>FEEDBACK</Text>
        </Pressable>

        <View style={[styles.aiWrapper, { backgroundColor: stateColors.aiBtn }]}>
          <Pressable
            style={styles.aiFace}
            disabled
            accessibilityRole="button"
            accessibilityState={{ disabled: true }}
            accessibilityLabel="AI versus AI listen, coming soon"
          >
            <Ionicons name="headset" size={spacing.iconMd} color={palette.white} />
            <Text style={styles.aiLabel}>  AI VS AI (LISTEN)</Text>
          </Pressable>
        </View>
      </Animated.View>
    </Modal>
  );
}

const shadow = Platform.select({
  ios: {
    shadowColor: palette.shadow,
    shadowOffset: { width: 0, height: spacing.xs },
    shadowOpacity: 0.18,
    shadowRadius: spacing.m,
  },
  android: { elevation: 12 },
});

const styles = StyleSheet.create({
  dim: {
    backgroundColor: palette.overlayModal,
  },
  popover: {
    position: "absolute",
    width: POPOVER_W,
    borderRadius: BORDER_RADIUS,
    padding: spacing.cardPadding,
    ...shadow,
  },

  /** ↑ Upward caret — popover is BELOW the card */
  arrowUp: {
    position: "absolute",
    top: -ARROW_H,
    width: 0, height: 0,
    borderLeftWidth: ARROW_W / 2, borderRightWidth: ARROW_W / 2,
    borderBottomWidth: ARROW_H,
    borderLeftColor: "transparent", borderRightColor: "transparent",
  },

  /** ↓ Downward caret — popover is ABOVE the card */
  arrowDown: {
    position: "absolute",
    bottom: -ARROW_H,
    width: 0, height: 0,
    borderLeftWidth: ARROW_W / 2, borderRightWidth: ARROW_W / 2,
    borderTopWidth: ARROW_H,
    borderLeftColor: "transparent", borderRightColor: "transparent",
  },

  questionText: {
    fontFamily: typography.fonts.inter.bold,
    fontSize: typography.sizes.popoverTitle,
    lineHeight: typography.lineHeights.popoverQuestion,
    marginBottom: spacing.popoverQuestionMarginBottom,
  },
  metaRow: {
    flexDirection: "row", alignItems: "center",
    justifyContent: "space-between", marginBottom: spacing.popoverMetaMarginBottom,
  },
  askedBy: { fontFamily: typography.fonts.inter.normal, fontSize: typography.sizes.s, flex: 1 },
  askedByBold: { fontFamily: typography.fonts.inter.semiBold },
  durationRow: { flexDirection: "row", alignItems: "center", gap: spacing.tight },
  durationText: { fontFamily: typography.fonts.inter.medium, fontSize: typography.sizes.s },

  feedbackBtn: {
    height: spacing.feedbackButtonHeight,
    borderRadius: spacing.inputRadius,
    backgroundColor: palette.white,
    alignItems: "center", justifyContent: "center", marginBottom: spacing.s,
  },
  feedbackLabel: {
    fontFamily: typography.fonts.inter.bold, fontSize: typography.sizes.m,
    color: palette.feedbackBrand, letterSpacing: typography.letterSpacing.feedbackCta,
  },

  aiWrapper: { borderRadius: spacing.inputRadius, overflow: "hidden" },
  aiFace: {
    height: spacing.feedbackButtonHeight,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  aiLabel: {
    fontFamily: typography.fonts.inter.bold,
    fontSize: typography.sizes.m,
    color: palette.white,
    letterSpacing: typography.letterSpacing.aiListen,
  },
});
