import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Container, FadeIn } from '../../components/ui';
import { colors, fonts, radius } from '../../constants/theme';
import { serviceCategories } from '../../data/services';

export default function ServicesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{ paddingTop: insets.top + 24, paddingBottom: 48 }}
      showsVerticalScrollIndicator={false}>
      <Container>
        <FadeIn>
          <Text style={styles.kicker}>OUR DIVISIONS</Text>
          <Text style={styles.title}>Everything your business needs</Text>
          <Text style={styles.subtitle}>
            Seven specialized teams working as one studio — from creative design to artificial
            intelligence.
          </Text>
        </FadeIn>

        <View style={styles.grid}>
          {serviceCategories.map((cat, i) => (
            <FadeIn key={cat.id} delay={i * 60} style={styles.cell}>
              <Pressable
                onPress={() => router.push(`/service/${cat.id}` as any)}
                style={styles.card}>
                <LinearGradient
                  colors={[cat.gradient[0] + '26', cat.gradient[1] + '14']}
                  style={styles.cardTop}>
                  <LinearGradient
                    colors={[cat.gradient[0], cat.gradient[1]]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.iconWrap}>
                    <Text style={{ fontSize: 26 }}>{cat.emoji}</Text>
                  </LinearGradient>
                  <View style={styles.countBadge}>
                    <Text style={styles.countText}>{cat.services.length} services</Text>
                  </View>
                </LinearGradient>
                <View style={styles.cardBody}>
                  <Text style={styles.cardName}>{cat.name}</Text>
                  <Text style={styles.cardTagline}>{cat.tagline}</Text>
                  <Text style={styles.cardLink}>Explore →</Text>
                </View>
              </Pressable>
            </FadeIn>
          ))}
        </View>
      </Container>
    </ScrollView>
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
    lineHeight: 38,
  },
  subtitle: {
    color: colors.subtext,
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 10,
    maxWidth: 560,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, marginTop: 28 },
  cell: { width: '100%' },
  card: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.xl,
    overflow: 'hidden',
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    paddingBottom: 14,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countBadge: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  countText: { color: colors.subtext, fontFamily: fonts.bodyMedium, fontSize: 12 },
  cardBody: { padding: 18, paddingTop: 6 },
  cardName: { color: colors.text, fontFamily: fonts.displaySemi, fontSize: 20 },
  cardTagline: {
    color: colors.subtext,
    fontFamily: fonts.body,
    fontSize: 13.5,
    lineHeight: 19,
    marginTop: 5,
  },
  cardLink: { color: colors.cyan, fontFamily: fonts.bodySemi, fontSize: 13.5, marginTop: 12 },
});
