import { useState, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import PageHeader from "../../src/components/PageHeader";
import { useAdminLeavesStore } from "../../src/store/adminLeaves.store";
import { useAuthStore } from "../../src/store/auth.store";
import LeaveReviewModal from "../../src/components/admin/LeaveReviewModal";
import { LeaveDoc } from "../../src/services/leave.service";

export default function AdminLeaves() {
  const { leaves, loadLeaves, approve, reject } = useAdminLeavesStore();
  const admin = useAuthStore((s) => s.user);

  const [selected, setSelected] = useState<LeaveDoc | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadLeaves();
    }, []),
  );

  const pendingLeaves = leaves.filter((l) => l.status === "beklemede");
  const approvedLeaves = leaves.filter((l) => l.status === "onaylandı");

  return (
    <View style={styles.container}>
      <PageHeader title="İzin Yönetimi" />

      <ScrollView>
        <Text style={styles.sectionTitle}>Bekleyen İzin Talepleri</Text>

        {pendingLeaves.length === 0 && (
          <Text style={styles.empty}>Bekleyen izin yok</Text>
        )}

        {pendingLeaves.map((l) => (
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

        <Text style={styles.sectionTitle}>Onaylanan İzinler</Text>

        {approvedLeaves.length === 0 && (
          <Text style={styles.empty}>Henüz onaylanan izin yok</Text>
        )}

        {approvedLeaves.map((l) => (
          <View key={l.id} style={[styles.card, styles.approvedCard]}>
            <Text style={styles.bold}>{l.type}</Text>
            <Text>
              {l.startDate.toDate().toLocaleDateString("tr-TR")} →{" "}
              {l.endDate.toDate().toLocaleDateString("tr-TR")}
            </Text>
            <Text style={styles.approvedText}>Onaylandı</Text>
          </View>
        ))}
      </ScrollView>

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
  sectionTitle: {
    marginTop: 16,
    marginLeft: 12,
    fontSize: 16,
    fontWeight: "700",
  },
  empty: {
    margin: 12,
    color: "#6B7280",
  },
  card: {
    backgroundColor: "#fff",
    margin: 12,
    padding: 16,
    borderRadius: 12,
  },
  approvedCard: {
    backgroundColor: "#ECFDF5",
  },
  approvedText: {
    marginTop: 6,
    color: "#059669",
    fontWeight: "600",
  },
  bold: {
    fontWeight: "700",
  },
});
