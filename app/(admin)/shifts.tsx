import { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";

import PageHeader from "../../src/components/PageHeader";
import AppButton from "../../src/components/AppButton";
import ShiftCreateModal from "../../src/components/admin/ShiftCreateModal";

import { useAdminShiftsStore } from "../../src/store/adminShifts.store";
import { useAdminEmployeesStore } from "../../src/store/adminUsers.store";

export default function AdminShifts() {
  const { loadShifts, shifts, loading } = useAdminShiftsStore();
  const { employees } = useAdminEmployeesStore();

  const [open, setOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState<any>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  useEffect(() => {
    loadShifts();
  }, []);

  const filteredShifts = useMemo(() => {
    if (!selectedUserId) return shifts;
    return shifts.filter((s) => s.userId === selectedUserId);
  }, [shifts, selectedUserId]);

  const getUserName = (userId: string) => {
    const user = employees.find((e) => e.uid === userId);
    return user ? `${user.name}` : "—";
  };

  return (
    <View style={{ flex: 1 }}>
      <PageHeader title="Vardiya Yönetimi" showBack={false} />

      <View style={styles.container}>
        <AppButton
          title="Vardiya Ekle"
          onPress={() => setOpen(true)}
          icon={
            <Ionicons name="add-circle-outline" size={20} color="#FFFFFF" />
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
                  label={`${emp.name}`}
                  value={emp.uid}
                />
              ))}
            </Picker>
          </View>
        </View>

        {loading && <Text style={styles.loading}>Yükleniyor…</Text>}

        <FlatList
          data={filteredShifts}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 24 }}
          ListEmptyComponent={
            !loading ? (
              <Text style={styles.empty}>
                Bu kullanıcı için vardiya bulunamadı
              </Text>
            ) : null
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
    backgroundColor: "#F9FAFB",
    padding: 12,
  },

  loading: {
    textAlign: "center",
    marginVertical: 12,
    color: "#6B7280",
  },

  empty: {
    textAlign: "center",
    marginTop: 32,
    color: "#9CA3AF",
  },

  filterBox: {
    marginTop: 12,
    marginBottom: 12,
  },

  filterLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4,
  },

  pickerWrapper: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    overflow: "hidden",
  },

  card: {
    backgroundColor: "#FFFFFF",
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
  },

  title: {
    fontWeight: "700",
    fontSize: 15,
  },

  sub: {
    color: "#6B7280",
    marginTop: 4,
    fontSize: 13,
  },
});
