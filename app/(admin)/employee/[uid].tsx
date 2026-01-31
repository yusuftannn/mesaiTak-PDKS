import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  ScrollView,
} from "react-native";
import { useLocalSearchParams } from "expo-router";

import PageHeader from "../../../src/components/PageHeader";
import AppButton from "../../../src/components/AppButton";

import { useAdminEmployeeDetailStore } from "../../../src/store/adminEmployeeDetail.store";
import { useAdminEmployeeHistoryStore } from "../../../src/store/adminEmployeeHistory.store";
import { Picker } from "@react-native-picker/picker";
import { Company, getCompanies } from "../../../src/services/company.service";
import {
  Branch,
  getBranchesByCompany,
} from "../../../src/services/branch.service";

export default function EmployeeDetail() {
  const { uid } = useLocalSearchParams<{ uid: string }>();

  const { loadUser, changeRole, updateProfile, user, loading, saving } =
    useAdminEmployeeDetailStore();

  const {
    loadHistory,
    leaves,
    shifts,
    loading: historyLoading,
  } = useAdminEmployeeHistoryStore();

  const [companyId, setCompanyId] = useState<string | null>(null);
  const [branchId, setBranchId] = useState<string | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (uid) loadUser(uid);
  }, [uid]);

  useEffect(() => {
    if (uid) loadHistory(uid);
  }, [uid]);

  useEffect(() => {
    getCompanies().then((data) => {
      setCompanies(data);
    });
  }, []);

  useEffect(() => {
    if (!companyId) {
      setBranches([]);
      setBranchId(null);
      return;
    }

    getBranchesByCompany(companyId).then((data) => {
      setBranches(data);
    });
  }, [companyId]);

  useEffect(() => {
    if (!user) return;

    setCompanyId(user.companyId);
    setBranchId(user.branchId);
    setCountry(user.country ?? "");
    setPhone(user.phone ?? "");
  }, [user]);

  const saveInfo = async () => {
    await updateProfile({
      companyId: companyId || null,
      branchId: branchId || null,
      country: country || null,
      phone: phone || null,
    });
  };

  if (loading || !user) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <PageHeader title="Çalışan Detayı" />

      <View style={styles.card}>
        <Text style={styles.name}>{user.name ?? "İsimsiz"}</Text>
        <Text style={styles.email}>{user.email}</Text>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>{user.role.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Rol Değiştir</Text>

        <AppButton
          title="Employee"
          variant={user.role === "employee" ? "primary" : "secondary"}
          onPress={() => changeRole("employee")}
        />

        <AppButton
          title="Manager"
          variant={user.role === "manager" ? "primary" : "secondary"}
          onPress={() => changeRole("manager")}
        />

        <AppButton
          title="Admin"
          variant={user.role === "admin" ? "danger" : "secondary"}
          onPress={() => changeRole("admin")}
        />

        {saving && <Text style={styles.saving}>Rol kaydediliyor…</Text>}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Çalışan Bilgileri</Text>

        <Text style={styles.label}>Şirket</Text>
        <Picker selectedValue={companyId} onValueChange={setCompanyId}>
          <Picker.Item label="Şirket seç" value={null} />
          {companies.map((c) => (
            <Picker.Item key={c.id} label={c.name} value={c.id} />
          ))}
        </Picker>

        <Text style={styles.label}>Şube</Text>
        <Picker
          selectedValue={branchId}
          onValueChange={setBranchId}
          enabled={!!companyId}
        >
          <Picker.Item label="Şube seç" value={null} />
          {branches.map((b) => (
            <Picker.Item key={b.id} label={b.name} value={b.id} />
          ))}
        </Picker>
        <Field label="Ülke" value={country} onChange={setCountry} />
        <Field
          label="Telefon"
          value={phone}
          onChange={setPhone}
          keyboardType="phone-pad"
        />

        <AppButton title="Bilgileri Kaydet" onPress={saveInfo} />

        {saving && <Text style={styles.saving}>Bilgiler kaydediliyor…</Text>}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>İzin Geçmişi</Text>

        {leaves.length === 0 && (
          <Text style={styles.empty}>İzin kaydı yok</Text>
        )}

        {leaves.map((l) => (
          <View key={l.id} style={styles.row}>
            <Text>
              {l.type} • {l.status}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Vardiya Geçmişi</Text>

        {shifts.length === 0 && (
          <Text style={styles.empty}>Vardiya kaydı yok</Text>
        )}

        {shifts.map((s) => (
          <View key={s.id} style={styles.row}>
            <Text>
              {s.startTime} - {s.endTime} • {s.type}
            </Text>
          </View>
        ))}

        {historyLoading && (
          <Text style={styles.loading}>Geçmiş yükleniyor…</Text>
        )}
      </View>
    </ScrollView>
  );
}

function Field({
  label,
  value,
  onChange,
  keyboardType,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  keyboardType?: "default" | "phone-pad";
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        style={styles.input}
        keyboardType={keyboardType}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  card: {
    margin: 16,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 16,
    alignItems: "center",
  },

  name: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },

  email: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },
  label: {
    fontSize: 13,
    color: "#6B7280",
  },
  badge: {
    marginTop: 12,
    backgroundColor: "#E5E7EB",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },

  badgeText: {
    fontWeight: "700",
    fontSize: 12,
  },

  section: {
    padding: 16,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 8,
  },

  saving: {
    marginTop: 8,
    textAlign: "center",
    color: "#6B7280",
  },

  field: {
    marginBottom: 12,
  },

  fieldLabel: {
    fontWeight: "600",
    marginBottom: 4,
  },

  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  row: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },

  empty: {
    color: "#9CA3AF",
    fontSize: 13,
    marginBottom: 8,
  },

  loading: {
    textAlign: "center",
    color: "#6B7280",
    marginTop: 12,
  },
});
