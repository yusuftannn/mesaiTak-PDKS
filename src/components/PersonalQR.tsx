import QRCode from "react-native-qrcode-svg";
import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { colors } from "../core/theme";

function getTodayString() {
  return new Date().toISOString().slice(0, 10);
}

export default function PersonalQR({ uid }: { uid: string }) {
  const [qrValue, setQrValue] = useState("");

  const generateQR = () => {
    const payload = {
      uid,
      date: getTodayString(),
      nonce: Date.now(),
    };

    setQrValue(JSON.stringify(payload));
  };

  useEffect(() => {
    generateQR();
  }, [uid]);

  return (
    <View style={{ alignItems: "center" }}>
      {qrValue ? <QRCode value={qrValue} size={220} /> : null}

      <Text style={{ marginTop: 12, color: colors.textSecondary }}>Bugün geçerli QR</Text>

      <TouchableOpacity
        onPress={generateQR}
        style={{
          marginTop: 16,
          backgroundColor: colors.primary,
          paddingHorizontal: 16,
          paddingVertical: 10,
          borderRadius: 10,
        }}
      >
        <Text style={{ color: colors.surface, fontWeight: "600" }}>QR Yenile</Text>
      </TouchableOpacity>
    </View>
  );
}
