import { ScrollView, StyleSheet, Text, View } from "react-native";
import PageHeader from "../../src/components/PageHeader";
import { colors } from "../../src/core/theme";

export default function CookiePolicy() {
  return (
    <View style={styles.container}>
      <PageHeader title="Çerez Politikası" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Çerez Kullanımı</Text>
        <Text style={styles.paragraph}>
          MesaiTak, uygulama içi oturum yönetimi ve temel kullanım deneyimi için çerez benzeri yerel depolama yöntemleri kullanabilir.
          Bu yöntemler kullanıcı tercihlerini saklamak, oturum bilgilerini yönetmek ve kullanıcı arayüzünü geliştirmek için kullanılır.
        </Text>

        <Text style={styles.sectionTitle}>Veri Saklama</Text>
        <Text style={styles.paragraph}>
          Uygulama, kullanıcı tercihlerini ve oturum durumunu cihazda saklayabilir. Bu bilgiler sadece uygulamanın düzgün çalışması için gereklidir.
        </Text>

        <Text style={styles.sectionTitle}>Üçüncü Taraf Hizmetler</Text>
        <Text style={styles.paragraph}>
          MesaiTak, üçüncü taraf izleme çerezleri kullanmaz. Kullanılan yerel depolama ve benzeri teknikler sadece uygulamanın işlevselliği için gereklidir.
        </Text>

        <Text style={styles.sectionTitle}>Kullanıcı Kontrolü</Text>
        <Text style={styles.paragraph}>
          Kullanıcılar çerez veya depolama kullanımını doğrudan yönetemez, ancak uygulamada oturum açma/kapama ve cihazdaki uygulama verilerini silme yoluyla bu bilgileri kaldırabilir.
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
