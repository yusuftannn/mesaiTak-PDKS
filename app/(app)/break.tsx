import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import PageHeader from "../../src/components/PageHeader";
import { useHomeStore } from "../../src/store/home.store";
import { toDateSafe } from "../../src/utils/date";
import { formatMinutes } from "../../src/utils/time";

function calcBreakMinutes(start: any, end: any) {
  const s = toDateSafe(start);
  const e = toDateSafe(end);
  if (!s) return 0;
  const endDate = e ?? new Date();
  return Math.floor((endDate.getTime() - s.getTime()) / 60000);
}

function mapBreakType(type: string) {
  switch (type) {
    case "yemek":
      return "Yemek Molası";
    case "cay_kahve":
      return "Çay / Kahve";
    case "sigara":
      return "Sigara";
    default:
      return "Diğer";
  }
}

export default function Break() {
  const { breaks } = useHomeStore();

  return (
    <View style={styles.container}>
      <PageHeader title="Mola" showBack={true} />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {breaks.length === 0 && (
          <View style={styles.empty}>
            <Ionicons name="cafe-outline" size={48} color="#9CA3AF" />
            <Text style={styles.emptyText}>Henüz mola kaydı yok</Text>
          </View>
        )}

        {breaks.map((b, index) => {
          const minutes = calcBreakMinutes(b.start, b.end);
          const isActive = !b.end;

          return (
            <View
              key={index}
              style={[styles.card, isActive && styles.activeCard]}
            >
              <View style={styles.row}>
                <Text style={styles.type}>{mapBreakType(b.type)}</Text>

                {isActive && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>Devam ediyor</Text>
                  </View>
                )}
              </View>

              <Text style={styles.time}>
                {toDateSafe(b.start)
                  ? toDateSafe(b.start)!.toLocaleTimeString("tr-TR")
                  : "--"}
                {" → "}
                {toDateSafe(b.end)
                  ? toDateSafe(b.end)!.toLocaleTimeString("tr-TR")
                  : "—"}
              </Text>

              <Text style={styles.duration}>
                Süre: {formatMinutes(minutes)}
              </Text>
            </View>
          );
        })}
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

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
  },

  empty: {
    alignItems: "center",
    marginTop: 80,
  },

  emptyText: {
    marginTop: 12,
    color: "#6B7280",
    fontSize: 14,
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

  activeCard: {
    borderWidth: 1,
    borderColor: "#2563EB",
    backgroundColor: "#EFF6FF",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  type: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },

  badge: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },

  badgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },

  time: {
    marginTop: 8,
    fontSize: 14,
    color: "#374151",
  },

  duration: {
    marginTop: 4,
    fontSize: 13,
    color: "#6B7280",
  },
});
