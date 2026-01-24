import { Stack } from "expo-router";
import { useAuthBootstrap } from "../src/core/useAuthBootstrap";
import AuthGate from "../src/core/authGate";

export default function RootLayout() {
  useAuthBootstrap();

  return (
    <>
      <AuthGate />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(app)" />
        <Stack.Screen name="(admin)" />
      </Stack>
    </>
  );
}
