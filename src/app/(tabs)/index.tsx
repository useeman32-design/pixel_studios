import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, Container, FadeIn, GlassCard, SectionHeader, Stars } from '../../components/ui';
import { CONTACT, waDefaultMessage, waLink } from '../../constants/contact';
import { colors, fonts, gradients, radius } from '../../constants/theme';
import { portfolioItems } from '../../data/portfolio';
import { formatNaira, products } from '../../data/products';
import { serviceCategories } from '../../data/services';
import { testimonials } from '../../data/testimonials';

const heroImage = require('../../../assets/images/hero.jpg');

const paths = [
  {
    emoji: '🎨',
    title: 'I need something designed',
    subtitle: 'Logos, branding & graphics',
    route: '/service/creative',
    gradient: gradients.rose,
  },
  {
    emoji: '🖨️',
    title: 'I need something printed',
    subtitle: 'Cards, flyers & merchandise',
    route: '/service/print',
    gradient: gradients.sky,
  },
  {
    emoji: '💻',
    title: 'I need a digital solution',
    subtitle: 'Websites, apps & systems',
    route: '/service/digital',
    gradient: gradients.primary,
  },
];

const whyUs = [
  { icon: 'flash-outline', title: 'Fast delivery', text: 'Quick turnarounds without cutting corners.' },
  { icon: 'diamond-outline', title: 'Premium quality', text: 'Work that makes your business look world-class.' },
  { icon: 'apps-outline', title: 'One-stop studio', text: 'Design, print, tech and marketing under one roof.' },
  { icon: 'shield-checkmark-outline', title: 'Reliable support', text: 'We stay with you from idea to launch and beyond.' },
];

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const popularProducts = products.filter((p) => p.popular);

  return (
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
      {/* ================================ HERO ================================ */}
      <ImageBackground source={heroImage} style={styles.hero} resizeMode="cover">
        <LinearGradient
          colors={['rgba(7,7,13,0.35)', 'rgba(7,7,13,0.55)', colors.bg]}
          style={styles.heroOverlay}>
          <Container style={{ paddingTop: insets.top + 28 }}>
            <FadeIn>
              <View style={styles.heroBadge}>
                <View style={styles.heroBadgeDot} />
                <Text style={styles.heroBadgeText}>Creative · Print · Technology — Gusau, Nigeria</Text>
              </View>
            </FadeIn>
            <FadeIn delay={120}>
              <Text style={styles.heroTitle}>
                Design. Print.{'\n'}Build. <Text style={styles.heroAccent}>Grow.</Text>
              </Text>
            </FadeIn>
            <FadeIn delay={240}>
              <Text style={styles.heroSubtitle}>
                Creative, printing and technology solutions for modern businesses — from a single
                business card to complete software systems.
              </Text>
            </FadeIn>
            <FadeIn delay={360}>
              <View style={styles.heroButtons}>
                <Button title="Start a Project" icon="rocket-outline" onPress={() => router.push('/start')} />
                <Button
                  title="Explore Services"
                  variant="glass"
                  icon="grid-outline"
                  onPress={() => router.push('/services')}
                />
              </View>
            </FadeIn>
          </Container>
        </LinearGradient>
      </ImageBackground>

      <Container>
        {/* ============================ THREE PATHS ============================ */}
        <FadeIn delay={80}>
          <SectionHeader
            title="What do you need today?"
            subtitle="Three simple ways we can help."
          />
          <View style={{ gap: 12 }}>
            {paths.map((p) => (
              <GlassCard key={p.title} onPress={() => router.push(p.route as any)} style={styles.pathCard}>
                <LinearGradient
                  colors={[p.gradient[0], p.gradient[1]]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.pathEmojiWrap}>
                  <Text style={styles.pathEmoji}>{p.emoji}</Text>
                </LinearGradient>
                <View style={{ flex: 1 }}>
                  <Text style={styles.pathTitle}>{p.title}</Text>
                  <Text style={styles.pathSubtitle}>{p.subtitle}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.muted} />
              </GlassCard>
            ))}
          </View>
        </FadeIn>

        {/* ========================= FEATURED SERVICES ======================== */}
        <View style={styles.section}>
          <SectionHeader
            title="Explore our divisions"
            subtitle="Seven specialized teams, one studio."
            actionLabel="View all"
            onAction={() => router.push('/services')}
          />
        </View>
      </Container>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.hScroll}>
        {serviceCategories.map((cat) => (
            <Pressable
              key={cat.id}
              onPress={() => router.push(`/service/${cat.id}` as any)}
              style={styles.serviceCard}>
              <LinearGradient
                colors={[cat.gradient[0], cat.gradient[1]]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.serviceIcon}>
                <Text style={{ fontSize: 22 }}>{cat.emoji}</Text>
              </LinearGradient>
              <Text style={styles.serviceName}>{cat.shortName}</Text>
              <Text style={styles.serviceTag} numberOfLines={2}>
                {cat.tagline}
              </Text>
              <Text style={styles.serviceCount}>{cat.services.length} services →</Text>
            </Pressable>
          ))}
      </ScrollView>

      <Container>
        {/* ========================= POPULAR PRODUCTS ========================= */}
        <View style={styles.section}>
          <SectionHeader
            title="Popular products"
            subtitle="Order ready — quality guaranteed."
            actionLabel="Open shop"
            onAction={() => router.push('/shop')}
          />
        </View>
      </Container>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.hScroll}>
          {popularProducts.map((product) => (
            <Pressable
              key={product.id}
              onPress={() => router.push(`/product/${product.id}` as any)}
              style={styles.productCard}>
              <Image source={product.image} style={styles.productImage} resizeMode="cover" />
              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={1}>
                  {product.name}
                </Text>
                <Text style={styles.productPrice}>
                  From {formatNaira(product.price ?? 0)}{' '}
                  <Text style={styles.productPriceNote}>{product.priceNote}</Text>
                </Text>
              </View>
            </Pressable>
          ))}
      </ScrollView>

      <Container>
        {/* ============================= WHY US ============================== */}
        <View style={styles.section}>
          <SectionHeader title="Why Pixel Studios?" />
          <View style={styles.whyGrid}>
            {whyUs.map((w) => (
              <GlassCard key={w.title} style={styles.whyCard}>
                <View style={styles.whyIconWrap}>
                  <Ionicons name={w.icon as any} size={20} color={colors.cyan} />
                </View>
                <Text style={styles.whyTitle}>{w.title}</Text>
                <Text style={styles.whyText}>{w.text}</Text>
              </GlassCard>
            ))}
          </View>
        </View>

        {/* ========================== PORTFOLIO PREVIEW ======================= */}
        <View style={styles.section}>
          <SectionHeader
            title="Recent work"
            subtitle="Quality you can see."
            actionLabel="Full portfolio"
            onAction={() => router.push('/portfolio')}
          />
          <View style={styles.portfolioGrid}>
            {portfolioItems.slice(0, 4).map((item) => (
              <Pressable key={item.id} onPress={() => router.push('/portfolio')} style={styles.portfolioTile}>
                <Image source={item.image} style={styles.portfolioImage} resizeMode="cover" />
                <LinearGradient
                  colors={['transparent', 'rgba(7,7,13,0.92)']}
                  style={styles.portfolioOverlay}>
                  <Text style={styles.portfolioCategory}>{item.category}</Text>
                  <Text style={styles.portfolioTitle} numberOfLines={1}>
                    {item.title}
                  </Text>
                </LinearGradient>
              </Pressable>
            ))}
          </View>
        </View>

        {/* ============================ TESTIMONIALS ========================== */}
        <View style={styles.section}>
          <SectionHeader title="What clients say" subtitle="Trusted across Nigeria." />
        </View>
      </Container>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.hScroll}>
          {testimonials.map((t) => (
            <GlassCard key={t.id} style={styles.testimonialCard}>
              <Stars rating={t.rating} />
              <Text style={styles.testimonialQuote}>“{t.quote}”</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 14 }}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{t.name.charAt(0)}</Text>
                </View>
                <View>
                  <Text style={styles.testimonialName}>{t.name}</Text>
                  <Text style={styles.testimonialRole}>{t.role}</Text>
                </View>
              </View>
            </GlassCard>
          ))}
      </ScrollView>

      <Container>
        {/* =============================== CTA ================================ */}
        <View style={styles.section}>
          <LinearGradient
            colors={['#7C3AED', '#5B4BE0', '#0E7490']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.ctaCard}>
            <Text style={styles.ctaTitle}>Have an idea?</Text>
            <Text style={styles.ctaText}>
              Bring it to Pixel Studios — we'll design it, print it, build it and help it grow.
            </Text>
            <View style={styles.ctaButtons}>
              <Button
                title="Chat on WhatsApp"
                variant="dark"
                icon="logo-whatsapp"
                href={waLink(waDefaultMessage)}
              />
              <Button title="Start a Project" variant="glass" onPress={() => router.push('/start')} />
            </View>
          </LinearGradient>
        </View>

        {/* ============================== FOOTER ============================== */}
        <View style={styles.footer}>
          <Text style={styles.footerLogo}>PIXEL STUDIOS</Text>
          <Text style={styles.footerText}>{CONTACT.location}</Text>
          <Text style={styles.footerText}>
            {CONTACT.hours[0].days}: {CONTACT.hours[0].time}
          </Text>
          <Pressable onPress={() => router.push('/contact')} hitSlop={8}>
            <Text style={styles.footerLink}>Contact us →</Text>
          </Pressable>
          <Text style={styles.footerCopy}>© {new Date().getFullYear()} Pixel Studios. All rights reserved.</Text>
        </View>
      </Container>
    </ScrollView>
  );
}

const CARD_W = 240;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  hero: { width: '100%' },
  heroOverlay: { paddingBottom: 34 },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginBottom: 18,
  },
  heroBadgeDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.success,
    marginRight: 8,
  },
  heroBadgeText: { color: colors.text, fontFamily: fonts.bodyMedium, fontSize: 12.5 },
  heroTitle: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 44,
    lineHeight: 50,
    letterSpacing: -1.2,
  },
  heroAccent: { color: colors.cyan },
  heroSubtitle: {
    color: colors.subtext,
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 24,
    marginTop: 14,
    maxWidth: 520,
  },
  heroButtons: { flexDirection: 'row', gap: 12, marginTop: 26, flexWrap: 'wrap' },
  section: { marginTop: 42 },
  pathCard: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 14 },
  pathEmojiWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pathEmoji: { fontSize: 24 },
  pathTitle: { color: colors.text, fontFamily: fonts.displaySemi, fontSize: 16.5 },
  pathSubtitle: { color: colors.subtext, fontFamily: fonts.body, fontSize: 13.5, marginTop: 2 },
  hScroll: { paddingHorizontal: 20, gap: 14, paddingBottom: 6 },
  serviceCard: {
    width: CARD_W,
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: 18,
    marginRight: 0,
    marginLeft: 0,
  },
  serviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  serviceName: { color: colors.text, fontFamily: fonts.displaySemi, fontSize: 18 },
  serviceTag: { color: colors.subtext, fontFamily: fonts.body, fontSize: 13, lineHeight: 18, marginTop: 4 },
  serviceCount: { color: colors.cyan, fontFamily: fonts.bodyMedium, fontSize: 12.5, marginTop: 12 },
  productCard: {
    width: CARD_W,
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  productImage: { width: '100%', height: 150 },
  productInfo: { padding: 14 },
  productName: { color: colors.text, fontFamily: fonts.displaySemi, fontSize: 15.5 },
  productPrice: { color: colors.cyan, fontFamily: fonts.bodySemi, fontSize: 13.5, marginTop: 5 },
  productPriceNote: { color: colors.muted, fontFamily: fonts.body, fontSize: 12 },
  whyGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  whyCard: { padding: 18, width: '48%', flexGrow: 1 },
  whyIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.cyanSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  whyTitle: { color: colors.text, fontFamily: fonts.displaySemi, fontSize: 15.5 },
  whyText: { color: colors.subtext, fontFamily: fonts.body, fontSize: 13, lineHeight: 18, marginTop: 4 },
  portfolioGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  portfolioTile: {
    width: '48%',
    flexGrow: 1,
    aspectRatio: 1,
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  portfolioImage: { width: '100%', height: '100%' },
  portfolioOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 14,
    paddingTop: 30,
  },
  portfolioCategory: {
    color: colors.cyan,
    fontFamily: fonts.bodySemi,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  portfolioTitle: { color: colors.text, fontFamily: fonts.displaySemi, fontSize: 14, marginTop: 3 },
  testimonialCard: { width: 320, padding: 20 },
  testimonialQuote: { color: colors.text, fontFamily: fonts.body, fontSize: 14.5, lineHeight: 22, marginTop: 12 },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.violetSoft,
    borderWidth: 1,
    borderColor: 'rgba(139,92,246,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#C4B5FD', fontFamily: fonts.displaySemi, fontSize: 16 },
  testimonialName: { color: colors.text, fontFamily: fonts.bodySemi, fontSize: 14 },
  testimonialRole: { color: colors.muted, fontFamily: fonts.body, fontSize: 12, marginTop: 1 },
  ctaCard: { borderRadius: radius.xl, padding: 28, alignItems: 'flex-start' },
  ctaTitle: { color: '#fff', fontFamily: fonts.display, fontSize: 30, letterSpacing: -0.5 },
  ctaText: {
    color: 'rgba(255,255,255,0.85)',
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
    maxWidth: 480,
  },
  ctaButtons: { flexDirection: 'row', gap: 12, marginTop: 22, flexWrap: 'wrap' },
  footer: { marginTop: 56, paddingBottom: 40, alignItems: 'center', gap: 6 },
  footerLogo: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 16,
    letterSpacing: 4,
    marginBottom: 6,
  },
  footerText: { color: colors.muted, fontFamily: fonts.body, fontSize: 13 },
  footerLink: { color: colors.cyan, fontFamily: fonts.bodySemi, fontSize: 14, marginTop: 8 },
  footerCopy: { color: colors.muted, fontFamily: fonts.body, fontSize: 12, marginTop: 16, opacity: 0.7 },
});
