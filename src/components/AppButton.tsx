import { Pressable, Text, View, StyleSheet } from "react-native";
import { ReactNode } from "react";

type Variant = "primary" | "danger" | "secondary";

type Props = {
  title: string;
  onPress: () => void;
  variant?: Variant;
  icon?: ReactNode;
  disabled?: boolean;
};

export default function AppButton({
  title,
  onPress,
  variant = "primary",
  icon,
  disabled = false,
}: Props) {
  const getBackgroundColor = () => {
    if (disabled) {
      if (variant === "primary") return "#93C5FD";
      if (variant === "danger") return "#FCA5A5";
      return "#E5E7EB";

    if (variant === "primary") return "#2563EB";
    if (variant === "danger") return "#DC2626";
    return "#E5E7EB";
  };

  const textColor = variant === "secondary" ? "#111827" : "#FFFFFF";

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      pointerEvents={disabled ? "none" : "auto"}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          opacity: pressed && !disabled ? 0.85 : 1,
        },
      ]}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
    >
      <View style={styles.content}>
        {icon && <View style={styles.icon}>{icon}</View>}
        <Text
          style={[
            styles.text,
            { color: textColor },
            disabled && styles.disabledText,
          ]}
        >
          {title}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
    marginVertical: 6,
  },

  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  icon: {
    marginTop: 1,
  },

  text: {
    fontWeight: "600",
    fontSize: 15,
  },

  disabledText: {
    opacity: 0.7,
  },
});
