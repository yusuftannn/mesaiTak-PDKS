import { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { updateDoc, doc, serverTimestamp } from "firebase/firestore";

import { useAuthStore } from "../../src/store/auth.store";
import { db } from "../../src/services/firebase";
import AppButton from "../../src/components/AppButton";
import PageHeader from "../../src/components/PageHeader";

export default function EditProfile() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const router = useRouter();

  const [name, setName] = useState(user?.name ?? "");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!user?.uid) return;

    setLoading(true);

    try {
      await updateDoc(doc(db, "users", user.uid), {
        name,
        updatedAt: serverTimestamp(),
      });

      setUser({
        ...user,
        name,
      });

      router.back();
    } catch (err) {
      console.error("Profile update error", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <PageHeader title="Profili Düzenle" showBack={true} />
      <View style={styles.container}>

        <View style={styles.card}>
          <Text style={styles.label}>Ad Soyad</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Ad Soyad"
          />

          <Text style={styles.label}>E-posta</Text>
          <Text style={styles.readonly}>{user?.email}</Text>

          <Text style={styles.label}>Rol</Text>
          <Text style={styles.readonly}>{user?.role}</Text>
        </View>

        <AppButton title="Kaydet" onPress={handleSave} disabled={loading} />
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

  card: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
  },

  label: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 12,
  },

  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 12,
    marginTop: 6,
    backgroundColor: "#FFFFFF",
  },

  readonly: {
    marginTop: 6,
    fontSize: 15,
    color: "#111827",
    fontWeight: "600",
  },
});
