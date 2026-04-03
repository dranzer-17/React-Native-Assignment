import { useEffect } from "react";
import { StyleSheet, type StyleProp, type ViewStyle } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { palette } from "@/theme/colors";

export interface ShimmerPlaceholderProps {
  style?: StyleProp<ViewStyle>;
}

/**
 * Lightweight shimmer for empty/loading states (README bonus: skeleton/shimmer).
 */
export function ShimmerPlaceholder({ style }: ShimmerPlaceholderProps) {
  const opacity = useSharedValue(0.38);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.92, { duration: 950, easing: Easing.inOut(Easing.quad) }),
      -1,
      true,
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return <Animated.View style={[styles.bar, style, animatedStyle]} />;
}

const styles = StyleSheet.create({
  bar: {
    borderRadius: 10,
    backgroundColor: palette.gray30,
  },
});
