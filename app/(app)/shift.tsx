import { useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import PageHeader from "../../src/components/PageHeader";
import { useAuthStore } from "../../src/store/auth.store";
import { useShiftStore } from "../../src/store/shift.store";

export default function Shift() {
  const user = useAuthStore((s) => s.user);
  const { loading, shifts, todayShift, loadShifts } = useShiftStore();

  useEffect(() => {
    if (!user?.uid) return;
    loadShifts(user.uid);
  }, [user?.uid]);

  return (
    <View style={styles.container}>
      <PageHeader title="Vardiya" showBack={false} />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.todayCard}>
          <View style={styles.todayRow}>
            <Ionicons name="calendar-outline" size={24} color="#2563EB" />
            <Text style={styles.todayTitle}>Bugünkü Vardiya</Text>
          </View>

          {todayShift ? (
            <>
              <Text style={styles.todayTime}>
                {todayShift.startTime} → {todayShift.endTime}
              </Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {todayShift.type === "day" ? "Gündüz" : "Gece"}
                </Text>
              </View>
            </>
          ) : (
            <Text style={styles.emptyText}>Bugün vardiya yok</Text>
          )}
        </View>

        <Text style={styles.sectionTitle}>Tüm Vardiyalar</Text>

        {loading && <Text style={styles.subText}>Yükleniyor…</Text>}

        {!loading &&
          shifts.map((s) => (
            <View key={s.id} style={styles.card}>
              <View style={styles.row}>
                <View>
                  <Text style={styles.day}>{s.date}</Text>
                </View>

                <View style={styles.right}>
                  <Text style={styles.time}>
                    {s.startTime} → {s.endTime}
                  </Text>
                  <Text style={styles.type}>
                    {s.type === "day" ? "Gündüz" : "Gece"}
                  </Text>
                </View>
              </View>
            </View>
          ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },

  content: {
    padding: 20,
    paddingBottom: 24,
  },

  todayCard: {
    backgroundColor: "#EFF6FF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },

  todayRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },

  todayTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E3A8A",
  },

  todayTime: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },

  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#2563EB",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },

  badgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  subText: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
    color: "#6B7280",
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  day: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },

  date: {
    fontSize: 13,
    color: "#6B7280",
  },

  right: {
    alignItems: "flex-end",
  },

  time: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },

  type: {
    fontSize: 13,
    color: "#6B7280",
  },
});
