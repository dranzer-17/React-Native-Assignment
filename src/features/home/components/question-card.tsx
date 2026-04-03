import { memo, useRef } from "react";
import * as Haptics from "expo-haptics";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import type { ImageSource } from "expo-image";
import type { Question } from "@/types/mock-data";
import { remoteImageWithHeaders } from "@/utils/remote-image";
import { palette } from "@/theme/colors";
import { homeQuestionCardScreenLeftOffsets, spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";
import type { CardLayout } from "@/features/home/components/question-popover";

export interface QuestionCardProps {
  item: Question;
  index: number;
  onPressCard: (item: Question, layout: CardLayout) => void;
}

/**
 * Figma "Button w company" layout (screen width 393px):
 *   Left offset:  48px from screen left (list paddingLeft 20 + wrapper marginLeft 28)
 *   Card width:   206px FIXED (not full-width!)
 *   Badge left:   124.37px from card left
 *   Badge size:   90.63×90.63, extends 9pt ABOVE and ~9pt RIGHT of card
 */

/** Local logo assets by companyId — used instead of remote URL */
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

/** Badge colour config per question state */
const BADGE_CFG = {
  active: {
    outerAlt: palette.homeQuestionActiveLime,
    outer: palette.homeQuestionActiveLime,
    inner: palette.homeQuestionActiveLime,
    numColor: palette.white,
    innerRadius: spacing.questionBadgeInnerRadius,
    cardBg: palette.homeQuestionActiveMint,
    innerCardBg: palette.homeQuestionActiveMint,
    shadowColor: palette.homeQuestionActiveLime,
    hasShadow: false,
    logoBorder: palette.homeQuestionActiveMint,
  },
  next: {
    outerAlt: palette.homeQuestionNextGold,
    outer: palette.homeQuestionNextGold,
    inner: palette.homeQuestionNextGold,
    numColor: palette.white,
    innerRadius: spacing.questionBadgeInnerRadius,
    cardBg: palette.homeQuestionNextCream,
    innerCardBg: palette.homeQuestionNextCream,
    shadowColor: palette.transparent,
    hasShadow: false,
    logoBorder: palette.homeQuestionNextCream,
  },
  locked: {
    outerAlt: palette.homeQuestionLockedRing,
    outer: palette.homeQuestionLockedRing,
    inner: palette.homeQuestionLockedRing,
    numColor: palette.white,
    innerRadius: spacing.questionBadgeInnerRadius,
    cardBg: palette.homeQuestionLockedCard,
    innerCardBg: palette.homeQuestionLockedCard,
    shadowColor: palette.homeQuestionLockedCard,
    hasShadow: false,
    logoBorder: palette.homeQuestionLockedCard,
  },
} as const;

const CARD_W = spacing.questionCardWidth;
const CARD_H = spacing.questionCardHeight;
const BADGE_OVERFLOW_TOP = spacing.questionBadgeOverflowTop;
const BADGE_LEFT = spacing.questionBadgeLeft;
const BADGE_OUTER = spacing.questionBadgeOuter;
const BADGE_INNER = spacing.questionBadgeInner;
const BADGE_CONTAINER = spacing.questionBadgeContainer;
const ROW_W = Math.ceil(BADGE_LEFT + BADGE_CONTAINER);

function getMarginLeft(index: number): number {
  const offset =
    index < homeQuestionCardScreenLeftOffsets.length
      ? homeQuestionCardScreenLeftOffsets[index]
      : homeQuestionCardScreenLeftOffsets[homeQuestionCardScreenLeftOffsets.length - 1];
  return offset - spacing.screenPadding;
}

export const QuestionCard = memo(function QuestionCard({
  item,
  index,
  onPressCard,
}: QuestionCardProps) {
  const cardRef = useRef<View>(null);
  const state = item.state ?? "locked";
  const cfg = BADGE_CFG[state];
  const isActive = state === "active";
  const isNext = state === "next";
  const hasGlass = isActive || isNext;
  const marginLeft = getMarginLeft(index);

  function handlePress() {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    cardRef.current?.measureInWindow((x, y, width, height) => {
      onPressCard(item, { x, y, width, height });
    });
  }

  return (
    <View style={[styles.wrapper, { marginLeft }]}>
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [pressed && styles.pressed]}
        accessibilityRole="button"
        accessibilityLabel={`Question ${item.questionNumber} ${item.companyName}`}
      >
        <View style={styles.rowContainer}>

          {/* ── Card ─────────────────────────────────────────── */}
          <View
            ref={cardRef}
            collapsable={false}
            style={[
              styles.greenCard,
              {
                backgroundColor: cfg.cardBg,
                ...(cfg.hasShadow && Platform.OS === "ios"
                  ? {
                    shadowColor: cfg.shadowColor,
                    shadowOffset: { width: spacing.hairline, height: spacing.xs },
                    shadowOpacity: 1 as const,
                    shadowRadius: 0,
                  }
                  : {}),
                ...(Platform.OS === "android"
                  ? { elevation: cfg.hasShadow ? 4 : 0 }
                  : {}),
              },
              !hasGlass && styles.greenCardDefault,
            ]}
          >
            {/* Inner highlighted area + glass shine strips (active + next) */}
            {hasGlass ? (
              <View style={[styles.innerArea, { backgroundColor: cfg.innerCardBg }]}>
                <View style={styles.shine1} />
                <View style={styles.shine2} />
              </View>
            ) : null}

            {/* Text then logo (Figma order: 0 = text, 1 = logo) */}
            <View style={styles.companyContent}>
              <Text
                style={[styles.companyName, !hasGlass && styles.companyNameMuted]}
                numberOfLines={1}
              >
                {item.companyName}
              </Text>
              <View style={[styles.logoCircle, { borderColor: cfg.logoBorder }]}>
                <Image
                  source={getLogoSource(item)}
                  style={styles.logoImg}
                  contentFit="contain"
                  cachePolicy="memory-disk"
                  accessibilityIgnoresInvertColors
                />
              </View>
            </View>
          </View>

          {/* ── Badge ────────────────────────────────────────── */}
          <View style={styles.badgeContainer}>
            {/* Outer ring */}
            <View
              style={[styles.badgeOuter, { backgroundColor: cfg.outerAlt }]}
            >
              {/* Brighter inner layer */}
              <View
                style={[styles.badgeOuterInner, { backgroundColor: cfg.outer }]}
              >
                {/* Centre circle at (5,5) — Figma exact — overflow:hidden clips shine */}
                <View
                  style={[
                    styles.badgeInner,
                    { backgroundColor: cfg.inner, borderRadius: cfg.innerRadius },
                  ]}
                >
                  {hasGlass ? (
                    <>
                      <View style={styles.badgeShine1} />
                      <View style={styles.badgeShine2} />
                    </>
                  ) : null}
                </View>
                {/* Stroke: 8 offset copies behind the main number */}
                {([-2, 0, 2] as const).flatMap((dx) =>
                  ([-2, 0, 2] as const)
                    .filter((dy) => dx !== 0 || dy !== 0)
                    .map((dy) => (
                      <Text
                        key={`s${dx},${dy}`}
                        style={[styles.badgeNum, styles.badgeNumStroke, { left: dx, top: dy }]}
                        aria-hidden
                      >
                        {item.questionNumber}
                      </Text>
                    ))
                )}
                {/* Main number */}
                <Text style={[styles.badgeNum, { color: cfg.numColor }]}>
                  {item.questionNumber}
                </Text>
              </View>
            </View>
          </View>

        </View>
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: { marginBottom: spacing.s },
  pressed: { opacity: 0.96 },

  rowContainer: {
    width: ROW_W,
    height: CARD_H + BADGE_OVERFLOW_TOP,
    position: "relative",
    overflow: "visible",
  },

  /* ── Card ───────────────────────────────────────────────── */
  greenCard: {
    position: "absolute",
    left: 0,
    width: CARD_W,
    top: BADGE_OVERFLOW_TOP,
    height: CARD_H,
    borderRadius: spacing.questionCardBorderRadiusLarge,
    overflow: "visible",
  },
  greenCardDefault: {
    borderWidth: spacing.hairline,
    borderColor: palette.homeCompanyRule,
  },

  /* Inner highlight area (no gold — same green family) */
  innerArea: {
    position: "absolute",
    left: spacing.questionInnerInsetLeft,
    top: spacing.questionInnerInsetTop,
    right: spacing.questionInnerInsetRight,
    bottom: spacing.questionInnerInsetBottom,
    borderRadius: spacing.questionInnerAreaRadius,
    overflow: "hidden",
  },
  /** Glass strip 1 — wide diagonal, clipped by innerArea overflow:hidden */
  shine1: {
    position: "absolute",
    width: spacing.questionCardShine1Width,
    height: spacing.questionCardShine1Height,
    left: spacing.questionCardShine1Left,
    top: spacing.questionCardShineTop,
    backgroundColor: palette.whiteAlpha40,
    transform: [{ rotate: "30deg" }],
  },
  /** Glass strip 2 — spaced 40pt right of strip 1 */
  shine2: {
    position: "absolute",
    width: spacing.questionCardShine2Width,
    height: spacing.questionCardShine1Height,
    left: spacing.questionCardShine2Left,
    top: spacing.questionCardShineTop,
    backgroundColor: palette.whiteAlpha40,
    transform: [{ rotate: "30deg" }],
  },

  /* Company content: text then logo */
  companyContent: {
    position: "absolute",
    left: spacing.questionCompanyRowLeft,
    top: 0,
    bottom: 0,
    right: spacing.questionCompanyRowRight,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.micro,
  },
  companyName: {
    fontFamily: typography.fonts.inter.semiBold,
    fontSize: typography.sizes.body,
    color: palette.ink,
    letterSpacing: typography.letterSpacing.companyNameTight,
    flexShrink: 1,
  },
  companyNameMuted: { color: palette.ink },

  logoCircle: {
    width: spacing.questionCompanyIcon,
    height: spacing.questionCompanyIcon,
    borderRadius: spacing.questionCompanyIcon / 2,
    backgroundColor: palette.white,
    borderWidth: spacing.questionLogoBorderWidth,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  logoImg: { width: spacing.questionLogoSize, height: spacing.questionLogoSize },

  /* ── Badge ────────────────────────────────────────────────── */
  badgeContainer: {
    position: "absolute",
    left: BADGE_LEFT,
    top: 0,
    width: BADGE_CONTAINER,
    height: BADGE_CONTAINER,
    alignItems: "center",
    justifyContent: "center",
  },
  /** Outer ring: 74×74, radius 30, lighter green */
  badgeOuter: {
    position: "absolute",
    width: BADGE_OUTER,
    height: BADGE_OUTER,
    borderRadius: spacing.questionCardBorderRadiusLarge,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  /** Inner brighter-green layer — same 74×74, clips inner circle */
  badgeOuterInner: {
    width: BADGE_OUTER,
    height: BADGE_OUTER,
    borderRadius: spacing.questionCardBorderRadiusLarge,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  /**
   * Centre circle: 64×64 at (5,5) — Figma exact position.
   * overflow: hidden clips the shine rects inside.
   */
  badgeInner: {
    position: "absolute",
    left: spacing.questionBadgeInnerGutter,
    top: spacing.questionBadgeInnerGutter,
    width: BADGE_INNER,
    height: BADGE_INNER,
    overflow: "hidden",
  },
  /** Badge shine 1 — longer, clipped by badgeInner overflow:hidden */
  badgeShine1: {
    position: "absolute",
    width: spacing.questionBadgeShineWidth,
    height: spacing.questionBadgeShine1Height,
    left: spacing.questionBadgeShine1Left,
    top: spacing.questionBadgeShineTop,
    backgroundColor: palette.whiteAlpha40,
    transform: [{ rotate: "30deg" }],
  },
  /** Badge shine 2 — longer, clipped by badgeInner overflow:hidden */
  badgeShine2: {
    position: "absolute",
    width: spacing.questionBadgeShineWidth,
    height: spacing.questionBadgeShine2Height,
    left: spacing.questionBadgeShine2Left,
    top: spacing.questionBadgeShineTop,
    backgroundColor: palette.whiteAlpha40,
    transform: [{ rotate: "30deg" }],
  },
  /** Number: centered over full 74×74 badge */
  badgeNum: {
    position: "absolute",
    width: BADGE_OUTER,
    height: BADGE_OUTER,
    left: 0,
    top: 0,
    textAlign: "center",
    textAlignVertical: "center",
    fontFamily: typography.fonts.inter.bold,
    fontSize: typography.sizes.badgeNumber,
    includeFontPadding: false,
  },
  /** Stroke copies */
  badgeNumStroke: {
    color: palette.blackAlpha60,
  },
});
