import { View, Text, StyleSheet, TextInput } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";

import { useAuthStore } from "../../src/store/auth.store";
import AppButton from "../../src/components/AppButton";
import { auth, db } from "../../src/services/firebase";
import PageHeader from "../../src/components/PageHeader";

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

  return (
    <View style={{ flex: 1 }}>
      <PageHeader title="Profil" showBack />
      <View style={styles.container}>
        <View style={styles.header}>
          <Ionicons name="person-circle" size={88} color="#2563EB" />

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
                color="#16A34A"
                onPress={saveName}
              />

              <Ionicons
                name="close"
                size={22}
                color="#DC2626"
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
                color="#6B7280"
                onPress={() => setEditingName(true)}
              />
            </View>
          )}

          <Text style={styles.email}>{user?.email}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Rol</Text>
          <Text style={styles.value}>{user?.role ?? "-"}</Text>

          <Text style={styles.label}>Şirket</Text>
          <Text style={styles.value}>{companyName ?? "Tanımlı değil"}</Text>

          <Text style={styles.label}>Şube</Text>
          <Text style={styles.value}>{branchName ?? "Tanımlı değil"}</Text>

          <Text style={styles.label}>Telefon</Text>
          <Text style={styles.value}>{user?.phone ?? "-"}</Text>

          <Text style={styles.label}>Ülke</Text>
          <Text style={styles.value}>{user?.country ?? "-"}</Text>
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
    backgroundColor: "#F9FAFB",
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  email: {
    marginTop: 4,
    fontSize: 14,
    color: "#6B7280",
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
  label: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 12,
  },
  value: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },
  inlineRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  inlineInput: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 160,
    backgroundColor: "#FFFFFF",
  },
  actions: {
    marginTop: "auto",
  },
});
