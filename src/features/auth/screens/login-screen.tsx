import { useCallback, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button } from "@/components/ui/button";
import { navigateToMain } from "@/navigation/root-navigation-ref";
import type { RootStackParamList } from "@/navigation/types";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

/** README Screen 3 — 4-digit OTP (any values). */
const OTP_LENGTH = 4;

export function LoginScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState<string[]>(() => Array(OTP_LENGTH).fill(""));
  const otpRefs = useRef<Array<TextInput | null>>([]);

  const setDigit = useCallback((index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    setOtp((prev) => {
      const next = [...prev];
      next[index] = digit;
      return next;
    });
    if (digit && index < OTP_LENGTH - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  }, []);

  const onOtpKeyPress = useCallback((index: number, key: string) => {
    if (key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  }, [otp]);

  const handleContinue = useCallback(() => {
    const joined = otp.join("");
    if (phone.trim().length < 8 || joined.length !== OTP_LENGTH) {
      return;
    }
    navigateToMain();
  }, [otp, phone]);

  const canSubmit = phone.trim().length >= 8 && otp.join("").length === OTP_LENGTH;

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View
        style={[
          styles.root,
          { paddingTop: insets.top + spacing.xs, paddingBottom: insets.bottom + spacing.l },
        ]}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={() => navigation.goBack()}
          style={styles.back}
          hitSlop={12}
        >
          <Ionicons name="chevron-back" size={28} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.heading}>Kickstart your journey.</Text>
        <Text style={styles.caption}>We will send you an OTP to verify your number.</Text>
        <Text style={styles.label}>Mobile number</Text>
        <View style={styles.phoneRow}>
          <View style={styles.country}>
            <Text style={styles.countryText}>+91</Text>
          </View>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            placeholder="00000 00000"
            placeholderTextColor={colors.textDisabled}
            keyboardType="phone-pad"
            style={styles.phoneInput}
            accessibilityLabel="Phone number"
          />
        </View>
        <Text style={[styles.label, styles.otpLabel]}>Enter OTP</Text>
        <View style={styles.otpRow}>
          {otp.map((d, i) => (
            <TextInput
              key={i}
              ref={(r) => {
                otpRefs.current[i] = r;
              }}
              value={d}
              onChangeText={(t) => setDigit(i, t)}
              onKeyPress={({ nativeEvent }) => onOtpKeyPress(i, nativeEvent.key)}
              keyboardType="number-pad"
              maxLength={1}
              style={styles.otpCell}
              textAlign="center"
              accessibilityLabel={`OTP digit ${i + 1}`}
            />
          ))}
        </View>
        <View style={styles.spacer} />
        <Button label="Continue" onPress={handleContinue} disabled={!canSubmit} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.background,
  },
  root: {
    flex: 1,
    paddingHorizontal: spacing.screenPadding,
  },
  back: {
    alignSelf: "flex-start",
    marginBottom: spacing.m,
  },
  heading: {
    fontFamily: typography.fonts.inter.bold,
    fontSize: typography.sizes.xxl,
    color: colors.textPrimary,
    marginBottom: spacing.s,
  },
  caption: {
    fontFamily: typography.fonts.inter.normal,
    fontSize: typography.sizes.m,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  label: {
    fontFamily: typography.fonts.inter.medium,
    fontSize: typography.sizes.s,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  otpLabel: {
    marginTop: spacing.l,
  },
  phoneRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.s,
  },
  country: {
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
    borderRadius: spacing.inputRadius,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.backgroundSecondary,
  },
  countryText: {
    fontFamily: typography.fonts.inter.semiBold,
    fontSize: typography.sizes.m,
    color: colors.textPrimary,
  },
  phoneInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.inputRadius,
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
    fontFamily: typography.fonts.inter.normal,
    fontSize: typography.sizes.m,
    color: colors.textPrimary,
    backgroundColor: colors.cardBackground,
  },
  otpRow: {
    flexDirection: "row",
    gap: spacing.s,
    justifyContent: "space-between",
  },
  otpCell: {
    flex: 1,
    maxWidth: 64,
    height: 52,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.inputRadius,
    fontFamily: typography.fonts.inter.semiBold,
    fontSize: typography.sizes.xl,
    color: colors.textPrimary,
    backgroundColor: colors.cardBackground,
  },
  spacer: {
    flex: 1,
    minHeight: spacing.xl,
  },
});
