import { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuthStore } from "../../src/store/auth.store";
import { useHomeStore } from "../../src/store/home.store";
import AppButton from "../../src/components/AppButton";
import { formatMinutes } from "../../src/utils/time";
import { toDateSafe } from "../../src/utils/date";
import PageHeader from "../../src/components/PageHeader";

export default function Home() {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();
  const {
    loadToday,
    startWork,
    endWork,
    startBreak,
    endBreak,

    status,
    checkInAt,
    loading,
    breaks,

    selectedBreakType,
    setBreakType,
    totalBreakMinutes,
    totalWorkMinutes,
  } = useHomeStore();

  const BREAK_LABELS: Record<string, { label: string; color: string }> = {
    yemek: { label: "Yemek Molası", color: "#F59E0B" },
    cay_kahve: { label: "Çay / Kahve", color: "#10B981" },
    sigara: { label: "Sigara", color: "#6B7280" },
    diger: { label: "Diğer", color: "#6366F1" },
  };

  const getBreakDuration = (start: any, end: any | null) => {
    const s = toDateSafe(start);
    const e = end ? toDateSafe(end) : new Date();
    if (!s || !e) return "--";
    const diff = Math.floor((+e - +s) / 60000);
    return formatMinutes(diff);
  };

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
    <View style={{ flex: 1 }}>
      <PageHeader title="MesaiTak" showBack={false} />

      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.welcome}>Hoş geldin</Text>
            <Text style={styles.title}>{user?.name ?? "Kullanıcı"}</Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push("/(app)/profile")}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="person-circle-outline" size={44} color="#2563EB" />
          </TouchableOpacity>
        </View>

        <View style={styles.statusCard}>
          <View style={styles.statusLeft}>
            <Ionicons
              name={
                status === "çalışıyor"
                  ? "play-circle"
                  : status === "mola"
                    ? "pause-circle"
                    : status === "tamamlandı"
                      ? "checkmark-circle"
                      : "time-outline"
              }
              size={36}
              color="#2563EB"
            />
            <View>
              <Text style={styles.label}>Durum</Text>
              <Text style={styles.statusText}>{status}</Text>
              {checkInAt && (
                <Text style={styles.subText}>
                  Giriş: {checkInAt.toLocaleTimeString("tr-TR")}
                </Text>
              )}
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Bugünkü Özet</Text>

          <View style={styles.row}>
            <MaterialCommunityIcons
              name="coffee-outline"
              size={22}
              color="#6B7280"
            />
            <Text style={styles.rowText}>
              Toplam Mola: {formatMinutes(totalBreakMinutes)}
            </Text>
          </View>

          <View style={styles.row}>
            <MaterialCommunityIcons
              name="clock-outline"
              size={22}
              color="#6B7280"
            />
            <Text style={styles.rowText}>
              Net Çalışma: {formatMinutes(totalWorkMinutes)}
            </Text>
          </View>
        </View>

        {status === "boşta" && (
          <AppButton
            title="Mesaiye Başla"
            icon={<Ionicons name="play" size={18} color="#fff" />}
            onPress={() => startWork(user!.uid)}
          />
        )}

        {status === "çalışıyor" && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Mola Yönetimi</Text>

            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={selectedBreakType}
                onValueChange={setBreakType}
                style={styles.picker}
              >
                <Picker.Item label="Yemek Molası" value="yemek" />
                <Picker.Item label="Çay / Kahve" value="cay_kahve" />
                <Picker.Item label="Sigara" value="sigara" />
                <Picker.Item label="Diğer" value="diger" />
              </Picker>
            </View>

            <AppButton
              title="Molaya Çık"
              icon={<Ionicons name="pause" size={18} color="#2563EB" />}
              onPress={startBreak}
              variant="secondary"
            />

            <View style={{ marginTop: 8 }}>
              <AppButton
                title="Mesaiyi Bitir"
                icon={<Ionicons name="stop" size={18} color="#fff" />}
                onPress={endWork}
                variant="danger"
              />
            </View>
          </View>
        )}

        {status === "mola" && (
          <AppButton
            title="Molayı Bitir"
            icon={<Ionicons name="play" size={18} color="#fff" />}
            onPress={endBreak}
            variant="primary"
          />
        )}

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Son Molalar</Text>

          {breaks.length === 0 && (
            <Text style={styles.subText}>Henüz mola yok</Text>
          )}

          {breaks
            .slice(-3)
            .reverse()
            .map((b, i) => {
              const meta = BREAK_LABELS[b.type] ?? {
                label: b.type,
                color: "#9CA3AF",
              };

              const start = toDateSafe(b.start);
              const end = toDateSafe(b.end);

              return (
                <View key={i} style={styles.breakCard}>
                  <View style={styles.breakTop}>
                    <View
                      style={[
                        styles.breakBadge,
                        { backgroundColor: meta.color + "22" },
                      ]}
                    >
                      <Text
                        style={[styles.breakBadgeText, { color: meta.color }]}
                      >
                        {meta.label}
                      </Text>
                    </View>

                    <Text style={styles.breakDuration}>
                      {getBreakDuration(b.start, b.end)}
                    </Text>
                  </View>

                  <Text style={styles.breakTime}>
                    {start ? start.toLocaleTimeString("tr-TR") : "--"} →{" "}
                    {end ? end.toLocaleTimeString("tr-TR") : "Devam ediyor"}
                  </Text>
                </View>
              );
            })}
        </View>

        {status === "tamamlandı" && (
          <Text style={styles.done}>Bugünkü mesain tamamlandı ✅</Text>
        )}
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

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  loading: {
    color: "#6B7280",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  welcome: {
    fontSize: 13,
    color: "#6B7280",
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
  },

  statusCard: {
    backgroundColor: "#EFF6FF",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },

  statusLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  label: {
    fontSize: 13,
    color: "#6B7280",
  },

  statusText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E3A8A",
  },

  subText: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },

  card: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
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

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },

  rowText: {
    fontSize: 14,
    color: "#374151",
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

  breakRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 6,
  },

  breakItem: {
    fontSize: 14,
    color: "#374151",
  },

  done: {
    marginTop: 16,
    color: "#16A34A",
    fontWeight: "600",
    textAlign: "center",
  },
  breakCard: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  breakTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  breakBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },

  breakBadgeText: {
    fontSize: 12,
    fontWeight: "600",
  },

  breakDuration: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
  },

  breakTime: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 4,
  },
});
