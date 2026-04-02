import { Dimensions, Modal, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Question } from "@/types/mock-data";
import { typography } from "@/theme/typography";
import { spacing } from "@/theme/spacing";

export interface CardLayout {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface QuestionPopoverProps {
    question: Question | null;
    cardLayout: CardLayout | null;
    onFeedback: () => void;
    onClose: () => void;
}

const SCREEN_W = Dimensions.get("window").width;
const POPOVER_W = Math.min(345, SCREEN_W - 32);
const ARROW_W = 24;
const ARROW_H = 10;
const BORDER_RADIUS = 16;
const GAP_FROM_CARD = 40;
/** Rough estimated height — used only for "above" offset so popover clears the card */
const POPOVER_ESTIMATED_H = 205;

/** Per-state colour palette */
const STATE_COLORS = {
    active: { bg: "#79D634", aiBtn: "#325E0F", text: "#0B2100" },
    next: { bg: "#FFD033", aiBtn: "#7B6009", text: "#2B1E00" },
    locked: { bg: "#FFFFFF", aiBtn: "#374151", text: "#111827" },
} as const;

export function QuestionPopover({ question, cardLayout, onFeedback, onClose }: QuestionPopoverProps) {
    if (!question || !cardLayout) return null;

    const state = question.state ?? "locked";
    const colors = STATE_COLORS[state];

    // Smart: show ABOVE card if its centre is in the lower half of the screen
    const SCREEN_H = Dimensions.get("window").height;
    const showAbove = (cardLayout.y + cardLayout.height / 2) > SCREEN_H / 2;

    const popoverLeft = (SCREEN_W - POPOVER_W) / 2;

    // Arrow: align horizontally to card centre, clamped inside popover
    const cardCentreX = cardLayout.x + cardLayout.width / 2;
    const arrowOffsetInPop = Math.max(
        BORDER_RADIUS + 4,
        Math.min(POPOVER_W - BORDER_RADIUS - ARROW_W - 4, cardCentreX - popoverLeft - ARROW_W / 2),
    );

    const positionStyle = showAbove
        ? { top: cardLayout.y - GAP_FROM_CARD - POPOVER_ESTIMATED_H, left: popoverLeft }
        : { top: cardLayout.y + cardLayout.height + GAP_FROM_CARD, left: popoverLeft };

    return (
        <Modal transparent animationType="fade" onRequestClose={onClose}>
            <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

            <View style={[styles.popover, positionStyle, { backgroundColor: colors.bg }]}>
                {/* Arrow — DOWN when popover is above card, UP when below */}
                {showAbove ? (
                    <View style={[styles.arrowDown, { left: arrowOffsetInPop, borderTopColor: colors.bg }]} />
                ) : (
                    <View style={[styles.arrowUp, { left: arrowOffsetInPop, borderBottomColor: colors.bg }]} />
                )}

                <Text style={[styles.questionText, { color: colors.text }]}>{question.text}</Text>

                <View style={styles.metaRow}>
                    <Text style={[styles.askedBy, { color: colors.text, opacity: 0.75 }]}>
                        Asked by <Text style={styles.askedByBold}>{question.companyName}</Text>
                    </Text>
                    <View style={styles.durationRow}>
                        <Ionicons name="time-outline" size={13} color={colors.text} style={{ opacity: 0.75 }} />
                        <Text style={[styles.durationText, { color: colors.text, opacity: 0.75 }]}>
                            {question.durationMinutes} mins
                        </Text>
                    </View>
                </View>

                <Pressable style={styles.feedbackBtn} onPress={onFeedback} accessibilityRole="button">
                    <Text style={styles.feedbackLabel}>FEEDBACK</Text>
                </Pressable>

                <View style={[styles.aiWrapper, { backgroundColor: colors.aiBtn }]}>
                    <Pressable style={styles.aiFace} disabled>
                        <Ionicons name="headset" size={18} color="#fff" />
                        <Text style={styles.aiLabel}>  AI VS AI (LISTEN)</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
}

const shadow = Platform.select({
    ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.18, shadowRadius: 16 },
    android: { elevation: 12 },
});

const styles = StyleSheet.create({
    popover: {
        position: "absolute",
        width: POPOVER_W,
        borderRadius: BORDER_RADIUS,
        padding: 16,
        ...shadow,
    },

    /** ↑ Upward caret — popover is BELOW the card */
    arrowUp: {
        position: "absolute",
        top: -ARROW_H,
        width: 0, height: 0,
        borderLeftWidth: ARROW_W / 2, borderRightWidth: ARROW_W / 2,
        borderBottomWidth: ARROW_H,
        borderLeftColor: "transparent", borderRightColor: "transparent",
    },

    /** ↓ Downward caret — popover is ABOVE the card */
    arrowDown: {
        position: "absolute",
        bottom: -ARROW_H,
        width: 0, height: 0,
        borderLeftWidth: ARROW_W / 2, borderRightWidth: ARROW_W / 2,
        borderTopWidth: ARROW_H,
        borderLeftColor: "transparent", borderRightColor: "transparent",
    },

    questionText: {
        fontFamily: typography.fonts.inter.bold,
        fontSize: 18, lineHeight: 26, marginBottom: 10,
    },
    metaRow: {
        flexDirection: "row", alignItems: "center",
        justifyContent: "space-between", marginBottom: 14,
    },
    askedBy: { fontFamily: typography.fonts.inter.normal, fontSize: 13, flex: 1 },
    askedByBold: { fontFamily: typography.fonts.inter.semiBold },
    durationRow: { flexDirection: "row", alignItems: "center", gap: 3 },
    durationText: { fontFamily: typography.fonts.inter.medium, fontSize: 13 },

    feedbackBtn: {
        height: 48, borderRadius: 12, backgroundColor: "#fff",
        alignItems: "center", justifyContent: "center", marginBottom: spacing.s,
    },
    feedbackLabel: {
        fontFamily: typography.fonts.inter.bold, fontSize: 15,
        color: "#13BF69", letterSpacing: 0.5,
    },

    aiWrapper: { borderRadius: 12, overflow: "hidden" },
    aiFace: { height: 48, flexDirection: "row", alignItems: "center", justifyContent: "center" },
    aiLabel: { fontFamily: typography.fonts.inter.bold, fontSize: 15, color: "#fff", letterSpacing: 0.3 },
});
