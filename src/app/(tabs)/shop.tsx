import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Chip, Container, FadeIn } from '../../components/ui';
import { colors, fonts, radius } from '../../constants/theme';
import { formatNaira, products } from '../../data/products';

const categories = ['All', 'Cards', 'Print', 'Merch', 'Smart', 'Packaging'];

export default function ShopScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [active, setActive] = useState('All');

  const filtered = useMemo(
    () => (active === 'All' ? products : products.filter((p) => p.category === active)),
    [active],
  );

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + 24, paddingBottom: 48 }}
        showsVerticalScrollIndicator={false}>
        <Container>
          <FadeIn>
            <Text style={styles.kicker}>PIXEL SHOP</Text>
            <Text style={styles.title}>Products & prints</Text>
            <Text style={styles.subtitle}>
              Browse, pick and order in minutes. Prices in Naira — pay flexibly, via WhatsApp.
            </Text>
          </FadeIn>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 10, marginTop: 22, paddingBottom: 4 }}>
            {categories.map((c) => (
              <Chip key={c} label={c} active={active === c} onPress={() => setActive(c)} />
            ))}
          </ScrollView>

          <View style={styles.grid}>
            {filtered.map((product, i) => (
              <FadeIn key={product.id} delay={(i % 4) * 50} style={styles.cell}>
                <Pressable
                  onPress={() => router.push(`/product/${product.id}` as any)}
                  style={styles.card}>
                  <View>
                    <Image source={product.image} style={styles.image} resizeMode="cover" />
                    {product.popular && (
                      <View style={styles.popularBadge}>
                        <Text style={styles.popularText}>POPULAR</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.body}>
                    <Text style={styles.name} numberOfLines={1}>
                      {product.name}
                    </Text>
                    <Text style={styles.category}>{product.category}</Text>
                    <View style={styles.priceRow}>
                      {product.quoteOnly ? (
                        <Text style={styles.quote}>Request Quote</Text>
                      ) : (
                        <Text style={styles.price}>
                          From {formatNaira(product.price ?? 0)}
                          <Text style={styles.priceNote}> {product.priceNote}</Text>
                        </Text>
                      )}
                    </View>
                  </View>
                </Pressable>
              </FadeIn>
            ))}
          </View>
        </Container>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  kicker: {
    color: colors.cyan,
    fontFamily: fonts.bodySemi,
    fontSize: 12,
    letterSpacing: 2.5,
    marginBottom: 10,
  },
  title: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 32,
    letterSpacing: -0.8,
  },
  subtitle: {
    color: colors.subtext,
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
    maxWidth: 560,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, marginTop: 24 },
  cell: { width: '48%', flexGrow: 1 },
  card: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.lg,
    overflow: 'hidden',
    flex: 1,
  },
  image: { width: '100%', height: 150 },
  popularBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: colors.cyan,
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  popularText: { color: '#06282E', fontFamily: fonts.bodySemi, fontSize: 10, letterSpacing: 1 },
  body: { padding: 14 },
  name: { color: colors.text, fontFamily: fonts.displaySemi, fontSize: 15.5 },
  category: {
    color: colors.muted,
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 3,
  },
  priceRow: { marginTop: 10 },
  price: { color: colors.cyan, fontFamily: fonts.bodySemi, fontSize: 14 },
  priceNote: { color: colors.muted, fontFamily: fonts.body, fontSize: 11.5 },
  quote: { color: colors.amber, fontFamily: fonts.bodySemi, fontSize: 13.5 },
});
