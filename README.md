# Mobil Programlama – Laboratuvar Föyü: API Tabanlı E-Ticaret Uygulaması (`eticaret-lab`)

React Native, Expo (`~58.0.26`), Expo Router ve JavaScript (`.js`) kullanılarak geliştirilmiş, DummyJSON Products REST API üzerinden ürün verilerini çeken, ürün detayını gösteren ve React Context API ile ortak sepet durumunu yöneten üç sayfalı mobil e-ticaret uygulaması.

---

## Proje Yapısı

```text
eticaret-lab/
├── app/
│   ├── _layout.js          # Stack navigasyon ve SepetProvider sarmalayıcısı
│   ├── index.js            # Ürün listeleme, arama ve sepet sayacı ekranı
│   ├── sepet.js            # Sepet yönetimi ekranı
│   └── urun/
│       └── [id].js         # Dinamik ürün detay ve indirim hesaplama ekranı
├── components/
│   └── UrunKarti.js        # Yeniden kullanılabilir ürün kartı (fiyat ve puan dahil)
├── context/
│   └── SepetContext.js     # Ortak sepet state'i ve useSepet custom hook'u
├── ekran_goruntuleri/      # Çalışan uygulamadan alınmış ekran görüntüleri
│   ├── 01_urun_listesi.png
│   ├── 02_urun_detay.png
│   └── 03_sepet.png
├── app.json
├── package.json
└── .gitignore
```

---

## Tamamlanan Öğrenci Görevleri (Aşama 8)

- **Görev 1 – Ürün kartında puan bilgisi (`components/UrunKarti.js`):** Her ürün kartının içinde API'den gelen gerçek puan değeri (`Puan: {urun.rating}`) gösterilmektedir.
- **Görev 2 – Sepet butonunda toplam ürün adedi (`app/index.js`):** `useSepet()` ile alınan `toplamAdet` değeri `Sepetim ({toplamAdet})` şeklinde buton üzerinde canlı gösterilmektedir.
- **Görev 3 – İndirimli fiyat hesaplama (`app/urun/[id].js`):** API'den gelen `discountPercentage` verisi kullanılarak `urun.price * (1 - indirimOrani / 100)` formülüyle indirim oranı ve indirimli fiyat hesaplanıp ürün detayında görüntülenmektedir (sepet toplamı yalnızca görüntüleme dışı normal `price` değerini kullanmaya devam eder).
- **Görev 4 – Ek çalışma: Ürün arama (`app/index.js`):** Ana sayfaya eklenen `TextInput` alanı ile `https://dummyjson.com/products/search?q=<sorgu>` uç noktasına istek atılarak ürün arama yapılabilmektedir; arama temizlendiğinde varsayılan 20 ürün yeniden yüklenir.

---

## Föy Soruları ve Kavram Kontrolü Yanıtları

### Sayfa 8 – Öğrenciye Soru
- **`options` nesnesindeki `title` değeri değiştirilirse uygulamada hangi bölüm değişir?**
  - Üst gezinme çubuğunda (Stack header) görünen ekran başlığı değişir.

### Sayfa 17 – Öğrenci Kontrolü
1. **`urunler` başlangıçta neden boş dizidir?**
   - API isteği asenkron olduğu için veri gelmeden önce `FlatList` bileşeninin `undefined` yerine geçerli bir dizi (`[]`) ile hatasız render edilebilmesi için başlangıç değeri boş dizi olarak tanımlanır.
2. **`setUrunler` çağrıldığında neden ekran güncellenir?**
   - `setUrunler`, `useState` hook'unun durum güncelleyici fonksiyonudur; state değiştiğinde React ilgili bileşeni yeni ürün verileriyle yeniden render eder.
3. **`useEffect` kaldırılırsa API isteği ne zaman yapılır?**
   - `urunleriGetir()` doğrudan bileşen gövdesinde çağrılırsa her render'da tekrar çalışarak sonsuz döngüye neden olur; hiç çağrılmazsa ekran açıldığında otomatik olarak API isteği yapılmaz.
4. **`urun={item}` ifadesinde hangi bileşene veri gönderilir?**
   - `UrunKarti` bileşenine `urun` prop'u üzerinden ilgili ürün nesnesi gönderilir.

### Sayfa 37 – Öğrenciye Soru ve Tartışma Sorusu
- **Neden Context kullandık?**
  - Ürün detay ekranı (`app/urun/[id].js`), ana sayfa (`app/index.js`) ve sepet ekranı (`app/sepet.js`) aynı sepet durumunu (`sepet`, `toplamAdet`, `sepeteEkle` vb.) paylaşmalıdır. `SepetProvider` kök `_layout.js` içinde tüm ekranları sardığı için sayfalar arasında prop drilling yapmadan ortak state yönetilir.
- **Tartışma sorusu:** *`SepetProvider`, `_layout.js` içerisinde yalnızca detay ekranını kapsasaydı sepet ekranının aynı state'e ulaşması mümkün olur muydu?*
  - Hayır. `useContext(SepetContext)` en yakın üst `SepetProvider` bileşenini arar; sepet ekranı (`app/sepet.js`) ve ana sayfa (`app/index.js`) `SepetProvider` dışında kalacağı için `context` değeri `null` olur ve `useSepet()` `"useSepet, SepetProvider içinde kullanılmalıdır."` hatasını fırlatır.

### Sayfa 41 – Laboratuvar Sonu Kavram Kontrolü
1. Aşağıdakilerden hangisi bir React Hook'udur? → **`useEffect`**
2. Bir component'e dışarıdan gönderilen veri nasıl adlandırılır? → **`Props`**
3. Expo Router'da `[id].js` dosyası ne sağlar? → **`Dinamik rota parametresi`**
4. Fragment'ın temel görevi nedir? → **`Gereksiz View eklemeden JSX öğelerini gruplamak`**
5. Sepetteki ortak veriye erişmek için hangi Hook kullanılmıştır? → **`useContext`**

---

## Test Kontrol Listesi (Expo Web Üzerinde Doğrulandı)

| Test Senaryosu | Sonuç | Gözlenen Davranış |
| :--- | :---: | :--- |
| **1. API'den ürünlerin yüklenmesi** | Geçti | Ana sayfada 20 ürünün görsel, başlık, fiyat ve puan ile listelendiği doğrulandı. |
| **2. Ürün kartına tıklanması** | Geçti | `/urun/1` (*Essence Mascara Lash Princess*) detay sayfası açıldı; indirim oranı `%10.48` ve indirimli fiyat `$8.94` hesaplandı. |
| **3. Sepete ürün eklenmesi** | Geçti | `Sepete Ekle` sonrasında `/sepet` ekranında ürün 1 adet (`$9.99`) olarak görüntülendi. |
| **4. Aynı ürünün tekrar eklenmesi** | Geçti | Yeni satır açılmadan adet `2`, toplam tutar `$19.98` oldu. |
| **5. Sepette `+` butonuna basılması** | Geçti | Adet `3`, toplam tutar `$29.97` olarak güncellendi. |
| **6. Sepette `−` butonuna basılması** | Geçti | Adet `2` ve `1`'e düştü; `1` iken tekrar basıldığında `1`'in altına düşmedi. |
| **7. Ürünün silinmesi** | Geçti | `Ürünü Sil` sonrası `"Sepetiniz boş."` mesajı ve `"Alışverişe Dön"` butonu gösterildi. |
| **8. Alışverişe devam edilmesi** | Geçti | Ana sayfaya dönüldüğünde sepet durumu korundu (`Sepetim (3)` rozeti ile doğrulandı). |
| **9. Hata / Çevrimdışı durumu** | Kısmi | `/urun/999999` için HTTP 404 yanıtında `"Ürün bulunamadı."` hatası doğrulandı; tarayıcı aracında ağ kesintisi (offline) simülasyonu desteklenmediği için çevrimdışı senaryo kod seviyesinde (`try/catch` + `Tekrar Dene`) doğrulandı. |
| **Ek: Ürün arama (`TextInput`)** | Geçti | `"phone"` aramasında API'den 23 ürün geldi; temizlenince 20 ürün geri yüklendi. |

---

## Projeyi Çalıştırma

```bash
cd eticaret-lab
npx expo start --go --clear
```

- **Telefonda (Expo Go):** Terminaldeki QR kodu Expo Go uygulamasıyla okutun.
- **Tarayıcıda (Web):** `npx expo start --web` komutunu çalıştırın veya Expo terminalinde `w` tuşuna basın.
