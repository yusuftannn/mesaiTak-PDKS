import { useEffect } from "react";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import { useAuthStore } from "../store/auth.store";
import {
  registerPushToken,
  scheduleUpcomingShiftReminders,
  subscribeUserNotifications,
} from "../services/notification.service";

export function useNotifications() {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();

  useEffect(() => {
    if (!user) return;

    registerPushToken(user).catch((err) =>
      console.error("registerPushToken error:", err),
    );
    scheduleUpcomingShiftReminders(user).catch((err) =>
      console.error("scheduleUpcomingShiftReminders error:", err),
    );

    const unsubscribe = subscribeUserNotifications(user);
    return unsubscribe;
  }, [user?.uid, user?.companyId]);

  useEffect(() => {
    const sub = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const route = response.notification.request.content.data?.route;
        if (typeof route === "string") {
          router.push(route as any);
        }
      },
    );

    return () => sub.remove();
  }, [router]);
}
