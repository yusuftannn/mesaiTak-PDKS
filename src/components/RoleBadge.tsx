import { View, Text, StyleSheet } from "react-native";
import { colors } from "../core/theme";

export default function RoleBadge({ role }: { role: string }) {
  const bg =
    role === "admin"
      ? colors.accentSoft
      : role === "manager"
      ? colors.warningSoft
      : colors.primarySoft;

  const color =
    role === "admin"
      ? colors.accent
      : role === "manager"
      ? colors.warning
      : colors.primary;

  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[styles.text, { color }]}>
        {role.toUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  text: {
    fontSize: 12,
    fontWeight: "700",
  },
});
