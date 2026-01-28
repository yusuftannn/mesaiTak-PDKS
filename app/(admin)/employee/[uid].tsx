import { useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import PageHeader from "../../../src/components/PageHeader";
import { useAdminEmployeeDetailStore } from "../../../src/store/adminEmployeeDetail.store";
import { useAdminEmployeeHistoryStore } from "../../../src/store/adminEmployeeHistory.store";
import AppButton from "../../../src/components/AppButton";

export default function EmployeeDetail() {
  const { uid } = useLocalSearchParams<{ uid: string }>();

  const { loadUser, changeRole, user, loading, saving } =
    useAdminEmployeeDetailStore();
  const {
    loadHistory,
    leaves,
    shifts,
    loading: historyLoading,
  } = useAdminEmployeeHistoryStore();

  useEffect(() => {
    if (uid) loadUser(uid);
  }, [uid]);

  useEffect(() => {
    if (uid) loadHistory(uid);
  }, [uid]);

  if (loading || !user) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <PageHeader title="Çalışan Detayı" />

      <View style={styles.card}>
        <Text style={styles.name}>{user.name ?? "İsimsiz"}</Text>
        <Text style={styles.email}>{user.email}</Text>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>{user.role.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Rol Değiştir</Text>

        <AppButton
          title="Employee"
          variant={user.role === "employee" ? "primary" : "secondary"}
          onPress={() => changeRole("employee")}
        />

        <AppButton
          title="Manager"
          variant={user.role === "manager" ? "primary" : "secondary"}
          onPress={() => changeRole("manager")}
        />

        <AppButton
          title="Admin"
          variant={user.role === "admin" ? "danger" : "secondary"}
          onPress={() => changeRole("admin")}
        />

        {saving && <Text style={styles.saving}>Kaydediliyor…</Text>}
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>İzin Geçmişi</Text>

        {leaves.length === 0 && (
          <Text style={styles.empty}>İzin kaydı yok</Text>
        )}

        {leaves.map((l) => (
          <View key={l.id} style={styles.row}>
            <Text>
              {l.type} • {l.status}
            </Text>
          </View>
        ))}
      </View>
      {historyLoading && <Text style={styles.loading}>Geçmiş yükleniyor…</Text>}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Vardiya Geçmişi</Text>

        {shifts.length === 0 && (
          <Text style={styles.empty}>Vardiya kaydı yok</Text>
        )}

        {shifts.map((s) => (
          <View key={s.id} style={styles.row}>
            <Text>
              {s.startTime} - {s.endTime} • {s.type}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  card: {
    margin: 16,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 16,
    alignItems: "center",
  },

  name: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },

  email: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },

  badge: {
    marginTop: 12,
    backgroundColor: "#E5E7EB",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },

  badgeText: {
    fontWeight: "700",
    fontSize: 12,
  },

  section: {
    padding: 16,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 8,
  },

  saving: {
    marginTop: 8,
    textAlign: "center",
    color: "#6B7280",
  },
  row: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },

  empty: {
    color: "#9CA3AF",
    fontSize: 13,
    marginBottom: 8,
  },
  loading: {
    textAlign: "center",
    color: "#6B7280",
    marginTop: 12,
  },
});
