import { useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import PageHeader from "../../src/components/PageHeader";
import { useAdminEmployeesStore } from "../../src/store/admin.users.store";
import RoleBadge from "../../src/components/RoleBadge";
import { Ionicons } from "@expo/vector-icons";

export default function AdminEmployees() {
  const { users, loading, error, loadUsers } =
    useAdminEmployeesStore();

  useEffect(() => {
    loadUsers();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <PageHeader title="Çalışanlar" showBack={false} />

      {error && <Text style={styles.error}>{error}</Text>}

      <FlatList
        data={users}
        keyExtractor={(item) => item.uid}
        contentContainerStyle={{ padding: 16 }}
        ItemSeparatorComponent={() => (
          <View style={{ height: 12 }} />
        )}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}>
            <View style={styles.left}>
              <Ionicons
                name="person-circle-outline"
                size={36}
                color="#2563EB"
              />
              <View>
                <Text style={styles.name}>
                  {item.name || "İsimsiz Kullanıcı"}
                </Text>
                <Text style={styles.email}>{item.email}</Text>
              </View>
            </View>

            <RoleBadge role={item.role} />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>
            Henüz çalışan yok
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 14,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  name: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },
  email: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },
  empty: {
    textAlign: "center",
    color: "#6B7280",
    marginTop: 40,
  },
  error: {
    color: "#DC2626",
    textAlign: "center",
    marginVertical: 8,
  },
});
