import { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Location from "expo-location";

type Props = {
  onSuccess: (data: {
    branchId: string;
    lat: number;
    lng: number;
    accuracy?: number;
  }) => void;
  onClose: () => void;
};

export default function QRScanner({ onSuccess, onClose }: Props) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  const lastScanRef = useRef(0);
  const locationRef = useRef<{
    lat: number;
    lng: number;
    accuracy?: number;
  } | null>(null);

  useEffect(() => {
    (async () => {
      await requestPermission();

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      locationRef.current = {
        lat: loc.coords.latitude,
        lng: loc.coords.longitude,
        accuracy: loc.coords.accuracy ?? undefined,
      };
    })();
  }, []);

  const handleScan = async ({ data }: { data: string }) => {
    const now = Date.now();

    if (now - lastScanRef.current < 800) return;
    lastScanRef.current = now;

    if (scanned) return;

    try {
      setScanned(true);

      const url = new URL(data);
      const branchId = url.searchParams.get("branchId");

      if (!branchId) throw new Error("branchId yok");

      const loc = locationRef.current;

      onSuccess({
        branchId,
        lat: loc?.lat ?? 0,
        lng: loc?.lng ?? 0,
        accuracy: loc?.accuracy,
      });
    } catch (e) {
      console.log("QR parse error:", e);
      setScanned(false);
    }
  };

  if (!permission) {
    return <Text>İzin kontrol ediliyor...</Text>;
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text>Kamera izni gerekli</Text>
        <TouchableOpacity onPress={requestPermission}>
          <Text>İzin ver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <CameraView
        style={{ flex: 1 }}
        zoom={0.2} 
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        onBarcodeScanned={handleScan}
      />

      <View style={styles.overlay}>
        <Text style={styles.text}>QR kodu okut</Text>

        <TouchableOpacity onPress={onClose}>
          <Text style={styles.close}>Kapat</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  overlay: {
    position: "absolute",
    bottom: 40,
    width: "100%",
    alignItems: "center",
  },
  text: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 10,
  },
  close: {
    color: "#fff",
    fontWeight: "600",
  },
});
