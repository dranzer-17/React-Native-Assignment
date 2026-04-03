/**
 * Spacing Scale
 *
 * Use named tokens instead of magic numbers for all margin/padding/gap values.
 */

export const spacing = {
  xxxs: 2,
  xxs: 4,
  xs: 8,
  s: 12,
  m: 16,
  l: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
  giga: 64,

  // Semantic
  screenPadding: 20,
  cardPadding: 16,
  cardRadius: 16,
  buttonRadius: 24,
  inputRadius: 12,
  avatarSize: 56,

  /** Hairline borders / separators */
  hairline: 1,
  /** Social proof dashed rule */
  dashedRuleWidth: 1.5,

  /** Micro gaps (badges, tight rows) */
  micro: 4,
  /** Extra-tight gap (e.g. icon + label) */
  tight: 3,
  /** Tab / pill internal spacing */
  tabGap: 8,
  /** List bullet row gap */
  bulletGap: 10,

  /** Touch targets & chrome */
  hitTarget: 40,
  closeButton: 40,
  playButton: 48,
  feedbackButtonHeight: 48,
  otpInputHeight: 52,
  sheetHandleWidth: 40,
  sheetHandleHeight: 4,

  /** Home — question card (Figma) */
  questionCardWidth: 206,
  questionCardHeight: 73,
  questionLogoSize: 20,
  questionCompanyIcon: 22,
  questionBadgeOverflowTop: 9,

  /** Tab bar (custom pill) */
  tabPillWidth: 172,
  tabPillHeight: 68,
  tabStoreCircle: 68,
  tabFeatherIcon: 22,
  tabLabelGap: 2,

  /** Session result */
  sessionAvatar: 100,
  sessionHumansWidth: 200,
  sessionHumansHeight: 100,
  sessionProgressHeight: 6,
  sessionPanelRadius: 28,
  /** Half of sessionPanelRadius — panel overlaps green hero */
  sessionPanelPullUp: 14,

  /** Welcome hero */
  welcomeHero: 310,

  /** Misc layout */
  iconSm: 14,
  iconMd: 18,
  iconLg: 22,
  practiceEmoji: 22,
  countryFlag: 22,
  iconXl: 20,

  /** Home list clears custom tab bar */
  homeListContentBottomInset: 148,
  homeListHeaderMarginBottom: 7,
  notifBadgeMinHeight: 36,
  /** notification pill vertical padding: xs + hairline */
  xsPlus1: 9,

  /** Auth marketing CTA (welcome + login) */
  authCtaFaceHeight: 58,
  authCtaDepth: 8,
  authDividerHeight: 28,
  loginBackIcon: 28,
  /** OTP / phone row focused border */
  inputBorderAccent: 1.5,

  /** Store tab bag icon */
  tabStoreBagIcon: 26,
  tabStoreShineHeight: 120,
  tabStoreShine2Width: 10,
  tabStoreShine2Left: 22,
  tabStoreShineTop: -30,

  /** Question card — Figma geometry */
  questionBadgeLeft: 124.37,
  questionBadgeOuter: 74,
  questionBadgeInner: 64,
  /** Offset of inner disc within 74×74 outer (Figma 5,5) */
  questionBadgeInnerGutter: 5,
  questionBadgeContainer: 90.63,
  questionBadgeInnerRadius: 25.9,
  questionCardBorderRadiusLarge: 30,
  questionInnerInsetLeft: 4,
  questionInnerInsetTop: 5,
  questionInnerInsetRight: 6,
  questionInnerInsetBottom: 5,
  questionInnerAreaRadius: 27.8,
  questionCompanyRowLeft: 20,
  questionCompanyRowRight: 90,
  questionLogoBorderWidth: 0.7,
  questionCardShine1Width: 40,
  questionCardShine1Height: 220,
  questionCardShine2Width: 22,
  questionCardShineTop: -80,
  questionCardShine1Left: -20,
  questionCardShine2Left: 40,
  questionBadgeShineWidth: 18,
  questionBadgeShine1Height: 140,
  questionBadgeShine2Height: 160,
  questionBadgeShine1Left: -9.81,
  questionBadgeShine2Left: 13.94,
  questionBadgeShineTop: -40,

  /** Popover layout */
  popoverMaxWidth: 345,
  popoverHorizontalInset: 32,
  popoverArrowWidth: 24,
  popoverArrowHeight: 10,
  popoverGapFromCard: 40,
  popoverEstimatedHeight: 205,
  popoverQuestionMarginBottom: 10,
  popoverMetaMarginBottom: 14,

  /** Session result */
  sessionQuestionCardMarginBottom: 30,
  sessionQuestionCardPadding: 20,
  sessionQuestionTextMarginBottom: 12,
  sessionAvatarOverlap: 24,
  sessionTriangleOverlap: 3,
  sessionTriangleSize: 16,
  sessionAvatarBorderWidth: 3,
  sessionCloseMarginBottom: 20,
  sessionAvatarsMarginBottom: 16,
} as const;

/** Figma staircase: left offsets from screen left edge per question index (list padding 20). */
export const homeQuestionCardScreenLeftOffsets = [48.42, 80.42, 120.42, 160.42, 120.42] as const;

export type Spacing = typeof spacing;
