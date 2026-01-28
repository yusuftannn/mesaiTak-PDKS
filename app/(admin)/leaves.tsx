import { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import PageHeader from "../../src/components/PageHeader";
import { useAdminLeavesStore } from "../../src/store/adminLeaves.store";
import { useAuthStore } from "../../src/store/auth.store";
import LeaveReviewModal from "../../src/components/admin/LeaveReviewModal";
import { LeaveDoc } from "../../src/services/leave.service";

export default function AdminLeaves() {
  const { leaves, loadLeaves, approve, reject } = useAdminLeavesStore();
  const admin = useAuthStore((s) => s.user);

  const [selected, setSelected] = useState<LeaveDoc | null>(null);

  useEffect(() => {
    loadLeaves();
  }, []);

  return (
    <View style={styles.container}>
      <PageHeader title="İzin Talepleri" />

      {leaves
        .filter((l) => l.status === "pending")
        .map((l) => (
          <TouchableOpacity
            key={l.id}
            style={styles.card}
            onPress={() => setSelected(l)}
          >
            <Text style={styles.bold}>{l.type}</Text>
            <Text>
              {l.startDate.toDate().toLocaleDateString("tr-TR")} →{" "}
              {l.endDate.toDate().toLocaleDateString("tr-TR")}
            </Text>
          </TouchableOpacity>
        ))}

      <LeaveReviewModal
        visible={!!selected}
        leave={selected}
        onClose={() => setSelected(null)}
        onApprove={async () => {
          await approve(selected!.id, admin!.uid);
          setSelected(null);
          loadLeaves();
        }}
        onReject={async (reason) => {
          if (!reason) return;
          await reject(selected!.id, admin!.uid, reason);
          setSelected(null);
          loadLeaves();
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
  card: {
    backgroundColor: "#fff",
    margin: 12,
    padding: 16,
    borderRadius: 12,
  },
  bold: {
    fontWeight: "700",
  },
});
