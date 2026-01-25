import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function AppLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#2563EB",
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopColor: "#E5E7EB",
          height: 64,
          paddingBottom: 6,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
        tabBarIcon: ({ color, size, focused }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case "home":
              iconName = focused ? "home" : "home-outline";
              break;
            case "break":
              iconName = focused ? "cafe" : "cafe-outline";
              break;
            case "shift":
              iconName = focused ? "calendar" : "calendar-outline";
              break;
            case "leave":
              iconName = focused ? "document-text" : "document-text-outline";
              break;
            default:
              iconName = "ellipse";
          }

          return <Ionicons name={iconName} size={22} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="home" options={{ title: "Anasayfa" }} />
      <Tabs.Screen name="break" options={{ title: "Mola" }} />
      <Tabs.Screen name="shift" options={{ title: "Vardiya" }} />
      <Tabs.Screen name="leave" options={{ title: "İzin" }} />

      <Tabs.Screen name="profile" options={{ href: null }} />
      <Tabs.Screen name="edit-profile" options={{ href: null }} />
    </Tabs>
  );
}
