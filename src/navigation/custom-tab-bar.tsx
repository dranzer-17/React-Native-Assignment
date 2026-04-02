import { Pressable, StyleSheet, Text, View, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { palette } from "@/theme/colors";
import { typography } from "@/theme/typography";

/** Figma spec */
const PILL_WIDTH = 172;
const PILL_HEIGHT = 68;
const STORE_SIZE = 68;
const GAP = 8;

type TabName = "HomeTab" | "SettingsTab" | "StoreTab";

const TAB_META: Record<TabName, { iconActive: string; iconInactive: string; label: string }> = {
    HomeTab: { iconActive: "home", iconInactive: "home-outline", label: "Home" },
    SettingsTab: { iconActive: "options", iconInactive: "options-outline", label: "Settings" },
    StoreTab: { iconActive: "bag", iconInactive: "bag-outline", label: "Store" },
};

const ACTIVE_COLOR = "#F97316";   // Orange/50
const INACTIVE_COLOR = palette.gray60;
const STORE_BG = "#e2f3ff";   // always-on blue tint
const STORE_ICON_COLOR = "#082f49"; // deep navy — darker icon

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
    const insets = useSafeAreaInsets();

    // Hide when any tab's nested navigator has pushed past its root screen
    const isNestedDeep = state.routes.some(
        (route) => route.state != null && (route.state.index ?? 0) > 0,
    );
    if (isNestedDeep) return null;

    const pillTabs = state.routes.filter((r) => r.name !== "StoreTab");
    const storeRoute = state.routes.find((r) => r.name === "StoreTab")!;
    const storeIndex = state.routes.indexOf(storeRoute);
    const storeActive = state.index === storeIndex;

    function handlePress(routeName: string, routeKey: string, isFocused: boolean) {
        const event = navigation.emit({ type: "tabPress", target: routeKey, canPreventDefault: true });
        if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(routeName);
        }
    }

    return (
        <View style={[styles.wrapper, { paddingBottom: insets.bottom || 16 }]}>
            <View style={styles.row}>

                {/* ── Pill: Home + Settings ───────────────────────────── */}
                <View style={styles.pill}>
                    {pillTabs.map((route) => {
                        const isFocused = state.index === state.routes.indexOf(route);
                        const meta = TAB_META[route.name as TabName];
                        const color = isFocused ? ACTIVE_COLOR : INACTIVE_COLOR;
                        const icon = isFocused ? meta.iconActive : meta.iconInactive;

                        return (
                            <Pressable
                                key={route.key}
                                onPress={() => handlePress(route.name, route.key, isFocused)}
                                accessibilityRole="button"
                                accessibilityState={{ selected: isFocused }}
                                accessibilityLabel={meta.label}
                                style={styles.pillTab}
                            >
                                {/* No background circle — just tint icon + label */}
                                <Ionicons name={icon as any} size={22} color={color} />
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
                        name={(storeActive ? "bag" : "bag-outline") as any}
                        size={26}
                        color={STORE_ICON_COLOR}
                    />
                    <Text style={[styles.label, { color: STORE_ICON_COLOR }]}>Store</Text>
                </Pressable>

            </View>
        </View>
    );
}

const shadow = Platform.select({
    ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
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
        gap: GAP,
    },

    /* ── Pill ──────────────────────────────────────────────── */
    pill: {
        width: PILL_WIDTH,
        height: PILL_HEIGHT,
        borderRadius: PILL_HEIGHT / 2,
        backgroundColor: "#fff",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        borderWidth: 1,
        borderColor: palette.gray20,
        ...shadow,
    },
    pillTab: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
    },

    /* ── Store circle ──────────────────────────────────────── */
    storeCircle: {
        width: STORE_SIZE,
        height: STORE_SIZE,
        borderRadius: STORE_SIZE / 2,
        backgroundColor: STORE_BG,
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        borderWidth: 1,
        borderColor: palette.gray20,
        overflow: "hidden", // clips the glass shine strips
        ...shadow,
    },
    /** Glass strip 1 — diagonal, clipped by circle overflow:hidden */
    storeShine1: {
        position: "absolute",
        width: 18,
        height: 120,
        left: -4,
        top: -30,
        backgroundColor: "rgba(255,255,255,0.45)",
        transform: [{ rotate: "30deg" }],
    },
    /** Glass strip 2 — slightly right of strip 1 */
    storeShine2: {
        position: "absolute",
        width: 10,
        height: 120,
        left: 22,
        top: -30,
        backgroundColor: "rgba(255,255,255,0.45)",
        transform: [{ rotate: "30deg" }],
    },

    /* ── Shared ──────────────────────────────────────────────*/
    label: {
        fontFamily: typography.fonts.inter.medium,
        fontSize: 10,
        includeFontPadding: false,
    },
});
