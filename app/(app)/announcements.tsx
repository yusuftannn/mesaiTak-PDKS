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
import { colors } from "../../src/core/theme";

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
          <ActivityIndicator color={colors.primary} />
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
              tintColor={colors.primary}
            />
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons
                name="megaphone-outline"
                size={36}
                color={colors.textSecondary}
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
                  color={colors.accent}
                />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.iconWrap}>
                  <Ionicons name="megaphone-outline" size={20} color={colors.primary} />
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
    backgroundColor: colors.background,
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  centerText: {
    color: colors.textSecondary,
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
    color: colors.secondary,
  },

  emptyText: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: "center",
  },

  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.accentSoft,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },

  errorText: {
    flex: 1,
    color: colors.accent,
    fontSize: 13,
    fontWeight: "600",
  },

  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: colors.secondary,
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
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },

  titleWrap: {
    flex: 1,
  },

  title: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.secondary,
  },

  meta: {
    marginTop: 4,
    fontSize: 12,
    color: colors.textSecondary,
  },

  message: {
    marginTop: 12,
    color: colors.textPrimary,
    fontSize: 14,
    lineHeight: 20,
  },
});
