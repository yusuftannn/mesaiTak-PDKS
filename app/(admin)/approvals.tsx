import { View, Text, StyleSheet } from "react-native";
import PageHeader from "../../src/components/PageHeader";

export default function AdminApprovals() {
  return (
    <View style={styles.container}>
      <PageHeader title="Onaylar" showBack={false} />
      <View style={styles.card}>
        <Text>İzin talepleri onay/ret burada olacak.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  card: { margin: 16, padding: 16, backgroundColor: "#fff", borderRadius: 16 },
});
