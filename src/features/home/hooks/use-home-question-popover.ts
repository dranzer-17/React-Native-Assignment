import { useCallback, useState } from "react";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { CardLayout } from "@/features/home/components/question-popover";
import type { HomeStackParamList } from "@/navigation/types";
import type { Question } from "@/types/mock-data";

export function useHomeQuestionPopover(
  navigation: NativeStackNavigationProp<HomeStackParamList, "Home">,
) {
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

  return {
    popoverQuestion,
    popoverLayout,
    openPopover,
    closePopover,
    onFeedback,
  };
}
