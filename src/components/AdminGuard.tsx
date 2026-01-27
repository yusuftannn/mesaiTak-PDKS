import { Redirect } from "expo-router";
import { ReactNode } from "react";
import { ActivityIndicator, View, Text } from "react-native";
import { useAuthStore } from "../store/auth.store";

export default function AdminGuard({ children }: { children: ReactNode }) {
  const user = useAuthStore((s) => s.user);
  const initializing = useAuthStore((s) => s.initializing);

  if (initializing) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!user) return <Redirect href="/(auth)/login" />;

  if (user.role !== "admin") {
    return <Redirect href="/(app)/home" />;
  }

  return <>{children}</>;
}
