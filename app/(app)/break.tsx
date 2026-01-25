import { View, Text, StyleSheet } from "react-native";

export default function Break() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mola</Text>
      <Text>Mola geçmişi ve işlemleri burada olacak.</Text>
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
