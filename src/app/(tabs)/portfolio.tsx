import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Chip, Container, FadeIn } from '../../components/ui';
import { colors, fonts, radius } from '../../constants/theme';
import { portfolioCategories, portfolioItems } from '../../data/portfolio';

export default function PortfolioScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [active, setActive] = useState('All');

  const filtered = useMemo(
    () =>
      active === 'All'
        ? portfolioItems
        : portfolioItems.filter((p) =>
            active === 'Systems' ? p.category === 'Systems' : p.category === active,
          ),
    [active],
  );

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{ paddingTop: insets.top + 24, paddingBottom: 48 }}
      showsVerticalScrollIndicator={false}>
      <Container>
        <FadeIn>
          <Text style={styles.kicker}>OUR WORK</Text>
          <Text style={styles.title}>Portfolio</Text>
          <Text style={styles.subtitle}>
            A selection of projects across branding, print, digital and smart products.
          </Text>
        </FadeIn>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8, marginTop: 22, paddingBottom: 4 }}>
          {portfolioCategories.map((c) => (
            <Chip key={c} label={c} active={active === c} onPress={() => setActive(c)} />
          ))}
        </ScrollView>

        <View style={styles.grid}>
          {filtered.map((item, i) => (
            <FadeIn key={item.id} delay={(i % 4) * 60} style={styles.cell}>
              <Pressable style={styles.tile}>
                <Image source={item.image} style={styles.image} resizeMode="cover" />
                <LinearGradient
                  colors={['transparent', 'rgba(7,7,13,0.95)']}
                  style={styles.overlay}>
                  <View style={styles.catBadge}>
                    <Text style={styles.catText}>{item.category}</Text>
                  </View>
                  <Text style={styles.itemTitle} numberOfLines={2}>
                    {item.title}
                  </Text>
                  <Text style={styles.itemClient} numberOfLines={1}>
                    {item.client}
                  </Text>
                </LinearGradient>
              </Pressable>
            </FadeIn>
          ))}
        </View>

        {filtered.length === 0 && (
          <View style={styles.empty}>
            <Ionicons name="images-outline" size={40} color={colors.muted} />
            <Text style={styles.emptyText}>No projects in this category yet — check back soon.</Text>
          </View>
        )}

        <FadeIn delay={150}>
          <View style={styles.ctaCard}>
            <Text style={styles.ctaTitle}>Want results like these?</Text>
            <Text style={styles.ctaText}>Let's make your business the next success story.</Text>
            <Pressable onPress={() => router.push('/start')} style={styles.ctaButton}>
              <Text style={styles.ctaButtonText}>Start your project →</Text>
            </Pressable>
          </View>
        </FadeIn>
      </Container>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  kicker: { color: colors.cyan, fontFamily: fonts.bodySemi, fontSize: 12, letterSpacing: 2.5, marginBottom: 10 },
  title: { color: colors.text, fontFamily: fonts.display, fontSize: 32, letterSpacing: -0.8 },
  subtitle: { color: colors.subtext, fontFamily: fonts.body, fontSize: 15, lineHeight: 22, marginTop: 8, maxWidth: 560 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 24 },
  cell: { width: '48%', flexGrow: 1 },
  tile: { aspectRatio: 0.82, borderRadius: radius.lg, overflow: 'hidden', backgroundColor: colors.surface },
  image: { width: '100%', height: '100%' },
  overlay: { position: 'absolute', left: 0, right: 0, bottom: 0, padding: 14, paddingTop: 40 },
  catBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 8,
  },
  catText: { color: '#fff', fontFamily: fonts.bodySemi, fontSize: 10.5, letterSpacing: 1, textTransform: 'uppercase' },
  itemTitle: { color: '#fff', fontFamily: fonts.displaySemi, fontSize: 15, lineHeight: 19 },
  itemClient: { color: 'rgba(255,255,255,0.7)', fontFamily: fonts.body, fontSize: 12, marginTop: 3 },
  empty: { alignItems: 'center', paddingVertical: 60, gap: 12 },
  emptyText: { color: colors.muted, fontFamily: fonts.body, fontSize: 14 },
  ctaCard: {
    marginTop: 32,
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.xl,
    padding: 26,
    alignItems: 'center',
  },
  ctaTitle: { color: colors.text, fontFamily: fonts.display, fontSize: 22, textAlign: 'center' },
  ctaText: { color: colors.subtext, fontFamily: fonts.body, fontSize: 14, marginTop: 6, textAlign: 'center' },
  ctaButton: {
    marginTop: 18,
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingHorizontal: 24,
    paddingVertical: 13,
  },
  ctaButtonText: { color: '#fff', fontFamily: fonts.bodySemi, fontSize: 14.5 },
});
