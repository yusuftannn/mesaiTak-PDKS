import { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import PageHeader from "../../src/components/PageHeader";
import { useAdminDashboardStore } from "../../src/store/adminDashboard.store";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../../src/store/auth.store";
import { auth } from "../../src/services/firebase";
function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number;
  icon: any;
  color: string;
}) {
  return (
    <View style={[styles.card, { borderLeftColor: color }]}>
      <Ionicons name={icon} size={26} color={color} />
      <View>
        <Text style={styles.cardValue}>{value}</Text>
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
    </View>
  );
}

export default function AdminDashboard() {
  const {
    loadDashboard,
    loading,
    error,
    totalEmployees,
    workingCount,
    breakCount,
    activeCount,
  } = useAdminDashboardStore();
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);

  const safeLoad = async () => {
    try {
      await loadDashboard();
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
  }, [loadDashboard]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (e) {
      console.log("Logout error:", e);
    } finally {
      logout();
      router.replace("/(auth)/login");
    }
  };

  return (
    <View style={styles.container}>
      <PageHeader title="Admin Dashboard" showBack={false} />
      <View style={styles.header}>
        <TouchableOpacity onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#DC2626" />
        </TouchableOpacity>
      </View>

      <View style={styles.grid}>
        <StatCard
          title="Toplam Çalışan"
          value={totalEmployees}
          icon="people-outline"
          color="#2563EB"
        />

        <StatCard
          title="Aktif Çalışan"
          value={activeCount}
          icon="pulse-outline"
          color="#16A34A"
        />

        <StatCard
          title="Çalışıyor"
          value={workingCount}
          icon="play-circle-outline"
          color="#0EA5E9"
        />

        <StatCard
          title="Molada"
          value={breakCount}
          icon="cafe-outline"
          color="#F59E0B"
        />
      </View>
      {!loading && error && (
        <View style={styles.errorBox}>
          <Ionicons name="alert-circle-outline" size={20} color="#DC2626" />
          <Text style={styles.errorText}>{error}</Text>

          <TouchableOpacity onPress={safeLoad} style={styles.retryBtn}>
            <Text style={styles.retryText}>Tekrar Dene</Text>
          </TouchableOpacity>
        </View>
      )}

      {loading && <Text style={styles.loading}>Veriler yükleniyor…</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
  },

  grid: {
    padding: 16,
    gap: 12,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },

  cardValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },

  cardTitle: {
    fontSize: 13,
    color: "#6B7280",
  },

  loading: {
    textAlign: "center",
    color: "#6B7280",
    marginTop: 12,
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
