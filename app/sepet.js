import React from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useSepet } from '../context/SepetContext';

export default function SepetSayfasi() {
  const router = useRouter();

  const {
    sepet,
    urunSil,
    adetArtir,
    adetAzalt,
    toplamTutar,
    toplamAdet,
  } = useSepet();

  function sepetUrunuGoster({ item }) {
    return (
      <View style={styles.kart}>
        <Image
          source={{ uri: item.thumbnail }}
          style={styles.resim}
          resizeMode="contain"
        />

        <View style={styles.bilgiler}>
          <Text style={styles.urunAdi}>
            {item.title}
          </Text>

          <Text style={styles.fiyat}>
            ${Number(item.price).toFixed(2)}
          </Text>

          <View style={styles.adetAlani}>
            <Pressable
              style={styles.adetButon}
              onPress={() => adetAzalt(item.id)}
            >
              <Text style={styles.adetButonYazi}>−</Text>
            </Pressable>

            <Text style={styles.adet}>
              {item.adet}
            </Text>

            <Pressable
              style={styles.adetButon}
              onPress={() => adetArtir(item.id)}
            >
              <Text style={styles.adetButonYazi}>+</Text>
            </Pressable>
          </View>

          <Pressable onPress={() => urunSil(item.id)}>
            <Text style={styles.sil}>
              Ürünü Sil
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView
      style={styles.container}
      edges={['bottom', 'left', 'right']}
    >
      <View style={styles.ustAlan}>
        <Text style={styles.baslik}>Sepetim</Text>
        <Text style={styles.altBaslik}>
          Toplam ürün adedi: {toplamAdet}
        </Text>
      </View>

      {sepet.length === 0 ? (
        <View style={styles.bosSepet}>
          <Text style={styles.bosYazi}>
            Sepetiniz boş.
          </Text>

          <Pressable
            style={styles.alisverisButon}
            onPress={() => router.navigate('/')}
          >
            <Text style={styles.butonYazi}>
              Alışverişe Dön
            </Text>
          </Pressable>
        </View>
      ) : (
        <>
          <FlatList
            data={sepet}
            keyExtractor={(item) => item.id.toString()}
            renderItem={sepetUrunuGoster}
            contentContainerStyle={styles.liste}
          />

          <View style={styles.altAlan}>
            <Text style={styles.toplam}>
              Toplam: ${toplamTutar.toFixed(2)}
            </Text>

            <Pressable
              style={styles.alisverisButon}
              onPress={() => router.navigate('/')}
            >
              <Text style={styles.butonYazi}>
                Alışverişe Devam Et
              </Text>
            </Pressable>
          </View>
        </>
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
    padding: 16,
    backgroundColor: '#ffffff',
  },
  baslik: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
  },
  altBaslik: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 5,
  },
  liste: {
    padding: 12,
  },
  kart: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  resim: {
    width: 90,
    height: 90,
    marginRight: 12,
  },
  bilgiler: {
    flex: 1,
  },
  urunAdi: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  fiyat: {
    fontSize: 16,
    color: '#2563eb',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  adetAlani: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  adetButon: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e5e7eb',
    borderRadius: 6,
  },
  adetButonYazi: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  adet: {
    fontSize: 16,
    marginHorizontal: 15,
  },
  sil: {
    color: '#dc2626',
    fontWeight: '600',
  },
  altAlan: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  toplam: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'right',
  },
  alisverisButon: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  butonYazi: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  bosSepet: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  bosYazi: {
    fontSize: 18,
    color: '#6b7280',
    marginBottom: 20,
  },
});
