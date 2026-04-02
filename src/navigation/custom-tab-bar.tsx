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

const TAB_META: Record<TabName, { icon: string; label: string }> = {
    HomeTab: { icon: "home", label: "Home" },
    SettingsTab: { icon: "settings-outline", label: "Settings" },
    StoreTab: { icon: "bag-handle-outline", label: "Store" },
};

const ACTIVE_COLOR = "#F97316"; // Orange/50
const INACTIVE_COLOR = palette.gray60;
const ACTIVE_BG = "#FFF0E6"; // soft orange tint behind active icon

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
    const insets = useSafeAreaInsets();

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

                        return (
                            <Pressable
                                key={route.key}
                                onPress={() => handlePress(route.name, route.key, isFocused)}
                                accessibilityRole="button"
                                accessibilityState={{ selected: isFocused }}
                                accessibilityLabel={meta.label}
                                style={styles.pillTab}
                            >
                                <View style={[styles.iconWrapper, isFocused && styles.iconWrapperActive]}>
                                    <Ionicons name={meta.icon as any} size={22} color={color} />
                                </View>
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
                    style={[styles.storeCircle, storeActive && styles.storeCircleActive]}
                >
                    <Ionicons
                        name={"bag-handle-outline" as any}
                        size={26}
                        color={storeActive ? ACTIVE_COLOR : INACTIVE_COLOR}
                    />
                    <Text style={[styles.label, { color: storeActive ? ACTIVE_COLOR : INACTIVE_COLOR }]}>
                        Store
                    </Text>
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
        borderColor: palette.gray20, // Grey/15 ≈ gray20
        ...shadow,
    },
    pillTab: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
    },
    iconWrapper: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
    },
    iconWrapperActive: {
        backgroundColor: ACTIVE_BG,
    },

    /* ── Store circle ──────────────────────────────────────── */
    storeCircle: {
        width: STORE_SIZE,
        height: STORE_SIZE,
        borderRadius: STORE_SIZE / 2,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        borderWidth: 1,
        borderColor: palette.gray20,
        ...shadow,
    },
    storeCircleActive: {
        backgroundColor: "#FFF0E6",
        borderColor: ACTIVE_COLOR,
    },

    /* ── Shared ──────────────────────────────────────────────*/
    label: {
        fontFamily: typography.fonts.inter.medium,
        fontSize: 10,
        includeFontPadding: false,
    },
});
