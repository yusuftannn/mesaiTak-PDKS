import { View, Text, StyleSheet } from "react-native";
import PageHeader from "../../src/components/PageHeader";

export default function Leave() {
  return (
    <View style={{ flex: 1 }}>
      <PageHeader title="İzin" showBack={true} />
      <View style={styles.container}>
        <Text style={styles.title}>İzin</Text>
        <Text>İzin talepleri ve geçmişi burada olacak.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
  },
});
