import { ScrollView, StyleSheet, Text, View } from "react-native";
import PageHeader from "../../src/components/PageHeader";
import { colors } from "../../src/core/theme";

export default function Contact() {
  return (
    <View style={styles.container}>
      <PageHeader title="İletişim" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Destek</Text>
        <Text style={styles.paragraph}>
          Uygulama veya hesap sorunları için şirketinizin MesaiTak yöneticisi veya destek ekibi ile iletişime geçin.
          Şu anda uygulama içinden doğrudan mesaj gönderme özelliği desteklenmemektedir.
        </Text>

        <Text style={styles.sectionTitle}>Yardımcı Olabileceğimiz Konular</Text>
        <Text style={styles.paragraph}>
          • Hesap ve giriş sorunları
          • Mesai ve izin takip soruları
          • Uygulama kullanımı destek talepleri
          • Bildirim ve izin talepleri
        </Text>

        <Text style={styles.sectionTitle}>İletişim Bilgileri</Text>
        <Text style={styles.paragraph}>
          Şirketinizin destek kanallarını kullanarak yardım alabilirsiniz. Destek hattı veya e-posta bilgileri şirket yönetimi tarafından sağlanmaktadır.
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
