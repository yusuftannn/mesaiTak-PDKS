import { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Location from "expo-location";
import { colors } from "../core/theme";

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
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFill}
        zoom={0.2}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        onBarcodeScanned={handleScan}
      />

      <View style={styles.mask} pointerEvents="none">
        <View style={styles.topShade}>
          <Text style={styles.title}>QR kodu tara</Text>
          <Text style={styles.text}>
            QR kodu aşağıdaki alanın içine hizala
          </Text>
        </View>

        <View style={styles.scanRow}>
          <View style={styles.sideShade} />
          <View style={styles.scanArea}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>
          <View style={styles.sideShade} />
        </View>

        <View style={styles.bottomShade} />
      </View>

      <View style={styles.closeWrapper}>
        <TouchableOpacity
          onPress={onClose}
          style={styles.closeButton}
          accessibilityRole="button"
          accessibilityLabel="QR tarayıcıyı kapat"
        >
          <Text style={styles.close}>Kapat</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  mask: {
    ...StyleSheet.absoluteFillObject,
  },
  topShade: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.58)",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  scanRow: {
    flexDirection: "row",
    height: 260,
  },
  sideShade: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.58)",
  },
  scanArea: {
    width: 260,
    height: 260,
  },
  corner: {
    position: "absolute",
    width: 38,
    height: 38,
    borderColor: colors.surface,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 12,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 12,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 12,
  },
  bottomRight: {
    right: 0,
    bottom: 0,
    borderRightWidth: 4,
    borderBottomWidth: 4,
    borderBottomRightRadius: 12,
  },
  bottomShade: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.58)",
  },
  title: {
    color: colors.surface,
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 6,
  },
  text: {
    color: colors.surface,
    fontSize: 14,
    textAlign: "center",
  },
  closeWrapper: {
    position: "absolute",
    right: 20,
    top: 48,
  },
  closeButton: {
    backgroundColor: "rgba(0, 0, 0, 0.55)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  close: {
    color: colors.surface,
    fontWeight: "600",
  },
});
