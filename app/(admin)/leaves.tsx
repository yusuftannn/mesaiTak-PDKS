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
import LeaveReviewModal from "../../src/components/admin/LeaveReviewModal";

import { useAdminLeavesStore } from "../../src/store/adminLeaves.store";
import { useAuthStore } from "../../src/store/auth.store";
import { LeaveDoc } from "../../src/services/leave.service";

const FILTERS = [
  { key: "pending", label: "Bekleyen" },
  { key: "approved", label: "Onaylanan" },
  { key: "rejected", label: "Reddedilen" },
  { key: "all", label: "Tümü" },
] as const;

export default function AdminLeaves() {
  const { leaves, loadLeaves, approve, reject, filter, setFilter } =
    useAdminLeavesStore();

  const admin = useAuthStore((s) => s.user);
  const [selected, setSelected] = useState<LeaveDoc | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadLeaves();
    }, []),
  );

  const filteredLeaves = leaves.filter((l) => {
    if (filter === "pending") return l.status === "beklemede";
    if (filter === "approved") return l.status === "onaylandı";
    if (filter === "rejected") return l.status === "reddedildi";
    return true;
  });

  return (
    <View style={styles.container}>
      <PageHeader title="İzin Yönetimi" />

      <View style={styles.filters}>
        {FILTERS.map((f) => {
          const active = filter === f.key;
          return (
            <TouchableOpacity
              key={f.key}
              onPress={() => setFilter(f.key)}
              style={[styles.filterBtn, active && styles.filterBtnActive]}
            >
              <Text
                style={[styles.filterText, active && styles.filterTextActive]}
              >
                {f.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView>
        {filteredLeaves.length === 0 && (
          <Text style={styles.empty}>Kayıt bulunamadı</Text>
        )}

        {filteredLeaves.map((l) => {
          const isPending = l.status === "beklemede";
          const isApproved = l.status === "onaylandı";
          const isRejected = l.status === "reddedildi";

          return (
            <TouchableOpacity
              key={l.id}
              style={[
                styles.card,
                isApproved && styles.approvedCard,
                isRejected && styles.rejectedCard,
              ]}
              onPress={() => isPending && setSelected(l)}
              activeOpacity={isPending ? 0.7 : 1}
            >
              <Text style={styles.bold}>{l.type}</Text>

              <Text style={styles.date}>
                {l.startDate.toDate().toLocaleDateString("tr-TR")} →{" "}
                {l.endDate.toDate().toLocaleDateString("tr-TR")}
              </Text>

              {isApproved && <Text style={styles.approvedText}>Onaylandı</Text>}

              {isRejected && (
                <Text style={styles.rejectedText}>Reddedildi</Text>
              )}

              {isPending && (
                <Text style={styles.pendingText}>İncelemek için dokunun</Text>
              )}
            </TouchableOpacity>
          );
        })}
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

  filters: {
    flexDirection: "row",
    margin: 12,
    gap: 8,
  },
  filterBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: "#E5E7EB",
  },
  filterBtnActive: {
    backgroundColor: "#2563EB",
  },
  filterText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
  },
  filterTextActive: {
    color: "#fff",
  },
  empty: {
    margin: 16,
    textAlign: "center",
    color: "#6B7280",
  },
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 12,
    marginVertical: 6,
    padding: 16,
    borderRadius: 12,
  },
  approvedCard: {
    backgroundColor: "#ECFDF5",
  },
  rejectedCard: {
    backgroundColor: "#FEF2F2",
  },
  bold: {
    fontWeight: "700",
    textTransform: "capitalize",
  },
  date: {
    marginTop: 4,
    color: "#374151",
  },
  approvedText: {
    marginTop: 6,
    color: "#059669",
    fontWeight: "600",
  },
  rejectedText: {
    marginTop: 6,
    color: "#DC2626",
    fontWeight: "600",
  },
  pendingText: {
    marginTop: 6,
    color: "#2563EB",
    fontWeight: "600",
  },
});
