import { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import PageHeader from "../../src/components/PageHeader";
import { useAdminShiftsStore } from "../../src/store/adminShifts.store";
import ShiftCreateModal from "../../src/components/admin/ShiftCreateModal";
import { useAdminEmployeesStore } from "../../src/store/adminUsers.store";
import AppButton from "../../src/components/AppButton";

export default function AdminShifts() {
  const { loadShifts, shifts, loading } = useAdminShiftsStore();
  const [open, setOpen] = useState(false);
  const { employees } = useAdminEmployeesStore();
  const [selectedShift, setSelectedShift] = useState<any>(null);

  useEffect(() => {
    loadShifts();
  }, []);

  return (
    <View style={styles.container}>
      <PageHeader title="Vardiya Yönetimi" showBack={false} />
      <AppButton title="➕ Vardiya Ekle" onPress={() => setOpen(true)} />
      {loading && <Text style={styles.loading}>Yükleniyor…</Text>}

      <FlatList
        data={shifts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>
              {item.startTime} - {item.endTime}
            </Text>
            <Text style={styles.sub}>
              {item.type} • {item.userId}
            </Text>
            <Pressable
              onPress={() => {
                setSelectedShift(item);
                setOpen(true);
              }}
            >
              <View style={styles.card}>
                <Text>
                  {item.startTime} - {item.endTime}
                </Text>
                <Text>{item.type}</Text>
              </View>
            </Pressable>
          </View>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  loading: {
    textAlign: "center",
    marginTop: 12,
    color: "#6B7280",
  },
  card: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
  },
  title: {
    fontWeight: "700",
  },
  sub: {
    color: "#6B7280",
    marginTop: 4,
  },
});
