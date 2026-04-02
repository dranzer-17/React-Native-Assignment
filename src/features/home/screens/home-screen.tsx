import { useCallback, useMemo, useRef, useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ReadyAiLogo } from "@/components/ui/ready-brand";
import { QuestionCard } from "@/features/home/components/question-card";
import { QuestionPopover } from "@/features/home/components/question-popover";
import type { CardLayout } from "@/features/home/components/question-popover";
import type { HomeStackParamList } from "@/navigation/types";
import questionsData from "@/mock-data/questions.json";
import type { Question } from "@/types/mock-data";
import { colors, palette } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

type Props = NativeStackScreenProps<HomeStackParamList, "Home">;

const questions = questionsData as Question[];

/** Figma: shown after question 3 in the list */
const SOCIAL_PROOF_AFTER_INDEX = 2;

const headerShadow =
  Platform.OS === "ios"
    ? {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 4,
    }
    : { elevation: 2 };

/** Figma: notification badge — green circle with lightning bolt + count */
function NotificationBadge({ count }: { count: number }) {
  return (
    <View style={styles.notifBadge}>
      <Ionicons name="flash" size={12} color="#fff" />
      <Text style={styles.notifCount}>{count}</Text>
    </View>
  );
}

export function HomeScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();

  const [popoverQuestion, setPopoverQuestion] = useState<Question | null>(null);
  const [popoverLayout, setPopoverLayout] = useState<CardLayout | null>(null);

  const openPopover = useCallback((q: Question, layout: CardLayout) => {
    setPopoverQuestion(q);
    setPopoverLayout(layout);
  }, []);

  const closePopover = useCallback(() => {
    setPopoverQuestion(null);
    setPopoverLayout(null);
  }, []);

  const onFeedback = useCallback(() => {
    const id = popoverQuestion?.id ?? "q1";
    closePopover();
    navigation.navigate("SessionResult", { questionId: id });
  }, [navigation, popoverQuestion?.id, closePopover]);

  const renderItem = useCallback(
    ({ item, index }: { item: Question; index: number }) => (
      <>
        <QuestionCard
          item={item}
          index={index}
          onPressCard={openPopover}
        />
        {index === SOCIAL_PROOF_AFTER_INDEX && (
          <SocialProofBanner question={questions[SOCIAL_PROOF_AFTER_INDEX]} />
        )}
      </>
    ),
    [openPopover],
  );

  const listHeader = useMemo(
    () => (
      <View style={styles.listTop}>
        {/* Figma practice card: yellow background, muscle emoji, dropdown */}
        <Pressable
          style={styles.practiceCard}
          accessibilityRole="button"
          accessibilityLabel="Practice set"
        >
          <Text style={styles.practiceEmoji}>💪</Text>
          <View style={styles.practiceMeta}>
            <Text style={styles.practiceSmall}>Practicing Top 50 Questions for</Text>
            <Text style={styles.practiceBig} numberOfLines={1}>
              Big Tech Companies
            </Text>
          </View>
          <Ionicons name="chevron-down" size={20} color={palette.gray70} />
        </Pressable>
      </View>
    ),
    [],
  );

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={[styles.header, headerShadow, { paddingTop: insets.top + spacing.s }]}>
        <ReadyAiLogo variant="header" />
        <View style={styles.headerActions}>
          <NotificationBadge count={8} />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Menu"
            hitSlop={8}
          >
            <Ionicons name="menu-outline" size={26} color={palette.gray90} />
          </Pressable>
        </View>
      </View>

      {/* List */}
      <FlashList
        data={questions}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={listHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        estimatedItemSize={80}
      />

      {/* Anchored popover */}
      <QuestionPopover
        question={popoverQuestion}
        cardLayout={popoverLayout}
        onFeedback={onFeedback}
        onClose={closePopover}
      />
    </View>
  );
}

/** Figma: "X users completed Question N today" strip — no bg, dashed line below */
function SocialProofBanner({ question }: { question: Question }) {
  return (
    <View style={styles.proofWrap}>
      <View style={styles.proofBanner}>
        <Ionicons name="flag" size={14} color="#BF9C26" style={styles.proofIcon} />
        <Text style={styles.proofText}>
          {question.completedTodayCount.toLocaleString()} users completed Question{" "}
          {question.questionNumber} today
        </Text>
        <Ionicons name="flag" size={14} color="#BF9C26" style={styles.proofIcon} />
      </View>
      <View style={styles.proofDash} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: palette.gray10,
  },

  /* ── Header ─────────────────────────────────────────────── */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.s,
    backgroundColor: colors.background,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.s,
  },

  /** Figma: green pill with ⚡ + count */
  notifBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3EBD70",
    borderRadius: 20,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xxs,
    gap: 3,
  },
  notifCount: {
    fontFamily: typography.fonts.inter.bold,
    fontSize: 13,
    color: "#fff",
    includeFontPadding: false,
  },

  /* ── List ───────────────────────────────────────────────── */
  listContent: {
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.m,
    paddingBottom: 120,
  },
  listTop: {
    marginBottom: spacing.s,
  },

  /* ── Practice card ──────────────────────────────────────── */
  practiceCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF3CD",
    borderRadius: spacing.cardRadius,
    paddingHorizontal: 12,
    paddingVertical: spacing.s,
    gap: 12,
    ...Platform.select({
      ios: {
        shadowColor: "#B8860B",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 4,
      },
      android: { elevation: 2 },
      default: {},
    }),
  },
  practiceEmoji: { fontSize: 22 },
  practiceMeta: { flex: 1, minWidth: 0 },
  practiceSmall: {
    fontFamily: typography.fonts.inter.normal,
    fontSize: 11,
    color: palette.gray60,
    lineHeight: 14,
  },
  practiceBig: {
    fontFamily: typography.fonts.inter.bold,
    fontSize: typography.sizes.m,
    color: palette.gray90,
    lineHeight: 20,
  },

  /* ── Social proof banner ────────────────────────────────── */
  proofWrap: {
    marginBottom: spacing.s,
  },
  proofBanner: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.s,
    paddingVertical: spacing.xs,
    gap: spacing.xxs,
  },
  proofIcon: { marginHorizontal: 2 },
  proofText: {
    fontFamily: typography.fonts.inter.semiBold,
    fontSize: typography.sizes.xs,
    color: "#BF9C26",
    letterSpacing: 0.2,
    flex: 1,
    textAlign: "center",
  },
  proofDash: {
    height: 0,
    borderBottomWidth: 1.5,
    borderBottomColor: "#BF9C26",
    borderStyle: "dashed",
    marginHorizontal: spacing.s,
  },
});
