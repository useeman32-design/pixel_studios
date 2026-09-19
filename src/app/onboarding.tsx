import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
  Dimensions,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Container, FadeIn, LogoMark } from '../components/ui';
import { fonts, radius, sp, useTheme } from '../constants/theme';

const heroImage = require('../../assets/images/hero.jpg');
const nfcImage = require('../../assets/images/nfc-card.jpg');
const digitalImage = require('../../assets/images/cat-digital.jpg');

const slides = [
  {
    id: 'brand',
    eyebrow: 'Welcome to Pixel Studios',
    title: 'Design. Print.\nBuild. Grow.',
    text: 'A creative technology studio in Gusau — bringing modern businesses to life.',
    image: null as any,
  },
  {
    id: 'studio',
    eyebrow: 'One studio',
    title: 'Every business need, under one roof.',
    text: 'Branding, printing, NFC smart products, websites, apps and business systems.',
    image: heroImage,
  },
  {
    id: 'smart',
    eyebrow: 'Pixel Smart',
    title: 'One tap. Your entire business.',
    text: 'NFC business cards that share your profile, portfolio and contacts instantly.',
    image: nfcImage,
  },
  {
    id: 'start',
    eyebrow: 'Ready when you are',
    title: 'Let’s bring your ideas to life.',
    text: 'Tell us what you need — Pixel AI and our team will take it from there.',
    image: digitalImage,
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const [index, setIndex] = useState(0);
  const scroll = useRef<ScrollView>(null);
  const W = Dimensions.get('window').width;

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / W);
    if (i !== index && i >= 0 && i < slides.length) setIndex(i);
  };

  const finish = async () => {
    try {
      await AsyncStorage.setItem('ps_onboarded', '1');
    } catch {}
    router.replace('/');
  };

  const next = () => {
    if (index < slides.length - 1) {
      scroll.current?.scrollTo({ x: (index + 1) * W, animated: true });
      setIndex(index + 1);
    } else {
      finish();
    }
  };

  const slide = slides[index];
  const last = index === slides.length - 1;

  return (
    <View style={[styles.screen, { backgroundColor: colors.bg }]}>
      <ScrollView
        ref={scroll}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScroll}
        scrollEventThrottle={32}>
        {slides.map((s, i) => (
          <View key={s.id} style={{ width: W }}>
            <View style={[styles.slideInner, { paddingTop: insets.top + sp.x7 }]}>
              {i === 0 ? (
                <FadeIn delay={150}>
                  <View style={styles.logoTile}>
                    <LogoMark size={72} />
                  </View>
                </FadeIn>
              ) : (
                <View style={styles.imageWrap}>
                  <Image source={s.image} style={styles.image} resizeMode="cover" />
                </View>
              )}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Copy — synced to current slide */}
      <Container style={{ marginTop: sp.x4 }}>
        <Text style={[styles.eyebrow, { color: colors.isDark ? colors.lime : '#6B9B0F' }]}>
          {slide.eyebrow}
        </Text>
        <Text style={[styles.title, { color: colors.text }]}>{slide.title}</Text>
        <Text style={[styles.text, { color: colors.subtext }]}>{slide.text}</Text>

        {/* Dots */}
        <View style={styles.dots}>
          {slides.map((s, i) => (
            <View
              key={s.id}
              style={[
                styles.dot,
                { backgroundColor: i === index ? colors.lime : colors.hairlineStrong },
                i === index && { width: 28 },
              ]}
            />
          ))}
        </View>
      </Container>

      {/* Controls */}
      <Container
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: sp.x4,
          paddingBottom: Math.max(insets.bottom, 20) + 16,
        }}>
        <Pressable onPress={finish} hitSlop={10}>
          <Text style={{ fontFamily: fonts.medium, fontSize: 15, color: colors.muted }}>Skip</Text>
        </Pressable>
        <View style={{ flex: 1 }} />
        <Pressable onPress={next} style={[styles.nextBtn, { backgroundColor: colors.lime }]}>
          <Text style={{ fontFamily: fonts.semi, fontSize: 16, color: colors.onLime }}>
            {last ? 'Get Started' : 'Next'}
          </Text>
          <Ionicons name="arrow-forward" size={17} color={colors.onLime} />
        </Pressable>
      </Container>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  slideInner: { alignItems: 'center', paddingHorizontal: 24 },
  logoTile: {
    width: 180,
    height: 180,
    borderRadius: radius.xl * 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  imageWrap: {
    width: '100%',
    maxWidth: 480,
    height: 300,
    borderRadius: radius.xl,
    overflow: 'hidden',
  },
  image: { width: '100%', height: '100%' },
  eyebrow: { fontFamily: fonts.semi, fontSize: 12, letterSpacing: 2.2, textTransform: 'uppercase' },
  title: {
    fontFamily: fonts.semi,
    fontSize: 34,
    lineHeight: 38,
    letterSpacing: -1,
    marginTop: sp.x2_,
  },
  text: { fontFamily: fonts.regular, fontSize: 16.5, lineHeight: 24, marginTop: sp.x2_ },
  dots: { flexDirection: 'row', gap: 8, marginTop: sp.x4 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: radius.md,
    paddingHorizontal: 26,
    paddingVertical: 16,
  },
});
