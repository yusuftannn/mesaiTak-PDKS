import React, { useState } from "react";
import { View, Text, TextInput, Button, ActivityIndicator, StyleSheet, TouchableOpacity } from "react-native";
import { login } from "../../src/services/auth.service";
import { useRouter } from "expo-router";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      await login(email, password);
      router.replace("/home");
    } catch (e: any) {
      setError(e.message || "Giriş başarısız");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Giriş Yap</Text>
      <TextInput
        style={styles.input}
        placeholder="E-posta"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Şifre"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {loading ? (
        <ActivityIndicator />
      ) : (
        <Button title="Giriş Yap" onPress={handleLogin} />
      )}
      <TouchableOpacity onPress={() => router.push("/register")}
        style={styles.registerLinkContainer}
      >
        <Text style={styles.registerLink}>Hesabın yok mu? Kayıt Ol</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    maxWidth: 350,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  error: {
    color: "red",
    marginBottom: 12,
  },
  registerLinkContainer: {
    marginTop: 24,
  },
  registerLink: {
    color: "#007bff",
    textDecorationLine: "underline",
    fontSize: 16,
    textAlign: "center",
  },
});
