import React, { useState } from "react";
import { View, Text, TextInput, Button, ActivityIndicator, StyleSheet } from "react-native";
import { register } from "../../src/services/auth.service";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await register(email, password);
      setSuccess("Kayıt başarılı! Giriş yapabilirsiniz.");
    } catch (e: any) {
      setError(e.message || "Kayıt başarısız");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kayıt Ol</Text>
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
      {success ? <Text style={styles.success}>{success}</Text> : null}
      {loading ? (
        <ActivityIndicator />
      ) : (
        <Button title="Kayıt Ol" onPress={handleRegister} />
      )}
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
  success: {
    color: "green",
    marginBottom: 12,
  },
});
