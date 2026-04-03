import { useCallback, useMemo, useState } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { FlashList, type ListRenderItemInfo } from "@shopify/flash-list";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { HomeStackParamList } from "@/navigation/types";
import { useMockInterviewAudio } from "@/features/session-result/hooks/use-mock-interview-audio";
import questionsData from "@/mock-data/questions.json";
import sessionResultData from "@/mock-data/session-result.json";
import type { KeyMoment, Question, SessionResult } from "@/types/mock-data";
import { colors, palette } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

type Props = NativeStackScreenProps<HomeStackParamList, "SessionResult">;

const questions = questionsData as Question[];
const sessionTemplate = sessionResultData as SessionResult;

/** Company logo local assets — mirrors question-card.tsx */
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

const DIAMOND = "✦";

const KM_PLAYER_BG = palette.orange10;
const KM_PROGRESS_TRACK = palette.orange20;
const KM_TIMESTAMP_BLUE = palette.keyMomentBlue;
const KM_SELECTION_BORDER = palette.keyMomentBorder;

function formatMmSs(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function getLogoSource(companyId: string) {
  return LOCAL_LOGOS[companyId] ?? null;
}

type SummaryRow =
  | { kind: "heading"; id: string; title: string }
  | { kind: "bullet"; id: string; text: string }
  | { kind: "divider"; id: string };

function buildSummaryRows(session: SessionResult): SummaryRow[] {
  return [
    { kind: "heading", id: "h-ww", title: "What worked well" },
    ...session.smartSummary.whatWorkedWell.map((text, i) => ({
      kind: "bullet" as const,
      id: `w-${i}`,
      text,
    })),
    { kind: "divider", id: "div-mid" },
    { kind: "heading", id: "h-ot", title: "Overall takeaways" },
    ...session.smartSummary.overallTakeaways.map((text, i) => ({
      kind: "bullet" as const,
      id: `t-${i}`,
      text,
    })),
  ];
}

export function SessionResultScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const { questionId } = route.params;
  const [tab, setTab] = useState<"summary" | "moments">("summary");
  const [selectedMomentIndex, setSelectedMomentIndex] = useState(0);
  const { playing: mockAudioPlaying, toggle: toggleMockInterviewAudio } = useMockInterviewAudio();

  const question = useMemo(
    () => questions.find((q) => q.id === questionId) ?? questions[0],
    [questionId],
  );

  const session = useMemo(
    (): SessionResult => ({
      ...sessionTemplate,
      questionId: question.id,
      questionText: question.text,
      companyName: question.companyName,
    }),
    [question],
  );

  const logoSource = getLogoSource(question.companyId);

  const durationLabel = formatMmSs(session.audioDurationSeconds);
  /** Static mock progress ratio for the bar (0–1) */
  const progressRatio = 0.18;

  const summaryRows = useMemo(() => buildSummaryRows(session), [session]);

  const renderSummaryItem = useCallback(({ item }: ListRenderItemInfo<SummaryRow>) => {
    switch (item.kind) {
      case "heading":
        return <Text style={styles.sectionTitle}>{item.title}</Text>;
      case "bullet":
        return (
          <View style={styles.bulletRow}>
            <Text style={styles.bulletDiamond}>{DIAMOND}</Text>
            <Text style={styles.bulletText}>{item.text}</Text>
          </View>
        );
      case "divider":
        return <View style={styles.sectionDivider} />;
      default:
        return null;
    }
  }, []);

  const momentsListHeader = useMemo(
    () => (
      <View style={styles.momentsListHeader}>
        <View style={styles.playerCard}>
          <Pressable
            style={styles.playBtn}
            onPress={() => {
              void toggleMockInterviewAudio();
            }}
            accessibilityRole="button"
            accessibilityLabel={
              mockAudioPlaying ? "Pause mock interview audio" : "Play mock interview audio"
            }
            accessibilityState={{ busy: mockAudioPlaying }}
          >
            <Ionicons
              name={mockAudioPlaying ? "pause" : "play"}
              size={spacing.iconLg}
              color={colors.primary}
            />
          </Pressable>
          <View style={styles.playerMeta}>
            <Text style={styles.playerTitle}>Mock Interview</Text>
            <View style={styles.progressTrack}>
              <View
                style={[styles.progressFill, { width: `${progressRatio * 100}%` }]}
              />
            </View>
            <View style={styles.timeRow}>
              <Text style={styles.timeLabel}>00:00</Text>
              <Text style={styles.timeLabel}>{durationLabel}</Text>
            </View>
          </View>
        </View>
      </View>
    ),
    [durationLabel, progressRatio, mockAudioPlaying, toggleMockInterviewAudio],
  );

  const renderMomentItem = useCallback(
    ({ item, index }: ListRenderItemInfo<KeyMoment>) => {
      const selected = index === selectedMomentIndex;
      return (
        <Pressable
          onPress={() => setSelectedMomentIndex(index)}
          style={styles.momentRow}
          accessibilityRole="button"
          accessibilityState={{ selected }}
        >
          <View
            style={[
              styles.momentInner,
              selected && styles.momentInnerSelected,
            ]}
          >
            <Text style={styles.momentTime}>{item.timestamp}</Text>
            <Text style={styles.momentText}>{item.description}</Text>
          </View>
        </Pressable>
      );
    },
    [selectedMomentIndex],
  );

  return (
    <View style={styles.root}>
      {/* ── Green top section ─────────────────────────────────── */}
      <View style={[styles.topSection, { paddingTop: insets.top + spacing.s }]}>
        {/* Close button — solid green circle with white X */}
        <Pressable
          style={styles.closeBtn}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Close"
        >
          <Ionicons name="close" size={spacing.iconLg} color={palette.white} />
        </Pressable>

        {/* Avatars from humans.png */}
        <View style={styles.avatarsRow}>
          {/* Left avatar */}
          <View style={styles.avatarCircle}>
            <Image
              // eslint-disable-next-line @typescript-eslint/no-var-requires
              source={require("../../../../assets/humans.png")}
              style={styles.humansImg}
              contentFit="cover"
              cachePolicy="memory-disk"
              accessibilityIgnoresInvertColors
            />
          </View>
          {/* Right avatar — slightly offset */}
          <View style={[styles.avatarCircle, styles.avatarRight]}>
            <Image
              // eslint-disable-next-line @typescript-eslint/no-var-requires
              source={require("../../../../assets/humans.png")}
              style={[styles.humansImg, styles.humansImgRight]}
              contentFit="cover"
              cachePolicy="memory-disk"
              accessibilityIgnoresInvertColors
            />
          </View>
        </View>

        {/* Triangle pointing UP — sits between avatars and card, anchored to card top */}
        <View style={styles.triangleBridge} />

        {/* Question card */}
        <View style={styles.questionCard}>
          <Text style={styles.questionText}>{session.questionText}</Text>
          <View style={styles.companyRow}>
            {logoSource ? (
              <Image
                source={logoSource}
                style={styles.companyLogo}
                contentFit="contain"
                cachePolicy="memory-disk"
                accessibilityIgnoresInvertColors
              />
            ) : (
              <View style={styles.companyLogoFallback} />
            )}
            <Text style={styles.companyLabel}>Asked by {session.companyName}</Text>
          </View>
        </View>
      </View>

      {/* ── White content panel ───────────────────────────────── */}
      <View style={styles.panel}>
        {/* Tabs */}
        <View style={styles.tabs}>
          <Pressable
            style={[styles.tab, tab === "summary" && styles.tabActive]}
            onPress={() => setTab("summary")}
            accessibilityRole="tab"
            accessibilityState={{ selected: tab === "summary" }}
          >
            <Text style={[styles.tabText, tab === "summary" && styles.tabTextActive]}>
              Smart summary
            </Text>
            {tab === "summary" && <View style={styles.tabUnderline} />}
          </Pressable>

          <Pressable
            style={[styles.tab, tab === "moments" && styles.tabActive]}
            onPress={() => setTab("moments")}
            accessibilityRole="tab"
            accessibilityState={{ selected: tab === "moments" }}
          >
            <Text style={[styles.tabText, tab === "moments" && styles.tabTextActive]}>
              Key moments
            </Text>
            {tab === "moments" && <View style={styles.tabUnderline} />}
          </Pressable>
        </View>

        {/* Tab divider */}
        <View style={styles.tabDivider} />

        {/* Content */}
        {tab === "summary" ? (
          <FlashList
            data={summaryRows}
            renderItem={renderSummaryItem}
            keyExtractor={(row) => row.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + spacing.xxxl }]}
          />
        ) : (
          <FlashList
            data={session.keyMoments}
            renderItem={renderMomentItem}
            keyExtractor={(item, index) => `${item.timestamp}-${index}`}
            ListHeaderComponent={momentsListHeader}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.momentsScroll,
              { paddingBottom: insets.bottom + spacing.xxxl },
            ]}
          />
        )}
      </View>
    </View>
  );
}

const shadow = Platform.select({
  ios: {
    shadowColor: palette.shadow,
    shadowOffset: { width: 0, height: -spacing.xxxs },
    shadowOpacity: 0.06,
    shadowRadius: spacing.xs,
  },
  android: { elevation: 6 },
});

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: palette.sessionPageMint },

  /* ── Green top ──────────────────────────────────────────── */
  topSection: {
    backgroundColor: palette.sessionPageMint,
    paddingHorizontal: spacing.screenPadding,
    alignItems: "center",
  },

  closeBtn: {
    alignSelf: "flex-end",
    width: spacing.hitTarget,
    height: spacing.hitTarget,
    borderRadius: spacing.l,
    backgroundColor: palette.sessionCloseMint,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sessionCloseMarginBottom,
  },

  /* Avatars */
  avatarsRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: spacing.sessionAvatarsMarginBottom,
  },
  avatarCircle: {
    width: spacing.sessionAvatar,
    height: spacing.sessionAvatar,
    borderRadius: spacing.sessionAvatar / 2,
    backgroundColor: palette.sessionAvatarMint,
    overflow: "hidden",
    borderWidth: spacing.sessionAvatarBorderWidth,
    borderColor: palette.white,
  },
  avatarRight: {
    marginLeft: -spacing.sessionAvatarOverlap,
    zIndex: 0,
  },
  humansImg: {
    width: spacing.sessionHumansWidth,
    height: spacing.sessionHumansHeight,
    // show left half (male avatar)
    left: 0,
  },
  humansImgRight: {
    // show right half (female avatar)
    left: -spacing.sessionHumansHeight,
  },

  /* Question card */
  questionCard: {
    width: "100%",
    backgroundColor: palette.sessionCardGreen,
    borderRadius: spacing.l,
    padding: spacing.sessionQuestionCardPadding,
    marginBottom: spacing.sessionQuestionCardMarginBottom,
  },
  questionText: {
    fontFamily: typography.fonts.manrope.bold,
    fontSize: typography.sizes.body,
    color: palette.white,
    lineHeight: typography.lineHeights.sessionQuestion,
    textAlign: "center",
    marginBottom: spacing.sessionQuestionTextMarginBottom,
  },
  companyRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
  },
  companyLogo: {
    width: spacing.questionCompanyIcon,
    height: spacing.questionCompanyIcon,
    borderRadius: spacing.questionCompanyIcon / 2,
    backgroundColor: palette.white,
  },
  companyLogoFallback: {
    width: spacing.questionCompanyIcon,
    height: spacing.questionCompanyIcon,
    borderRadius: spacing.questionCompanyIcon / 2,
    backgroundColor: palette.whiteAlpha40,
  },
  companyLabel: {
    fontFamily: typography.fonts.inter.medium,
    fontSize: typography.sizes.body,
    color: palette.whiteAlpha90,
  },

  /** Triangle pointing UP — anchored between avatars and top of question card */
  triangleBridge: {
    width: 0,
    height: 0,
    borderLeftWidth: spacing.sessionTriangleSize,
    borderRightWidth: spacing.sessionTriangleSize,
    borderBottomWidth: spacing.sessionTriangleSize,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: palette.sessionBridgeGreen,
    alignSelf: "center",
    marginBottom: -spacing.sessionTriangleOverlap,
  },

  /* ── White panel ────────────────────────────────────────── */
  panel: {
    flex: 1,
    backgroundColor: palette.white,
    borderTopLeftRadius: spacing.sessionPanelRadius,
    borderTopRightRadius: spacing.sessionPanelRadius,
    paddingTop: spacing.xs,
    marginTop: -spacing.sessionPanelPullUp,
    ...shadow,
  },

  /* Tabs */
  tabs: {
    flexDirection: "row",
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.s,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingBottom: spacing.bulletGap,
    position: "relative",
  },
  tabActive: {},
  tabText: {
    fontFamily: typography.fonts.inter.medium,
    fontSize: typography.sizes.m,
    color: palette.gray50,
  },
  tabTextActive: {
    fontFamily: typography.fonts.inter.semiBold,
    color: palette.ink,
  },
  tabUnderline: {
    position: "absolute",
    bottom: 0,
    left: "10%",
    right: "10%",
    height: spacing.xxxs,
    borderRadius: spacing.xxxs / 2,
    backgroundColor: palette.ink,
  },
  tabDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: palette.gray20,
    marginHorizontal: spacing.screenPadding,
    marginBottom: spacing.m,
  },

  /* Summary */
  scrollContent: {
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.xxs,
  },
  sectionTitle: {
    fontFamily: typography.fonts.inter.semiBold,
    fontSize: typography.sizes.section,
    color: palette.ink,
    marginBottom: spacing.s,
  },
  sectionDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: palette.gray20,
    marginVertical: spacing.l,
  },
  bulletRow: {
    flexDirection: "row",
    gap: spacing.bulletGap,
    marginBottom: spacing.popoverMetaMarginBottom,
    alignItems: "flex-start",
  },
  bulletDiamond: {
    fontSize: typography.sizes.xs,
    color: palette.ink,
    marginTop: spacing.xxs,
  },
  bulletText: {
    flex: 1,
    fontFamily: typography.fonts.inter.normal,
    fontSize: typography.sizes.m,
    color: palette.ink,
    lineHeight: typography.lineHeights.relaxed,
  },

  /* Key moments tab */
  momentsScroll: {
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.xs,
  },
  momentsListHeader: {
    paddingBottom: 0,
  },
  playerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: KM_PLAYER_BG,
    borderRadius: spacing.cardRadius,
    padding: spacing.m,
    gap: spacing.m,
    marginBottom: spacing.m,
  },
  playBtn: {
    width: spacing.playButton,
    height: spacing.playButton,
    borderRadius: spacing.playButton / 2,
    backgroundColor: palette.white,
    alignItems: "center",
    justifyContent: "center",
  },
  playerMeta: { flex: 1, minWidth: 0 },
  playerTitle: {
    fontFamily: typography.fonts.manrope.bold,
    fontSize: typography.sizes.m,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  progressTrack: {
    height: spacing.sessionProgressHeight,
    borderRadius: spacing.sessionProgressHeight / 2,
    backgroundColor: KM_PROGRESS_TRACK,
    overflow: "hidden",
    marginBottom: spacing.xxs,
  },
  progressFill: {
    height: "100%",
    borderRadius: spacing.sessionProgressHeight / 2,
    backgroundColor: colors.primary,
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  timeLabel: {
    fontFamily: typography.fonts.manrope.medium,
    fontSize: 11,
    color: palette.gray60,
  },
  momentRow: {
    paddingVertical: spacing.m,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: palette.gray20,
  },
  momentInner: {
    paddingHorizontal: spacing.xxs,
  },
  momentInnerSelected: {
    borderWidth: spacing.hairline,
    borderColor: KM_SELECTION_BORDER,
    borderStyle: "dashed",
    borderRadius: spacing.xs,
    paddingHorizontal: spacing.s,
    paddingVertical: spacing.xs,
  },
  momentTime: {
    fontFamily: typography.fonts.manrope.semiBold,
    fontSize: typography.sizes.s,
    color: KM_TIMESTAMP_BLUE,
    marginBottom: spacing.xxs,
  },
  momentText: {
    fontFamily: typography.fonts.manrope.regular,
    fontSize: typography.sizes.m,
    color: palette.ink,
    lineHeight: typography.lineHeights.relaxed,
  },
});
