import { useCallback, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { navigateToMain } from "@/navigation/root-navigation-ref";
import type { RootStackParamList } from "@/navigation/types";
import { colors, palette } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

/** Figma shows 6 OTP boxes */
const OTP_LENGTH = 6;

/** Figma button spec */
const BTN_FACE_H = 58;
const BTN_DEPTH = 8;
const BTN_RADIUS = 12;
const BTN_ORANGE = "#FF6D00";
const BTN_DEEP = "#FF3900";

interface Country {
  flag: string;
  name: string;
  dial: string;
}

const COUNTRIES: Country[] = [
  { flag: "🇮🇳", name: "India", dial: "+91" },
  { flag: "🇺🇸", name: "United States", dial: "+1" },
  { flag: "🇬🇧", name: "United Kingdom", dial: "+44" },
  { flag: "🇦🇪", name: "UAE", dial: "+971" },
  { flag: "🇸🇬", name: "Singapore", dial: "+65" },
  { flag: "🇨🇦", name: "Canada", dial: "+1" },
  { flag: "🇦🇺", name: "Australia", dial: "+61" },
  { flag: "🇩🇪", name: "Germany", dial: "+49" },
  { flag: "🇫🇷", name: "France", dial: "+33" },
  { flag: "🇯🇵", name: "Japan", dial: "+81" },
];

export function LoginScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState<string[]>(() => Array(OTP_LENGTH).fill(""));
  const [country, setCountry] = useState<Country>(COUNTRIES[0]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [focusedOtp, setFocusedOtp] = useState<number | null>(null);
  const otpRefs = useRef<Array<TextInput | null>>([]);
  const phoneRef = useRef<TextInput>(null);

  const digits = phone.replace(/\D/g, "");
  const phoneError = phone.length > 0 && digits.length !== 10;
  const canSubmit = digits.length === 10 && otp.join("").length === OTP_LENGTH;

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

  const onOtpKeyPress = useCallback(
    (index: number, key: string) => {
      if (key === "Backspace" && !otp[index] && index > 0) {
        otpRefs.current[index - 1]?.focus();
      }
    },
    [otp],
  );

  const handleContinue = useCallback(() => {
    if (!canSubmit) return;
    navigateToMain();
  }, [canSubmit]);

  const selectCountry = useCallback((c: Country) => {
    setCountry(c);
    setPickerOpen(false);
  }, []);

  return (
    <>
      {/* Country picker modal */}
      <Modal
        visible={pickerOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setPickerOpen(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setPickerOpen(false)} />
        <SafeAreaView style={styles.sheet}>
          <View style={styles.sheetHandle} />
          <Text style={styles.sheetTitle}>Select country</Text>
          <FlatList
            data={COUNTRIES}
            keyExtractor={(c) => c.name}
            renderItem={({ item }) => (
              <Pressable
                style={({ pressed }) => [
                  styles.countryRow,
                  pressed && styles.countryRowPressed,
                  item.dial === country.dial &&
                    item.name === country.name &&
                    styles.countryRowSelected,
                ]}
                onPress={() => selectCountry(item)}
              >
                <Text style={styles.countryRowFlag}>{item.flag}</Text>
                <Text style={styles.countryRowName}>{item.name}</Text>
                <Text style={styles.countryRowDial}>{item.dial}</Text>
                {item.name === country.name && (
                  <Ionicons
                    name="checkmark"
                    size={18}
                    color={colors.primary}
                  />
                )}
              </Pressable>
            )}
            ItemSeparatorComponent={() => <View style={styles.sep} />}
          />
        </SafeAreaView>
      </Modal>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View
          style={[
            styles.root,
            {
              paddingTop: insets.top + spacing.xs,
              paddingBottom: insets.bottom + spacing.l,
            },
          ]}
        >
          {/* Back */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => navigation.goBack()}
            style={styles.back}
            hitSlop={12}
          >
            <Ionicons name="chevron-back" size={28} color={colors.textPrimary} />
          </Pressable>

          {/* Heading — Figma: Manrope SemiBold 30 / -1% ls */}
          <Text style={styles.heading}>
            <Text style={styles.headingAccent}>Kickstart</Text>
            <Text style={styles.headingBase}>{" your journey"}</Text>
          </Text>

          {/* Caption — Figma: Inter Regular 14 / Surface·70 */}
          <Text style={styles.caption}>
            We will send you an OTP to verify your number.
          </Text>

          {/* ── Phone ─────────────────────────────────────── */}
          <Text style={styles.fieldLabel}>Phone number</Text>
          <View style={[styles.phoneRow, phoneError && styles.phoneRowError]}>
            <Pressable
              onPress={() => setPickerOpen(true)}
              style={styles.countryPill}
              accessibilityLabel="Select country code"
            >
              <Text style={styles.flag}>{country.flag}</Text>
              <Text style={styles.countryCode}>{country.dial}</Text>
              <Ionicons
                name="chevron-down"
                size={13}
                color={colors.textSecondary}
              />
            </Pressable>
            <View style={styles.divider} />
            <TextInput
              ref={phoneRef}
              value={phone}
              onChangeText={setPhone}
              placeholder="00000 00000"
              placeholderTextColor={colors.textDisabled}
              keyboardType="phone-pad"
              style={styles.phoneInput}
              accessibilityLabel="Phone number"
              returnKeyType="next"
              onSubmitEditing={() => otpRefs.current[0]?.focus()}
            />
          </View>

          {phoneError ? (
            <Text style={styles.fieldError}>
              Please enter a valid 10-digit mobile number.
            </Text>
          ) : null}

          {/* ── OTP ───────────────────────────────────────── */}
          <Text style={[styles.fieldLabel, styles.otpLabel]}>Enter the OTP</Text>
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
                onFocus={() => setFocusedOtp(i)}
                onBlur={() => setFocusedOtp(null)}
                keyboardType="number-pad"
                maxLength={1}
                placeholder="_"
                placeholderTextColor={palette.gray50}
                style={[
                  styles.otpCell,
                  focusedOtp === i && styles.otpCellFocused,
                  d ? styles.otpCellFilled : null,
                ]}
                textAlign="center"
                accessibilityLabel={`OTP digit ${i + 1}`}
                returnKeyType={i < OTP_LENGTH - 1 ? "next" : "done"}
                onSubmitEditing={() => {
                  if (i < OTP_LENGTH - 1) otpRefs.current[i + 1]?.focus();
                }}
              />
            ))}
          </View>

          <View style={styles.spacer} />

          {/* ── Continue button ────────────────────────────── */}
          <View
            style={[
              styles.ctaWrapper,
              !canSubmit && styles.ctaWrapperDisabled,
            ]}
          >
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Continue"
              onPress={handleContinue}
              disabled={!canSubmit}
            >
              {({ pressed }) => (
                <View
                  style={[
                    styles.ctaFace,
                    !canSubmit && styles.ctaFaceDisabled,
                    pressed && canSubmit && styles.ctaFacePressed,
                  ]}
                >
                  <Text
                    style={[
                      styles.ctaLabel,
                      !canSubmit && styles.ctaLabelDisabled,
                    ]}
                  >
                    Continue
                  </Text>
                </View>
              )}
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  root: { flex: 1, paddingHorizontal: spacing.screenPadding },
  back: { alignSelf: "flex-start", marginBottom: spacing.m },

  /* ── Heading ── Figma: Manrope SemiBold 30 -1% ls ──────── */
  heading: {
    fontSize: 30,
    lineHeight: 38,
    letterSpacing: -0.3,
    marginBottom: spacing.s,
    fontFamily: typography.fonts.inter.bold,
  },
  headingAccent: { color: colors.primary },
  headingBase: { color: colors.textPrimary },

  /* ── Caption ── Figma: Inter Regular 14 / Surface·70 ────── */
  caption: {
    fontFamily: typography.fonts.inter.normal,
    fontSize: 14,
    color: palette.gray60,
    marginBottom: spacing.xxl,
    lineHeight: 20,
  },

  /* ── Field labels ─────────────────────────────────────────  */
  fieldLabel: {
    fontFamily: typography.fonts.inter.medium,
    fontSize: typography.sizes.s,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  fieldError: {
    fontFamily: typography.fonts.inter.normal,
    fontSize: typography.sizes.xs,
    color: colors.error,
    marginTop: spacing.xxs,
    marginBottom: spacing.xs,
  },

  /* ── Phone row ────────────────────────────────────────────  */
  phoneRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.inputRadius,
    backgroundColor: palette.gray10,
    overflow: "hidden",
    height: 52,
  },
  phoneRowError: { borderColor: colors.error },
  countryPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.s,
    gap: spacing.xxs,
    height: "100%",
  },
  flag: { fontSize: 18, lineHeight: 22 },
  countryCode: {
    fontFamily: typography.fonts.inter.semiBold,
    fontSize: typography.sizes.m,
    color: colors.textPrimary,
  },
  divider: { width: 1, height: 28, backgroundColor: colors.border },
  phoneInput: {
    flex: 1,
    paddingHorizontal: spacing.m,
    fontFamily: typography.fonts.inter.normal,
    fontSize: typography.sizes.m,
    color: colors.textPrimary,
    height: "100%",
  },

  /* ── OTP ─────────────────────────────────────────────────── */
  otpLabel: { marginTop: spacing.xl },
  otpRow: { flexDirection: "row", gap: spacing.xs },
  otpCell: {
    flex: 1,
    height: 52,
    borderRadius: spacing.inputRadius,
    borderWidth: 0,
    backgroundColor: palette.gray20,
    fontFamily: typography.fonts.inter.bold,
    fontSize: typography.sizes.xl,
    color: colors.textPrimary,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  otpCellFocused: {
    backgroundColor: palette.gray30,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  otpCellFilled: {
    backgroundColor: palette.orange10,
    borderWidth: 1.5,
    borderColor: colors.primary,
    color: colors.primary,
  },

  spacer: { flex: 1, minHeight: spacing.xl },

  /* ── 3D Continue button ──────────────────────────────────── */
  ctaWrapper: {
    width: "100%",
    height: BTN_FACE_H + BTN_DEPTH,
    backgroundColor: BTN_DEEP,
    borderRadius: BTN_RADIUS,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
      android: { elevation: 8 },
      default: {},
    }),
  },
  ctaWrapperDisabled: {
    backgroundColor: colors.buttonDisabled,
    ...Platform.select({
      ios: { shadowOpacity: 0 },
      android: { elevation: 0 },
      default: {},
    }),
  },
  ctaFace: {
    height: BTN_FACE_H,
    backgroundColor: BTN_ORANGE,
    borderRadius: BTN_RADIUS,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  ctaFaceDisabled: { backgroundColor: colors.buttonDisabled },
  ctaFacePressed: { transform: [{ translateY: BTN_DEPTH }] },
  ctaLabel: {
    fontFamily: typography.fonts.inter.semiBold,
    fontSize: typography.sizes.m,
    color: "#fff",
  },
  ctaLabelDisabled: { color: colors.buttonDisabledText },

  /* ── Country picker modal ────────────────────────────────── */
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.xxl,
    maxHeight: "60%",
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: palette.gray30,
    alignSelf: "center",
    marginVertical: spacing.s,
  },
  sheetTitle: {
    fontFamily: typography.fonts.inter.semiBold,
    fontSize: typography.sizes.l,
    color: colors.textPrimary,
    marginBottom: spacing.m,
  },
  countryRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.s,
    gap: spacing.s,
    borderRadius: spacing.xs,
    paddingHorizontal: spacing.xs,
  },
  countryRowPressed: { backgroundColor: palette.gray10 },
  countryRowSelected: { backgroundColor: palette.orange10 },
  countryRowFlag: { fontSize: 22 },
  countryRowName: {
    flex: 1,
    fontFamily: typography.fonts.inter.normal,
    fontSize: typography.sizes.m,
    color: colors.textPrimary,
  },
  countryRowDial: {
    fontFamily: typography.fonts.inter.medium,
    fontSize: typography.sizes.m,
    color: colors.textSecondary,
  },
  sep: { height: 1, backgroundColor: palette.gray20 },
});
