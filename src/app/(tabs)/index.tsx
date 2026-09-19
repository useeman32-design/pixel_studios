import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  Easing,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, Container, Eyebrow, FadeIn, LogoMark } from '../../components/ui';
import { fonts, Palette, radius, sp, useTheme } from '../../constants/theme';

const heroImage = require('../../../assets/images/hero.jpg');
const nfcImage = require('../../../assets/images/nfc-card.jpg');
const brandingImage = require('../../../assets/images/portfolio/branding.jpg');
const digitalImage = require('../../../assets/images/portfolio/app.jpg');
const avatarImage = require('../../../assets/images/avatar.jpg');

const HERO_H = 560;

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

/* Floating "pixel" particles config */
const PIXELS = [
  { left: '12%', size: 8, dur: 5200, delay: 0 },
  { left: '28%', size: 5, dur: 6400, delay: 900 },
  { left: '52%', size: 10, dur: 5800, delay: 400 },
  { left: '68%', size: 6, dur: 7000, delay: 1400 },
  { left: '84%', size: 9, dur: 6100, delay: 700 },
];

function HeroAnimations() {
  const { colors } = useTheme();
  const beam = useRef(new Animated.Value(0)).current;
  const pixelAnims = useMemo(() => PIXELS.map(() => new Animated.Value(0)), []);

  useEffect(() => {
    // Print-head scan beam sweep
    const beamLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(beam, {
          toValue: 1,
          duration: 4200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(beam, { toValue: 0, duration: 0, useNativeDriver: true }),
      ]),
    );
    beamLoop.start();

    // Floating pixels rising like ink particles
    const pixelLoops = pixelAnims.map((v, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(PIXELS[i].delay),
          Animated.timing(v, { toValue: 1, duration: PIXELS[i].dur, useNativeDriver: true }),
          Animated.timing(v, { toValue: 0, duration: 0, useNativeDriver: true }),
        ]),
      ),
    );
    pixelLoops.forEach((l) => l.start());
    return () => {
      beamLoop.stop();
      pixelLoops.forEach((l) => l.stop());
    };
  }, [beam, pixelAnims]);

  const beamY = beam.interpolate({ inputRange: [0, 1], outputRange: [40, HERO_H - 140] });
  const beamOpacity = beam.interpolate({
    inputRange: [0, 0.1, 0.9, 1],
    outputRange: [0, 0.85, 0.85, 0],
  });

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {/* Scan beam */}
      <Animated.View
        style={{
          position: 'absolute',
          left: 24,
          right: 24,
          height: 2,
          backgroundColor: colors.lime,
          opacity: beamOpacity,
          transform: [{ translateY: beamY }],
          shadowColor: colors.lime,
          shadowOpacity: 0.9,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 0 },
        }}
      />
      {/* Rising pixels */}
      {PIXELS.map((p, i) => {
        const v = pixelAnims[i];
        const ty = v.interpolate({ inputRange: [0, 1], outputRange: [0, -190] });
        const op = v.interpolate({ inputRange: [0, 0.2, 0.8, 1], outputRange: [0, 0.55, 0.45, 0] });
        return (
          <Animated.View
            key={i}
            style={{
              position: 'absolute',
              left: p.left as any,
              bottom: 130,
              width: p.size,
              height: p.size,
              borderRadius: 2,
              backgroundColor: colors.lime,
              opacity: op,
              transform: [{ translateY: ty }],
            }}
          />
        );
      })}
    </View>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = useStyles(colors);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={{ paddingBottom: 140 }}
      showsVerticalScrollIndicator={false}>
      {/* =============================== HERO =============================== */}
      <View style={styles.hero}>
        <Image source={heroImage} style={styles.heroImage} resizeMode="cover" />
        <LinearGradient
          colors={[colors.overlay, 'rgba(0,0,0,0.15)', colors.bg]}
          locations={[0, 0.45, 1]}
          style={StyleSheet.absoluteFill}
        />
        <HeroAnimations />

        <Container style={{ flex: 1 }}>
          {/* Header */}
          <View style={[styles.header, { marginTop: insets.top + sp.x2_ }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: sp.x2_ }}>
              <LogoMark size={24} />
              <Text style={styles.wordmark}>PIXEL STUDIOS</Text>
            </View>
            <View style={{ flexDirection: 'row', gap: sp.x1 }}>
              <Pressable style={styles.headerIcon} onPress={() => router.push('/ai')}>
                <Ionicons name="sparkles-outline" size={18} color={colors.text} />
              </Pressable>
              <Pressable style={styles.headerIcon} onPress={() => router.push('/chat')}>
                <Ionicons name="chatbubble-outline" size={18} color={colors.text} />
              </Pressable>
              <Pressable style={styles.headerIcon} onPress={() => router.push('/profile')}>
                <Image source={avatarImage} style={styles.headerAvatar} />
              </Pressable>
            </View>
          </View>

          {/* Hero copy */}
          <View style={styles.heroCopy}>
            <FadeIn>
              <View style={styles.locationRow}>
                <Ionicons name="location" size={11} color={colors.lime} />
                <Text style={styles.locationText}>Gusau, Zamfara</Text>
              </View>
            </FadeIn>
            <FadeIn delay={90}>
              <Text style={styles.heroTitle}>Bring your ideas to life.</Text>
            </FadeIn>
            <FadeIn delay={170}>
              <Text style={styles.heroSub}>
                Design, print and digital solutions for modern businesses.
              </Text>
            </FadeIn>
            <FadeIn delay={250}>
              <View style={styles.heroCtas}>
                <View style={{ flex: 1, maxWidth: 320 }}>
                  <Button
                    title="Start a Project"
                    icon="arrow-forward"
                    onPress={() => router.push('/start')}
                  />
                </View>
                <Pressable style={styles.aiChip} onPress={() => router.push('/ai')}>
                  <Ionicons name="sparkles" size={15} color={colors.lime} />
                  <Text style={styles.aiChipText}>Ask Pixel AI</Text>
                </Pressable>
              </View>
            </FadeIn>
          </View>
        </Container>
      </View>

      {/* =========================== QUICK ACTIONS =========================== */}
      <Container style={{ marginTop: sp.x5 }}>
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

      {/* ============================= PIXEL AI ============================== */}
      <Container style={{ marginTop: sp.x6 }}>
        <FadeIn>
          <Pressable onPress={() => router.push('/ai')} style={styles.aiCard}>
            <View style={styles.aiIcon}>
              <Ionicons name="sparkles" size={20} color={colors.onLime} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.aiTitle}>Not sure what you need?</Text>
              <Text style={styles.aiSub}>Pixel AI will help you decide — and take your order.</Text>
            </View>
            <Ionicons name="arrow-forward" size={18} color={colors.muted} />
          </Pressable>
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
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.72)']}
                  style={styles.featuredShade}
                />
                <View style={styles.featuredTextWrap}>
                  <Text style={styles.featuredTitle}>{f.title}</Text>
                  <Text style={styles.featuredSub}>{f.sub}</Text>
                </View>
                <View style={[styles.featuredArrow, { backgroundColor: colors.lime }]}>
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
            <Ionicons
              name="arrow-forward"
              size={16}
              color={colors.isDark ? colors.lime : '#5E8A0D'}
            />
          </Pressable>
        </FadeIn>
      </Container>
    </ScrollView>
  );
}

function useStyles(colors: Palette) {
  return useMemo(
    () =>
      StyleSheet.create({
        hero: { height: HERO_H },
        heroImage: { position: 'absolute', width: '100%', height: '100%' },
        header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
        wordmark: { fontFamily: fonts.bold, fontSize: 12, letterSpacing: 3, color: '#FFFFFF' },
        headerIcon: {
          width: 40,
          height: 40,
          borderRadius: radius.sm,
          backgroundColor: 'rgba(10,10,12,0.4)',
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: 'rgba(255,255,255,0.2)',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        },
        headerAvatar: { width: '100%', height: '100%' },
        heroCopy: { flex: 1, justifyContent: 'flex-end', paddingBottom: sp.x6 },
        locationRow: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          alignSelf: 'flex-start',
          backgroundColor: 'rgba(10,10,12,0.42)',
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: 'rgba(255,255,255,0.18)',
          borderRadius: 999,
          paddingHorizontal: 12,
          paddingVertical: 7,
          marginBottom: sp.x3,
        },
        locationText: { fontFamily: fonts.medium, fontSize: 12.5, color: 'rgba(255,255,255,0.85)' },
        heroTitle: {
          fontFamily: fonts.semi,
          fontSize: 46,
          lineHeight: 50,
          letterSpacing: -1.6,
          color: '#FFFFFF',
          maxWidth: 480,
        },
        heroSub: {
          fontFamily: fonts.regular,
          fontSize: 18,
          lineHeight: 26,
          color: 'rgba(255,255,255,0.8)',
          marginTop: sp.x2_,
          maxWidth: 420,
        },
        heroCtas: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: sp.x2_,
          marginTop: sp.x4,
          flexWrap: 'wrap',
        },
        aiChip: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          paddingHorizontal: 18,
          paddingVertical: 15,
          borderRadius: radius.md,
          backgroundColor: 'rgba(10,10,12,0.45)',
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: 'rgba(255,255,255,0.22)',
        },
        aiChipText: { fontFamily: fonts.semi, fontSize: 15, color: '#FFFFFF' },
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
        aiCard: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: sp.x3,
          backgroundColor: colors.surface,
          borderColor: colors.hairline,
          borderWidth: 1,
          borderRadius: radius.lg,
          padding: sp.x3,
        },
        aiIcon: {
          width: 44,
          height: 44,
          borderRadius: 14,
          backgroundColor: colors.lime,
          alignItems: 'center',
          justifyContent: 'center',
        },
        aiTitle: { fontFamily: fonts.semi, fontSize: 16.5, color: colors.text },
        aiSub: { fontFamily: fonts.regular, fontSize: 13.5, color: colors.subtext, marginTop: 2 },
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
        featuredShade: { position: 'absolute', left: 0, right: 0, bottom: 0, height: '58%' },
        featuredTextWrap: { position: 'absolute', left: 20, bottom: 20, right: 76 },
        featuredTitle: { fontFamily: fonts.semi, fontSize: 21, letterSpacing: -0.3, color: '#fff' },
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
        textLinkText: { fontFamily: fonts.semi, fontSize: 15, color: colors.isDark ? colors.lime : '#5E8A0D' },
      }),
    [colors],
  );
}
