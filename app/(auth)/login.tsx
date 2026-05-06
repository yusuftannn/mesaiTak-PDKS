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
import { colors } from "../../src/core/theme";

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
          <View style={styles.bgCircle1} />
          <View style={styles.bgCircle2} />

          <View style={styles.card}>
            <View>
              <View style={styles.logoBox}>
                <Ionicons name="time-outline" size={28} color={colors.secondary} />
              </View>

              <Text style={styles.title}>MesaiTak</Text>

              <Text style={styles.subtitle}>
                Hesabına giriş yap ve devam et
              </Text>
            </View>

            <TextInput
              placeholder="E-posta veya kullanıcı adı"
              placeholderTextColor={colors.textSecondary}
              autoCapitalize="none"
              value={identifier}
              onChangeText={setIdentifier}
              style={styles.input}
            />

            <View style={styles.passwordContainer}>
              <TextInput
                placeholder="Şifre"
                placeholderTextColor={colors.textSecondary}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                style={styles.passwordInput}
              />
              <TouchableOpacity onPress={() => setShowPassword((s) => !s)}>
                <Ionicons
                  name={showPassword ? "eye-off" : "eye"}
                  size={20}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            </View>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <TouchableOpacity
              onPress={handleLogin}
              disabled={loading}
              style={[styles.button, loading && styles.buttonDisabled]}
            >
              {loading ? (
                <ActivityIndicator color={colors.secondary} />
              ) : (
                <Text style={styles.buttonText}>Giriş Yap</Text>
              )}
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Tüm hakları saklıdır.{" "}
                <Text style={styles.footerLink}>MesaiTak</Text>
              </Text>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.secondary,
  },

  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  logoBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },

  bgCircle1: {
    position: "absolute",
    top: -100,
    left: -50,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: colors.primary,
    opacity: 0.15,
  },

  bgCircle2: {
    position: "absolute",
    bottom: -120,
    right: -60,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: colors.primaryDark,
    opacity: 0.15,
  },

  card: {
    backgroundColor: colors.secondary + "0D",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.surface + "14",
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
    color: colors.surface,
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: 28,
  },

  input: {
    backgroundColor: colors.surface + "14",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: colors.surface,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.surface + "1A",
  },

  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface + "14",
    borderRadius: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.surface + "1A",
    marginBottom: 14,
  },

  passwordInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
    color: colors.surface,
  },

  error: {
    color: colors.accent,
    fontSize: 13,
    marginBottom: 10,
  },

  button: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 6,
    shadowColor: colors.primary,
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonText: {
    color: colors.secondary,
    fontSize: 15,
    fontWeight: "600",
  },

  footer: {
    marginTop: 20,
    alignItems: "center",
  },

  footerText: {
    color: colors.textSecondary,
    fontSize: 13,
  },

  footerLink: {
    color: colors.primary,
    fontWeight: "600",
  },
});
