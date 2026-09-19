import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Image,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackBar, Button, Container, Eyebrow, FadeIn, LogoMark, OptChip, Stepper } from '../components/ui';
import { waLink } from '../constants/contact';
import { fonts, Palette, radius, sp, useTheme } from '../constants/theme';

const artImage = require('../../assets/images/cat-smart.jpg');

type Material = 'Matte Black' | 'Pure White' | 'Transparent';
type Finish = 'Matte' | 'Gloss';
type Design = 'Studio design' | 'Your artwork';

const materials: Material[] = ['Matte Black', 'Pure White', 'Transparent'];
const finishes: Finish[] = ['Matte', 'Gloss'];
const designs: Design[] = ['Studio design', 'Your artwork'];

function pricePerCard(qty: number): number {
  if (qty >= 5) return 20000;
  if (qty >= 2) return 22500;
  return 25000;
}

/* ------------------------------ LIVE CARD ------------------------------ */

function CardPreview({
  material,
  finish,
  design,
  name,
  business,
}: {
  material: Material;
  finish: Finish;
  design: Design;
  name: string;
  business: string;
}) {
  const shine = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (finish === 'Gloss') {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.delay(900),
          Animated.timing(shine, {
            toValue: 1,
            duration: 1600,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(shine, { toValue: 0, duration: 0, useNativeDriver: true }),
        ]),
      );
      loop.start();
      return () => loop.stop();
    }
    shine.setValue(0);
  }, [finish, shine]);

  const shineX = shine.interpolate({ inputRange: [0, 1], outputRange: [-320, 460] });

  const isBlack = material === 'Matte Black';
  const isWhite = material === 'Pure White';

  const cardBg = isBlack ? '#0E0E11' : isWhite ? '#F2F2EF' : 'rgba(210,215,225,0.14)';
  const textColor = isWhite ? '#141416' : '#F4F4F2';
  const subColor = isWhite ? 'rgba(20,20,22,0.55)' : 'rgba(244,244,242,0.55)';

  return (
    <View
      style={{
        aspectRatio: 1.586,
        borderRadius: 22,
        overflow: 'hidden',
        backgroundColor: cardBg,
        borderWidth: material === 'Transparent' ? 1.2 : 1,
        borderColor: material === 'Transparent' ? 'rgba(255,255,255,0.3)' : isWhite ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.1)',
        padding: 24,
      }}>
      {/* Artwork design variant */}
      {design === 'Your artwork' && (
        <>
          <Image source={artImage} style={StyleSheet.absoluteFill} resizeMode="cover" />
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(8,8,10,0.55)',
            }}
          />
        </>
      )}

      {/* Gloss sweep */}
      {finish === 'Gloss' && (
        <Animated.View
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: -80,
            bottom: -80,
            width: 120,
            transform: [{ translateX: shineX }, { rotate: '18deg' }],
          }}>
          <LinearGradient
            colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.28)', 'rgba(255,255,255,0)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ flex: 1 }}
          />
        </Animated.View>
      )}

      {/* Top row */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <LogoMark size={22} />
          <Text style={{ fontFamily: fonts.bold, fontSize: 9, letterSpacing: 2.4, color: textColor }}>
            PIXEL STUDIOS
          </Text>
        </View>
        <Ionicons name="wifi" size={17} color={design === 'Studio design' ? '#BFF549' : textColor} />
      </View>

      {/* Owner */}
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        <Text style={{ fontFamily: fonts.semi, fontSize: 22, letterSpacing: -0.4, color: textColor }}>
          {name || 'Your Name'}
        </Text>
        <Text style={{ fontFamily: fonts.regular, fontSize: 13, color: subColor, marginTop: 2 }}>
          {business || 'Your Business'}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 14,
          }}>
          <Text style={{ fontFamily: fonts.medium, fontSize: 11, color: subColor }}>
            pixelstudios.ng
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 5,
              backgroundColor: design === 'Studio design' ? 'rgba(191,245,73,0.16)' : 'rgba(255,255,255,0.1)',
              borderRadius: 999,
              paddingHorizontal: 10,
              paddingVertical: 5,
            }}>
            <Ionicons name="flash" size={10} color={design === 'Studio design' ? '#BFF549' : textColor} />
            <Text style={{ fontFamily: fonts.semi, fontSize: 9.5, letterSpacing: 1, color: design === 'Studio design' ? '#BFF549' : textColor }}>
              TAP TO CONNECT
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

/* ------------------------------ SCREEN ------------------------------ */

export default function NFCScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = useStyles(colors);

  const [qty, setQty] = useState(1);
  const [material, setMaterial] = useState<Material>('Matte Black');
  const [finish, setFinish] = useState<Finish>('Matte');
  const [design, setDesign] = useState<Design>('Studio design');
  const [name, setName] = useState('');
  const [business, setBusiness] = useState('');

  const pulse = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.sequence([
      Animated.spring(pulse, { toValue: 0.965, useNativeDriver: true, damping: 18, stiffness: 320 }),
      Animated.spring(pulse, { toValue: 1, useNativeDriver: true, damping: 12, stiffness: 240 }),
    ]).start();
  }, [material, finish, design, pulse]);

  const perCard = pricePerCard(qty);
  const total = perCard * qty;

  const orderMessage = `Hello Pixel Studios! I'd like to order the *Smart NFC Business Card*.

Quantity: ${qty} (${perCard.toLocaleString('en-NG')} per card)
Material: ${material}
Finish: ${finish}
Design: ${design}
Name on card: ${name || '-'}
Business: ${business || '-'}

Total: ₦${total.toLocaleString('en-NG')}. Please share payment details!`;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={{ paddingBottom: sp.x8 + 40 }}
      showsVerticalScrollIndicator={false}>
      <Container style={{ marginTop: insets.top + sp.x3 }}>
        <BackBar onBack={() => router.back()} />
      </Container>

      <Container style={{ marginTop: sp.x3 }}>
        <FadeIn>
          <Eyebrow>Pixel Smart · Signature product</Eyebrow>
          <Text style={styles.title}>Smart Business Card</Text>
          <Text style={styles.subtitle}>One tap. Your entire business.</Text>
        </FadeIn>

        {/* Live preview */}
        <FadeIn delay={80}>
          <Animated.View style={{ transform: [{ scale: pulse }], marginTop: sp.x5 }}>
            <CardPreview material={material} finish={finish} design={design} name={name} business={business} />
          </Animated.View>
        </FadeIn>

        {/* Personalize */}
        <Text style={styles.optionTitle}>Personalize</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Name on card"
          placeholderTextColor={colors.muted}
          style={styles.input}
        />
        <TextInput
          value={business}
          onChangeText={setBusiness}
          placeholder="Business / title"
          placeholderTextColor={colors.muted}
          style={[styles.input, { marginTop: sp.x2_ }]}
        />

        {/* Options */}
        <Text style={styles.optionTitle}>Card material</Text>
        <View style={styles.chipRow}>
          {materials.map((m) => (
            <OptChip key={m} label={m} active={material === m} onPress={() => setMaterial(m)} />
          ))}
        </View>

        <Text style={styles.optionTitle}>Finish</Text>
        <View style={styles.chipRow}>
          {finishes.map((f) => (
            <OptChip key={f} label={f} active={finish === f} onPress={() => setFinish(f)} />
          ))}
        </View>

        <Text style={styles.optionTitle}>Design</Text>
        <View style={styles.chipRow}>
          {designs.map((d) => (
            <OptChip key={d} label={d} active={design === d} onPress={() => setDesign(d)} />
          ))}
        </View>

        <Text style={styles.optionTitle}>Quantity</Text>
        <Stepper value={qty} onChange={setQty} />
        {qty >= 2 && (
          <Text style={styles.discountNote}>
            {qty >= 5 ? 'Best value' : 'Bulk rate'} — ₦{(25000 - perCard).toLocaleString('en-NG')} saved per card
          </Text>
        )}

        {/* Capabilities */}
        <Text style={styles.optionTitle}>What one tap shares</Text>
        <View style={{ gap: 2 }}>
          {['Digital profile — always up to date', 'WhatsApp, phone & email', 'Social media & website', 'Portfolio and services'].map(
            (f) => (
              <View key={f} style={styles.featureRow}>
                <Ionicons name="checkmark" size={14} color={colors.isDark ? colors.lime : '#5E8A0D'} />
                <Text style={styles.featureText}>{f}</Text>
              </View>
            ),
          )}
        </View>

        {/* Order */}
        <View style={styles.orderCard}>
          <View>
            <Text style={styles.totalLabel}>
              Total · ₦{perCard.toLocaleString('en-NG')} / card
            </Text>
            <Text style={styles.totalValue}>₦{total.toLocaleString('en-NG')}</Text>
          </View>
          <Button title="Order Smart Card" icon="arrow-forward" href={waLink(orderMessage)} />
        </View>

        <Pressable onPress={() => router.push('/nfc-profile')} style={styles.demoLink}>
          <Text style={styles.demoLinkText}>See the digital profile it unlocks</Text>
          <Ionicons name="arrow-forward" size={15} color={colors.subtext} />
        </Pressable>
      </Container>
    </ScrollView>
  );
}

function useStyles(colors: Palette) {
  return StyleSheet.create({
    title: {
      fontFamily: fonts.semi,
      fontSize: 36,
      lineHeight: 40,
      letterSpacing: -1.1,
      color: colors.text,
      marginTop: sp.x1,
    },
    subtitle: { fontFamily: fonts.regular, fontSize: 18, color: colors.subtext, marginTop: sp.x1 },
    optionTitle: {
      fontFamily: fonts.semi,
      fontSize: 16,
      color: colors.text,
      marginTop: sp.x5,
      marginBottom: sp.x2_,
    },
    input: {
      backgroundColor: colors.surface,
      borderColor: colors.hairline,
      borderWidth: 1,
      borderRadius: radius.md,
      paddingHorizontal: 18,
      paddingVertical: 16,
      color: colors.text,
      fontFamily: fonts.regular,
      fontSize: 16,
    },
    chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: sp.x1 },
    discountNote: {
      fontFamily: fonts.medium,
      fontSize: 13,
      color: colors.isDark ? colors.lime : '#5E8A0D',
      marginTop: sp.x2_,
    },
    featureRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      paddingVertical: 10,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.hairline,
    },
    featureText: { fontFamily: fonts.regular, fontSize: 15.5, color: colors.subtext },
    orderCard: {
      marginTop: sp.x5,
      backgroundColor: colors.surface,
      borderColor: colors.hairline,
      borderWidth: 1,
      borderRadius: radius.lg,
      padding: sp.x3,
      gap: sp.x3,
    },
    totalLabel: { fontFamily: fonts.regular, fontSize: 13, color: colors.muted },
    totalValue: { fontFamily: fonts.semi, fontSize: 28, letterSpacing: -0.6, color: colors.text, marginTop: 2 },
    demoLink: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 7,
      paddingVertical: sp.x4,
    },
    demoLinkText: { fontFamily: fonts.medium, fontSize: 14.5, color: colors.subtext },
  });
}
