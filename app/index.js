import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Pressable,
  TextInput,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import UrunKarti from '../components/UrunKarti';
import { useSepet } from '../context/SepetContext';

export default function AnaSayfa() {
  const router = useRouter();
  const { toplamAdet } = useSepet();

  const [urunler, setUrunler] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hata, setHata] = useState('');
  const [aramaMetni, setAramaMetni] = useState('');

  async function urunleriGetir(sorgu = '', aktifKontrol = () => true) {
    try {
      setYukleniyor(true);
      setHata('');

      const temizSorgu = sorgu.trim();
      const url = temizSorgu
        ? `https://dummyjson.com/products/search?q=${encodeURIComponent(temizSorgu)}`
        : 'https://dummyjson.com/products?limit=20';

      const cevap = await fetch(url);

      if (!cevap.ok) {
        throw new Error('Ürünler alınamadı.');
      }

      const veri = await cevap.json();

      if (aktifKontrol()) {
        setUrunler(veri.products || []);
      }
    } catch (error) {
      if (aktifKontrol()) {
        setHata(error.message);
      }
    } finally {
      if (aktifKontrol()) {
        setYukleniyor(false);
      }
    }
  }

  useEffect(() => {
    let aktif = true;
    const temizSorgu = aramaMetni.trim();

    if (!temizSorgu) {
      urunleriGetir('', () => aktif);
      return () => {
        aktif = false;
      };
    }

    const zamanlayici = setTimeout(() => {
      urunleriGetir(temizSorgu, () => aktif);
    }, 300);

    return () => {
      aktif = false;
      clearTimeout(zamanlayici);
    };
  }, [aramaMetni]);

  return (
    <SafeAreaView
      style={styles.container}
      edges={['bottom', 'left', 'right']}
    >
      <View style={styles.ustAlan}>
        <Text style={styles.baslik}>
          E-Ticaret Mağazam
        </Text>

        <Pressable
          style={styles.sepetButon}
          onPress={() => router.push('/sepet')}
        >
          <Text style={styles.butonYazi}>
            Sepetim ({toplamAdet})
          </Text>
        </Pressable>
      </View>

      <View style={styles.aramaAlani}>
        <TextInput
          style={styles.aramaGirdisi}
          placeholder="Ürün ara..."
          placeholderTextColor="#9ca3af"
          value={aramaMetni}
          onChangeText={setAramaMetni}
          clearButtonMode="while-editing"
          returnKeyType="search"
        />
      </View>

      {yukleniyor ? (
        <ActivityIndicator
          size="large"
          color="#2563eb"
          style={styles.yukleme}
        />
      ) : hata ? (
        <View style={styles.mesajAlani}>
          <Text style={styles.hata}>{hata}</Text>

          <Pressable
            style={styles.tekrarButon}
            onPress={() => urunleriGetir(aramaMetni)}
          >
            <Text style={styles.butonYazi}>
              Tekrar Dene
            </Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={urunler}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.liste}
          ListEmptyComponent={
            <Text style={styles.bosListe}>
              Gösterilecek ürün bulunamadı.
            </Text>
          }
          renderItem={({ item }) => (
            <UrunKarti
              urun={item}
              onPress={() =>
                router.push(`/urun/${item.id}`)
              }
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  ustAlan: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  baslik: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#111827',
    flex: 1,
  },
  sepetButon: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  butonYazi: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  aramaAlani: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  aramaGirdisi: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: '#111827',
  },
  liste: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  bosListe: {
    textAlign: 'center',
    color: '#6b7280',
    marginTop: 32,
    fontSize: 15,
  },
  yukleme: {
    flex: 1,
    justifyContent: 'center',
  },
  mesajAlani: {
    alignItems: 'center',
    marginTop: 40,
    padding: 16,
  },
  hata: {
    color: '#dc2626',
    marginBottom: 16,
    textAlign: 'center',
  },
  tekrarButon: {
    backgroundColor: '#2563eb',
    padding: 12,
    borderRadius: 8,
  },
});
