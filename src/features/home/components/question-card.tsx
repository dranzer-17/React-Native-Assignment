import { memo } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import type { ImageSource } from "expo-image";
import type { Question } from "@/types/mock-data";
import { remoteImageWithHeaders } from "@/utils/remote-image";
import { palette } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

export interface QuestionCardProps {
  item: Question;
  index: number;
  onPressCard: (item: Question) => void;
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
};

function getLogoSource(item: Question): ImageSource {
  const local = LOCAL_LOGOS[item.companyId];
  if (local) return local as ImageSource;
  return remoteImageWithHeaders(item.companyLogoUrl);
}

/** Badge colour config per question state */
const BADGE_CFG = {
  active: {
    outerAlt: "#79D634",
    outer: "#79D634",
    inner: "#79D634",
    numColor: "#fff",
    innerRadius: 25.9,
    cardBg: "#D8F7C2",
    innerCardBg: "#D8F7C2",
    shadowColor: "#79D634",
    hasShadow: false,
    logoBorder: "#D8F7C2",
  },
  next: {
    outerAlt: "#FFD033",
    outer: "#FFD033",
    inner: "#FFD033",
    numColor: "#fff",
    innerRadius: 25.9,
    cardBg: "#FFF0BF",
    innerCardBg: "#FFF0BF",
    shadowColor: "transparent",
    hasShadow: false,          // no shadow for Amazon — matches user request
    logoBorder: "#FFF0BF",
  },
  locked: {
    outerAlt: "#d1d1d6",
    outer: "#d1d1d6",
    inner: "#d1d1d6",
    numColor: "#fff",
    innerRadius: 25.9,
    cardBg: "#efeff4",
    innerCardBg: "#efeff4",
    shadowColor: "#efeff4",
    hasShadow: false,
    logoBorder: "#efeff4",
  },
} as const;

/** Figma exact pixel values */
const CARD_W = 206;
const CARD_H = 73;
const BADGE_OVERFLOW_TOP = 9;
const BADGE_LEFT = 124.37;
const BADGE_OUTER = 74;
const BADGE_INNER = 64;
const BADGE_CONTAINER = 90.63;
const ROW_W = Math.ceil(BADGE_LEFT + BADGE_CONTAINER); // ~215pt

/**
 * Figma staircase: left offsets from screen left edge per question index.
 * List has paddingLeft 20; wrapper marginLeft = offset - 20.
 */
const SCREEN_LEFT_OFFSETS = [48.42, 80.42, 120.42, 160.42, 120.42] as const;

function getMarginLeft(index: number): number {
  const offset =
    index < SCREEN_LEFT_OFFSETS.length
      ? SCREEN_LEFT_OFFSETS[index]
      : SCREEN_LEFT_OFFSETS[SCREEN_LEFT_OFFSETS.length - 1];
  return offset - 20;
}

export const QuestionCard = memo(function QuestionCard({
  item,
  index,
  onPressCard,
}: QuestionCardProps) {
  const state = item.state ?? "locked";
  const cfg = BADGE_CFG[state];
  const isActive = state === "active";
  const isNext = state === "next";
  const hasGlass = isActive || isNext;   // both PhonePe and Amazon get the glass effect
  const marginLeft = getMarginLeft(index);

  return (
    <View style={[styles.wrapper, { marginLeft }]}>
      <Pressable
        onPress={() => onPressCard(item)}
        style={({ pressed }) => [pressed && styles.pressed]}
        accessibilityRole="button"
        accessibilityLabel={`Question ${item.questionNumber} ${item.companyName}`}
      >
        <View style={styles.rowContainer}>

          {/* ── Card ─────────────────────────────────────────── */}
          <View
            style={[
              styles.greenCard,
              {
                backgroundColor: cfg.cardBg,
                ...(cfg.hasShadow && Platform.OS === "ios"
                  ? {
                    shadowColor: cfg.shadowColor,
                    shadowOffset: { width: 1, height: 8 },
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
    borderRadius: 30,
    overflow: "visible",
  },
  greenCardDefault: {
    borderWidth: 1,
    borderColor: "#ECECEC",
  },

  /* Inner highlight area (no gold — same green family) */
  innerArea: {
    position: "absolute",
    left: 4,
    top: 5,
    right: 6,          // extends to ~200pt in 206pt card
    bottom: 5,
    borderRadius: 27.8,
    overflow: "hidden",
  },
  /** Glass strip 1 — wide diagonal, clipped by innerArea overflow:hidden */
  shine1: {
    position: "absolute",
    width: 40,
    height: 220,
    left: -20,
    top: -80,
    backgroundColor: "rgba(255,255,255,0.40)",
    transform: [{ rotate: "30deg" }],
  },
  /** Glass strip 2 — spaced 40pt right of strip 1 */
  shine2: {
    position: "absolute",
    width: 22,
    height: 220,
    left: 40,
    top: -80,
    backgroundColor: "rgba(255,255,255,0.40)",
    transform: [{ rotate: "30deg" }],
  },

  /* Company content: text then logo */
  companyContent: {
    position: "absolute",
    left: 20,
    top: 0,
    bottom: 0,
    right: 90,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  companyName: {
    fontFamily: typography.fonts.inter.semiBold,
    fontSize: 14,
    color: "#0B0B0D",
    letterSpacing: -0.14,
    flexShrink: 1,
  },
  companyNameMuted: { color: "#0B0B0D" },

  logoCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#fff",
    borderWidth: 0.7,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  logoImg: { width: 20, height: 20 },

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
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  /** Inner brighter-green layer — same 74×74, clips inner circle */
  badgeOuterInner: {
    width: BADGE_OUTER,
    height: BADGE_OUTER,
    borderRadius: 30,
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
    left: 5,             // Figma: (5,5) offset within 74×74 outer
    top: 5,
    width: BADGE_INNER,
    height: BADGE_INNER,
    overflow: "hidden",
  },
  /** Badge shine 1 — longer, clipped by badgeInner overflow:hidden */
  badgeShine1: {
    position: "absolute",
    width: 18,
    height: 140,
    left: -9.81,
    top: -40,
    backgroundColor: "rgba(255,255,255,0.4)",
    transform: [{ rotate: "30deg" }],
  },
  /** Badge shine 2 — longer, clipped by badgeInner overflow:hidden */
  badgeShine2: {
    position: "absolute",
    width: 18,
    height: 160,
    left: 13.94,
    top: -40,
    backgroundColor: "rgba(255,255,255,0.4)",
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
    fontSize: 36,
    includeFontPadding: false,
  },
  /** Stroke copies */
  badgeNumStroke: {
    color: "rgba(0,0,0,0.6)",
  },
});
