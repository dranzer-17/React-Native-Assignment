import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ReadyAiLogo } from "@/components/ui/ready-brand";
import type { RootStackParamList } from "@/navigation/types";
import { colors } from "@/theme/colors";

const SPLASH_MS = 2000;

type Props = NativeStackScreenProps<RootStackParamList, "Splash">;

export function SplashScreen({ navigation }: Props) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("Welcome");
    }, SPLASH_MS);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.root} accessibilityLabel="Splash screen">
      <ReadyAiLogo variant="splash" />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
});
