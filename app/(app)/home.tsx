import { useEffect } from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { Picker } from "@react-native-picker/picker";

import { useAuthStore } from "../../src/store/auth.store";
import { useHomeStore } from "../../src/store/home.store";
import AppButton from "../../src/components/AppButton";
import { formatMinutes } from "../../src/utils/time";
import { toDateSafe } from "../../src/utils/date";

export default function Home() {
  const user = useAuthStore((s) => s.user);

  const {
    loadToday,
    startWork,
    endWork,
    startBreak,
    endBreak,

    status,
    checkInTime,
    loading,
    breaks,

    selectedBreakType,
    setBreakType,
    totalBreakMinutes,
    totalWorkMinutes,
  } = useHomeStore();

  useEffect(() => {
    if (!user?.uid) return;
    loadToday(user.uid);
  }, [user?.uid]);

  if (loading) {
    return (
      <View style={styles.center}>
        <Text style={styles.loading}>Yükleniyor…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Merhaba, {user?.name ?? "Kullanıcı"}</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Durum</Text>
        <Text style={styles.value}>{status}</Text>

        {checkInTime && (
          <Text style={styles.subText}>Giriş: {checkInTime}</Text>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Özet</Text>
        <Text>Toplam Mola: {formatMinutes(totalBreakMinutes)}</Text>
        <Text>Net Çalışma: {formatMinutes(totalWorkMinutes)}</Text>
      </View>

      {status === "idle" && (
        <AppButton title="Mesaiye Başla" onPress={() => startWork(user!.uid)} />
      )}

      {status === "working" && (
        <View style={styles.card}>
          <Text style={styles.label}>Mola Türü</Text>

          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={selectedBreakType}
              onValueChange={setBreakType}
              dropdownIconColor="#111827"
              style={styles.picker}
            >
              <Picker.Item label="🍽️ Yemek Molası" value="yemek" />
              <Picker.Item label="☕ Çay / Kahve" value="cay_kahve" />
              <Picker.Item label="🚬 Sigara" value="sigara" />
              <Picker.Item label="➕ Diğer" value="diger" />
            </Picker>
          </View>

          <AppButton
            title="Molaya Çık"
            onPress={startBreak}
            variant="secondary"
          />

          <View style={{ marginTop: 8 }}>
            <AppButton
              title="Mesaiyi Bitir"
              onPress={endWork}
              variant="danger"
            />
          </View>
        </View>
      )}

      {status === "break" && (
        <AppButton title="Molayı Bitir" onPress={endBreak} variant="primary" />
      )}

      <View style={styles.card}>
        <Text style={styles.label}>Son Mola İşlemleriniz</Text>

        {breaks.length === 0 && (
          <Text style={styles.subText}>Henüz mola yok</Text>
        )}

        {breaks
          .slice(-3)
          .reverse()
          .map((b, i) => (
            <Text key={i} style={styles.breakItem}>
              • {b.type} —{" "}
              {toDateSafe(b.start)
                ? toDateSafe(b.start)!.toLocaleTimeString("tr-TR")
                : "--"}
              {" → "}
              {toDateSafe(b.end)
                ? toDateSafe(b.end)!.toLocaleTimeString("tr-TR")
                : "Devam ediyor"}
            </Text>
          ))}
      </View>

      {status === "completed" && (
        <Text style={styles.done}>Bugünkü mesain tamamlandı ✅</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 20,
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  loading: {
    color: "#6B7280",
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
  },

  card: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 14,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 6,
  },

  value: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },

  subText: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 4,
  },

  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    marginBottom: Platform.OS === "ios" ? 12 : 16,
    overflow: "hidden",
    backgroundColor: "#F9FAFB",
  },

  picker: {
    height: Platform.OS === "ios" ? 140 : 50,
    color: "#111827",
  },

  breakItem: {
    fontSize: 14,
    color: "#374151",
    marginTop: 4,
  },

  done: {
    marginTop: 16,
    color: "#16A34A",
    fontWeight: "600",
    textAlign: "center",
  },
});
