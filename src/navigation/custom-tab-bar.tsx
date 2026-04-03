import type { ComponentProps } from "react";
import * as Haptics from "expo-haptics";
import { Pressable, StyleSheet, Text, View, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, Ionicons } from "@expo/vector-icons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { colors, palette } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

type TabName = "HomeTab" | "SettingsTab" | "StoreTab";

const TAB_META: Record<TabName, { label: string }> = {
    HomeTab: { label: "Home" },
    SettingsTab: { label: "Settings" },
    StoreTab: { label: "Store" },
};

const PILL_ICON_SIZE = 22;

/** Feather icons (Lucide lineage); font-based like Ionicons — stable on Android Fabric. */
function PillTabIcon({
    routeName,
    color,
}: {
    routeName: "HomeTab" | "SettingsTab";
    color: string;
}) {
    const name = routeName === "HomeTab" ? "home" : "settings";
    return <Feather name={name} size={PILL_ICON_SIZE} color={color} />;
}

const ACTIVE_COLOR = palette.orange50;
const INACTIVE_COLOR = palette.gray60;

type IoniconName = NonNullable<ComponentProps<typeof Ionicons>["name"]>;

function storeBagIcon(active: boolean): IoniconName {
  return active ? "bag" : "bag-outline";
}

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
    const insets = useSafeAreaInsets();

    // Hide when any tab's nested navigator has pushed past its root screen
    const isNestedDeep = state.routes.some(
        (route) => route.state != null && (route.state.index ?? 0) > 0,
    );
    if (isNestedDeep) return null;

    // Settings is a full-screen profile flow — no Home / Settings / Store pill
    const activeRoute = state.routes[state.index];
    if (activeRoute?.name === "SettingsTab") return null;

    const pillTabs = state.routes.filter((r) => r.name !== "StoreTab");
    const storeRoute = state.routes.find((r) => r.name === "StoreTab")!;
    const storeIndex = state.routes.indexOf(storeRoute);
    const storeActive = state.index === storeIndex;

    function handlePress(routeName: string, routeKey: string, isFocused: boolean) {
        const event = navigation.emit({ type: "tabPress", target: routeKey, canPreventDefault: true });
        if (!isFocused && !event.defaultPrevented) {
            void Haptics.selectionAsync();
            navigation.navigate(routeName);
        }
    }

    return (
        <View
            style={[
                styles.wrapper,
                { paddingBottom: (insets.bottom || 16) + spacing.l },
            ]}
        >
            <View style={styles.row}>

                {/* ── Pill: Home + Settings ───────────────────────────── */}
                <View style={styles.pill}>
                    {pillTabs.map((route) => {
                        const isFocused = state.index === state.routes.indexOf(route);
                        const meta = TAB_META[route.name as TabName];
                        const color = isFocused ? ACTIVE_COLOR : INACTIVE_COLOR;
                        const pillName = route.name as "HomeTab" | "SettingsTab";

                        return (
                            <Pressable
                                key={route.key}
                                onPress={() => handlePress(route.name, route.key, isFocused)}
                                accessibilityRole="button"
                                accessibilityState={{ selected: isFocused }}
                                accessibilityLabel={meta.label}
                                style={styles.pillTab}
                            >
                                <PillTabIcon routeName={pillName} color={color} />
                                <Text style={[styles.label, { color }]}>{meta.label}</Text>
                            </Pressable>
                        );
                    })}
                </View>

                {/* ── Store circle ────────────────────────────────────── */}
                <Pressable
                    onPress={() => handlePress(storeRoute.name, storeRoute.key, storeActive)}
                    accessibilityRole="button"
                    accessibilityState={{ selected: storeActive }}
                    accessibilityLabel="Store"
                    style={styles.storeCircle}
                >
                    {/* Glass shine strips — clipped by the circle overflow:hidden */}
                    <View style={styles.storeShine1} />
                    <View style={styles.storeShine2} />

                    <Ionicons
                        name={storeBagIcon(storeActive)}
                        size={spacing.tabStoreBagIcon}
                        color={palette.storeIconNavy}
                    />
                    <Text style={[styles.label, { color: palette.storeIconNavy }]}>Store</Text>
                </Pressable>

            </View>
        </View>
    );
}

const shadow = Platform.select({
    ios: {
        shadowColor: palette.shadow,
        shadowOffset: { width: 0, height: spacing.micro },
        shadowOpacity: 0.1,
        shadowRadius: spacing.s,
    },
    android: { elevation: 8 },
});

const styles = StyleSheet.create({
    wrapper: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: "center",
        backgroundColor: "transparent",
        pointerEvents: "box-none",
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.tabGap,
    },

    /* ── Pill ──────────────────────────────────────────────── */
    pill: {
        width: spacing.tabPillWidth,
        height: spacing.tabPillHeight,
        borderRadius: spacing.tabPillHeight / 2,
        backgroundColor: colors.background,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        borderWidth: spacing.hairline,
        borderColor: palette.gray20,
        ...shadow,
    },
    pillTab: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: spacing.tabLabelGap,
    },

    /* ── Store circle ──────────────────────────────────────── */
    storeCircle: {
        width: spacing.tabStoreCircle,
        height: spacing.tabStoreCircle,
        borderRadius: spacing.tabStoreCircle / 2,
        backgroundColor: palette.storeCircleBlue,
        alignItems: "center",
        justifyContent: "center",
        gap: spacing.tabLabelGap,
        borderWidth: spacing.hairline,
        borderColor: palette.gray20,
        overflow: "hidden", // clips the glass shine strips
        ...shadow,
    },
    /** Glass strip 1 — diagonal, clipped by circle overflow:hidden */
    storeShine1: {
        position: "absolute",
        width: spacing.iconMd,
        height: spacing.tabStoreShineHeight,
        left: -spacing.xxs,
        top: spacing.tabStoreShineTop,
        backgroundColor: palette.whiteAlpha45,
        transform: [{ rotate: "30deg" }],
    },
    /** Glass strip 2 — slightly right of strip 1 */
    storeShine2: {
        position: "absolute",
        width: spacing.tabStoreShine2Width,
        height: spacing.tabStoreShineHeight,
        left: spacing.tabStoreShine2Left,
        top: spacing.tabStoreShineTop,
        backgroundColor: palette.whiteAlpha45,
        transform: [{ rotate: "30deg" }],
    },

    /* ── Shared ──────────────────────────────────────────────*/
    label: {
        fontFamily: typography.fonts.inter.medium,
        fontSize: typography.sizes.tabLabel,
        includeFontPadding: false,
    },
});
