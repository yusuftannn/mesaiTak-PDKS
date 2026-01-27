import { View, Text, StyleSheet } from "react-native";
import PageHeader from "../../src/components/PageHeader";
import { useAuthStore } from "../../src/store/auth.store";

export default function AdminDashboard() {
  const user = useAuthStore((s) => s.user);

  return (
    <View style={styles.container}>
      <PageHeader title="Admin Panel" showBack={false} />
      <View style={styles.card}>
        <Text style={styles.title}>Hoş geldin</Text>
        <Text style={styles.sub}>{user?.name ?? user?.email}</Text>
        <Text style={styles.note}>
          Buradan çalışan, izin, vardiya ve denetim süreçlerini yöneteceğiz.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  card: { margin: 16, padding: 16, backgroundColor: "#fff", borderRadius: 16 },
  title: { fontSize: 18, fontWeight: "700", color: "#111827" },
  sub: { marginTop: 6, color: "#6B7280" },
  note: { marginTop: 10, color: "#374151" },
});
