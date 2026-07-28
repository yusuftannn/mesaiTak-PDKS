import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import PageHeader from "../../src/components/PageHeader";
import { useHomeStore } from "../../src/store/home.store";
import { toDateSafe } from "../../src/utils/date";
import { formatMinutes } from "../../src/utils/time";
import { colors } from "../../src/core/theme";

function calcBreakMinutes(start: any, end: any) {
  const s = toDateSafe(start);
  const e = toDateSafe(end);
  if (!s) return 0;
  const endDate = e ?? new Date();
  return Math.floor((endDate.getTime() - s.getTime()) / 60000);
}

const BREAK_TYPES: Record<string, string> = {
  yemek: "Yemek Molası",
  cay_kahve: "Çay / Kahve",
  sigara: "Sigara",
};

function mapBreakType(type: string) {
  return BREAK_TYPES[type] ?? "Diğer";
}

export default function Break() {
  const { breaks } = useHomeStore();

  return (
    <View style={styles.container}>
      <PageHeader title="Mola" showBack={false} />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {breaks.length === 0 && (
          <View style={styles.empty}>
            <Ionicons
              name="cafe-outline"
              size={48}
              color={colors.textSecondary}
            />
            <Text style={styles.emptyText}>Henüz mola kaydı yok</Text>
          </View>
        )}

        {breaks.map((b, index) => {
          const minutes = calcBreakMinutes(b.start, b.end);
          const isActive = !b.end;
          const start = toDateSafe(b.start);
          const end = toDateSafe(b.end);
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
                {start ? start.toLocaleTimeString("tr-TR") : "--"}
                {" → "}
                {end ? end.toLocaleTimeString("tr-TR") : "—"}
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
    backgroundColor: colors.background,
  },

  content: {
    padding: 20,
    paddingBottom: 24,
  },

  empty: {
    alignItems: "center",
    marginTop: 80,
  },

  emptyText: {
    marginTop: 12,
    color: colors.textSecondary,
    fontSize: 14,
  },

  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: colors.secondary,
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },

  activeCard: {
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  type: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.textPrimary,
  },

  badge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },

  badgeText: {
    color: colors.surface,
    fontSize: 12,
    fontWeight: "600",
  },

  time: {
    marginTop: 8,
    fontSize: 14,
    color: colors.textPrimary,
  },

  duration: {
    marginTop: 4,
    fontSize: 13,
    color: colors.textSecondary,
  },
});
