import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { useAuthStore } from "../../src/store/auth.store";
import AppButton from "../../src/components/AppButton";
import { auth } from "../../src/services/firebase";

export default function Profile() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();

  const handleLogout = async () => {
    await auth.signOut();
    logout();
    router.replace("/(auth)/login");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="person-circle" size={88} color="#2563EB" />
        <Text style={styles.name}>{user?.name ?? "Kullanıcı"}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Rol</Text>
        <Text style={styles.value}>{user?.role ?? "-"}</Text>

        <Text style={styles.label}>Şirket</Text>
        <Text style={styles.value}>{user?.companyId ?? "Tanımlı değil"}</Text>

        <Text style={styles.label}>Şube</Text>
        <Text style={styles.value}>{user?.branchId ?? "Tanımlı değil"}</Text>
      </View>

      <View style={styles.actions}>
        <AppButton
          title="Profili Düzenle"
          variant="secondary"
          onPress={() => router.push("/(app)/edit-profile")}
        />

        <View style={{ marginTop: 12 }}>
          <AppButton
            title="Çıkış Yap"
            variant="danger"
            onPress={handleLogout}
          />
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 20,
  },

  header: {
    alignItems: "center",
    marginBottom: 24,
  },

  name: {
    marginTop: 12,
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
  },

  email: {
    marginTop: 4,
    fontSize: 14,
    color: "#6B7280",
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },

  label: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 12,
  },

  value: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },

  actions: {
    marginTop: "auto",
  },
});
