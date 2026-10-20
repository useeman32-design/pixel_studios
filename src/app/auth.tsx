import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, Container, FadeIn, LogoMark } from '../components/ui';
import { fonts, radius, sp, useTheme } from '../constants/theme';
import { hapticSelect } from '../lib/haptics';
import { useAuth } from '../lib/auth';

const heroImage = require('../../assets/images/hero.jpg');

export default function AuthWelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { continueAsGuest } = useAuth();
  const styles = useStyles();

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      {/* Hero */}
      <View style={{ height: 340 }}>
        <Image source={heroImage} style={StyleSheet.absoluteFill} resizeMode="cover" />
        <LinearGradient
          colors={['rgba(6,6,8,0.55)', 'rgba(6,6,8,0.15)', colors.bg]}
          locations={[0, 0.55, 1]}
          style={StyleSheet.absoluteFill}
        />
        <View style={{ paddingTop: insets.top + sp.x3, paddingHorizontal: 24 }}>
          <LogoMark size={30} />
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 30 }} showsVerticalScrollIndicator={false}>
        <Container style={{ marginTop: -sp.x2 }}>
          <FadeIn>
            <Text style={[styles.title, { color: colors.text }]}>Your studio,{'\n'}your account.</Text>
            <Text style={[styles.subtitle, { color: colors.subtext }]}>
              Track orders, manage your digital profile and smart card, and checkout faster — all
              from one account.
            </Text>
          </FadeIn>

          <FadeIn delay={120} style={{ gap: sp.x2_, marginTop: sp.x5 }}>
            <Button title="Create account" icon="person-add-outline" onPress={() => router.push('/register' as any)} />
            <Button title="Sign in" variant="secondary" icon="log-in-outline" onPress={() => router.push('/login' as any)} />
          </FadeIn>

          <FadeIn delay={200}>
            <Pressable
              onPress={async () => {
                hapticSelect();
                await continueAsGuest();
                router.replace('/');
              }}
              style={styles.guestRow}>
              <Text style={[styles.guestText, { color: colors.muted }]}>Continue as guest</Text>
              <Ionicons name="arrow-forward" size={14} color={colors.muted} />
            </Pressable>

            <View style={[styles.perks, { backgroundColor: colors.surface, borderColor: colors.hairline }]}>
              {[
                ['receipt-outline', 'Order history that follows you everywhere'],
                ['card-outline', 'Your digital profile & smart card in one place'],
                ['flash-outline', 'Faster checkout — your details, pre-filled'],
              ].map(([icon, text], i) => (
                <View key={i} style={styles.perkRow}>
                  <View style={[styles.perkIcon, { backgroundColor: colors.limeDim }]}>
                    <Ionicons name={icon as any} size={14} color={colors.isDark ? colors.lime : '#5E8A0D'} />
                  </View>
                  <Text style={[styles.perkText, { color: colors.subtext }]}>{text}</Text>
                </View>
              ))}
            </View>
          </FadeIn>
        </Container>
      </ScrollView>
    </View>
  );
}

function useStyles() {
  return StyleSheet.create({
    title: { fontFamily: fonts.semi, fontSize: 40, lineHeight: 44, letterSpacing: -1.3 },
    subtitle: { fontFamily: fonts.regular, fontSize: 16, lineHeight: 24, marginTop: sp.x2_, maxWidth: 460 },
    guestRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: sp.x4, paddingVertical: 8 },
    guestText: { fontFamily: fonts.semi, fontSize: 14.5, textDecorationLine: 'underline' },
    perks: { marginTop: sp.x5, borderRadius: radius.lg, borderWidth: 1, padding: sp.x3, gap: sp.x2_ },
    perkRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    perkIcon: { width: 30, height: 30, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
    perkText: { flex: 1, fontFamily: fonts.regular, fontSize: 13.5, lineHeight: 19 },
  });
}
