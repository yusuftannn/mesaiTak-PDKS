import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../core/theme";

/**
 * @param {{
 *   title: string;
 *   showBack?: boolean;
 *   leftIcon?: keyof typeof Ionicons.glyphMap;
 *   onLeftPress?: (() => void) | null;
 *   rightIcon?: keyof typeof Ionicons.glyphMap;
 *   onRightPress?: (() => void) | null;
 * }} props
 */
export default function PageHeader({
  title,
  showBack = true,
  leftIcon = null,
  onLeftPress = null,
  rightIcon = null,
  onRightPress = null,
}) {
  const router = useRouter();

  return (
    <SafeAreaView edges={["top"]} style={styles.safe}>
      <View style={styles.header}>
        {leftIcon && onLeftPress ? (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onLeftPress}
            accessibilityRole="button"
          >
            <Ionicons name={leftIcon} size={25} color={colors.secondary} />
          </TouchableOpacity>
        ) : showBack ? (
          <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={26} color={colors.secondary} />
          </TouchableOpacity>
        ) : (
          <View style={styles.iconButton} />
        )}

        <Text style={styles.title}>{title}</Text>

        {rightIcon && onRightPress ? (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onRightPress}
            accessibilityRole="button"
          >
            <Ionicons name={rightIcon} size={26} color={colors.secondary} />
          </TouchableOpacity>
        ) : (
          <View style={styles.iconButton} />
        )}
      </View>

      <View style={styles.divider} />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safe: {
    backgroundColor: colors.surface,
  },
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    backgroundColor: colors.surface,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.secondary,
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  divider: {
    height: 3,
    backgroundColor: colors.secondary,
  },
});
