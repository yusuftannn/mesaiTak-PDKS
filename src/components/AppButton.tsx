import { Pressable, Text } from "react-native";

type Props = {
  title: string;
  onPress: () => void;
  variant?: "primary" | "danger" | "secondary";
};

export default function AppButton({
  title,
  onPress,
  variant = "primary",
}: Props) {
  const bg =
    variant === "primary"
      ? "#2563eb"
      : variant === "danger"
      ? "#dc2626"
      : "#e5e7eb";

  const color = variant === "secondary" ? "#111827" : "#fff";

  return (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: bg,
        padding: 14,
        borderRadius: 10,
        alignItems: "center",
        marginVertical: 6,
      }}
    >
      <Text style={{ color, fontWeight: "600" }}>{title}</Text>
    </Pressable>
  );
}
