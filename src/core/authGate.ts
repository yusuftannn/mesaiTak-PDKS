import { useEffect } from "react";
import { useRouter, useSegments } from "expo-router";
import { useAuthStore } from "../store/auth.store";

export default function AuthGate() {
  const router = useRouter();
  const segments = useSegments();

  const user = useAuthStore((s) => s.user);
  const initializing = useAuthStore((s) => s.initializing);

  useEffect(() => {
    if (initializing) return;

    const group = segments[0];

    if (!user) {
      if (group !== "(auth)") {
        router.replace("/(auth)/login");
      }
      return;
    }

    if (user.role === "admin") {
      if (group !== "(admin)") {
        router.replace("/(admin)/dashboard");
      }
      return;
    }

    if (group !== "(app)") {
      router.replace("/(app)/home");
    }
  }, [user, initializing, segments]);

  return null;
}
