import { Modal, View, Text, StyleSheet, TextInput } from "react-native";
import { useState, useEffect } from "react";
import AppButton from "../AppButton";
import { LeaveDoc } from "../../services/leave.service";
import { colors } from "../../core/theme";

type Props = {
  visible: boolean;
  leave: LeaveDoc | null;

  onApprove: () => Promise<void>;
  onReject: (reason: string) => Promise<void>;
  onClose: () => void;

  loading?: boolean; // 🔹 yeni
  errorText?: string | null; // 🔹 yeni
};

export default function LeaveReviewModal({
  visible,
  leave,
  onApprove,
  onReject,
  onClose,
  loading = false,
  errorText,
}: Props) {
  const [reason, setReason] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (!visible) {
      setReason("");
      setLocalError(null);
    }
  }, [visible]);

  if (!leave) return null;

  const handleApprove = async () => {
    setLocalError(null);
    try {
      await onApprove();
    } catch {
      // hata parent zaten set ediyor
    }
  };

  const handleReject = async () => {
    if (!reason.trim()) {
      setLocalError("Red sebebi zorunludur.");
      return;
    }

    setLocalError(null);
    try {
      await onReject(reason.trim());
    } catch {
      // hata parent zaten set ediyor
    }
  };

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
            editable={!loading}
            onChangeText={(t) => {
              setReason(t);
              setLocalError(null);
            }}
          />

          {(localError || errorText) && (
            <Text style={styles.errorText}>{localError ?? errorText}</Text>
          )}

          <AppButton
            title={loading ? "Onaylanıyor..." : "Onayla"}
            onPress={handleApprove}
            disabled={loading}
          />

          <AppButton
            title={loading ? "Reddediliyor..." : "Reddet"}
            variant="danger"
            onPress={handleReject}
            disabled={loading}
          />

          <AppButton
            title="Kapat"
            variant="secondary"
            onPress={onClose}
            disabled={loading}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: "center",
    padding: 16,
  },

  modal: {
    backgroundColor: colors.surface,
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
    borderColor: colors.border,
    borderRadius: 8,
    padding: 10,
    marginTop: 4,
  },

  errorText: {
    marginTop: 8,
    marginBottom: 8,
    color: colors.accent,
    fontSize: 13,
    fontWeight: "600",
  },
});
