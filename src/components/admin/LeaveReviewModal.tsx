import { Modal, View, Text, StyleSheet, TextInput } from "react-native";
import AppButton from "../AppButton";
import { LeaveDoc } from "../../services/leave.service";
import { useState } from "react";

type Props = {
  visible: boolean;
  leave: LeaveDoc | null;
  onApprove: () => Promise<void>;
  onReject: (reason: string) => Promise<void>;
  onClose: () => void;
};

export default function LeaveReviewModal({
  visible,
  leave,
  onApprove,
  onReject,
  onClose,
}: Props) {
  const [reason, setReason] = useState("");

  if (!leave) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>İzin Talebi</Text>

          <Text style={styles.label}>Tür</Text>
          <Text>{leave.type}</Text>

          <Text style={styles.label}>Tarih</Text>
          <Text>
            {leave.startDate.toDate().toLocaleDateString("tr-TR")} →{" "}
            {leave.endDate.toDate().toLocaleDateString("tr-TR")}
          </Text>

          <Text style={styles.label}>Sebep</Text>
          <Text>{leave.reason}</Text>

          <Text style={styles.label}>Red Sebebi</Text>
          <TextInput
            style={styles.input}
            placeholder="Red sebebi (zorunlu)"
            value={reason}
            onChangeText={setReason}
          />

          <AppButton title="Onayla" onPress={onApprove} />
          <AppButton
            title="Reddet"
            variant="danger"
            onPress={() => onReject(reason)}
          />
          <AppButton title="Kapat" variant="secondary" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 16,
  },
  modal: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  label: {
    marginTop: 10,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 10,
    marginTop: 4,
  },
});
