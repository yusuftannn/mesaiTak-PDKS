import { View, Text, StyleSheet } from "react-native";

export default function RoleBadge({ role }: { role: string }) {
  const bg =
    role === "admin"
      ? "#FEE2E2"
      : role === "manager"
      ? "#FEF3C7"
      : "#DBEAFE";

  const color =
    role === "admin"
      ? "#DC2626"
      : role === "manager"
      ? "#D97706"
      : "#2563EB";

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
