import { ScrollView, StyleSheet, Text, View } from "react-native";
import PageHeader from "../../src/components/PageHeader";
import { colors } from "../../src/core/theme";

export default function FAQ() {
  return (
    <View style={styles.container}>
      <PageHeader title="SSS" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Mesai kaydetmek için ne yapmalıyım?</Text>
        <Text style={styles.paragraph}>
          Mesaiye başlamak için ana ekranda bulunan "Mesai Başlat" veya QR ile giriş seçeneklerinden birini kullanabilirsiniz.
          Uygulama sizden gerekli izinleri isteyebilir.
        </Text>

        <Text style={styles.sectionTitle}>Mola sürem nasıl görüntülenir?</Text>
        <Text style={styles.paragraph}>
          Mola sekmesine girdiğinizde aktif molalarınız ve toplam mola süreniz görüntülenir.
          Mola başlatma ve bitirme işlemlerini aynı sayfa üzerinden yapabilirsiniz.
        </Text>

        <Text style={styles.sectionTitle}>İzin talebimi nasıl gönderirim?</Text>
        <Text style={styles.paragraph}>
          İzinlerim sekmesine gidip yeni izin talebi oluşturabilirsiniz. Talep onaylandığında uygulama üzerinden bilgilendirilirsiniz.
        </Text>

        <Text style={styles.sectionTitle}>Hesabımı nasıl kapatırım?</Text>
        <Text style={styles.paragraph}>
          Profil sayfasından çıkış yapabilirsiniz. Hesabınızı tamamen silme işlemi bu sürümde uygulama içinden desteklenmemektedir.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.secondary,
    marginTop: 20,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.textPrimary,
  },
});
