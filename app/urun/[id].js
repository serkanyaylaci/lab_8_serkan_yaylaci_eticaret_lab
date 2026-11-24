import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Stack,
  useLocalSearchParams,
  useRouter,
} from 'expo-router';

import { useSepet } from '../../context/SepetContext';

export default function UrunDetay() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const { sepeteEkle } = useSepet();

  const [urun, setUrun] = useState(null);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hata, setHata] = useState('');

  useEffect(() => {
    let aktif = true;

    async function urunGetir() {
      try {
        setYukleniyor(true);
        setHata('');
        setUrun(null);

        const cevap = await fetch(
          `https://dummyjson.com/products/${id}`
        );

        if (!cevap.ok) {
          throw new Error('Ürün bulunamadı.');
        }

        const veri = await cevap.json();

        if (aktif) {
          setUrun(veri);
        }
      } catch (error) {
        if (aktif) {
          setHata(error.message);
        }
      } finally {
        if (aktif) {
          setYukleniyor(false);
        }
      }
    }

    if (id) {
      urunGetir();
    }

    return () => {
      aktif = false;
    };
  }, [id]);

  const indirimOrani = urun?.discountPercentage ?? 0;
  const indirimliFiyat = urun
    ? urun.price * (1 - indirimOrani / 100)
    : 0;

  return (
    <>
      <Stack.Screen
        options={{
          title: urun ? urun.title : 'Ürün Detayı',
        }}
      />

      <SafeAreaView
        style={styles.container}
        edges={['bottom', 'left', 'right']}
      >
        {yukleniyor ? (
          <ActivityIndicator
            size="large"
            color="#2563eb"
            style={styles.yukleme}
          />
        ) : hata ? (
          <View style={styles.mesajAlani}>
            <Text style={styles.hata}>{hata}</Text>
          </View>
        ) : urun ? (
          <ScrollView contentContainerStyle={styles.icerik}>
            <Image
              source={{ uri: urun.thumbnail }}
              style={styles.resim}
              resizeMode="contain"
            />

            <Text style={styles.baslik}>
              {urun.title}
            </Text>

            <Text style={styles.fiyat}>
              ${Number(urun.price).toFixed(2)}
            </Text>

            <View style={styles.indirimAlani}>
              <Text style={styles.indirimOrani}>
                İndirim Oranı: %{Number(indirimOrani).toFixed(2)}
              </Text>
              <Text style={styles.indirimliFiyat}>
                İndirimli Fiyat: ${indirimliFiyat.toFixed(2)}
              </Text>
            </View>

            <Text style={styles.kategori}>
              Kategori: {urun.category}
            </Text>

            <Text style={styles.puan}>
              Puan: {urun.rating}
            </Text>

            <Text style={styles.aciklamaBaslik}>
              Ürün Açıklaması
            </Text>

            <Text style={styles.aciklama}>
              {urun.description}
            </Text>

            <Pressable
              style={styles.buton}
              onPress={() => {
                sepeteEkle(urun);
                router.push('/sepet');
              }}
            >
              <Text style={styles.butonYazi}>
                Sepete Ekle
              </Text>
            </Pressable>
          </ScrollView>
        ) : (
          <Text style={styles.hata}>
            Ürün bilgisi bulunamadı.
          </Text>
        )}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  yukleme: {
    flex: 1,
    justifyContent: 'center',
  },
  mesajAlani: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  icerik: {
    padding: 20,
    paddingBottom: 35,
  },
  resim: {
    width: '100%',
    height: 240,
    marginBottom: 20,
  },
  baslik: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  fiyat: {
    fontSize: 23,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 8,
  },
  indirimAlani: {
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
  },
  indirimOrani: {
    fontSize: 14,
    fontWeight: '600',
    color: '#047857',
    marginBottom: 4,
  },
  indirimliFiyat: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#065f46',
  },
  kategori: {
    fontSize: 15,
    color: '#6b7280',
    marginBottom: 8,
  },
  puan: {
    fontSize: 15,
    color: '#6b7280',
    marginBottom: 20,
  },
  aciklamaBaslik: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  aciklama: {
    fontSize: 15,
    lineHeight: 24,
    color: '#374151',
    marginBottom: 25,
  },
  buton: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  butonYazi: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  hata: {
    fontSize: 16,
    color: '#dc2626',
    textAlign: 'center',
  },
});
