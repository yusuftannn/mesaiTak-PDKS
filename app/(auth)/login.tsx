import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { login, getUserProfile } from "../../src/services/auth.service";
import { useAuthStore } from "../../src/store/auth.store";

function mapFirebaseAuthError(err: unknown): string {
  const code = (err as { code?: string })?.code;

  switch (code) {
    case "auth/invalid-email":
      return "Geçersiz e-posta adresi.";
    case "auth/user-not-found":
      return "Kullanıcı bulunamadı.";
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Bilgiler hatalı.";
    case "auth/too-many-requests":
      return "Çok fazla deneme. Daha sonra tekrar dene.";
    case "auth/network-request-failed":
      return "İnternet bağlantısı yok.";
    case "auth/user-disabled":
      return "Hesap devre dışı.";
    default:
      return "Giriş başarısız.";
  }
}

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const setUser = useAuthStore((s) => s.setUser);
  const router = useRouter();

  const handleLogin = async () => {
    if (!identifier || !password) {
      setError("E-posta / kullanıcı adı ve şifre zorunludur.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const cred = await login(identifier, password);

      const profile = await getUserProfile(cred.user.uid);

      setUser(profile);
      router.replace("/(app)/home");
    } catch (e: unknown) {
      setError(mapFirebaseAuthError(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.flex}
      >
        <View style={styles.container}>
          <Text style={styles.title}>Hoş Geldin 👋</Text>
          <Text style={styles.subtitle}>Devam etmek için giriş yap</Text>

          {/* 🔥 FIX */}
          <TextInput
            style={styles.input}
            placeholder="E-posta veya kullanıcı adı"
            placeholderTextColor="#9CA3AF"
            autoCapitalize="none"
            value={identifier}
            onChangeText={setIdentifier}
          />

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Şifre"
              placeholderTextColor="#9CA3AF"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword((s) => !s)}>
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={22}
                color="#6B7280"
              />
            </TouchableOpacity>
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Giriş Yap</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 32,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 16,
    color: "#111827",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: "#111827",
  },
  error: {
    color: "#DC2626",
    fontSize: 14,
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#2563EB",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  linkContainer: {
    marginTop: 24,
    alignItems: "center",
  },
  link: {
    color: "#6B7280",
    fontSize: 15,
  },
  linkBold: {
    color: "#2563EB",
    fontWeight: "600",
  },
});
