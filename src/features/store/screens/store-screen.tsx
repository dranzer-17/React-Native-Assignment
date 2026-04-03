import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

export function StoreScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { paddingTop: insets.top + spacing.l }]}>
      <Text style={styles.title}>Store</Text>
      <Text style={styles.body}>
        README: third tab matches the Figma shell — add store content when you wire product data.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.screenPadding,
    alignItems: "center",
  },
  title: {
    fontFamily: typography.fonts.inter.bold,
    fontSize: typography.sizes.xxl,
    color: colors.textPrimary,
  },
  body: {
    marginTop: spacing.m,
    fontFamily: typography.fonts.inter.normal,
    fontSize: typography.sizes.m,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
  },
});
