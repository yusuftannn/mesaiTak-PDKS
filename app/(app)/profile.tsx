import { View, Text, StyleSheet, TextInput } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";

import { useAuthStore } from "../../src/store/auth.store";
import AppButton from "../../src/components/AppButton";
import { auth, db } from "../../src/services/firebase";
import PageHeader from "../../src/components/PageHeader";
import { colors } from "../../src/core/theme";

export default function Profile() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();

  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState(user?.name ?? "");

  const [companyName, setCompanyName] = useState<string | null>(null);
  const [branchName, setBranchName] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const loadRelations = async () => {
      try {
        if (user.companyId) {
          const companySnap = await getDoc(
            doc(db, "companies", user.companyId),
          );
          if (companySnap.exists()) {
            setCompanyName(companySnap.data().name);
          }
        }

        if (user.branchId) {
          const branchSnap = await getDoc(doc(db, "branches", user.branchId));
          if (branchSnap.exists()) {
            setBranchName(branchSnap.data().name);
          }
        }
      } catch (e) {
        console.log("Company / Branch load error", e);
      }
    };

    loadRelations();
  }, [user?.companyId, user?.branchId]);

  const handleLogout = async () => {
    await auth.signOut();
    logout();
    router.replace("/(auth)/login");
  };

  const saveName = async () => {
    if (!user?.uid) return;

    await updateDoc(doc(db, "users", user.uid), {
      name,
      updatedAt: serverTimestamp(),
    });

    setUser({ ...user, name });
    setEditingName(false);
  };

  function display(value?: string | null) {
    if (!value || value.trim() === "") return "Tanımlı değil";
    return value;
  }

  return (
    <View style={{ flex: 1 }}>
      <PageHeader title="Profil" showBack />
      <View style={styles.container}>
        <View style={styles.header}>
          <Ionicons name="person-circle" size={88} color={colors.primary} />

          {editingName ? (
            <View style={styles.inlineRow}>
              <TextInput
                value={name}
                onChangeText={setName}
                style={styles.inlineInput}
                autoFocus
              />

              <Ionicons
                name="checkmark"
                size={22}
                color={colors.success}
                onPress={saveName}
              />

              <Ionicons
                name="close"
                size={22}
                color={colors.accent}
                onPress={() => {
                  setName(user?.name ?? "");
                  setEditingName(false);
                }}
              />
            </View>
          ) : (
            <View style={styles.inlineRow}>
              <Text style={styles.value}>{user?.name}</Text>

              <Feather
                name="edit"
                size={16}
                color={colors.textSecondary}
                onPress={() => setEditingName(true)}
              />
            </View>
          )}

          <Text style={styles.email}>{user?.email}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Kullanıcı Adı</Text>
          <Text style={styles.value}>{user?.userName ?? "-"}</Text>

          <Text style={styles.label}>Rol</Text>
          <Text style={styles.value}>{user?.role ?? "-"}</Text>

          <Text style={styles.label}>Şirket</Text>
          <Text style={styles.value}>{display(companyName)}</Text>

          <Text style={styles.label}>Şube</Text>
          <Text style={styles.value}>{display(branchName)}</Text>

          <Text style={styles.label}>Telefon</Text>
          <Text style={styles.value}>{display(user?.phone)}</Text>

          <Text style={styles.label}>Ülke</Text>
          <Text style={styles.value}>{display(user?.country)}</Text>
        </View>

        <View style={styles.actions}>
          <AppButton
            title="Çıkış Yap"
            variant="danger"
            onPress={handleLogout}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  email: {
    marginTop: 4,
    fontSize: 14,
    color: colors.textSecondary,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: colors.secondary,
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  label: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 12,
  },
  value: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  inlineRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  inlineInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 160,
    backgroundColor: colors.surface,
  },
  actions: {
    marginTop: "auto",
  },
});
