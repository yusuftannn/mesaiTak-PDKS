# 📊 MesaiTak - Çalışan Devam/Devamsızlık ve Vardiya Yönetim Sistemi

MesaiTak, kuruluşların çalışan devam/devamsızlık izleme, vardiya yönetimi ve izin taleplerini verimli bir şekilde yönetmesine yardımcı olmak üzere tasarlanmış kapsamlı bir insan kaynakları yönetim platformudur. Gerçek zamanlı takip, konum tabanlı izleme ve detaylı raporlama yetenekleri ile organizasyonlarının emek gücünü etkili bir şekilde yönetmesini sağlar.

---

## 🎯 Proje Hakkında

MesaiTak, modern web teknolojileri kullanılarak geliştirilen, tamamen özelliklere sahip bir HR yönetim uygulamasıdır. İşletmelerin çalışan verilerini merkezi bir platformda yönetmesine, raporlama yeteneklerini artırmasına ve operasyonel verimlilik sağlamasına olanak tanır.

### Ana Hedefler

✅ **Merkezi Devam/Devamsızlık Takibi**: Tüm çalışanların devam/devamsızlık verilerini tek bir platformda yönetin  
✅ **Gerçek Zamanlı İzleme**: Canlı panolar ile çalışan durumlarını anlık olarak takip edin  
✅ **GPS Tabanlı Konum Doğrulama**: Çalışanların kontrol saatlerini konum bilgisi ile doğrulayın  
✅ **Kapsamlı Raporlama**: Aylık, detaylı Puantaj raporları ve kitle dışa aktarımı  
✅ **Vardiya Yönetimi**: Esnek vardiya planlama ve yönetim sistemi  
✅ **İzin Yönetimi**: Yapılandırılabilir izin türleri ve talep yönetimi

## Mesai Başlatma Özellikleri

### Kameralı Mesai Başlatma (QR Kod ile)

Kameralı mesai başlatma seçeneği, çalışanların görev yaptıkları şubeye özel olarak web yönetim paneli üzerinden oluşturulan QR kodu telefon kamerasıyla okutmasına dayanır.

Bu işlem sırasında:

1. Çalışan, uygulamadaki **Kameralı** sekmesinden QR kod okuyucuyu açar.
2. Web panelinde ilgili şube için oluşturulmuş QR kod kameraya okutulur.
3. QR kod içerisindeki şube bilgisi doğrulanır.
4. Çalışanın güncel konumu alınır ve şubenin kayıtlı konumuyla karşılaştırılır.
5. Mesai başlangıç kaydı; çalışan, şube, konum, tarih ve saat bilgileriyle birlikte web sistemine gönderilir.

Bu yöntem, çalışanın doğru şubede bulunduğunun QR kod ve konum bilgisi üzerinden kontrol edilmesini sağlar. Kamera ve konum izinlerinin açık olması gerekir.

### Kamerasız Mesai Başlatma (Şube Seçimi ile)

Kamerasız mesai başlatma seçeneği, QR kod okutulmasının mümkün olmadığı durumlarda kullanılabilir. Çalışan, kendisine atanmış şubeyi uygulama üzerinden seçerek mesaisini doğrudan başlatır.

Bu işlem sırasında:

1. Çalışan, **Kamerasız** sekmesine geçer.
2. Yetkili olduğu veya kendisine atanmış şubeyi seçer.
3. **Mesaiyi Başlat** butonuna dokunur.
4. Uygulama çalışanın güncel konumunu alır.
5. Seçilen şube, konum, tarih ve saat bilgileri web sistemine gönderilerek mesai kaydı oluşturulur.

Kamerasız akışta kamera izni gerekmez; ancak konum doğrulaması ve kayıt oluşturulması için konum servislerinin açık olması gerekir.

## Konum ve Şube Doğrulaması

Uygulama, mesai başlangıcında çalışanın koordinatlarını şubenin kayıtlı koordinatlarıyla karşılaştırır. Şube için belirlenen izin verilen mesafe dikkate alınarak çalışanın uygun konumda olup olmadığı kontrol edilir. Böylece farklı bir şubeden veya izin verilen alanın dışından hatalı mesai kaydı oluşturulmasının önüne geçilmesi amaçlanır.

Çalışanın yalnızca kendisine atanmış şube için işlem yapmasına izin verilir. Yetkisiz şube seçimi veya geçersiz QR kod kullanımı durumunda mesai başlatma işlemi tamamlanmaz.

## Web Entegrasyonu ve Aktarılan Bilgiler

Mobil uygulama üzerinden oluşturulan mesai kayıtları REST API aracılığıyla merkezi web sistemine aktarılır. Gönderilen kayıtlar genel olarak şu bilgileri içerir:

- Çalışan bilgisi
- Şube kimliği ve şube adı
- Mesai başlangıç tarihi ve saati
- Çalışanın enlem ve boylam bilgileri
- Konum doğruluğu
- Planlanan vardiya bilgisi
- Mesainin aktif veya tamamlanmış olma durumu
- Mesai bitiş tarihi, saati ve bitiş konumu

Bu entegrasyon sayesinde yetkili kullanıcılar çalışanların mesai hareketlerini web paneli üzerinden merkezi olarak takip edebilir, şube bazında değerlendirebilir ve devam/devamsızlık süreçlerini yönetebilir.

## Mesai Bitiş İşlemi

Aktif mesai, uygulama üzerinden sonlandırılabilir. Mesai bitirilirken güncel tarih, saat ve konum bilgileri alınarak mevcut kayda eklenir. Böylece başlangıç ve bitiş verileri aynı mesai kaydı altında tutulur ve toplam çalışma süresinin hesaplanmasına temel oluşturur.

## Temel Özellikler

- Şubeye özel QR kod ile kameralı mesai başlangıcı
- Şube seçerek kamerasız mesai başlangıcı
- GPS tabanlı konum ve mesafe doğrulaması
- Tarih ve saat bilgilerinin otomatik kaydı
- Mesai başlangıç ve bitiş konumlarının saklanması
- Mesaiyi erken bitirilmesi veya mesaiye geç başlanması durumlarında mazeret bildirimi
- Çalışan-şube yetki kontrolü
- Günlük vardiya kontrolü
- Mobil uygulama ile web sistemi arasında merkezi veri aktarımı
- Yönetim panelinden çalışan, şube, vardiya ve mesai takibi
- izin talebi oluşturma

## Teknolojiler

- React Native
- Expo SDK
- Expo Router
- TypeScript
- Firebase Authentication
- Cloud Firestore
- Firebase Storage
- Zustand
- React Hook Form
- Expo Camera
- Expo Location

## Kurulum

Bağımlılıkları yükleyin:

```bash
npm install
```

Projeyi geliştirme ortamında başlatın:

```bash
npx expo start
```

## 📄 Lisans

Bu proje **MesaiTak Source Available License (MSAL) v1.0** kapsamında lisanslanmıştır.

Kaynak kodu; öğrenme, inceleme, değerlendirme ve katkı sağlama amacıyla herkese açıktır.

Yazılı izin alınmaksızın ticari kullanım, yeniden dağıtım, üretim ortamında kullanım, ticari amaçlı değiştirme veya bu projeden türetilmiş rakip ürünlerin geliştirilmesi **yasaktır**.

Ticari lisanslama veya kurumsal kullanım talepleri için lütfen iletişime geçin:

**E-posta:** yusuftan41@hotmail.com

**Copyright © 2026 Yusuf Tan. Tüm hakları saklıdır.**