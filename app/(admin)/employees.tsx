import { useEffect } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import PageHeader from "../../src/components/PageHeader";
import EmployeeCard from "../../src/components/admin/EmployeeCard";
import { useAdminEmployeesStore } from "../../src/store/adminUsers.store";
import { router } from "expo-router";

export default function AdminEmployees() {
  const { loadEmployees, employees, loading } = useAdminEmployeesStore();

  useEffect(() => {
    loadEmployees();
  }, []);

  return (
    <View style={styles.container}>
      <PageHeader title="Çalışanlar" showBack={false} />

      {loading && <Text style={styles.loading}>Yükleniyor…</Text>}

      {!loading && employees.length === 0 && (
        <Text style={styles.empty}>Henüz çalışan bulunmuyor</Text>
      )}

      <FlatList
        data={employees}
        keyExtractor={(item) => item.uid}
        renderItem={({ item }) => (
          <EmployeeCard
            employee={item}
            onPress={() => router.push(`/(admin)/employee/${item.uid}`)}
          />
        )}
        contentContainerStyle={{ padding: 16 }}
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

  empty: {
    textAlign: "center",
    marginTop: 24,
    color: "#9CA3AF",
  },
});
