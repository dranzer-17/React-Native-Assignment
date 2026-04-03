import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SplashScreen } from "@/features/auth/screens/splash-screen";
import { WelcomeScreen } from "@/features/auth/screens/welcome-screen";
import { LoginScreen } from "@/features/auth/screens/login-screen";
import { MainNavigator } from "@/navigation/main-navigator";
import type { RootStackParamList } from "@/navigation/types";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
      initialRouteName="Splash"
    >
      <Stack.Screen name="Splash" component={SplashScreen} options={{ animation: "fade" }} />
      <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ animation: "fade" }} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen
        name="Main"
        component={MainNavigator}
        options={{ animation: "fade_from_bottom" }}
      />
    </Stack.Navigator>
  );
}
