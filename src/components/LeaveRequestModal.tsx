import { Modal, View, Text, StyleSheet, TextInput } from "react-native";
import { useState } from "react";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import AppButton from "./AppButton";

type Props = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (payload: {
    startDate: Date;
    endDate: Date;
    type: "annual" | "sick" | "unpaid" | "other";
    reason: string;
  }) => Promise<void>;
};

export default function LeaveRequestModal({
  visible,
  onClose,
  onSubmit,
}: Props) {
  const [type, setType] = useState<
    "annual" | "sick" | "unpaid" | "other"
  >("annual");
  const [reason, setReason] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const [showStart, setShowStart] = useState(false);
  const [showEnd, setShowEnd] = useState(false);

  const submit = async () => {
    if (!reason.trim()) return;

    await onSubmit({
      type,
      reason,
      startDate,
      endDate,
    });

    setReason("");
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <Text style={styles.title}>İzin Talebi Oluştur</Text>

        <Text style={styles.label}>İzin Türü</Text>
        <View style={styles.pickerWrapper}>
          <Picker selectedValue={type} onValueChange={setType}>
            <Picker.Item label="Yıllık İzin" value="annual" />
            <Picker.Item label="Hastalık İzni" value="sick" />
            <Picker.Item label="Ücretsiz İzin" value="unpaid" />
            <Picker.Item label="Diğer" value="other" />
          </Picker>
        </View>

        <Text style={styles.label}>Başlangıç Tarihi</Text>
        <AppButton
          title={startDate.toLocaleDateString("tr-TR")}
          variant="secondary"
          onPress={() => setShowStart(true)}
        />

        <Text style={styles.label}>Bitiş Tarihi</Text>
        <AppButton
          title={endDate.toLocaleDateString("tr-TR")}
          variant="secondary"
          onPress={() => setShowEnd(true)}
        />

        <Text style={styles.label}>Açıklama</Text>
        <TextInput
          style={styles.input}
          placeholder="İzin sebebi"
          value={reason}
          onChangeText={setReason}
          multiline
        />

        <AppButton title="Gönder" onPress={submit} />
        <AppButton title="İptal" variant="secondary" onPress={onClose} />

        {showStart && (
          <DateTimePicker
            value={startDate}
            mode="date"
            onChange={(_, d) => {
              setShowStart(false);
              if (d) setStartDate(d);
            }}
          />
        )}

        {showEnd && (
          <DateTimePicker
            value={endDate}
            mode="date"
            onChange={(_, d) => {
              setShowEnd(false);
              if (d) setEndDate(d);
            }}
          />
        )}
      </View>
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
  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginTop: 4,
    minHeight: 80,
  },
});
