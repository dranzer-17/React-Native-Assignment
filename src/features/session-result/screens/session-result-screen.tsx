import { useCallback, useMemo, useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { HomeStackParamList } from "@/navigation/types";
import questionsData from "@/mock-data/questions.json";
import sessionResultData from "@/mock-data/session-result.json";
import type { KeyMoment, Question, SessionResult } from "@/types/mock-data";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";
import { palette } from "@/theme/colors";

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

function getLogoSource(companyId: string) {
  return LOCAL_LOGOS[companyId] ?? null;
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
    [question],
  );

  const logoSource = getLogoSource(question.companyId);

  const renderMoment = useCallback(({ item }: { item: KeyMoment }) => {
    const isPositive = item.type === "positive";
    return (
      <View style={styles.momentRow}>
        <View style={[styles.momentDot, { backgroundColor: isPositive ? GREEN_BG : "#EF4444" }]} />
        <View style={styles.momentContent}>
          <Text style={styles.momentTime}>{item.timestamp}</Text>
          <Text style={styles.momentText}>{item.description}</Text>
        </View>
      </View>
    );
  }, []);

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
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
          >
            <Text style={styles.sectionTitle}>What worked well</Text>
            {session.smartSummary.whatWorkedWell.map((line, i) => (
              <View key={`w-${i}`} style={styles.bulletRow}>
                <Text style={styles.bulletDiamond}>{DIAMOND}</Text>
                <Text style={styles.bulletText}>{line}</Text>
              </View>
            ))}

            <View style={styles.sectionDivider} />

            <Text style={styles.sectionTitle}>Overall takeaways</Text>
            {session.smartSummary.overallTakeaways.map((line, i) => (
              <View key={`t-${i}`} style={styles.bulletRow}>
                <Text style={styles.bulletDiamond}>{DIAMOND}</Text>
                <Text style={styles.bulletText}>{line}</Text>
              </View>
            ))}
          </ScrollView>
        ) : (
          <FlashList
            data={session.keyMoments}
            renderItem={renderMoment}
            keyExtractor={(item, i) => `${item.timestamp}-${i}`}
            contentContainerStyle={{ paddingTop: 8, paddingBottom: insets.bottom + 40 }}
            estimatedItemSize={72}
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
    fontFamily: typography.fonts.inter.bold,
    fontSize: 18,
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

  /* Key moments */
  momentRow: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: spacing.screenPadding,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: palette.gray15,
    alignItems: "flex-start",
  },
  momentDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  momentContent: { flex: 1 },
  momentTime: {
    fontFamily: typography.fonts.inter.semiBold,
    fontSize: 12,
    color: palette.gray60,
    marginBottom: 2,
  },
  momentText: {
    fontFamily: typography.fonts.inter.normal,
    fontSize: 15,
    color: "#0B0B0D",
    lineHeight: 22,
  },
});
