import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import {
  collection,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  where,
} from "firebase/firestore";
import { db } from "./firebase";
import { AuthUser } from "../store/auth.store";

type Unsubscribe = () => void;

const ANDROID_CHANNEL_ID = "mesaitak-default";
const SHIFT_REMINDER_PREFIX = "shift-reminder:";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

function getProjectId() {
  return (
    Constants.expoConfig?.extra?.eas?.projectId ??
    Constants.easConfig?.projectId
  );
}

function tokenDocId(token: string) {
  return token.replace(/[/#?[\]]/g, "_");
}

function toDate(value: any): Date | null {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value.toDate === "function") return value.toDate();
  if (typeof value.seconds === "number") return new Date(value.seconds * 1000);
  return null;
}

function combineDateAndTime(dateValue: any, time: string): Date | null {
  const date = toDate(dateValue);
  if (!date) return null;

  const [hour, minute] = time.split(":").map(Number);
  if (Number.isNaN(hour) || Number.isNaN(minute)) return null;

  const result = new Date(date);
  result.setHours(hour, minute, 0, 0);
  return result;
}

async function ensureAndroidChannel() {
  if (Platform.OS !== "android") return;

  await Notifications.setNotificationChannelAsync(ANDROID_CHANNEL_ID, {
    name: "MesaiTak",
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: "#2563EB",
  });
}

export async function requestNotificationPermission() {
  await ensureAndroidChannel();

  const current = await Notifications.getPermissionsAsync();
  let status = current.status;

  if (status !== "granted") {
    const requested = await Notifications.requestPermissionsAsync();
    status = requested.status;
  }

  return status === "granted";
}

export async function registerPushToken(user: AuthUser) {
  const granted = await requestNotificationPermission();
  if (!granted) return null;

  const projectId = getProjectId();
  const tokenResult = await Notifications.getExpoPushTokenAsync(
    projectId ? { projectId } : undefined,
  ).catch((err) => {
    console.warn("Expo push token alinamadi:", err);
    return null;
  });

  if (!tokenResult) return null;
  const token = tokenResult.data;

  await setDoc(
    doc(db, "users", user.uid, "pushTokens", tokenDocId(token)),
    {
      token,
      platform: Platform.OS,
      companyId: user.companyId,
      branchId: user.branchId ?? null,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );

  return token;
}

async function showLocalNotification(input: {
  title: string;
  body: string;
  route?: string;
}) {
  const granted = await requestNotificationPermission();
  if (!granted) return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: input.title,
      body: input.body,
      data: input.route ? { route: input.route } : undefined,
      sound: "default",
    },
    trigger: null,
  });
}

async function scheduleShiftReminder(shift: any) {
  const start = combineDateAndTime(shift.date, shift.startTime);
  if (!start) return;

  const reminderAt = new Date(start.getTime() - 30 * 60 * 1000);
  if (reminderAt <= new Date()) return;

  await Notifications.cancelScheduledNotificationAsync(
    `${SHIFT_REMINDER_PREFIX}${shift.id}`,
  ).catch(() => undefined);

  await Notifications.scheduleNotificationAsync({
    identifier: `${SHIFT_REMINDER_PREFIX}${shift.id}`,
    content: {
      title: "Vardiya hatirlatmasi",
      body: `Vardiyaniz ${shift.startTime} saatinde basliyor.`,
      data: { route: "/(app)/shift" },
      sound: "default",
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: reminderAt,
      channelId: ANDROID_CHANNEL_ID,
    },
  });
}

export async function scheduleUpcomingShiftReminders(
  user: AuthUser,
  daysAhead = 7,
) {
  const granted = await requestNotificationPermission();
  if (!granted) return;

  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(end.getDate() + daysAhead);
  end.setHours(23, 59, 59, 999);

  const q = query(
    collection(db, "shifts"),
    where("userId", "==", user.uid),
    where("companyId", "==", user.companyId),
    where("date", ">=", Timestamp.fromDate(start)),
    where("date", "<=", Timestamp.fromDate(end)),
    orderBy("date", "asc"),
  );

  const snap = await getDocs(q);
  snap.docs.forEach((item) => {
    scheduleShiftReminder({ id: item.id, ...item.data() }).catch((err) =>
      console.error("scheduleShiftReminder error:", err),
    );
  });
}

export function subscribeUserNotifications(user: AuthUser): Unsubscribe {
  const unsubs: Unsubscribe[] = [];

  let announcementsReady = false;
  const announcementsQuery = query(
    collection(db, "announcements"),
    where("companyId", "==", user.companyId),
    orderBy("createdAt", "desc"),
    limit(10),
  );

  unsubs.push(
    onSnapshot(announcementsQuery, (snap) => {
      if (!announcementsReady) {
        announcementsReady = true;
        return;
      }

      snap.docChanges().forEach((change) => {
        if (change.type !== "added") return;
        const data = change.doc.data();
        showLocalNotification({
          title: data.title ?? "Yeni duyuru",
          body: data.message ?? "Yeni bir duyuru yayinlandi.",
          route: "/(app)/announcements",
        }).catch((err) => console.error("showLocalNotification error:", err));
      });
    }),
  );

  let leavesReady = false;
  const leavesQuery = query(
    collection(db, "leaves"),
    where("userId", "==", user.uid),
    where("companyId", "==", user.companyId),
  );

  unsubs.push(
    onSnapshot(leavesQuery, (snap) => {
      if (!leavesReady) {
        leavesReady = true;
        return;
      }

      snap.docChanges().forEach((change) => {
        if (change.type !== "modified") return;
        const data = change.doc.data();
        if (data.status === "beklemede") return;

        showLocalNotification({
          title: "Izin talebiniz guncellendi",
          body:
            data.status === "reddedildi"
              ? "Izin talebiniz reddedildi."
              : "Izin talebiniz onaylandi.",
          route: "/(app)/leave",
        }).catch((err) => console.error("showLocalNotification error:", err));
      });
    }),
  );

  let shiftsReady = false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const shiftsQuery = query(
    collection(db, "shifts"),
    where("userId", "==", user.uid),
    where("companyId", "==", user.companyId),
    where("date", ">=", Timestamp.fromDate(today)),
    orderBy("date", "asc"),
  );

  unsubs.push(
    onSnapshot(shiftsQuery, (snap) => {
      if (!shiftsReady) {
        shiftsReady = true;
        return;
      }

      snap.docChanges().forEach((change) => {
        if (change.type !== "added" && change.type !== "modified") return;
        const data = { id: change.doc.id, ...change.doc.data() } as any;

        scheduleShiftReminder(data).catch((err) =>
          console.error("scheduleShiftReminder error:", err),
        );
        showLocalNotification({
          title:
            change.type === "added"
              ? "Yeni vardiya atandi"
              : "Vardiyaniz guncellendi",
          body: `${data.startTime} - ${data.endTime} saatleri icin vardiya bilgisi.`,
          route: "/(app)/shift",
        }).catch((err) => console.error("showLocalNotification error:", err));
      });
    }),
  );

  return () => {
    unsubs.forEach((unsub) => unsub());
  };
}
