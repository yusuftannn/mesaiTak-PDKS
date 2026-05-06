import { useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import PageHeader from "../../src/components/PageHeader";
import { useAuthStore } from "../../src/store/auth.store";
import { useShiftStore } from "../../src/store/shift.store";
import { colors } from "../../src/core/theme";

export default function Shift() {
  const user = useAuthStore((s) => s.user);
  const { loading, shifts, todayShift, loadShifts } = useShiftStore();

  useEffect(() => {
    if (!user?.uid) return;
    loadShifts(user.uid);
  }, [user?.uid]);

  const capitalize = (text?: string) => {
    if (!text) return "Tanımlı değil";
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  function toDateAny(value: any): Date {
    if (!value) return new Date(NaN);

    if (typeof value.toDate === "function") return value.toDate();
    if (typeof value.seconds === "number")
      return new Date(value.seconds * 1000);
    if (value instanceof Date) return value;

    return new Date(value);
  }

  function formatTR(dateValue: any) {
    const date = toDateAny(dateValue);

    return new Intl.DateTimeFormat("tr-TR", {
      timeZone: "Europe/Istanbul",
      weekday: "long",
      day: "numeric",
      month: "long",
    }).format(date);
  }

  return (
    <View style={styles.container}>
      <PageHeader title="Vardiya" showBack={false} />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.todayCard}>
          <View style={styles.todayRow}>
            <Ionicons name="calendar-outline" size={24} color={colors.primary} />
            <Text style={styles.todayTitle}>Bugünkü Vardiya</Text>
          </View>

          {todayShift ? (
            <>
              <Text style={styles.todayTime}>
                {todayShift.startTime} → {todayShift.endTime}
              </Text>

              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {capitalize(todayShift.type) || "Tanımlı değil"}
                </Text>
              </View>
            </>
          ) : (
            <Text style={styles.emptyText}>Bugün vardiya yok</Text>
          )}
        </View>

        <Text style={styles.sectionTitle}>Tüm Vardiyalar</Text>

        {loading && <Text style={styles.subText}>Yükleniyor…</Text>}

        {!loading && shifts.length === 0 && (
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-clear-outline" size={48} color={colors.textSecondary} />

            <Text style={styles.emptyTitle}>Henüz vardiya yok</Text>

            <Text style={styles.emptyDesc}>
              Tanımlanmış vardiyan bulunmuyor. Yöneticin sana vardiya atadığında
              burada görünecek.
            </Text>
          </View>
        )}

        {!loading &&
          shifts.length > 0 &&
          shifts.map((s) => (
            <View key={s.id} style={styles.card}>
              <View style={styles.row}>
                <View>
                  <Text style={styles.day}>{formatTR(s.date)}</Text>
                </View>

                <View style={styles.right}>
                  <Text style={styles.time}>
                    {s.startTime} → {s.endTime}
                  </Text>
                  <Text style={styles.type}>{s.type || "Tanımlı değil"}</Text>
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
    backgroundColor: colors.background,
  },

  content: {
    padding: 20,
    paddingBottom: 24,
  },

  todayCard: {
    backgroundColor: colors.primarySoft,
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
  
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: colors.surface,
    borderRadius: 16,
    marginTop: 10,
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textPrimary,
    marginTop: 12,
  },

  emptyDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: 6,
    lineHeight: 18,
  },
  
  todayTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.primaryDark,
  },

  todayTime: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 8,
  },

  badge: {
    alignSelf: "flex-start",
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },

  badgeText: {
    color: colors.surface,
    fontSize: 12,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  subText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: 12,
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

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  day: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.textPrimary,
  },

  date: {
    fontSize: 13,
    color: colors.textSecondary,
  },

  right: {
    alignItems: "flex-end",
  },

  time: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary,
  },

  type: {
    fontSize: 13,
    color: colors.textSecondary,
    textTransform: "capitalize",
  },
});
