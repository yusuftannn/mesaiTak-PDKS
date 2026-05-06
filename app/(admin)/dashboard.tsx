import { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import PageHeader from "../../src/components/PageHeader";
import { useAdminDashboardStore } from "../../src/store/adminDashboard.store";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../../src/store/auth.store";
import { auth } from "../../src/services/firebase";
import { colors } from "../../src/core/theme";
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
          <Ionicons name="log-out-outline" size={24} color={colors.accent} />
        </TouchableOpacity>
      </View>

      <View style={styles.grid}>
        <StatCard
          title="Toplam Çalışan"
          value={totalEmployees}
          icon="people-outline"
          color={colors.primary}
        />

        <StatCard
          title="Aktif Çalışan"
          value={activeCount}
          icon="pulse-outline"
          color={colors.success}
        />

        <StatCard
          title="Çalışıyor"
          value={workingCount}
          icon="play-circle-outline"
          color={colors.primary}
        />

        <StatCard
          title="Molada"
          value={breakCount}
          icon="cafe-outline"
          color={colors.warning}
        />
      </View>
      {!loading && error && (
        <View style={styles.errorBox}>
          <Ionicons name="alert-circle-outline" size={20} color={colors.accent} />
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
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.surface,
  },

  grid: {
    padding: 16,
    gap: 12,
  },

  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderLeftWidth: 4,
    shadowColor: colors.secondary,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },

  cardValue: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.textPrimary,
  },

  cardTitle: {
    fontSize: 13,
    color: colors.textSecondary,
  },

  loading: {
    textAlign: "center",
    color: colors.textSecondary,
    marginTop: 12,
  },
  errorBox: {
    marginHorizontal: 16,
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: colors.accentSoft,
    borderWidth: 1,
    borderColor: colors.accentMuted,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  errorText: {
    flex: 1,
    color: colors.accent,
    fontSize: 13,
  },

  retryBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: colors.accent,
  },

  retryText: {
    color: colors.surface,
    fontSize: 12,
    fontWeight: "600",
  },
});
