import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeScreen } from "@/features/home/screens/home-screen";
import { SessionResultScreen } from "@/features/session-result/screens/session-result-screen";
import { SettingsScreen } from "@/features/settings/screens/settings-screen";
import { StoreScreen } from "@/features/store/screens/store-screen";
import type { HomeStackParamList, MainTabParamList } from "@/navigation/types";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="Home" component={HomeScreen} />
      <HomeStack.Screen name="SessionResult" component={SessionResultScreen} />
    </HomeStack.Navigator>
  );
}

export function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: {
          fontFamily: typography.fonts.inter.medium,
          fontSize: typography.sizes.xs,
          marginBottom: spacing.xxs,
        },
        tabBarStyle: {
          paddingTop: spacing.xs,
          height: 60 + spacing.xs,
          borderTopColor: colors.border,
        },
        tabBarIcon: ({ color, size }) => {
          const iconName =
            route.name === "HomeTab"
              ? "home"
              : route.name === "SettingsTab"
                ? "settings-outline"
                : "bag-handle-outline";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStackNavigator}
        options={{ tabBarLabel: "Home" }}
      />
      <Tab.Screen
        name="SettingsTab"
        component={SettingsScreen}
        options={{ tabBarLabel: "Settings" }}
      />
      <Tab.Screen name="StoreTab" component={StoreScreen} options={{ tabBarLabel: "Store" }} />
    </Tab.Navigator>
  );
}
