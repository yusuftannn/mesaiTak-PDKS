import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Employee } from "../../store/adminUsers.store";
import { colors } from "../../core/theme";

export default function EmployeeCard({
  employee,
  onPress,
}: {
  employee: Employee;
  onPress?: () => void;
}) {
  const roleColor =
    employee.role === "admin"
      ? colors.accent
      : employee.role === "manager"
        ? colors.primary
        : colors.success;

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.left}>
        <Ionicons name="person-circle-outline" size={40} color={colors.textSecondary} />
        <View>
          <Text style={styles.name}>{employee.name ?? "İsimsiz"}</Text>
          <Text style={styles.email}>{employee.email}</Text>
        </View>
      </View>

      <View style={[styles.badge, { backgroundColor: roleColor + "22" }]}>
        <Text style={[styles.badgeText, { color: roleColor }]}>
          {employee.role.toUpperCase()}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    shadowColor: colors.secondary,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  name: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.textPrimary,
  },

  email: {
    fontSize: 13,
    color: colors.textSecondary,
  },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },

  badgeText: {
    fontSize: 12,
    fontWeight: "700",
  },
});
