import { useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import PageHeader from "../../src/components/PageHeader";
import { useAnnouncementStore } from "../../src/store/announcement.store";

function formatDate(date: Date | null) {
  if (!date) return "Tarih yok";

  return date.toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function Announcements() {
  const { announcements, loading, error, fetchAnnouncements } =
    useAnnouncementStore();

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  return (
    <View style={styles.container}>
      <PageHeader title="Duyurular" />

      {loading && announcements.length === 0 ? (
        <View style={styles.center}>
          <ActivityIndicator color="#2563EB" />
          <Text style={styles.centerText}>Duyurular yukleniyor...</Text>
        </View>
      ) : (
        <FlatList
          data={announcements}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.list,
            announcements.length === 0 && styles.emptyList,
          ]}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={fetchAnnouncements}
              tintColor="#2563EB"
            />
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons
                name="megaphone-outline"
                size={36}
                color="#94A3B8"
              />
              <Text style={styles.emptyTitle}>Henuz duyuru yok</Text>
              <Text style={styles.emptyText}>
                Yayinlanan duyurular burada listelenecek.
              </Text>
            </View>
          }
          ListHeaderComponent={
            error ? (
              <View style={styles.errorBox}>
                <Ionicons
                  name="alert-circle-outline"
                  size={18}
                  color="#B91C1C"
                />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.iconWrap}>
                  <Ionicons name="megaphone-outline" size={20} color="#2563EB" />
                </View>

                <View style={styles.titleWrap}>
                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={styles.meta}>
                    {formatDate(item.createdAt)}
                    {item.createdByName ? ` - ${item.createdByName}` : ""}
                  </Text>
                </View>
              </View>

              <Text style={styles.message}>{item.message}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F5F9",
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  centerText: {
    color: "#64748B",
    fontSize: 13,
  },

  list: {
    padding: 16,
    paddingBottom: 32,
  },

  emptyList: {
    flexGrow: 1,
    justifyContent: "center",
  },

  empty: {
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 24,
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },

  emptyText: {
    fontSize: 13,
    color: "#64748B",
    textAlign: "center",
  },

  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FEE2E2",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },

  errorText: {
    flex: 1,
    color: "#B91C1C",
    fontSize: 13,
    fontWeight: "600",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 4,
  },

  cardHeader: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
  },

  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#DBEAFE",
    alignItems: "center",
    justifyContent: "center",
  },

  titleWrap: {
    flex: 1,
  },

  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },

  meta: {
    marginTop: 4,
    fontSize: 12,
    color: "#64748B",
  },

  message: {
    marginTop: 12,
    color: "#334155",
    fontSize: 14,
    lineHeight: 20,
  },
});
