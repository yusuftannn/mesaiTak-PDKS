import { ScrollView, StyleSheet, Text, View } from "react-native";
import PageHeader from "../../src/components/PageHeader";
import { colors } from "../../src/core/theme";

export default function TermsOfUse() {
  return (
    <View style={styles.container}>
      <PageHeader title="Kullanım Şartları" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Kabul</Text>
        <Text style={styles.paragraph}>
          MesaiTak uygulamasını kullanarak, bu kullanım şartlarını kabul etmiş olursunuz. Uygulamayı yalnızca yetkiniz dahilinde ve amacına uygun şekilde kullanmanız gerekmektedir.
        </Text>

        <Text style={styles.sectionTitle}>Kullanım Amaçları</Text>
        <Text style={styles.paragraph}>
          Uygulama, mesai ve izin takibi, mola yönetimi, duyuru gösterimi ve profil bilgileri yönetimi gibi işlevler için tasarlanmıştır.
          Sistemi kötüye kullanmak, yanlış bilgi girmek veya yetkisiz erişim sağlamak yasaktır.
        </Text>

        <Text style={styles.sectionTitle}>Sorumluluklar</Text>
        <Text style={styles.paragraph}>
          Kullanıcılar, uygulamada verdikleri bilgilerden ve yaptıkları işlemlerden sorumludur. Şirketiniz, bu bilgilerin doğruluğunu ve güncelliğini sağlamak için gerekli düzenlemeleri yapacaktır.
        </Text>

        <Text style={styles.sectionTitle}>Güncellemeler</Text>
        <Text style={styles.paragraph}>
          MesaiTak kullanım şartlarını zaman zaman güncelleyebilir. Bu değişiklikler yayınlandığında uygulamayı kullanmaya devam etmeniz, yeni şartları kabul ettiğiniz anlamına gelir.
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
