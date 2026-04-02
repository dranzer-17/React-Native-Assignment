import { useCallback, useMemo, useRef, useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import BottomSheet from "@gorhom/bottom-sheet";
import { FlashList } from "@shopify/flash-list";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ReadyAiLogo } from "@/components/ui/ready-brand";
import { QuestionCard } from "@/features/home/components/question-card";
import { QuestionDetailSheet } from "@/features/home/components/question-detail-sheet";
import type { HomeStackParamList } from "@/navigation/types";
import questionsData from "@/mock-data/questions.json";
import type { Question } from "@/types/mock-data";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

type Props = NativeStackScreenProps<HomeStackParamList, "Home">;

const questions = questionsData as Question[];

/** README Screen 4 — example practice set title (UI only; not mock JSON). */
const PRACTICE_SET_CARD_TITLE =
  "Practicing Top 50 Questions for Big Tech Companies";

const bannerShadow =
  Platform.OS === "ios"
    ? {
        shadowColor: colors.textPrimary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
      }
    : { elevation: 2 };

export function HomeScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const sheetRef = useRef<BottomSheet>(null);
  const [practiceExpanded, setPracticeExpanded] = useState(true);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);

  const openSheet = useCallback((q: Question) => {
    setSelectedQuestion(q);
    requestAnimationFrame(() => {
      sheetRef.current?.snapToIndex(0);
    });
  }, []);

  const closeSheet = useCallback(() => {
    setSelectedQuestion(null);
  }, []);

  const onFeedback = useCallback(() => {
    const id = selectedQuestion?.id ?? "q1";
    sheetRef.current?.close();
    setSelectedQuestion(null);
    navigation.navigate("SessionResult", { questionId: id });
  }, [navigation, selectedQuestion?.id]);

  const renderItem = useCallback(
    ({ item, index }: { item: Question; index: number }) => (
      <QuestionCard
        item={item}
        index={index}
        onPressCard={openSheet}
        onPressStart={openSheet}
      />
    ),
    [openSheet],
  );

  const listHeader = useMemo(
    () => (
      <View style={styles.listTop}>
        <Pressable
          onPress={() => setPracticeExpanded((e) => !e)}
          style={({ pressed }) => [
            styles.practiceCard,
            bannerShadow,
            pressed && styles.practicePressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Practice set card"
        >
          <View style={styles.practiceRow}>
            <Text style={styles.practiceTitle} numberOfLines={practiceExpanded ? 3 : 2}>
              {PRACTICE_SET_CARD_TITLE}
            </Text>
            <Ionicons
              name={practiceExpanded ? "chevron-up" : "chevron-down"}
              size={22}
              color={colors.textPrimary}
            />
          </View>
          {practiceExpanded ? (
            <Text style={styles.practiceHint}>
              Tap a company card to open the full prompt, duration, and feedback actions.
            </Text>
          ) : null}
        </Pressable>
      </View>
    ),
    [practiceExpanded],
  );

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.s }]}>
        <ReadyAiLogo variant="header" />
        <View style={styles.headerActions}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Notifications"
            style={styles.iconBtn}
            hitSlop={8}
          >
            <Ionicons name="notifications-outline" size={24} color={colors.textPrimary} />
            <View style={styles.badgeDot} />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Menu"
            style={styles.iconBtn}
            hitSlop={8}
          >
            <Ionicons name="menu-outline" size={26} color={colors.textPrimary} />
          </Pressable>
        </View>
      </View>
      <FlashList
        style={styles.list}
        data={questions}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={listHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
      <QuestionDetailSheet
        sheetRef={sheetRef}
        question={selectedQuestion}
        onFeedback={onFeedback}
        onClose={closeSheet}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  list: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.s,
    backgroundColor: colors.background,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  iconBtn: {
    padding: spacing.xs,
    position: "relative",
  },
  badgeDot: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  listContent: {
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.m,
    paddingBottom: spacing.giga,
  },
  listTop: {
    marginBottom: spacing.s,
  },
  practiceCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: spacing.cardRadius,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: spacing.cardPadding,
  },
  practicePressed: {
    opacity: 0.97,
  },
  practiceRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.s,
  },
  practiceTitle: {
    flex: 1,
    fontFamily: typography.fonts.inter.semiBold,
    fontSize: typography.sizes.m,
    color: colors.textPrimary,
    lineHeight: 22,
  },
  practiceHint: {
    marginTop: spacing.s,
    fontFamily: typography.fonts.inter.normal,
    fontSize: typography.sizes.s,
    color: colors.textSecondary,
    lineHeight: 18,
  },
});
