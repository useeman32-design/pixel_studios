import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackHeader, Button, Container, FadeIn, GlassCard } from '../../components/ui';
import { CONTACT, waLink } from '../../constants/contact';
import { colors, fonts, radius } from '../../constants/theme';
import { getCategory } from '../../data/services';

export default function ServiceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const category = getCategory(id);

  if (!category) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top + 20 }]}>
        <BackHeader title="Service" onBack={() => router.back()} />
        <Text style={{ color: colors.subtext, padding: 24 }}>Service not found.</Text>
      </View>
    );
  }

  const waMessage = `Hello Pixel Studios! I'm interested in *${category.name}* services. Can we discuss?`;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{ paddingBottom: 48 }}
      showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={[category.gradient[0], category.gradient[1]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.hero, { paddingTop: insets.top + 8 }]}>
        <Container>
          <BackHeader title={category.name} onBack={() => router.back()} />
          <View style={styles.heroBody}>
            <Text style={{ fontSize: 44 }}>{category.emoji}</Text>
            <Text style={styles.heroTitle}>{category.name}</Text>
            <Text style={styles.heroTagline}>{category.tagline}</Text>
          </View>
        </Container>
      </LinearGradient>

      <Container style={{ paddingHorizontal: 20 }}>
        <FadeIn delay={80}>
          <Text style={styles.description}>{category.description}</Text>
        </FadeIn>

        <View style={{ marginTop: 26, gap: 12 }}>
          {category.services.map((service, i) => (
            <FadeIn key={service.name} delay={i * 45}>
              <GlassCard style={styles.serviceRow}>
                <LinearGradient
                  colors={[category.gradient[0] + '40', category.gradient[1] + '25']}
                  style={styles.serviceIcon}>
                  <Ionicons name="checkmark" size={16} color="#fff" />
                </LinearGradient>
                <View style={{ flex: 1 }}>
                  <Text style={styles.serviceName}>{service.name}</Text>
                  <Text style={styles.serviceBlurb}>{service.blurb}</Text>
                </View>
              </GlassCard>
            </FadeIn>
          ))}
        </View>

        <FadeIn delay={200}>
          <View style={styles.ctaBlock}>
            <Text style={styles.ctaTitle}>Ready to start?</Text>
            <Text style={styles.ctaText}>
              Tell us what you need — we reply within 24 hours with a clear plan and quotation.
            </Text>
            <View style={{ gap: 12, marginTop: 18 }}>
              <Button title="Start this project" icon="rocket-outline" onPress={() => router.push('/start')} />
              <Button
                title={`WhatsApp ${CONTACT.phone}`}
                variant="whatsapp"
                icon="logo-whatsapp"
                href={waLink(waMessage)}
              />
            </View>
          </View>
        </FadeIn>
      </Container>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  hero: { paddingBottom: 30, borderBottomLeftRadius: radius.xl, borderBottomRightRadius: radius.xl },
  heroBody: { padding: 20, paddingTop: 8 },
  heroTitle: {
    color: '#fff',
    fontFamily: fonts.display,
    fontSize: 32,
    letterSpacing: -0.6,
    marginTop: 14,
  },
  heroTagline: {
    color: 'rgba(255,255,255,0.88)',
    fontFamily: fonts.body,
    fontSize: 15.5,
    lineHeight: 22,
    marginTop: 6,
    maxWidth: 480,
  },
  description: {
    color: colors.subtext,
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 23,
    marginTop: 24,
  },
  serviceRow: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 14 },
  serviceIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceName: { color: colors.text, fontFamily: fonts.displaySemi, fontSize: 15.5 },
  serviceBlurb: { color: colors.subtext, fontFamily: fonts.body, fontSize: 13, lineHeight: 18, marginTop: 2 },
  ctaBlock: {
    marginTop: 34,
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.xl,
    padding: 24,
  },
  ctaTitle: { color: colors.text, fontFamily: fonts.display, fontSize: 22 },
  ctaText: { color: colors.subtext, fontFamily: fonts.body, fontSize: 14, lineHeight: 21, marginTop: 6 },
});
