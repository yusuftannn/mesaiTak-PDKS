import { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import PageHeader from "../../src/components/PageHeader";
import AppButton from "../../src/components/AppButton";
import ShiftCreateModal from "../../src/components/admin/ShiftCreateModal";

import { useAdminShiftsStore } from "../../src/store/adminShifts.store";
import { useAdminEmployeesStore } from "../../src/store/adminUsers.store";
import { useAuthStore } from "../../src/store/auth.store";
import { auth } from "../../src/services/firebase";
import { colors } from "../../src/core/theme";

export default function AdminShifts() {
  const { loadShifts, shifts, loading, error } = useAdminShiftsStore();

  const { employees, loadEmployees } = useAdminEmployeesStore();

  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);

  const [open, setOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState<any>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const safeLoad = async () => {
    try {
      await Promise.all([loadEmployees(), loadShifts()]);
    } catch (err: any) {
      if (err?.code === "permission-denied" || err?.code?.startsWith("auth/")) {
        await auth.signOut();
        logout();
        router.replace("/(auth)/login");
      }
    }
  };

  useEffect(() => {
    safeLoad();
  }, [loadShifts, loadEmployees]);

  const filteredShifts = useMemo(() => {
    if (!selectedUserId) return shifts;
    return shifts.filter((s) => s.userId === selectedUserId);
  }, [shifts, selectedUserId]);

  const getUserName = (userId: string) => {
    const user = employees.find((e) => e.uid === userId);
    return user?.name ?? "—";
  };

  return (
    <View style={{ flex: 1 }}>
      <PageHeader title="Vardiya Yönetimi" showBack={false} />

      <View style={styles.container}>
        <AppButton
          title="Vardiya Ekle"
          onPress={() => setOpen(true)}
          icon={
            <Ionicons name="add-circle-outline" size={20} color={colors.surface} />
          }
        />

        <View style={styles.filterBox}>
          <Text style={styles.filterLabel}>Çalışan</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={selectedUserId}
              onValueChange={(value) => setSelectedUserId(value)}
            >
              <Picker.Item label="Tüm Çalışanlar" value={null} />
              {employees.map((emp) => (
                <Picker.Item
                  key={emp.uid}
                  label={emp.name ?? "İsimsiz"}
                  value={emp.uid}
                />
              ))}
            </Picker>
          </View>
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
          <FlatList
            data={filteredShifts}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 24 }}
            ListEmptyComponent={
              <Text style={styles.empty}>
                Bu kullanıcı için vardiya bulunamadı
              </Text>
            }
            renderItem={({ item }) => (
              <Pressable
                onPress={() => {
                  setSelectedShift(item);
                  setOpen(true);
                }}
              >
                <View style={styles.card}>
                  <Text style={styles.title}>
                    {item.startTime} – {item.endTime}
                  </Text>

                  <Text style={styles.sub}>
                    {item.type} • {getUserName(item.userId)}
                  </Text>
                </View>
              </Pressable>
            )}
          />
        )}

        <ShiftCreateModal
          visible={open}
          onClose={() => {
            setOpen(false);
            setSelectedShift(null);
          }}
          employees={employees}
          shift={selectedShift}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 12,
  },

  loading: {
    textAlign: "center",
    marginVertical: 12,
    color: colors.textSecondary,
  },

  empty: {
    textAlign: "center",
    marginTop: 32,
    color: colors.textSecondary,
  },

  filterBox: {
    marginTop: 12,
    marginBottom: 12,
  },

  filterLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },

  pickerWrapper: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },

  card: {
    backgroundColor: colors.surface,
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
  },

  title: {
    fontWeight: "700",
    fontSize: 15,
  },

  sub: {
    color: colors.textSecondary,
    marginTop: 4,
    fontSize: 13,
  },
  errorBox: {
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
});
