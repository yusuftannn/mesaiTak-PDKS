import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { useAuthStore } from "../store/auth.store";
import { auth } from "../services/firebase";
import { colors } from "../core/theme";

type Props = {
  visible: boolean;
  onClose: () => void;
};

const menuItems = [
  { label: "Anasayfa", icon: "home-outline", href: "/(app)/home" },
  { label: "Vardiyam", icon: "calendar-outline", href: "/(app)/shift" },
  { label: "Molalarım", icon: "cafe-outline", href: "/(app)/break" },
  { label: "İzinlerim", icon: "document-text-outline", href: "/(app)/leave" },
  { label: "Duyurular", icon: "notifications-outline", href: "/(app)/announcements" },
  { label: "Profilim", icon: "person-outline", href: "/(app)/profile" },
] as const;

export default function EmployeeMenu({ visible, onClose }: Props) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const navigate = (href: (typeof menuItems)[number]["href"]) => {
    onClose();
    router.push(href);
  };

  const handleLogout = async () => {
    onClose();
    await auth.signOut();
    logout();
    router.replace("/(auth)/login");
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.root}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.panel}>
          <View style={styles.userArea}>
            <Ionicons name="person-circle" size={48} color={colors.primary} />
            <View style={styles.userText}>
              <Text style={styles.name} numberOfLines={1}>{user?.name || "Çalışan"}</Text>
              <Text style={styles.email} numberOfLines={1}>{user?.email}</Text>
            </View>
            <Pressable style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.textSecondary} />
            </Pressable>
          </View>

          <View style={styles.divider} />
          {menuItems.map((item) => (
            <Pressable key={item.href} style={styles.menuItem} onPress={() => navigate(item.href)}>
              <Ionicons name={item.icon} size={22} color={colors.secondary} />
              <Text style={styles.menuText}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
            </Pressable>
          ))}

          <View style={styles.divider} />
          <Pressable style={styles.menuItem} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={22} color={colors.accent} />
            <Text style={[styles.menuText, styles.logoutText]}>Çıkış Yap</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, flexDirection: "row" },
  backdrop: { flex: 1, backgroundColor: colors.overlay },
  panel: { width: "82%", maxWidth: 340, backgroundColor: colors.surface, paddingTop: 52, paddingHorizontal: 18, shadowColor: colors.secondary, shadowOpacity: 0.2, shadowRadius: 18, elevation: 12 },
  userArea: { flexDirection: "row", alignItems: "center", paddingBottom: 16 },
  userText: { flex: 1, marginLeft: 10 },
  name: { fontSize: 16, fontWeight: "700", color: colors.textPrimary },
  email: { marginTop: 2, fontSize: 12, color: colors.textSecondary },
  closeButton: { width: 38, height: 38, alignItems: "center", justifyContent: "center" },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 8 },
  menuItem: { minHeight: 52, flexDirection: "row", alignItems: "center", gap: 14, borderRadius: 12, paddingHorizontal: 10 },
  menuText: { flex: 1, fontSize: 15, fontWeight: "500", color: colors.textPrimary },
  logoutText: { color: colors.accent },
});
