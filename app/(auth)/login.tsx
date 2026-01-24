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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { login, getUserProfile } from "../../src/services/auth.service";
import { useAuthStore } from "../../src/store/auth.store";

function mapFirebaseAuthError(err: any): string {
  const code: string | undefined = err?.code;

  switch (code) {
    case "auth/invalid-email":
      return "Geçersiz e-posta adresi.";
    case "auth/user-not-found":
      return "Bu e-posta ile kayıtlı kullanıcı bulunamadı.";
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "E-posta veya şifre hatalı.";
    case "auth/too-many-requests":
      return "Çok fazla deneme yapıldı. Lütfen daha sonra tekrar deneyin.";
    case "auth/network-request-failed":
      return "İnternet bağlantısı bulunamadı.";
    case "auth/user-disabled":
      return "Bu hesap devre dışı bırakılmış.";
    default:
      return "Giriş başarısız. Bilgilerinizi kontrol edin.";
  }
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const setUser = useAuthStore((s) => s.setUser);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      setError("E-posta ve şifre zorunludur.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const cred = await login(email.trim(), password);
      const profile = await getUserProfile(cred.user.uid);

      setUser(profile);
      router.replace("/(app)/home");
    } catch (e: any) {
      setError(mapFirebaseAuthError(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.flex}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Hoş Geldin 👋</Text>
        <Text style={styles.subtitle}>Devam etmek için giriş yap</Text>

        <TextInput
          style={styles.input}
          placeholder="E-posta adresi"
          placeholderTextColor="#9CA3AF"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
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
          <TouchableOpacity
            onPress={() => setShowPassword((s) => !s)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
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
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Giriş Yap</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/(auth)/register")}
          style={styles.linkContainer}
        >
          <Text style={styles.link}>
            Hesabın yok mu?{" "}
            <Text style={styles.linkBold}>Kayıt Ol</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
