import { Modal, View, Text, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";

import AppButton from "../AppButton";
import { useAdminShiftsStore } from "../../store/adminShifts.store";
import { AdminUser } from "../../services/adminUsers.service";

type Props = {
  visible: boolean;
  onClose: () => void;
  employees: AdminUser[];
  shift?: any;
};

export default function ShiftCreateModal({
  visible,
  onClose,
  employees,
  shift,
}: Props) {
  const { addShift, editShift, removeShift, saving } = useAdminShiftsStore();

  const [userId, setUserId] = useState<string | undefined>();
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("18:00");
  const [type, setType] = useState<"normal" | "gece" | "mesai">("normal");
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (shift) {
      setUserId(shift.userId);
      setDate(shift.date?.toDate ? shift.date.toDate() : new Date());
      setStartTime(shift.startTime);
      setEndTime(shift.endTime);
      setType(shift.type);
    }
  }, [shift]);

  useEffect(() => {
    if (!visible) {
      setUserId(undefined);
      setDate(new Date());
      setStartTime("09:00");
      setEndTime("18:00");
      setType("normal");
      setFormError(null);
    }
  }, [visible]);

  const submit = async () => {
    setFormError(null);

    if (!userId) {
      setFormError("Lütfen bir çalışan seçin.");
      return;
    }

    if (startTime >= endTime) {
      setFormError("Başlangıç saati, bitiş saatinden önce olmalıdır.");
      return;
    }

    const payload = {
      userId,
      date,
      startTime,
      endTime,
      type,
    };

    try {
      if (shift) {
        await editShift(shift.id, payload);
      } else {
        await addShift(payload);
      }

      onClose();
    } catch (err) {
      console.error("Shift submit error:", err);
      setFormError("Vardiya kaydedilemedi. Lütfen tekrar deneyin.");
    }
  };

  const handleDelete = async () => {
    if (!shift) return;

    setFormError(null);

    try {
      await removeShift(shift.id);
      onClose();
    } catch (err) {
      console.error("removeShift error:", err);
      setFormError("Vardiya silinemedi.");
    }
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <Text style={styles.title}>
          {shift ? "Vardiya Düzenle" : "Vardiya Ekle"}
        </Text>

        <Text style={styles.label}>Çalışan</Text>
        <View style={styles.pickerWrapper}>
          <Picker selectedValue={userId} onValueChange={setUserId}>
            <Picker.Item label="Çalışan Seç" value={undefined} />
            {employees.map((e) => (
              <Picker.Item
                key={e.uid}
                label={e.name ?? e.email}
                value={e.uid}
              />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Tarih</Text>
        <AppButton
          title={date.toLocaleDateString("tr-TR")}
          variant="secondary"
          onPress={() => setShowDatePicker(true)}
        />

        <Text style={styles.label}>Vardiya Tipi</Text>
        <View style={styles.pickerWrapper}>
          <Picker selectedValue={type} onValueChange={setType}>
            <Picker.Item label="Normal" value="normal" />
            <Picker.Item label="Gece" value="gece" />
            <Picker.Item label="Fazla Mesai" value="mesai" />
          </Picker>
        </View>

        <Text style={styles.label}>Saatler</Text>
        <View style={styles.timeRow}>
          <Picker
            selectedValue={startTime}
            style={styles.timePicker}
            onValueChange={setStartTime}
          >
            {Array.from({ length: 24 }).map((_, i) => {
              const h = String(i).padStart(2, "0");
              return (
                <Picker.Item key={h} label={`${h}:00`} value={`${h}:00`} />
              );
            })}
          </Picker>

          <Picker
            selectedValue={endTime}
            style={styles.timePicker}
            onValueChange={setEndTime}
          >
            {Array.from({ length: 24 }).map((_, i) => {
              const h = String(i).padStart(2, "0");
              return (
                <Picker.Item key={h} label={`${h}:00`} value={`${h}:00`} />
              );
            })}
          </Picker>
        </View>

        {formError && <Text style={styles.errorText}>{formError}</Text>}

        <AppButton
          title={saving ? "Kaydediliyor..." : "Kaydet"}
          onPress={submit}
          disabled={saving}
        />

        <AppButton
          title="İptal"
          variant="secondary"
          onPress={onClose}
          disabled={saving}
        />

        {shift && (
          <AppButton
            title="Vardiyayı Sil"
            variant="danger"
            onPress={handleDelete}
            disabled={saving}
          />
        )}

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={(_, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setDate(selectedDate);
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
    marginBottom: 12,
  },

  label: {
    marginTop: 12,
    marginBottom: 4,
    fontWeight: "600",
  },

  pickerWrapper: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    overflow: "hidden",
  },

  timeRow: {
    flexDirection: "row",
    gap: 8,
  },

  timePicker: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
  },

  errorText: {
    marginTop: 8,
    marginBottom: 8,
    color: "#DC2626",
    fontSize: 13,
    fontWeight: "600",
  },
});
