import { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useAuthStore } from "../../src/store/auth.store";
import { useHomeStore } from "../../src/store/home.store";
import AppButton from "../../src/components/AppButton";

export default function Home() {
  const user = useAuthStore((s) => s.user);

  const {
    loadToday,
    startWork,
    endWork,
    status,
    checkInTime,
    loading,
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

  const statusLabel =
    status === "idle"
      ? "Mesai Dışı"
      : status === "working"
      ? "Çalışıyor"
      : "Mesai Tamamlandı";

  const statusColor =
    status === "idle"
      ? "#6B7280"
      : status === "working"
      ? "#2563EB"
      : "#16A34A";

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>
          Merhaba, {user?.name ?? "Kullanıcı"}
        </Text>
        <Text style={styles.subGreeting}>Bugünkü çalışma durumun</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Durum</Text>

        <View style={styles.statusRow}>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: statusColor },
            ]}
          />
          <Text style={[styles.statusText, { color: statusColor }]}>
            {statusLabel}
          </Text>
        </View>

        {checkInTime && (
          <Text style={styles.infoText}>
            Giriş Saati:{" "}
            <Text style={styles.infoStrong}>{checkInTime}</Text>
          </Text>
        )}
      </View>

      <View style={styles.actions}>
        {status === "idle" && (
          <AppButton
            title="Mesaiye Başla"
            onPress={() => startWork(user!.uid)}
          />
        )}

        {status === "working" && (
          <AppButton
            title="Mesaiyi Bitir"
            onPress={endWork}
            variant="danger"
          />
        )}
      </View>

      {status === "completed" && (
        <View style={[styles.card, styles.successCard]}>
          <Text style={styles.successText}>
            ✅ Bugünkü mesain tamamlandı
          </Text>
        </View>
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
    fontSize: 16,
    color: "#6B7280",
  },

  header: {
    marginBottom: 20,
  },
  greeting: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
  },
  subGreeting: {
    marginTop: 4,
    fontSize: 15,
    color: "#6B7280",
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 8,
  },

  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: "600",
  },

  infoText: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },
  infoStrong: {
    color: "#111827",
    fontWeight: "600",
  },

  actions: {
    marginTop: 8,
  },

  successCard: {
    backgroundColor: "#ECFDF5",
    borderColor: "#A7F3D0",
    borderWidth: 1,
  },
  successText: {
    color: "#065F46",
    fontWeight: "600",
    textAlign: "center",
  },
});
