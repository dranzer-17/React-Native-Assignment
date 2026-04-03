import { useCallback, useMemo } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ReadyAiLogo } from "@/components/ui/ready-brand";
import { QuestionCard } from "@/features/home/components/question-card";
import { QuestionListEmpty } from "@/features/home/components/question-list-empty";
import { QuestionPopover } from "@/features/home/components/question-popover";
import { SocialProofBanner } from "@/features/home/components/social-proof-banner";
import { useHomeQuestionPopover } from "@/features/home/hooks/use-home-question-popover";
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

const MENU_ICON_SIZE = 24;
const MENU_CIRCLE = 40;
const FLASH_ICON_SIZE = 14;

/** Figma: notification badge — green pill with lightning + count */
function NotificationBadge({ count }: { count: number }) {
  return (
    <View style={styles.notifBadge}>
      <Ionicons name="flash" size={FLASH_ICON_SIZE} color="#fff" />
      <Text style={styles.notifCount}>{count}</Text>
    </View>
  );
}

export function HomeScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { popoverQuestion, popoverLayout, openPopover, closePopover, onFeedback } =
    useHomeQuestionPopover(navigation);

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
      <View>
        <View
          style={[
            styles.listHeaderBar,
            {
              paddingTop: insets.top + spacing.l + spacing.xs,
              marginHorizontal: -spacing.screenPadding,
            },
          ]}
        >
          <View style={styles.headerCluster}>
            <View style={styles.readyScale}>
              <ReadyAiLogo variant="header" withAiTile={false} />
            </View>
            <View style={styles.headerRight}>
              <NotificationBadge count={8} />
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Menu"
                hitSlop={8}
                style={({ pressed }) => [styles.menuCircle, pressed && styles.menuCirclePressed]}
              >
                <Ionicons name="menu-outline" size={MENU_ICON_SIZE} color={palette.gray90} />
              </Pressable>
            </View>
          </View>
        </View>
        <View style={styles.listTop}>
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
      </View>
    ),
    [insets.top],
  );

  return (
    <View style={styles.root}>
      <FlashList
        data={questions}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={QuestionListEmpty}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <QuestionPopover
        question={popoverQuestion}
        cardLayout={popoverLayout}
        onFeedback={onFeedback}
        onClose={closePopover}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },

  /** Scrolls with list — full-bleed bar, same row as cards content below */
  listHeaderBar: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: 2,
    marginBottom: 7,
  },
  headerCluster: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingTop: spacing.s,
  },
  readyScale: {
    transform: [{ scale: 1.12 }],
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.s,
  },
  menuCircle: {
    width: MENU_CIRCLE,
    height: MENU_CIRCLE,
    borderRadius: MENU_CIRCLE / 2,
    backgroundColor: palette.gray20,
    alignItems: "center",
    justifyContent: "center",
  },
  menuCirclePressed: {
    opacity: 0.88,
    backgroundColor: palette.gray30,
  },

  /** Green pill — ⚡ + count */
  notifBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3EBD70",
    borderRadius: 20,
    paddingHorizontal: spacing.s,
    paddingVertical: spacing.xs + 1,
    gap: 4,
    minHeight: 36,
  },
  notifCount: {
    fontFamily: typography.fonts.inter.bold,
    fontSize: 15,
    color: "#fff",
    includeFontPadding: false,
  },

  /* ── List ───────────────────────────────────────────────── */
  listContent: {
    paddingHorizontal: spacing.screenPadding,
    paddingTop: 0,
    paddingBottom: 148,
    backgroundColor: colors.background,
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
});
