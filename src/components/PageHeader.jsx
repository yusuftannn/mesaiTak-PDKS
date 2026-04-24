import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/**
 * @param {{
 *   title: string;
 *   showBack?: boolean;
 *   rightIcon?: keyof typeof Ionicons.glyphMap;
 *   onRightPress?: (() => void) | null;
 * }} props
 */
export default function PageHeader({
  title,
  showBack = true,
  rightIcon = null,
  onRightPress = null,
}) {
  const router = useRouter();

  return (
    <SafeAreaView edges={["top"]} style={styles.safe}>
      <View style={styles.header}>
        {showBack ? (
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={26} color="#000" />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 26 }} />
        )}

        <Text style={styles.title}>{title}</Text>

        {rightIcon && onRightPress ? (
          <TouchableOpacity onPress={onRightPress}>
            <Ionicons name={rightIcon} size={26} color="#000" />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 26 }} />
        )}
      </View>

      <View style={styles.divider} />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safe: {
    backgroundColor: "#fff",
  },
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  divider: {
    height: 3,
    backgroundColor: "#000",
  },
});
