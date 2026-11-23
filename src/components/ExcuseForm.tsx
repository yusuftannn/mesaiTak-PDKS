import { useRef, useState } from "react";
import { View, Text, StyleSheet, TextInput, Alert, Modal } from "react-native";
import { colors } from "../core/theme";
import { useExcuseStore } from "../store/excuse.store";
import type { ExcuseType } from "../types/excuse.types";
import AppButton from "./AppButton";
import PageHeader from "./PageHeader";

type Props = {
  type: ExcuseType;
  userId: string;
  onClose: () => void;
  onSubmitted: () => void;
};

export default function ExcuseForm({ type, userId, onClose, onSubmitted }: Props) {
  const { addExcuse } = useExcuseStore();
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const submissionRef = useRef(false);

  const handleClose = () => {
    if (!submissionRef.current) onClose();
  };

  const handleSubmit = async () => {
    if (submissionRef.current) return;

    const trimmedDescription = description.trim();
    if (!trimmedDescription) {
      Alert.alert("Hata", "Lütfen açıklama giriniz");
      return;
    }

    submissionRef.current = true;
    setSubmitting(true);
    try {
      await addExcuse(userId, type, trimmedDescription);

      Alert.alert(
        "Başarılı",
        "Mazeret bildirildi ✅",
        [{ text: "Devam Et", onPress: onSubmitted }],
        { cancelable: false },
      );
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Mazeret gönderilemedi";

      submissionRef.current = false;
      setSubmitting(false);
      Alert.alert("Hata", message);
    }
  };

  return (
    <Modal onRequestClose={handleClose}>
      <PageHeader
        title="Mazeret Bildir"
        showBack={false}
        leftIcon="chevron-back"
        onLeftPress={handleClose}
      />

      <View style={styles.container}>
        <Text style={styles.title}>
          {type === "early" ? "Erken Çıkış Mazereti" : "Geç Kalma Mazereti"}
        </Text>

        <TextInput
          placeholder="Mazeretinizi yazınız..."
          value={description}
          onChangeText={setDescription}
          editable={!submitting}
          multiline
          style={styles.input}
        />

        <AppButton
          title={submitting ? "Gönderiliyor…" : "Gönder"}
          onPress={handleSubmit}
          disabled={submitting}
        />
      </View>
    </Modal>
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
    color: colors.textPrimary,
  },

  input: {
    minHeight: 120,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    textAlignVertical: "top",
    backgroundColor: colors.background,
  },
});
