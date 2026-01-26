import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import PageHeader from "../../src/components/PageHeader";

/* mock data */
const weeklyShifts = [
  {
    day: "Pazartesi",
    date: "22.01.2026",
    start: "09:00",
    end: "18:00",
    type: "Gündüz",
  },
  {
    day: "Salı",
    date: "23.01.2026",
    start: "09:00",
    end: "18:00",
    type: "Gündüz",
  },
  {
    day: "Çarşamba",
    date: "24.01.2026",
    start: "13:00",
    end: "22:00",
    type: "Akşam",
  },
  {
    day: "Perşembe",
    date: "25.01.2026",
    start: "09:00",
    end: "18:00",
    type: "Gündüz",
  },
  {
    day: "Cuma",
    date: "26.01.2026",
    start: "09:00",
    end: "18:00",
    type: "Gündüz",
  },
];

export default function Shift() {
  return (
    <View style={styles.container}>
      <PageHeader title="Vardiya" showBack={true} />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.todayCard}>
          <View style={styles.todayRow}>
            <Ionicons name="calendar-outline" size={24} color="#2563EB" />
            <Text style={styles.todayTitle}>Bugünkü Vardiya</Text>
          </View>

          <Text style={styles.todayTime}>09:00 → 18:00</Text>

          <View style={styles.badge}>
            <Text style={styles.badgeText}>Gündüz</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Haftalık Vardiya Planı</Text>

        {weeklyShifts.map((s, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.row}>
              <View>
                <Text style={styles.day}>{s.day}</Text>
                <Text style={styles.date}>{s.date}</Text>
              </View>

              <View style={styles.right}>
                <Text style={styles.time}>
                  {s.start} → {s.end}
                </Text>
                <Text style={styles.type}>{s.type}</Text>
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
