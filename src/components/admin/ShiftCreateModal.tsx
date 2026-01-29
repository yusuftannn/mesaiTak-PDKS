import { Modal, View, Text, StyleSheet, Platform } from "react-native";
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
  const { addShift, editShift, saving, removeShift } = useAdminShiftsStore();

  const [userId, setUserId] = useState<string>();
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("18:00");
  const [type, setType] = useState<"normal" | "gece" | "mesai">("normal");
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (shift) {
      setUserId(shift.userId);
      setDate(shift.date.toDate ? shift.date.toDate() : new Date());
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
    }
  }, [visible]);

  const submit = async () => {
    if (!userId) return;

    const payload = {
      userId,
      date,
      startTime,
      endTime,
      type,
    };

    if (shift) {
      await editShift(shift.id, payload);
    } else {
      await addShift(payload);
    }

    onClose();
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

        <Text style={styles.label}>Başlangıç</Text>
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

        <AppButton
          title={saving ? "Kaydediliyor..." : "Kaydet"}
          onPress={submit}
          disabled={saving}
        />

        <AppButton title="İptal" variant="secondary" onPress={onClose} />
        {shift && (
          <AppButton
            title="Vardiyayı Sil"
            variant="danger"
            onPress={async () => {
              await removeShift(shift.id);
              onClose();
            }}
          />
        )}
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={(_, selectedDate) => {
              setShowDatePicker(false);

              if (selectedDate) {
                setDate(selectedDate);
              }
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
    backgroundColor: "#fff",
    borderRadius: 12,
  },
  timeRow: {
    flexDirection: "row",
    gap: 8,
  },
  timePicker: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
  },
});
