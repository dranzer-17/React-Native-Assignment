import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeScreen } from "@/features/home/screens/home-screen";
import { SessionResultScreen } from "@/features/session-result/screens/session-result-screen";
import { SettingsScreen } from "@/features/settings/screens/settings-screen";
import { StoreScreen } from "@/features/store/screens/store-screen";
import type { HomeStackParamList, MainTabParamList } from "@/navigation/types";
import { CustomTabBar } from "@/navigation/custom-tab-bar";

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
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: "none" }, // hide the default bar
      }}
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
