import React from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
} from 'react-native';

export default function UrunKarti({ urun, onPress }) {
  return (
    <Pressable
      style={styles.kart}
      onPress={onPress}
    >
      <Image
        source={{ uri: urun.thumbnail }}
        style={styles.resim}
        resizeMode="contain"
      />

      <View style={styles.bilgiler}>
        <Text style={styles.baslik} numberOfLines={2}>
          {urun.title}
        </Text>

        <Text style={styles.fiyat}>
          ${Number(urun.price).toFixed(2)}
        </Text>

        <Text style={styles.puan}>
          Puan: {urun.rating}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  kart: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
  },
  resim: {
    width: 90,
    height: 90,
    marginRight: 12,
  },
  bilgiler: {
    flex: 1,
  },
  baslik: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  fiyat: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  puan: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 4,
  },
});
