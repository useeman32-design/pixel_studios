import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, Container, Eyebrow, FadeIn, LogoMark } from '../../components/ui';
import { colors, fonts, radius, sp } from '../../constants/theme';

const heroImage = require('../../../assets/images/hero.jpg');
const nfcImage = require('../../../assets/images/nfc-card.jpg');
const brandingImage = require('../../../assets/images/portfolio/branding.jpg');
const digitalImage = require('../../../assets/images/portfolio/app.jpg');
const avatarImage = require('../../../assets/images/avatar.jpg');

const quickActions = [
  { label: 'Print', icon: 'print-outline', target: '/service/print' },
  { label: 'Design', icon: 'color-palette-outline', target: '/service/creative' },
  { label: 'NFC', icon: 'wifi-outline', target: '/nfc' },
  { label: 'Web', icon: 'code-slash-outline', target: '/service/digital' },
];

const featured = [
  {
    title: 'Smart NFC Business Cards',
    sub: 'One tap. Your entire business.',
    image: nfcImage,
    target: '/nfc',
  },
  {
    title: 'Premium Branding',
    sub: 'Identity that earns trust.',
    image: brandingImage,
    target: '/service/creative',
  },
  {
    title: 'Websites & Apps',
    sub: 'From idea to launch.',
    image: digitalImage,
    target: '/service/digital',
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{ paddingBottom: sp.x8 }}
      showsVerticalScrollIndicator={false}>
      {/* ============================== HEADER ============================== */}
      <Container>
        <View style={[styles.header, { marginTop: insets.top + sp.x2 }]}>
          <LogoMark size={26} />
          <View style={{ flex: 1, marginLeft: sp.x2_ }}>
            <Text style={styles.wordmark}>PIXEL STUDIOS</Text>
          </View>
          <Pressable style={styles.headerIcon} onPress={() => router.push('/chat')}>
            <Ionicons name="chatbubble-outline" size={19} color={colors.text} />
          </Pressable>
          <Pressable style={styles.headerIcon} onPress={() => router.push('/profile')}>
            <Image source={avatarImage} style={styles.headerAvatar} />
          </Pressable>
        </View>

        <Pressable onPress={() => {}} style={styles.location}>
          <Ionicons name="location-outline" size={13} color={colors.muted} />
          <Text style={styles.locationText}>Gusau, Zamfara</Text>
        </Pressable>
      </Container>

      {/* =============================== HERO =============================== */}
      <Container>
        <FadeIn delay={60}>
          <Text style={styles.heroTitle}>Bring your ideas to life.</Text>
        </FadeIn>
        <FadeIn delay={140}>
          <Text style={styles.heroSub}>
            Design, print and digital solutions for modern businesses.
          </Text>
        </FadeIn>
        <FadeIn delay={220} style={{ marginTop: sp.x4 }}>
          <Button title="Start a Project" icon="arrow-forward" onPress={() => router.push('/start')} />
        </FadeIn>
        <FadeIn delay={300}>
          <Image source={heroImage} style={styles.heroImage} resizeMode="cover" />
        </FadeIn>
      </Container>

      {/* =========================== QUICK ACTIONS =========================== */}
      <Container style={{ marginTop: sp.x6 }}>
        <FadeIn delay={80}>
          <View style={styles.actionsRow}>
            {quickActions.map((a) => (
              <Pressable
                key={a.label}
                onPress={() => router.push(a.target as any)}
                style={styles.actionItem}>
                <View style={styles.actionIcon}>
                  <Ionicons name={a.icon as any} size={22} color={colors.text} />
                </View>
                <Text style={styles.actionLabel}>{a.label}</Text>
              </Pressable>
            ))}
          </View>
        </FadeIn>
      </Container>

      {/* ============================= FEATURED ============================= */}
      <Container style={{ marginTop: sp.x7 }}>
        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>Featured</Text>
          <Pressable onPress={() => router.push('/services')} hitSlop={8}>
            <Text style={styles.viewAll}>View all services</Text>
          </Pressable>
        </View>

        <View style={{ gap: sp.x3 }}>
          {featured.map((f, i) => (
            <FadeIn key={f.title} delay={i * 80}>
              <Pressable onPress={() => router.push(f.target as any)} style={styles.featuredCard}>
                <Image source={f.image} style={styles.featuredImage} resizeMode="cover" />
                <View style={styles.featuredOverlay} />
                <View style={styles.featuredTextWrap}>
                  <Text style={styles.featuredTitle}>{f.title}</Text>
                  <Text style={styles.featuredSub}>{f.sub}</Text>
                </View>
                <View style={styles.featuredArrow}>
                  <Ionicons name="arrow-forward" size={18} color={colors.onLime} />
                </View>
              </Pressable>
            </FadeIn>
          ))}
        </View>
      </Container>

      {/* ============================ WORK TEASER ============================ */}
      <Container style={{ marginTop: sp.x7 }}>
        <FadeIn>
          <Eyebrow>Selected work</Eyebrow>
          <Text style={styles.teaserTitle}>Work that speaks before you do.</Text>
          <Pressable onPress={() => router.push('/portfolio')} style={styles.textLink}>
            <Text style={styles.textLinkText}>Explore the portfolio</Text>
            <Ionicons name="arrow-forward" size={16} color={colors.lime} />
          </Pressable>
        </FadeIn>
      </Container>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center' },
  wordmark: { fontFamily: fonts.bold, fontSize: 12, letterSpacing: 3, color: colors.text },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.hairline,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: sp.x1,
    overflow: 'hidden',
  },
  headerAvatar: { width: '100%', height: '100%' },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: sp.x2_ + 2,
    alignSelf: 'flex-start',
  },
  locationText: { fontFamily: fonts.medium, fontSize: 12.5, color: colors.muted },
  heroTitle: {
    fontFamily: fonts.semi,
    fontSize: 44,
    lineHeight: 48,
    letterSpacing: -1.6,
    color: colors.text,
    marginTop: sp.x6,
  },
  heroSub: {
    fontFamily: fonts.regular,
    fontSize: 18,
    lineHeight: 26,
    color: colors.subtext,
    marginTop: sp.x2_,
    maxWidth: 420,
  },
  heroImage: {
    width: '100%',
    height: 300,
    borderRadius: radius.xl,
    marginTop: sp.x5,
    backgroundColor: colors.surface,
  },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  actionItem: { alignItems: 'center', gap: sp.x1 },
  actionIcon: {
    width: 62,
    height: 62,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.hairline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: { fontFamily: fonts.medium, fontSize: 13.5, color: colors.subtext },
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: sp.x3,
  },
  sectionTitle: { fontFamily: fonts.semi, fontSize: 22, letterSpacing: -0.4, color: colors.text },
  viewAll: { fontFamily: fonts.medium, fontSize: 14, color: colors.subtext },
  featuredCard: {
    height: 210,
    borderRadius: radius.xl,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  featuredImage: { width: '100%', height: '100%' },
  featuredOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '60%',
    backgroundColor: 'transparent',
    // subtle legibility gradient via layered opacity block
    opacity: 0.85,
    borderBottomLeftRadius: radius.xl,
    borderBottomRightRadius: radius.xl,
  },
  featuredTextWrap: { position: 'absolute', left: 20, bottom: 20, right: 76 },
  featuredTitle: {
    fontFamily: fonts.semi,
    fontSize: 21,
    letterSpacing: -0.3,
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowRadius: 12,
    textShadowOffset: { width: 0, height: 2 },
  },
  featuredSub: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 3,
  },
  featuredArrow: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.lime,
    alignItems: 'center',
    justifyContent: 'center',
  },
  teaserTitle: {
    fontFamily: fonts.semi,
    fontSize: 30,
    lineHeight: 34,
    letterSpacing: -0.8,
    color: colors.text,
    marginTop: sp.x1,
    maxWidth: 420,
  },
  textLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: sp.x3,
    alignSelf: 'flex-start',
  },
  textLinkText: { fontFamily: fonts.semi, fontSize: 15, color: colors.lime },
});
