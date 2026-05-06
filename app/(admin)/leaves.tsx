import { useState, useCallback } from "react";
import { useFocusEffect, useRouter } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import PageHeader from "../../src/components/PageHeader";
import LeaveReviewModal from "../../src/components/admin/LeaveReviewModal";

import { useAdminLeavesStore } from "../../src/store/adminLeaves.store";
import { useAuthStore } from "../../src/store/auth.store";
import { LeaveDoc } from "../../src/services/leave.service";
import { auth } from "../../src/services/firebase";
import { colors } from "../../src/core/theme";

const FILTERS = [
  { key: "pending", label: "Bekleyen" },
  { key: "approved", label: "Onaylanan" },
  { key: "rejected", label: "Reddedilen" },
  { key: "all", label: "Tümü" },
] as const;

export default function AdminLeaves() {
  const {
    leaves,
    loadLeaves,
    approve,
    reject,
    filter,
    setFilter,
    loading,
    saving,
    error,
  } = useAdminLeavesStore();

  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);
  const admin = useAuthStore((s) => s.user);

  const [selected, setSelected] = useState<LeaveDoc | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const safeLoad = async () => {
    try {
      await loadLeaves();
    } catch (err: any) {
      if (err?.code === "permission-denied" || err?.code?.startsWith("auth/")) {
        await auth.signOut();
        logout();
        router.replace("/(auth)/login");
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      safeLoad();
    }, [loadLeaves]),
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
              disabled={loading}
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

      {loading && <Text style={styles.loading}>Yükleniyor…</Text>}

      {!loading && error && (
        <View style={styles.errorBox}>
          <Ionicons name="alert-circle-outline" size={20} color={colors.accent} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={safeLoad} style={styles.retryBtn}>
            <Text style={styles.retryText}>Tekrar Dene</Text>
          </TouchableOpacity>
        </View>
      )}

      {!loading && !error && (
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
                onPress={() => {
                  if (!isPending) return;
                  setActionError(null);
                  setSelected(l);
                }}
                activeOpacity={isPending ? 0.7 : 1}
              >
                <Text style={styles.bold}>{l.type}</Text>

                <Text style={styles.date}>
                  {l.startDate.toDate().toLocaleDateString("tr-TR")} →{" "}
                  {l.endDate.toDate().toLocaleDateString("tr-TR")}
                </Text>

                {isApproved && (
                  <Text style={styles.approvedText}>Onaylandı</Text>
                )}
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
      )}

      <LeaveReviewModal
        visible={!!selected}
        leave={selected}
        onClose={() => {
          setSelected(null);
          setActionError(null);
        }}
        loading={saving}
        errorText={actionError}
        onApprove={async () => {
          if (!selected || !admin?.uid) return;

          setActionError(null);

          try {
            await approve(selected.id, admin.uid);
            setSelected(null);
            await safeLoad();
          } catch (err) {
            console.error("approve UI error:", err);
            setActionError("İzin onaylanamadı. Lütfen tekrar deneyin.");
          }
        }}
        onReject={async (reason) => {
          if (!selected || !admin?.uid) return;

          if (!reason) {
            setActionError("Lütfen bir red nedeni girin.");
            return;
          }

          setActionError(null);

          try {
            await reject(selected.id, admin.uid, reason);
            setSelected(null);
            await safeLoad();
          } catch (err) {
            console.error("reject UI error:", err);
            setActionError("İzin reddedilemedi. Lütfen tekrar deneyin.");
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
    backgroundColor: colors.border,
  },
  filterBtnActive: {
    backgroundColor: colors.primary,
  },

  filterText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  filterTextActive: {
    color: colors.surface,
  },

  loading: {
    textAlign: "center",
    marginTop: 12,
    color: colors.textSecondary,
  },

  errorBox: {
    marginHorizontal: 12,
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: colors.accentSoft,
    borderWidth: 1,
    borderColor: colors.accentMuted,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  errorText: {
    flex: 1,
    color: colors.accent,
    fontSize: 13,
  },

  retryBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: colors.accent,
  },

  retryText: {
    color: colors.surface,
    fontSize: 12,
    fontWeight: "600",
  },

  empty: {
    margin: 16,
    textAlign: "center",
    color: colors.textSecondary,
  },

  card: {
    backgroundColor: colors.surface,
    marginHorizontal: 12,
    marginVertical: 6,
    padding: 16,
    borderRadius: 12,
  },

  approvedCard: {
    backgroundColor: colors.successSoft,
  },
  rejectedCard: {
    backgroundColor: colors.accentSoft,
  },

  bold: {
    fontWeight: "700",
    textTransform: "capitalize",
  },

  date: {
    marginTop: 4,
    color: colors.textPrimary,
  },

  approvedText: {
    marginTop: 6,
    color: colors.success,
    fontWeight: "600",
  },
  rejectedText: {
    marginTop: 6,
    color: colors.accent,
    fontWeight: "600",
  },
  pendingText: {
    marginTop: 6,
    color: colors.primary,
    fontWeight: "600",
  },
});
