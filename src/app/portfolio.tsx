import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackBar, Container, FadeIn } from '../components/ui';
import { colors, fonts, radius, sp } from '../constants/theme';
import { portfolioCategories, portfolioItems } from '../data/portfolio';

export default function PortfolioScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [active, setActive] = useState('All');

  const filtered = useMemo(
    () => (active === 'All' ? portfolioItems : portfolioItems.filter((p) => p.category === active)),
    [active],
  );

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{ paddingBottom: sp.x8 }}
      showsVerticalScrollIndicator={false}>
      <Container style={{ marginTop: insets.top + sp.x1 }}>
        <BackBar onBack={() => router.back()} />
      </Container>

      <Container style={{ marginTop: sp.x3 }}>
        <FadeIn>
          <Text style={styles.title}>Selected work</Text>
        </FadeIn>

        <FadeIn delay={60}>
          <View style={styles.chipRow}>
            {portfolioCategories.map((c) => (
              <Pressable
                key={c}
                onPress={() => setActive(c)}
                style={[styles.chip, active === c && styles.chipActive]}>
                <Text style={[styles.chipText, active === c && styles.chipTextActive]}>{c}</Text>
              </Pressable>
            ))}
          </View>
        </FadeIn>

        <View style={styles.grid}>
          {filtered.map((item, i) => (
            <FadeIn key={item.id} delay={(i % 2) * 60} style={styles.cell}>
              <View style={styles.tile}>
                <Image source={item.image} style={styles.tileImage} resizeMode="cover" />
                <Text style={styles.tileCategory}>{item.category}</Text>
                <Text style={styles.tileTitle} numberOfLines={1}>
                  {item.title}
                </Text>
              </View>
            </FadeIn>
          ))}
        </View>

        <FadeIn delay={150}>
          <Text style={styles.footer}>
            Every project starts with a conversation.
          </Text>
          <Pressable onPress={() => router.push('/start')} style={styles.footerLink}>
            <Text style={styles.footerLinkText}>Start yours</Text>
          </Pressable>
        </FadeIn>
      </Container>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  title: { fontFamily: fonts.semi, fontSize: 36, letterSpacing: -1.1, color: colors.text },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: sp.x1, marginTop: sp.x4 },
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.hairline,
  },
  chipActive: { backgroundColor: colors.text, borderColor: colors.text },
  chipText: { fontFamily: fonts.medium, fontSize: 14, color: colors.subtext },
  chipTextActive: { color: colors.bg },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: sp.x3, marginTop: sp.x4 },
  cell: { width: '47.5%', flexGrow: 1 },
  tile: { marginBottom: sp.x1 },
  tileImage: {
    width: '100%',
    height: 210,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
  },
  tileCategory: {
    fontFamily: fonts.medium,
    fontSize: 11.5,
    letterSpacing: 1.4,
    color: colors.muted,
    textTransform: 'uppercase',
    marginTop: sp.x2_,
  },
  tileTitle: { fontFamily: fonts.medium, fontSize: 15, color: colors.text, marginTop: 3 },
  footer: {
    fontFamily: fonts.semi,
    fontSize: 22,
    letterSpacing: -0.4,
    color: colors.text,
    marginTop: sp.x6,
  },
  footerLink: {
    backgroundColor: colors.lime,
    borderRadius: radius.md,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: sp.x3,
  },
  footerLinkText: { fontFamily: fonts.semi, fontSize: 16, color: colors.onLime },
});
