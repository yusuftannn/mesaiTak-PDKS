import { Stack } from "expo-router";
import { useAuthBootstrap } from "../src/core/useAuthBootstrap";

export default function RootLayout() {
  useAuthBootstrap();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(app)" />
      <Stack.Screen name="(admin)" />
    </Stack>
  );
}
