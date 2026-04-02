import { useCallback, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { HomeStackParamList } from "@/navigation/types";
import { remoteImageWithHeaders } from "@/utils/remote-image";
import questionsData from "@/mock-data/questions.json";
import sessionResultData from "@/mock-data/session-result.json";
import type { KeyMoment, Question, SessionResult } from "@/types/mock-data";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

type Props = NativeStackScreenProps<HomeStackParamList, "SessionResult">;

const questions = questionsData as Question[];
const sessionTemplate = sessionResultData as SessionResult;

function formatDuration(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function SessionResultScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const { questionId } = route.params;
  const [tab, setTab] = useState<"summary" | "moments">("summary");

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
    [question, sessionTemplate],
  );

  const renderMoment = useCallback(({ item }: { item: KeyMoment }) => {
    const isPositive = item.type === "positive";
    return (
      <View style={styles.momentRow}>
        <Text style={[styles.timestamp, isPositive ? styles.tsPos : styles.tsNeg]}>
          {item.timestamp}
        </Text>
        <Text style={styles.momentText}>{item.description}</Text>
      </View>
    );
  }, []);

  const durationLabel = formatDuration(session.audioDurationSeconds);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.topBar}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close"
          onPress={() => navigation.goBack()}
          hitSlop={12}
        >
          <Ionicons name="close" size={28} color={colors.textPrimary} />
        </Pressable>
      </View>
      <View style={styles.avatarsRow}>
        <Image
          source={remoteImageWithHeaders("https://i.pravatar.cc/120?img=12")}
          style={styles.avatar}
          cachePolicy="memory-disk"
          accessibilityIgnoresInvertColors
        />
        <Image
          source={remoteImageWithHeaders("https://i.pravatar.cc/120?img=33")}
          style={[styles.avatar, styles.avatarSecond]}
          cachePolicy="memory-disk"
          accessibilityIgnoresInvertColors
        />
        <View style={styles.checkWrap}>
          <Ionicons name="checkmark-circle" size={28} color={colors.success} />
        </View>
      </View>
      <View style={styles.questionCard}>
        <Text style={styles.questionText}>{session.questionText}</Text>
        <View style={styles.companyRow}>
          <Image
            source={remoteImageWithHeaders(question.companyLogoUrl)}
            style={styles.companyLogo}
            contentFit="contain"
            cachePolicy="memory-disk"
            accessibilityIgnoresInvertColors
          />
          <Text style={styles.companyLabel}>{session.companyName}</Text>
        </View>
      </View>
      <View style={styles.tabs}>
        <Pressable
          onPress={() => setTab("summary")}
          style={[styles.tab, tab === "summary" && styles.tabActive]}
          accessibilityRole="tab"
          accessibilityState={{ selected: tab === "summary" }}
        >
          <Text style={[styles.tabText, tab === "summary" && styles.tabTextActive]}>
            Smart Summary
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setTab("moments")}
          style={[styles.tab, tab === "moments" && styles.tabActive]}
          accessibilityRole="tab"
          accessibilityState={{ selected: tab === "moments" }}
        >
          <Text style={[styles.tabText, tab === "moments" && styles.tabTextActive]}>
            Key Moments
          </Text>
        </Pressable>
      </View>
      {tab === "summary" ? (
        <ScrollView
          style={styles.summaryScrollView}
          contentContainerStyle={styles.summaryScroll}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.sectionTitle}>What worked well</Text>
          {session.smartSummary.whatWorkedWell.map((line, i) => (
            <View key={i} style={styles.bulletRow}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>{line}</Text>
            </View>
          ))}
          <Text style={[styles.sectionTitle, styles.sectionSpaced]}>Overall takeaways</Text>
          {session.smartSummary.overallTakeaways.map((line, i) => (
            <View key={i} style={styles.bulletRow}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>{line}</Text>
            </View>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.tabBody}>
          <View style={styles.player}>
            <Ionicons name="play-circle" size={40} color={colors.primary} />
            <View style={styles.wave}>
              <View style={[styles.waveBar, { height: 12 }]} />
              <View style={[styles.waveBar, { height: 20 }]} />
              <View style={[styles.waveBar, { height: 8 }]} />
              <View style={[styles.waveBar, { height: 24 }]} />
              <View style={[styles.waveBar, { height: 14 }]} />
            </View>
            <Text style={styles.durationText}>{durationLabel}</Text>
          </View>
          <FlashList
            style={styles.momentsList}
            data={session.keyMoments}
            renderItem={renderMoment}
            keyExtractor={(item, index) => `${item.timestamp}-${index}`}
            contentContainerStyle={{ paddingBottom: insets.bottom + spacing.xl }}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.backgroundFeedback,
    paddingHorizontal: spacing.screenPadding,
  },
  topBar: {
    alignItems: "flex-end",
    marginBottom: spacing.s,
  },
  avatarsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.m,
    position: "relative",
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 3,
    borderColor: colors.background,
  },
  avatarSecond: {
    marginLeft: -spacing.m,
  },
  checkWrap: {
    position: "absolute",
    right: "24%",
    bottom: -4,
    backgroundColor: colors.background,
    borderRadius: 16,
  },
  questionCard: {
    backgroundColor: colors.successLight,
    borderRadius: spacing.cardRadius,
    borderWidth: 1,
    borderColor: colors.success,
    padding: spacing.cardPadding,
    marginBottom: spacing.l,
  },
  questionText: {
    fontFamily: typography.fonts.inter.semiBold,
    fontSize: typography.sizes.m,
    color: colors.textPrimary,
    lineHeight: 22,
    marginBottom: spacing.s,
  },
  companyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.s,
  },
  companyLogo: {
    width: 24,
    height: 24,
    borderRadius: spacing.xxs,
    backgroundColor: colors.background,
  },
  companyLabel: {
    fontFamily: typography.fonts.inter.medium,
    fontSize: typography.sizes.s,
    color: colors.textSecondary,
  },
  tabs: {
    flexDirection: "row",
    backgroundColor: colors.successLight,
    borderRadius: spacing.m,
    padding: spacing.xxs,
    marginBottom: spacing.m,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.s,
    alignItems: "center",
    borderRadius: spacing.s,
  },
  tabActive: {
    backgroundColor: colors.background,
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  tabText: {
    fontFamily: typography.fonts.inter.medium,
    fontSize: typography.sizes.s,
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.textPrimary,
    fontFamily: typography.fonts.inter.semiBold,
  },
  tabBody: {
    flex: 1,
  },
  summaryScrollView: {
    flex: 1,
  },
  summaryScroll: {
    paddingBottom: spacing.xxl,
    flexGrow: 1,
  },
  sectionTitle: {
    fontFamily: typography.fonts.inter.semiBold,
    fontSize: typography.sizes.m,
    color: colors.textPrimary,
    marginBottom: spacing.s,
  },
  sectionSpaced: {
    marginTop: spacing.l,
  },
  bulletRow: {
    flexDirection: "row",
    gap: spacing.s,
    marginBottom: spacing.s,
    paddingRight: spacing.xs,
  },
  bullet: {
    fontFamily: typography.fonts.inter.bold,
    fontSize: typography.sizes.m,
    color: colors.success,
    lineHeight: 22,
  },
  bulletText: {
    flex: 1,
    fontFamily: typography.fonts.inter.normal,
    fontSize: typography.sizes.m,
    color: colors.textPrimary,
    lineHeight: 22,
  },
  player: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.m,
    backgroundColor: colors.background,
    borderRadius: spacing.cardRadius,
    padding: spacing.m,
    marginBottom: spacing.m,
    borderWidth: 1,
    borderColor: colors.border,
  },
  wave: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 28,
    paddingHorizontal: spacing.xs,
  },
  waveBar: {
    width: 4,
    borderRadius: 2,
    backgroundColor: colors.primary,
    opacity: 0.85,
  },
  durationText: {
    fontFamily: typography.fonts.inter.medium,
    fontSize: typography.sizes.s,
    color: colors.textSecondary,
    minWidth: 40,
  },
  momentRow: {
    flexDirection: "row",
    gap: spacing.m,
    paddingVertical: spacing.s,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  timestamp: {
    fontFamily: typography.fonts.inter.semiBold,
    fontSize: typography.sizes.s,
    minWidth: 48,
  },
  tsPos: {
    color: colors.success,
  },
  tsNeg: {
    color: colors.error,
  },
  momentText: {
    flex: 1,
    fontFamily: typography.fonts.inter.normal,
    fontSize: typography.sizes.m,
    color: colors.textPrimary,
    lineHeight: 22,
  },
  momentsList: {
    flex: 1,
  },
});
