import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useState, useEffect } from "react";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import AppButton from "./AppButton";
import PageHeader from "./PageHeader";

type Props = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (payload: {
    startDate: Date;
    endDate: Date;
    type: "yıllık" | "hasta" | "ücretsiz" | "diğer";
    reason: string;
  }) => Promise<void>;
};

export default function LeaveRequestModal({
  visible,
  onClose,
  onSubmit,
}: Props) {
  const [type, setType] = useState<"yıllık" | "hasta" | "ücretsiz" | "diğer">(
    "yıllık",
  );
  const [reason, setReason] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const [showStart, setShowStart] = useState(false);
  const [showEnd, setShowEnd] = useState(false);

  useEffect(() => {
    if (!visible) {
      setReason("");
      setType("yıllık");
      setStartDate(new Date());
      setEndDate(new Date());
      setShowStart(false);
      setShowEnd(false);
    }
  }, [visible]);

  const submit = async () => {
    if (!reason.trim()) {
      Alert.alert(
        "Eksik Bilgi",
        "İzin talebi oluşturabilmek için açıklama girmek zorunludur.",
      );
      return;
    }

    if (endDate < startDate) {
      Alert.alert(
        "Tarih Hatası",
        "Bitiş tarihi, başlangıç tarihinden önce olamaz.",
      );
      return;
    }

    await onSubmit({
      type,
      reason,
      startDate,
      endDate,
    });

    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <PageHeader title="İzin Talebi Oluştur" showBack={false} />

          <ScrollView
            contentContainerStyle={{ padding: 16 }}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.label}>İzin Türü</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={type}
                onValueChange={(itemValue) => setType(itemValue)}
                style={styles.picker}
                itemStyle={{ color: "#111", backgroundColor: "#F9FAFB" }}
              >
                <Picker.Item label="Yıllık İzin" value="yıllık" />
                <Picker.Item label="Hastalık İzni" value="hasta" />
                <Picker.Item label="Ücretsiz İzin" value="ücretsiz" />
                <Picker.Item label="Diğer" value="diğer" />
              </Picker>
            </View>

            <Text style={styles.label}>Başlangıç Tarihi</Text>

            <AppButton
              title={startDate.toLocaleDateString("tr-TR")}
              variant="secondary"
              onPress={() => {
                setShowStart((prev) => !prev);
                setShowEnd(false);
              }}
            />

            {showStart && Platform.OS === "ios" && (
              <View style={styles.inlinePicker}>
                <DateTimePicker
                  value={startDate}
                  mode="date"
                  display="inline"
                  onChange={(_, d) => {
                    if (d) setStartDate(d);
                  }}
                />
              </View>
            )}

            <Text style={styles.label}>Bitiş Tarihi</Text>

            <AppButton
              title={endDate.toLocaleDateString("tr-TR")}
              variant="secondary"
              onPress={() => {
                setShowEnd((prev) => !prev);
                setShowStart(false);
              }}
            />

            {showEnd && Platform.OS === "ios" && (
              <View style={styles.inlinePicker}>
                <DateTimePicker
                  value={endDate}
                  mode="date"
                  display="inline"
                  onChange={(_, d) => {
                    if (d) setEndDate(d);
                  }}
                />
              </View>
            )}

            <Text style={styles.label}>Açıklama</Text>
            <TextInput
              style={styles.input}
              placeholder="İzin sebebi (zorunlu)"
              value={reason}
              onChangeText={setReason}
              multiline
            />

            <AppButton title="Gönder" onPress={submit} />
            <AppButton title="İptal" variant="secondary" onPress={onClose} />

            {showStart && Platform.OS === "android" && (
              <DateTimePicker
                value={startDate}
                mode="date"
                onChange={(_, d) => {
                  setShowStart(false);
                  if (d) setStartDate(d);
                }}
              />
            )}

            {showEnd && Platform.OS === "android" && (
              <DateTimePicker
                value={endDate}
                mode="date"
                onChange={(_, d) => {
                  setShowEnd(false);
                  if (d) setEndDate(d);
                }}
              />
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F9FAFB",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
  },
  label: {
    marginTop: 12,
    fontWeight: "600",
  },
  pickerWrapper: {
    backgroundColor: "#fff",
    borderRadius: 12,
  },
  picker: {
    color: "#111",
    backgroundColor: "#F9FAFB",
  },

  pickerItem: {
    color: "#111",
  },
  input: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 12,
    marginTop: 4,
    minHeight: 80,
  },
  inlinePicker: {
    backgroundColor: "#111",
    borderRadius: 12,
    marginTop: 8,
    padding: 8,
  },
});
