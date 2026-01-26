import { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TextInput } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";

import PageHeader from "../../src/components/PageHeader";
import AppButton from "../../src/components/AppButton";

/* mock data */
const leaveHistory = [
  {
    type: "Yıllık İzin",
    start: "10.02.2026",
    end: "14.02.2026",
    status: "pending",
  },
  {
    type: "Mazeret İzni",
    start: "05.01.2026",
    end: "05.01.2026",
    status: "approved",
  },
];

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
  const [leaveType, setLeaveType] = useState("yillik");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [note, setNote] = useState("");

  return (
    <View style={styles.container}>
      <PageHeader title="İzin" showBack={true} />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>İzin Talebi Oluştur</Text>

          <Text style={styles.label}>İzin Türü</Text>
          <View style={styles.pickerWrapper}>
            <Picker selectedValue={leaveType} onValueChange={setLeaveType}>
              <Picker.Item label="Yıllık İzin" value="yillik" />
              <Picker.Item label="Mazeret İzni" value="mazeret" />
              <Picker.Item label="Ücretsiz İzin" value="ucretsiz" />
            </Picker>
          </View>

          <Text style={styles.label}>Başlangıç Tarihi</Text>
          <TextInput
            placeholder="GG.AA.YYYY"
            style={styles.input}
            value={startDate}
            onChangeText={setStartDate}
          />

          <Text style={styles.label}>Bitiş Tarihi</Text>
          <TextInput
            placeholder="GG.AA.YYYY"
            style={styles.input}
            value={endDate}
            onChangeText={setEndDate}
          />

          <Text style={styles.label}>Açıklama</Text>
          <TextInput
            placeholder="Açıklama (opsiyonel)"
            style={[styles.input, { height: 80 }]}
            multiline
            value={note}
            onChangeText={setNote}
          />

          <AppButton
            title="İzin Talebi Gönder"
            icon={<Ionicons name="send" size={18} color="#fff" />}
            onPress={() => {
              // Firestore’a yazacağız
            }}
          />
        </View>

        <Text style={styles.sectionTitle}>İzin Geçmişim</Text>

        {leaveHistory.length === 0 && (
          <Text style={styles.subText}>Henüz izin talebiniz yok</Text>
        )}

        {leaveHistory.map((l, index) => {
          const status = mapStatus(l.status);

          return (
            <View key={index} style={styles.historyCard}>
              <View style={styles.row}>
                <Text style={styles.type}>{l.type}</Text>
                <Text style={[styles.status, { color: status.color }]}>
                  {status.text}
                </Text>
              </View>

              <Text style={styles.date}>
                {l.start} → {l.end}
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
