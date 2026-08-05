import { ScrollView, StyleSheet, Text, View } from "react-native";
import PageHeader from "../../src/components/PageHeader";
import { colors } from "../../src/core/theme";

export default function PrivacyPolicy() {
  return (
    <View style={styles.container}>
      <PageHeader title="Gizlilik Politikası" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Veri Toplama</Text>
        <Text style={styles.paragraph}>
          MesaiTak, hizmetlerimizi sunabilmek ve kullanıcı deneyimini iyileştirebilmek için bazı kişisel bilgileri toplar.
          Bu bilgiler arasında adınız, e-posta adresiniz, kullanıcı adınız, şirket/şube bilgileriniz ve işe giriş/çıkış zamanlarınız yer alabilir.
        </Text>

        <Text style={styles.sectionTitle}>Veri Kullanımı</Text>
        <Text style={styles.paragraph}>
          Toplanan veriler; kimlik doğrulama, mesai takibi, izin ve mola yönetimi, duyuru gönderimi ve uygulama içi bildirimler için kullanılır.
          Veriler hiçbir şekilde izniniz olmadan üçüncü taraflarla paylaşılmaz.
        </Text>

        <Text style={styles.sectionTitle}>Konum Verisi</Text>
        <Text style={styles.paragraph}>
          Uygulamada kamera destekli mesai girişleri için konum izni istenebilir. Bu konum verisi yalnızca mesai başlatma ve bitirme süreçleri için kullanılır.
          Konum iznini her zaman cihaz ayarlarından kapatabilirsiniz.
        </Text>

        <Text style={styles.sectionTitle}>Veri Güvenliği</Text>
        <Text style={styles.paragraph}>
          MesaiTak, verilerinizi korumak için güvenli serverlar ve şifreleme yöntemleri kullanır. Yetkisiz erişime karşı gerekli tedbirler alınmıştır.
        </Text>

        <Text style={styles.sectionTitle}>İletişim</Text>
        <Text style={styles.paragraph}>
          Gizlilik politikamızla ilgili sorularınız varsa, şirketinizin MesaiTak yöneticisi veya destek ekibi ile iletişime geçebilirsiniz.
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
