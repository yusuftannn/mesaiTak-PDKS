import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import PageHeader from "../../src/components/PageHeader";
import AppButton from "../../src/components/AppButton";
import LeaveRequestModal from "../../src/components/LeaveRequestModal";

import { useAuthStore } from "../../src/store/auth.store";
import { useLeaveStore } from "../../src/store/leave.store";

export default function Leave() {
  const user = useAuthStore((s) => s.user);

  const { leaves, listenMyLeaves, stopListening, sendLeave, loading } =
    useLeaveStore();

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!user?.uid) return;

    listenMyLeaves(user.uid);
    return () => stopListening();
  }, [user?.uid]);

  return (
    <View style={styles.container}>
      <PageHeader title="İzin" showBack={false} />

      <View style={styles.actions}>
        <AppButton title="İzin Talep Et" onPress={() => setOpen(true)} />
      </View>

      {leaves.length === 0 && (
        <Text style={styles.empty}>Henüz izin talebiniz yok</Text>
      )}

      {leaves.map((l) => (
        <View key={l.id} style={styles.card}>
          <Text style={styles.type}>{l.type}</Text>

          <Text style={styles.date}>
            {l.startDate.toDate().toLocaleDateString("tr-TR")} →{" "}
            {l.endDate.toDate().toLocaleDateString("tr-TR")}
          </Text>

          <Text
            style={[
              styles.status,
              l.status === "approved" && { color: "#16A34A" },
              l.status === "rejected" && { color: "#DC2626" },
            ]}
          >
            {l.status}
          </Text>

          {l.status === "rejected" && l.rejectReason && (
            <Text style={styles.rejectReason}>
              Red Sebebi: {l.rejectReason}
            </Text>
          )}
        </View>
      ))}

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
    backgroundColor: "#F9FAFB",
  },

  actions: {
    paddingHorizontal: 16,
    marginTop: 12,
  },

  empty: {
    textAlign: "center",
    marginTop: 40,
    color: "#6B7280",
  },

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },

  type: {
    fontWeight: "700",
    fontSize: 15,
    marginBottom: 4,
  },

  date: {
    color: "#374151",
  },

  status: {
    marginTop: 6,
    fontWeight: "600",
    color: "#2563EB",
  },

  rejectReason: {
    marginTop: 6,
    color: "#DC2626",
    fontSize: 13,
  },
});
