import { View, Text, StyleSheet } from "react-native";

export default function Leave() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>İzin</Text>
      <Text>İzin talepleri ve geçmişi burada olacak.</Text>
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
