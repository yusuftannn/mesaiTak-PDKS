import { ScrollView, StyleSheet, Text, View } from "react-native";
import PageHeader from "../../src/components/PageHeader";
import { colors } from "../../src/core/theme";

export default function About() {
  return (
    <View style={styles.container}>
      <PageHeader title="Hakkımızda" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>MesaiTak Nedir?</Text>
        <Text style={styles.paragraph}>
          MesaiTak, çalışanların mesai, mola, izin ve duyuru yönetimini tek bir uygulama üzerinden kolaylaştırmak için geliştirilmiş bir mobil çözümdür.
          Amacımız, iş takibini basitleştirmek ve çalışan ile yönetici arasındaki iletişimi güçlendirmektir.
        </Text>

        <Text style={styles.sectionTitle}>Nasıl Çalışır?</Text>
        <Text style={styles.paragraph}>
          Uygulama ile kullanıcılar giriş yapabilir, vardiyalarını takip edebilir, molalarını yönetebilir, izin talepleri oluşturabilir ve tüm duyuruları görebilir.
          Ayrıca profil bilgileriniz üzerinden şirket ve şube bilgilerinize hızlıca erişebilirsiniz.
        </Text>

        <Text style={styles.sectionTitle}>Vizyonumuz</Text>
        <Text style={styles.paragraph}>
          Basit, güvenilir ve kullanıcı odaklı bir iş zamanı yönetimi deneyimi sunmak.
          Şirketlerin mesai süreçlerini daha şeffaf ve verimli yönetmesine yardımcı olmayı hedefliyoruz.
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
