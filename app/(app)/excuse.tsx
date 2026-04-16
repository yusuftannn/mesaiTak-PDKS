"use client";

import { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAuthStore } from "../../src/store/auth.store";
import { useExcuseStore } from "../../src/store/excuse.store";
import AppButton from "../../src/components/AppButton";
import PageHeader from "../../src/components/PageHeader";

export default function ExcusePage() {
  const { type } = useLocalSearchParams<{ type: "late" | "early" }>();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const { addExcuse } = useExcuseStore();
  const [description, setDescription] = useState("");

  useEffect(() => {
    setDescription("");
  }, [type]);

  const handleSubmit = async () => {
    if (!user) return;

    if (!description.trim()) {
      Alert.alert("Hata", "Lütfen açıklama giriniz");
      return;
    }

    try {
      await addExcuse(user.uid, type || "late", description);

      Alert.alert("Başarılı", "Mazeret bildirildi ✅", [
        {
          text: "Devam Et",
          onPress: () => {
            if (type === "late") {
              router.replace("/(app)/home?skipLate=1");
            } else {
              router.replace("/(app)/home?skipEarly=1");
            }
          },
        },
      ]);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Mazeret gönderilemedi";

      Alert.alert("Hata", message);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <PageHeader title="Mazeret Bildir" showBack={false} />

      <View style={styles.container}>
        <Text style={styles.title}>
          {type === "early" ? "Erken Çıkış Mazereti" : "Geç Kalma Mazereti"}
        </Text>

        <TextInput
          placeholder="Mazeretinizi yazınız..."
          value={description}
          onChangeText={setDescription}
          multiline
          style={styles.input}
        />

        <AppButton title="Gönder" onPress={handleSubmit} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },

  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#111827",
  },

  input: {
    minHeight: 120,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    textAlignVertical: "top",
    backgroundColor: "#F9FAFB",
  },
});
