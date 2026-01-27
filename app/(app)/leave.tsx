import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TextInput } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";

import PageHeader from "../../src/components/PageHeader";
import AppButton from "../../src/components/AppButton";
import { useAuthStore } from "../../src/store/auth.store";
import { useLeaveStore } from "../../src/store/leave.store";

function mapStatus(status: string) {
  switch (status) {
    case "approved":
      return { text: "Onaylandı", color: "#16A34A" };
    case "rejected":
      return { text: "Reddedildi", color: "#DC2626" };
    default:
      return { text: "Beklemede", color: "#F59E0B" };
  }
}

export default function Leave() {
  const user = useAuthStore((s) => s.user);
  const { leaves, loading, loadLeaves, submitLeave } = useLeaveStore();

  const [type, setType] = useState<"yillik" | "mazeret" | "ucretsiz">("yillik");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!user?.uid) return;
    loadLeaves(user.uid);
  }, [user?.uid]);

  const handleSubmit = async () => {
    if (!user?.uid) return;
    if (!startDate || !endDate) return;

    await submitLeave(user.uid, {
      type,
      startDate,
      endDate,
      note,
    });

    setStartDate("");
    setEndDate("");
    setNote("");
  };

  return (
    <View style={styles.container}>
      <PageHeader title="İzin" showBack={false} />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>İzin Talebi Oluştur</Text>

          <Text style={styles.label}>İzin Türü</Text>
          <View style={styles.pickerWrapper}>
            <Picker selectedValue={type} onValueChange={setType}>
              <Picker.Item label="Yıllık İzin" value="yillik" />
              <Picker.Item label="Mazeret İzni" value="mazeret" />
              <Picker.Item label="Ücretsiz İzin" value="ucretsiz" />
            </Picker>
          </View>

          <Text style={styles.label}>Başlangıç Tarihi</Text>
          <TextInput
            placeholder="YYYY-MM-DD"
            style={styles.input}
            value={startDate}
            onChangeText={setStartDate}
          />

          <Text style={styles.label}>Bitiş Tarihi</Text>
          <TextInput
            placeholder="YYYY-MM-DD"
            style={styles.input}
            value={endDate}
            onChangeText={setEndDate}
          />

          <Text style={styles.label}>Açıklama</Text>
          <TextInput
            style={[styles.input, { height: 80 }]}
            multiline
            value={note}
            onChangeText={setNote}
          />

          <AppButton
            title="İzin Talebi Gönder"
            onPress={handleSubmit}
            disabled={loading}
            icon={<Ionicons name="send" size={18} color="#fff" />}
          />
        </View>

        <Text style={styles.sectionTitle}>İzin Geçmişim</Text>

        {leaves.map((l) => {
          const status = mapStatus(l.status);

          return (
            <View key={l.id} style={styles.historyCard}>
              <View style={styles.row}>
                <Text style={styles.type}>{l.type}</Text>
                <Text style={[styles.status, { color: status.color }]}>
                  {status.text}
                </Text>
              </View>

              <Text style={styles.date}>
                {l.startDate} → {l.endDate}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },

  content: {
    padding: 20,
    paddingBottom: 32,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },

  label: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 12,
    marginBottom: 6,
  },

  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#F9FAFB",
  },

  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 12,
    backgroundColor: "#FFFFFF",
  },

  subText: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 12,
  },

  historyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  type: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },

  status: {
    fontSize: 13,
    fontWeight: "600",
  },

  date: {
    marginTop: 6,
    fontSize: 13,
    color: "#6B7280",
  },
});
