import { Stack } from "expo-router";
import { useAuthBootstrap } from "../src/core/useAuthBootstrap";
import { useNotifications } from "../src/core/useNotifications";

export default function RootLayout() {
  useAuthBootstrap();
  useNotifications();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(app)" />
      <Stack.Screen name="(admin)" />
    </Stack>
  );
}
