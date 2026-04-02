import type { ReactNode } from "react";
import * as Haptics from "expo-haptics";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  type PressableProps,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

type ButtonVariant = "primary" | "secondary" | "ghost";

export interface ButtonProps extends Omit<PressableProps, "style"> {
  label: string;
  variant?: ButtonVariant;
  loading?: boolean;
  /** Shown before the label (e.g. Figma “Let’s go” + Google mark). */
  leading?: ReactNode;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
}

export function Button({
  label,
  variant = "primary",
  loading = false,
  leading,
  disabled,
  style,
  labelStyle,
  onPress,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled === true || loading;

  const handlePress: PressableProps["onPress"] = (event) => {
    if (isDisabled) {
      return;
    }
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.(event);
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: isDisabled }}
      disabled={isDisabled}
      onPress={handlePress}
      style={({ pressed }) => [
        styles.base,
        variant === "primary" && styles.primary,
        variant === "secondary" && styles.secondary,
        variant === "ghost" && styles.ghost,
        isDisabled && styles.disabled,
        pressed && !isDisabled && styles.pressed,
        style,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "primary" ? colors.buttonPrimaryText : colors.primary}
        />
      ) : (
        <View style={styles.labelRow}>
          {leading ? <View style={styles.leading}>{leading}</View> : null}
          <Text
            style={[
              styles.label,
              variant === "primary" && styles.labelPrimary,
              variant === "secondary" && styles.labelSecondary,
              variant === "ghost" && styles.labelGhost,
              isDisabled && styles.labelDisabled,
              labelStyle,
            ]}
          >
            {label}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    borderRadius: spacing.buttonRadius,
    paddingHorizontal: spacing.l,
    alignItems: "center",
    justifyContent: "center",
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.s,
  },
  leading: {
    justifyContent: "center",
    alignItems: "center",
  },
  primary: {
    backgroundColor: colors.buttonPrimary,
  },
  secondary: {
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.border,
  },
  ghost: {
    backgroundColor: "transparent",
  },
  disabled: {
    backgroundColor: colors.buttonDisabled,
    borderColor: colors.buttonDisabled,
  },
  pressed: {
    opacity: 0.92,
  },
  label: {
    fontFamily: typography.fonts.inter.semiBold,
    fontSize: typography.sizes.m,
  },
  labelPrimary: {
    color: colors.buttonPrimaryText,
  },
  labelSecondary: {
    color: colors.textPrimary,
  },
  labelGhost: {
    color: colors.textLink,
  },
  labelDisabled: {
    color: colors.buttonDisabledText,
  },
});
