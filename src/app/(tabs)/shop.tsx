import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Container, FadeIn } from '../../components/ui';
import { colors, fonts, radius, sp } from '../../constants/theme';
import { formatNaira, products } from '../../data/products';

const categories = ['All', 'Cards', 'Apparel', 'Mugs', 'Stickers', 'Packaging'];

export default function ShopScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [active, setActive] = useState('All');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    let list = active === 'All' ? products : products.filter((p) => p.category === active);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q));
    }
    return list;
  }, [active, query]);

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: sp.x8 }}
        showsVerticalScrollIndicator={false}>
        <Container style={{ marginTop: insets.top + sp.x4 }}>
          <FadeIn>
            <Text style={styles.title}>Shop</Text>
            <Text style={styles.subtitle}>Products crafted with the same care as our biggest projects.</Text>
          </FadeIn>

          {/* Search */}
          <FadeIn delay={80}>
            <View style={styles.search}>
              <Ionicons name="search-outline" size={18} color={colors.muted} />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Search products"
                placeholderTextColor={colors.muted}
                style={styles.searchInput}
              />
            </View>
          </FadeIn>

          {/* Categories */}
          <View style={{ marginTop: sp.x3, marginHorizontal: -24 }}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: sp.x1, paddingHorizontal: 24 }}>
              {categories.map((c) => (
                <Pressable
                  key={c}
                  onPress={() => setActive(c)}
                  style={[styles.catChip, active === c && styles.catChipActive]}>
                  <Text style={[styles.catChipText, active === c && styles.catChipTextActive]}>
                    {c}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {/* Grid */}
          <View style={styles.grid}>
            {filtered.map((product, i) => (
              <FadeIn key={product.id} delay={(i % 2) * 60} style={styles.cell}>
                <Pressable onPress={() => router.push(`/product/${product.id}` as any)} style={styles.card}>
                  <Image source={product.image} style={styles.image} resizeMode="cover" />
                  <Text style={styles.name} numberOfLines={1}>
                    {product.name}
                  </Text>
                  {product.quoteOnly ? (
                    <Text style={styles.quote}>Request quote</Text>
                  ) : (
                    <Text style={styles.price}>{formatNaira(product.price ?? 0)}</Text>
                  )}
                </Pressable>
              </FadeIn>
            ))}
          </View>

          {filtered.length === 0 && (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No products match your search.</Text>
            </View>
          )}
        </Container>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  title: { fontFamily: fonts.semi, fontSize: 36, letterSpacing: -1.1, color: colors.text },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.subtext,
    marginTop: sp.x1,
    maxWidth: 480,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.surface,
    borderColor: colors.hairline,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: 16,
    marginTop: sp.x4,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 15,
    color: colors.text,
    fontFamily: fonts.regular,
    fontSize: 16,
  },
  catChip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.hairline,
  },
  catChipActive: { backgroundColor: colors.text, borderColor: colors.text },
  catChipText: { fontFamily: fonts.medium, fontSize: 14, color: colors.subtext },
  catChipTextActive: { color: colors.bg },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: sp.x3, marginTop: sp.x4 },
  cell: { width: '47.5%', flexGrow: 1 },
  card: { flex: 1 },
  image: {
    width: '100%',
    height: 190,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
  },
  name: {
    fontFamily: fonts.medium,
    fontSize: 16,
    color: colors.text,
    marginTop: sp.x2_,
  },
  price: { fontFamily: fonts.regular, fontSize: 14.5, color: colors.subtext, marginTop: 3 },
  quote: { fontFamily: fonts.regular, fontSize: 14.5, color: colors.subtext, marginTop: 3 },
  empty: { paddingVertical: sp.x7, alignItems: 'center' },
  emptyText: { fontFamily: fonts.regular, fontSize: 15, color: colors.muted },
});
