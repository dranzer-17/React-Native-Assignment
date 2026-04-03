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

// ── Design tokens ────────────────────────────────────────────────
const GREEN_BG = "#DAF2E6";   // top section / question card
const GREEN_DARK = "#1A8F50";   // question card gradient edge
const PANEL_RADIUS = 28;
const DIAMOND = "✦";         // bullet icon matching Figma

/** Key moments tab — design tokens (Figma-style) */
const KM_PLAYER_BG = palette.orange10;
const KM_PROGRESS_TRACK = palette.orange20;
const KM_TIMESTAMP_BLUE = "#2563EB";
const KM_SELECTION_BORDER = "#93C5FD";

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
            accessibilityRole="button"
            accessibilityLabel="Play mock interview"
          >
            <Ionicons name="play" size={22} color={colors.primary} />
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
    [durationLabel, progressRatio],
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
      <View style={[styles.topSection, { paddingTop: insets.top + 12 }]}>
        {/* Close button — solid green circle with white X */}
        <Pressable
          style={styles.closeBtn}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Close"
        >
          <Ionicons name="close" size={22} color="#fff" />
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
            contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
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
              { paddingBottom: insets.bottom + 40 },
            ]}
          />
        )}
      </View>
    </View>
  );
}

const shadow = Platform.select({
  ios: { shadowColor: "#000", shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.06, shadowRadius: 8 },
  android: { elevation: 6 },
});

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: GREEN_BG },

  /* ── Green top ──────────────────────────────────────────── */
  topSection: {
    backgroundColor: GREEN_BG,
    paddingHorizontal: spacing.screenPadding,
    alignItems: "center",
  },

  closeBtn: {
    alignSelf: "flex-end",
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#2DB56B",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },

  /* Avatars */
  avatarsRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#D4F4E1",
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "#fff",
  },
  avatarRight: {
    marginLeft: -24,
    zIndex: 0,
  },
  humansImg: {
    width: 200,
    height: 100,
    // show left half (male avatar)
    left: 0,
  },
  humansImgRight: {
    // show right half (female avatar)
    left: -100,
  },

  /* Question card */
  questionCard: {
    width: "100%",
    backgroundColor: "#13BF69",
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
  },
  questionText: {
    fontFamily: typography.fonts.manrope.bold,
    fontSize: 14,
    color: "#fff",
    lineHeight: 26,
    textAlign: "center",
    marginBottom: 12,
  },
  companyRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  companyLogo: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#fff",
  },
  companyLogoFallback: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "rgba(255,255,255,0.4)",
  },
  companyLabel: {
    fontFamily: typography.fonts.inter.medium,
    fontSize: 14,
    color: "rgba(255,255,255,0.90)",
  },

  /** Triangle pointing UP — anchored between avatars and top of question card */
  triangleBridge: {
    width: 0,
    height: 0,
    borderLeftWidth: 16,
    borderRightWidth: 16,
    borderBottomWidth: 16,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#13BF69",
    alignSelf: "center",
    marginBottom: -3, // tuck flush into the card top
  },

  /* ── White panel ────────────────────────────────────────── */
  panel: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: PANEL_RADIUS,
    borderTopRightRadius: PANEL_RADIUS,
    paddingTop: 8,
    marginTop: -PANEL_RADIUS / 2,
    ...shadow,
  },

  /* Tabs */
  tabs: {
    flexDirection: "row",
    paddingHorizontal: spacing.screenPadding,
    paddingTop: 12,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingBottom: 10,
    position: "relative",
  },
  tabActive: {},
  tabText: {
    fontFamily: typography.fonts.inter.medium,
    fontSize: 15,
    color: palette.gray50,
  },
  tabTextActive: {
    fontFamily: typography.fonts.inter.semiBold,
    color: "#0B0B0D",
  },
  tabUnderline: {
    position: "absolute",
    bottom: 0,
    left: "10%",
    right: "10%",
    height: 2,
    borderRadius: 1,
    backgroundColor: "#0B0B0D",
  },
  tabDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: palette.gray20,
    marginHorizontal: spacing.screenPadding,
    marginBottom: 16,
  },

  /* Summary */
  scrollContent: {
    paddingHorizontal: spacing.screenPadding,
    paddingTop: 4,
  },
  sectionTitle: {
    fontFamily: typography.fonts.inter.semiBold,
    fontSize: 16,
    color: "#0B0B0D",
    marginBottom: 12,
  },
  sectionDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: palette.gray20,
    marginVertical: 20,
  },
  bulletRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
    alignItems: "flex-start",
  },
  bulletDiamond: {
    fontSize: 11,
    color: "#0B0B0D",
    marginTop: 4,
  },
  bulletText: {
    flex: 1,
    fontFamily: typography.fonts.inter.normal,
    fontSize: 15,
    color: "#0B0B0D",
    lineHeight: 22,
  },

  /* Key moments tab */
  momentsScroll: {
    paddingHorizontal: spacing.screenPadding,
    paddingTop: 8,
  },
  momentsListHeader: {
    paddingBottom: 0,
  },
  playerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: KM_PLAYER_BG,
    borderRadius: 16,
    padding: spacing.m,
    gap: spacing.m,
    marginBottom: spacing.m,
  },
  playBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: palette.white,
    alignItems: "center",
    justifyContent: "center",
  },
  playerMeta: { flex: 1, minWidth: 0 },
  playerTitle: {
    fontFamily: typography.fonts.manrope.bold,
    fontSize: 15,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: KM_PROGRESS_TRACK,
    overflow: "hidden",
    marginBottom: spacing.xxs,
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
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
    borderWidth: 1,
    borderColor: KM_SELECTION_BORDER,
    borderStyle: "dashed",
    borderRadius: 8,
    paddingHorizontal: spacing.s,
    paddingVertical: spacing.xs,
  },
  momentTime: {
    fontFamily: typography.fonts.manrope.semiBold,
    fontSize: 13,
    color: KM_TIMESTAMP_BLUE,
    marginBottom: 4,
  },
  momentText: {
    fontFamily: typography.fonts.manrope.regular,
    fontSize: 15,
    color: "#0B0B0D",
    lineHeight: 22,
  },
});
