import { Tabs, Redirect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../../src/store/auth.store";
import { ActivityIndicator, View } from "react-native";

export default function AppLayout() {
  const { user, initializing } = useAuthStore();

  if (initializing) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  if (user.role === "admin") {
    return <Redirect href="/(admin)/dashboard" />;
  }

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#2563EB",
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarIcon: ({ color, focused }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "ellipse";
          if (route.name === "home")
            iconName = focused ? "home" : "home-outline";
          if (route.name === "break")
            iconName = focused ? "cafe" : "cafe-outline";
          if (route.name === "shift")
            iconName = focused ? "calendar" : "calendar-outline";
          if (route.name === "leave")
            iconName = focused ? "document-text" : "document-text-outline";
          return <Ionicons name={iconName} size={22} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="home" />
      <Tabs.Screen name="break" />
      <Tabs.Screen name="shift" />
      <Tabs.Screen name="leave" />
      <Tabs.Screen name="profile" options={{ href: null }} />
      <Tabs.Screen name="edit-profile" options={{ href: null }} />
    </Tabs>
  );
}
