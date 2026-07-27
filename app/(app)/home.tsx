import { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
  ScrollView,
  Alert,
  Linking,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useAuthStore } from "../../src/store/auth.store";
import { useHomeStore } from "../../src/store/home.store";
import { useShiftStore } from "../../src/store/shift.store";
import { useBranchStore } from "../../src/store/branch.store";
import AppButton from "../../src/components/AppButton";
import { formatMinutes } from "../../src/utils/time";
import { toDateSafe } from "../../src/utils/date";
import PageHeader from "../../src/components/PageHeader";
import EmployeeMenu from "../../src/components/EmployeeMenu";
import QRScanner from "../../src/components/QRScanner";

import * as Location from "expo-location";
import PersonalQR from "../../src/components/PersonalQR";
import { colors } from "../../src/core/theme";

export default function Home() {
  const user = useAuthStore((s) => s.user);
  const { todayShift, loadShifts } = useShiftStore();
  const { branches, fetchBranches } = useBranchStore();
  const [showScanner, setShowScanner] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [startingWork, setStartingWork] = useState(false);
  const isProcessingRef = useRef(false);
  const { skipLate, skipEarly } = useLocalSearchParams<{
    skipLate?: string;
    skipEarly?: string;
  }>();
  const [activeTab, setActiveTab] = useState<"kamerali" | "kamerasiz" | "qr">(
    "kamerali",
  );
  const [selectedBranchId, setSelectedBranchId] = useState<string>("");
  const router = useRouter();
  const {
    loadToday,
    startWork,
    endWork,
    startBreak,
    endBreak,

    status,
    checkInAt,
    loading,
    breaks,

    selectedBreakType,
    setBreakType,
    totalBreakMinutes,
    totalWorkMinutes,
  } = useHomeStore();

  const BREAK_LABELS: Record<string, { label: string; color: string }> = {
    yemek: { label: "Yemek Molası", color: colors.warning },
    cay_kahve: { label: "Çay / Kahve", color: colors.success },
    sigara: { label: "Sigara", color: colors.textSecondary },
    diger: { label: "Diğer", color: colors.primaryDark },
  };

  function combineDateAndTime(date: Date, time: string): Date | null {
    const [hour, minute] = time.split(":").map(Number);

    if (isNaN(hour) || isNaN(minute)) return null;

    const d = new Date(date);
    d.setHours(hour, minute, 0, 0);

    return d;
  }

  const getBreakDuration = (start: unknown, end: unknown | null) => {
    const s = toDateSafe(start);
    const e = end ? toDateSafe(end) : new Date();
    if (!s || !e) return "--";
    const diff = Math.floor((+e - +s) / 60000);
    return formatMinutes(diff);
  };

  const handleOpenScanner = async () => {
    if (!todayShift) {
      Alert.alert("Hata", "Bugün için mesainiz bulunmuyor");
      return;
    }
    const { status } = await Location.getForegroundPermissionsAsync();

    let finalStatus = status;

    if (status !== "granted") {
      const { status: newStatus } =
        await Location.requestForegroundPermissionsAsync();

      finalStatus = newStatus;
    }

    if (finalStatus !== "granted") {
      Alert.alert(
        "Konum İzni Gerekli",
        "QR ile mesai başlatmak için ayarlardan konum iznini açmalısın.",
        [
          {
            text: "İptal",
            style: "cancel",
          },
          {
            text: "Ayarlara Git",
            onPress: () => {
              Linking.openSettings();
            },
          },
        ],
      );
      return;
    }

    setShowScanner(true);
  };

  useEffect(() => {
    if (!user?.uid) return;

    loadToday(user.uid);
    loadShifts(user.uid);

    fetchBranches();
  }, [user?.uid]);

  const checkLate = () => {
    if (!todayShift) return false;

    const now = new Date();
    const shiftDate = toDateSafe(todayShift.date);

    if (!shiftDate) return false;

    const shiftStart = combineDateAndTime(shiftDate, todayShift.startTime);

    if (!shiftStart) return false;

    return now > shiftStart;
  };

  const checkEarlyLeave = () => {
    if (!todayShift) return false;

    const now = new Date();
    const shiftDate = toDateSafe(todayShift.date);

    if (!shiftDate) return false;

    const shiftEnd = getShiftEnd(
      shiftDate,
      todayShift.startTime,
      todayShift.endTime,
    );

    if (!shiftEnd) return false;

    return now < shiftEnd;
  };

  function getShiftEnd(date: Date, start: string, end: string): Date | null {
    const startDate = combineDateAndTime(date, start);
    const endDate = combineDateAndTime(date, end);

    if (!startDate || !endDate) return null;

    if (endDate <= startDate) {
      const nextDay = new Date(endDate);
      nextDay.setDate(nextDay.getDate() + 1);
      return nextDay;
    }

    return endDate;
  }

  if (showScanner) {
    return (
      <QRScanner
        onClose={() => setShowScanner(false)}
        onSuccess={async ({ branchId, lat, lng, accuracy }) => {
          if (!user) return;

          if (isProcessingRef.current) return;
          isProcessingRef.current = true;

          if (!todayShift) {
            Alert.alert("Hata", "Bugün için mesainiz bulunmuyor");
            isProcessingRef.current = false;
            return;
          }

          if (checkLate() && skipLate !== "1") {
            Alert.alert(
              "Geç Kaldın",
              "Mesaiye geç giriş yaptınız. Devam edebilmek için mazeret bildirmeniz gerekiyor.",
              [
                {
                  text: "Mazeret Bildir",
                  onPress: () => {
                    isProcessingRef.current = false;
                    setShowScanner(false);
                    router.replace("/(app)/excuse?type=late");
                  },
                },
              ],
              {
                cancelable: false,
              },
            );

            return;
          }
          try {
            await startWork(user.uid, {
              branchId,
              location: {
                lat,
                lng,
                accuracy,
              },
            });
            isProcessingRef.current = false;
            Alert.alert("Başarılı", "Mesai başlatıldı ✅");
            setShowScanner(false);
          } catch (e: any) {
            Alert.alert("Hata", e?.message || "Mesai başlatılamadı");
            isProcessingRef.current = false;
          }
        }}
      />
    );
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <Text style={styles.loading}>Yükleniyor…</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <PageHeader
        title="MesaiTak"
        showBack={false}
        leftIcon="menu-outline"
        onLeftPress={() => setShowMenu(true)}
        rightIcon="notifications-outline"
        onRightPress={() => router.push("/(app)/announcements")}
      />
      <EmployeeMenu visible={showMenu} onClose={() => setShowMenu(false)} />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tabItem,
              activeTab === "kamerali" && styles.tabActive,
            ]}
            onPress={() => setActiveTab("kamerali")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "kamerali" && styles.tabTextActive,
              ]}
            >
              Kameralı
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabItem,
              activeTab === "kamerasiz" && styles.tabActive,
            ]}
            onPress={() => setActiveTab("kamerasiz")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "kamerasiz" && styles.tabTextActive,
              ]}
            >
              Kamerasız
            </Text>
          </TouchableOpacity>

          {/* <TouchableOpacity
            style={[styles.tabItem, activeTab === "qr" && styles.tabActive]}
            onPress={() => setActiveTab("qr")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "qr" && styles.tabTextActive,
              ]}
            >
              Kişisel QR
            </Text>
          </TouchableOpacity> */}
        </View>
        <View style={styles.container}>
          <View style={styles.header}>
            <View>
              <Text style={styles.welcome}>Hoş geldin</Text>
              <Text style={styles.title}>{user?.name ?? "Kullanıcı"}</Text>
            </View>
            <TouchableOpacity
              onPress={() => router.push("/(app)/profile")}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons
                name="person-circle-outline"
                size={44}
                color={colors.primary}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.statusCard}>
            <View style={styles.statusLeft}>
              <Ionicons
                name={
                  status === "çalışıyor"
                    ? "play-circle"
                    : status === "mola"
                      ? "pause-circle"
                      : status === "tamamlandı"
                        ? "checkmark-circle"
                        : "time-outline"
                }
                size={36}
                color={colors.primary}
              />
              <View>
                <Text style={styles.label}>Durum</Text>
                <Text style={styles.statusText}>{status}</Text>
                {checkInAt && (
                  <Text style={styles.subText}>
                    Giriş: {checkInAt.toLocaleTimeString("tr-TR")}
                  </Text>
                )}
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Bugünkü Özet</Text>

            <View style={styles.row}>
              <MaterialCommunityIcons
                name="coffee-outline"
                size={22}
                color={colors.textSecondary}
              />
              <Text style={styles.rowText}>
                Toplam Mola: {formatMinutes(totalBreakMinutes)}
              </Text>
            </View>

            <View style={styles.row}>
              <MaterialCommunityIcons
                name="clock-outline"
                size={22}
                color={colors.textSecondary}
              />
              <Text style={styles.rowText}>
                Net Çalışma: {formatMinutes(totalWorkMinutes)}
              </Text>
            </View>
          </View>
          {status === "boşta" && (
            <>
              {activeTab === "kamerali" && (
                <>
                  <AppButton
                    title={todayShift ? "QR ile Başla" : "Bugün mesain yok"}
                    icon={
                      <Ionicons
                        name="qr-code-outline"
                        size={18}
                        color={colors.surface}
                      />
                    }
                    disabled={!todayShift}
                    onPress={handleOpenScanner}
                  />
                </>
              )}
              {activeTab === "kamerasiz" && (
                <View style={styles.card}>
                  {(() => {
                    const userBranches = branches.filter((b) =>
                      user?.branchId ? user.branchId === b.id : false,
                    );

                    const hasBranch = userBranches.length > 0;

                    return (
                      <>
                        {hasBranch ? (
                          <Picker
                            selectedValue={selectedBranchId}
                            onValueChange={(val: string) =>
                              setSelectedBranchId(val)
                            }
                            style={styles.picker}
                            itemStyle={{ color: colors.textPrimary }}
                          >
                            <Picker.Item label="Şube seçiniz..." value="" />
                            {userBranches.map((b) => (
                              <Picker.Item
                                key={b.id}
                                label={b.name}
                                value={b.id}
                              />
                            ))}
                          </Picker>
                        ) : (
                          <View style={styles.emptyBranchBox}>
                            <Ionicons
                              name="business-outline"
                              size={22}
                              color={colors.textSecondary}
                            />
                            <Text style={styles.emptyBranchText}>
                              Herhangi bir şubeye atanmadınız.
                            </Text>
                            <Text style={styles.emptyBranchSubText}>
                              Lütfen yöneticiniz ile iletişime geçin
                            </Text>
                          </View>
                        )}

                        <AppButton
                          title={
                            todayShift ? "Mesaiyi Başlat" : "Bugün mesain yok"
                          }
                          icon={
                            <Ionicons
                              name="play"
                              size={18}
                              color={colors.surface}
                            />
                          }
                          disabled={!hasBranch || !todayShift || startingWork}
                          onPress={async () => {
                            if (!user || !selectedBranchId) return;

                            if (isProcessingRef.current) return;
                            isProcessingRef.current = true;

                            try {
                              const { status } =
                                await Location.getForegroundPermissionsAsync();

                              let finalStatus = status;

                              if (status !== "granted") {
                                const { status: newStatus } =
                                  await Location.requestForegroundPermissionsAsync();

                                finalStatus = newStatus;
                              }

                              if (finalStatus !== "granted") {
                                Alert.alert(
                                  "Konum İzni Gerekli",
                                  "Mesai başlatmak için konum izni vermelisin.",
                                );

                                return;
                              }

                              const loc =
                                await Location.getCurrentPositionAsync({
                                  accuracy: Location.Accuracy.High,
                                });

                              if (checkLate() && skipLate !== "1") {
                                Alert.alert(
                                  "Geç Kaldın",
                                  "Mesaiye geç giriş yaptınız. Devam edebilmek için mazeret bildirmeniz gerekiyor.",
                                  [
                                    {
                                      text: "Mazeret Bildir",
                                      onPress: () => {
                                        router.replace(
                                          "/(app)/excuse?type=late",
                                        );
                                      },
                                    },
                                  ],
                                  {
                                    cancelable: false,
                                  },
                                );

                                return;
                              }

                              await startWork(user.uid, {
                                branchId: selectedBranchId,
                                location: {
                                  lat: loc.coords.latitude,
                                  lng: loc.coords.longitude,
                                  accuracy: loc.coords.accuracy ?? 0,
                                },
                              });

                              Alert.alert("Başarılı", "Mesai başlatıldı ✅");
                            } catch (e: any) {
                              Alert.alert(
                                "Hata",
                                e?.message || "Mesai başlatılamadı",
                              );
                            } finally {
                              isProcessingRef.current = false;
                            }
                          }}
                        />
                      </>
                    );
                  })()}
                </View>
              )}
              {/* {activeTab === "qr" && (
                <View style={styles.card}>
                  <Text style={styles.sectionTitle}>Kişisel QR</Text>

                  {user && <PersonalQR uid={user.uid} />}
                </View>
              )} */}
            </>
          )}

          {status === "çalışıyor" && (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Mola Yönetimi</Text>

              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={selectedBreakType}
                  onValueChange={setBreakType}
                  style={styles.picker}
                  itemStyle={{ color: colors.textPrimary }}
                >
                  <Picker.Item label="Yemek Molası" value="yemek" />
                  <Picker.Item label="Çay / Kahve" value="cay_kahve" />
                  <Picker.Item label="Sigara" value="sigara" />
                  <Picker.Item label="Diğer" value="diger" />
                </Picker>
              </View>

              <AppButton
                title="Molaya Çık"
                icon={
                  <Ionicons name="pause" size={18} color={colors.primary} />
                }
                onPress={startBreak}
                variant="secondary"
              />

              <View style={{ marginTop: 8 }}>
                <AppButton
                  title="Mesaiyi Bitir"
                  icon={
                    <Ionicons name="stop" size={18} color={colors.surface} />
                  }
                  onPress={() => {
                    if (checkEarlyLeave() && skipEarly !== "1") {
                      Alert.alert(
                        "Erken Çıkış",
                        "Mesai bitmeden çıkıyorsunuz. Devam edebilmek için mazeret bildirmeniz gerekiyor.",
                        [
                          {
                            text: "Mazeret Bildir",
                            onPress: () => {
                              router.replace("/(app)/excuse?type=early");
                            },
                          },
                        ],
                        {
                          cancelable: false,
                        },
                      );

                      return;
                    }

                    endWork();
                  }}
                  variant="danger"
                />
              </View>
            </View>
          )}

          {status === "mola" && (
            <AppButton
              title="Molayı Bitir"
              icon={<Ionicons name="play" size={18} color={colors.surface} />}
              onPress={endBreak}
              variant="primary"
            />
          )}

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Son Molalar</Text>

            {breaks.length === 0 && (
              <Text style={styles.subText}>Henüz mola yok</Text>
            )}

            {breaks
              .slice(-3)
              .reverse()
              .map((b, i) => {
                const meta = BREAK_LABELS[b.type] ?? {
                  label: b.type,
                  color: colors.textSecondary,
                };

                const start = toDateSafe(b.start);
                const end = toDateSafe(b.end);

                return (
                  <View key={i} style={styles.breakCard}>
                    <View style={styles.breakTop}>
                      <View
                        style={[
                          styles.breakBadge,
                          { backgroundColor: meta.color + "22" },
                        ]}
                      >
                        <Text
                          style={[styles.breakBadgeText, { color: meta.color }]}
                        >
                          {meta.label}
                        </Text>
                      </View>

                      <Text style={styles.breakDuration}>
                        {getBreakDuration(b.start, b.end)}
                      </Text>
                    </View>

                    <Text style={styles.breakTime}>
                      {start ? start.toLocaleTimeString("tr-TR") : "--"} →{" "}
                      {end ? end.toLocaleTimeString("tr-TR") : "Devam ediyor"}
                    </Text>
                  </View>
                );
              })}
          </View>

          {status === "tamamlandı" && (
            <Text style={styles.done}>Bugünkü mesain tamamlandı ✅</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    padding: 20,
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  loading: {
    color: colors.textSecondary,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  welcome: {
    fontSize: 13,
    color: colors.textSecondary,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.textPrimary,
  },

  statusCard: {
    backgroundColor: colors.primarySoft,
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },

  statusLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  label: {
    fontSize: 13,
    color: colors.textSecondary,
  },

  statusText: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.primaryDark,
    textTransform: "capitalize",
  },

  subText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },

  emptyBranchBox: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    gap: 6,
  },

  emptyBranchText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary,
  },

  emptyBranchSubText: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: "center",
  },

  card: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: colors.secondary,
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: 12,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },

  rowText: {
    fontSize: 14,
    color: colors.textPrimary,
  },

  pickerWrapper: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    marginBottom: Platform.OS === "ios" ? 12 : 16,
    overflow: "hidden",
    backgroundColor: colors.background,
  },

  picker: {
    height: Platform.OS === "ios" ? 140 : 50,
    color: colors.textPrimary,
    backgroundColor: colors.background,
  },

  breakRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 6,
  },

  breakItem: {
    fontSize: 14,
    color: colors.textPrimary,
  },

  done: {
    marginTop: 16,
    color: colors.success,
    fontWeight: "600",
    textAlign: "center",
  },
  breakCard: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  breakTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  breakBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },

  breakBadgeText: {
    fontSize: 12,
    fontWeight: "600",
  },

  breakDuration: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textPrimary,
  },

  breakTime: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: colors.border,
    borderRadius: 12,
    padding: 4,
    margin: 16,
  },

  tabItem: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 10,
  },

  tabActive: {
    backgroundColor: colors.primary,
  },

  tabText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textSecondary,
  },

  tabTextActive: {
    color: colors.surface,
  },
});
