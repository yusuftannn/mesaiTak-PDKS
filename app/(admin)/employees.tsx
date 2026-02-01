import { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import PageHeader from "../../src/components/PageHeader";
import EmployeeCard from "../../src/components/admin/EmployeeCard";
import { useAdminEmployeesStore } from "../../src/store/adminUsers.store";
import { useAuthStore } from "../../src/store/auth.store";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { auth } from "../../src/services/firebase";

export default function AdminEmployees() {
  const { loadEmployees, employees, loading, error } = useAdminEmployeesStore();

  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);

  const safeLoad = async () => {
    try {
      await loadEmployees();
    } catch (err: any) {
      if (err?.code === "permission-denied" || err?.code?.startsWith("auth/")) {
        await auth.signOut();
        logout();
        router.replace("/(auth)/login");
      }
    }
  };

  useEffect(() => {
    safeLoad();
  }, [loadEmployees]);

  return (
    <View style={styles.container}>
      <PageHeader title="Çalışanlar" showBack={false} />

      {loading && <Text style={styles.loading}>Yükleniyor…</Text>}

      {!loading && error && (
        <View style={styles.errorBox}>
          <Ionicons name="alert-circle-outline" size={20} color="#DC2626" />
          <Text style={styles.errorText}>{error}</Text>

          <TouchableOpacity onPress={safeLoad} style={styles.retryBtn}>
            <Text style={styles.retryText}>Tekrar Dene</Text>
          </TouchableOpacity>
        </View>
      )}

      {!loading && !error && employees.length === 0 && (
        <Text style={styles.empty}>Henüz çalışan bulunmuyor</Text>
      )}

      {!loading && !error && (
        <FlatList
          data={employees}
          keyExtractor={(item) => item.uid}
          renderItem={({ item }) => (
            <EmployeeCard
              employee={item}
              onPress={() => router.push(`/(admin)/employee/${item.uid}`)}
            />
          )}
          contentContainerStyle={{ padding: 16 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },

  loading: {
    textAlign: "center",
    marginTop: 12,
    color: "#6B7280",
  },

  empty: {
    textAlign: "center",
    marginTop: 24,
    color: "#9CA3AF",
  },
  errorBox: {
    marginHorizontal: 16,
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FCA5A5",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  errorText: {
    flex: 1,
    color: "#991B1B",
    fontSize: 13,
  },

  retryBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#DC2626",
  },

  retryText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
});
