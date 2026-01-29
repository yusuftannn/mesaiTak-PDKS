import { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, SectionList } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import PageHeader from "../../src/components/PageHeader";
import AppButton from "../../src/components/AppButton";
import LeaveRequestModal from "../../src/components/LeaveRequestModal";

import { useAuthStore } from "../../src/store/auth.store";
import { useLeaveStore } from "../../src/store/leave.store";

export default function Leave() {
  const user = useAuthStore((s) => s.user);
  const { leaves, listenMyLeaves, stopListening, sendLeave } = useLeaveStore();

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!user?.uid) return;
    listenMyLeaves(user.uid);
    return () => stopListening();
  }, [user?.uid]);

  const sections = useMemo(() => {
    const grouped = leaves.reduce(
      (acc, l) => {
        const year = l.startDate.toDate().getFullYear();
        if (!acc[year]) acc[year] = [];
        acc[year].push(l);
        return acc;
      },
      {} as Record<number, typeof leaves>,
    );

    return Object.keys(grouped)
      .sort((a, b) => Number(b) - Number(a))
      .map((year) => ({
        title: year,
        data: grouped[Number(year)],
      }));
  }, [leaves]);

  const statusIcon = (status: string) => {
    switch (status) {
      case "onaylandı":
        return "check-circle";
      case "reddedildi":
        return "cancel";
      default:
        return "hourglass-top";
    }
  };

  return (
    <View style={styles.container}>
      <PageHeader title="İzinlerim" showBack={false} />

      <View style={styles.actions}>
        <AppButton title="Yeni İzin Talebi" onPress={() => setOpen(true)} />
      </View>

      {leaves.length === 0 ? (
        <Text style={styles.empty}>
          Henüz oluşturulmuş bir izin talebiniz bulunmamaktadır.
        </Text>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 32 }}
          renderSectionHeader={({ section }) => (
            <View style={styles.yearHeader}>
              <MaterialIcons name="calendar-today" size={18} color="#0F172A" />
              <Text style={styles.yearText}>{section.title}</Text>
            </View>
          )}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.topRow}>
                <Text style={styles.type}>{item.type}</Text>

                <View
                  style={[
                    styles.badge,
                    item.status === "onaylandı" && styles.success,
                    item.status === "reddedildi" && styles.error,
                  ]}
                >
                  <MaterialIcons
                    name={statusIcon(item.status)}
                    size={14}
                    color="#0F172A"
                  />
                  <Text style={styles.badgeText}>{item.status}</Text>
                </View>
              </View>

              <View style={styles.dateRow}>
                <MaterialIcons name="date-range" size={16} color="#64748B" />
                <Text style={styles.dateText}>
                  {item.startDate.toDate().toLocaleDateString("tr-TR")} →{" "}
                  {item.endDate.toDate().toLocaleDateString("tr-TR")}
                </Text>
              </View>

              {item.status === "reddedildi" && item.rejectReason && (
                <View style={styles.rejectBox}>
                  <MaterialIcons
                    name="info-outline"
                    size={16}
                    color="#B91C1C"
                  />
                  <Text style={styles.rejectText}>{item.rejectReason}</Text>
                </View>
              )}
            </View>
          )}
        />
      )}

      <LeaveRequestModal
        visible={open}
        onClose={() => setOpen(false)}
        onSubmit={async (data) => {
          await sendLeave({
            userId: user!.uid,
            ...data,
          });
        }}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F5F9",
  },

  actions: {
    paddingHorizontal: 16,
    marginVertical: 12,
  },

  empty: {
    textAlign: "center",
    marginTop: 40,
    color: "#64748B",
  },

  yearHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 10,
  },

  yearText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 4,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  type: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
  },

  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: "#E0E7FF",
  },

  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },

  success: {
    backgroundColor: "#DCFCE7",
  },

  error: {
    backgroundColor: "#FEE2E2",
  },

  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 10,
  },

  dateText: {
    color: "#475569",
  },

  rejectBox: {
    flexDirection: "row",
    gap: 6,
    marginTop: 10,
  },

  rejectText: {
    color: "#B91C1C",
    fontSize: 13,
  },
});
