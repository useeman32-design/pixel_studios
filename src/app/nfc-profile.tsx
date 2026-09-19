import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, Linking, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackBar, Container, FadeIn } from '../components/ui';
import { CONTACT, waLink } from '../constants/contact';
import { fonts, radius, sp, useTheme } from '../constants/theme';

const avatarImage = require('../../assets/images/avatar.jpg');

export default function NfcProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  const actions = [
    { icon: 'logo-whatsapp', label: 'WhatsApp', href: waLink('Hello! I got your Pixel Studios NFC card.') },
    { icon: 'call-outline', label: 'Call', href: `tel:${CONTACT.phoneRaw}` },
    { icon: 'mail-outline', label: 'Email', href: `mailto:${CONTACT.email}` },
    { icon: 'globe-outline', label: 'Website', href: 'https://pixelstudios.ng' },
  ];

  const socials = ['logo-instagram', 'logo-facebook', 'logo-linkedin', 'logo-x'];

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={{ paddingBottom: sp.x8 }}
      showsVerticalScrollIndicator={false}>
      <Container style={{ marginTop: insets.top + sp.x3 }}>
        <BackBar onBack={() => router.back()} />
      </Container>

      <Container style={{ alignItems: 'center', marginTop: sp.x4 }}>
        <FadeIn>
          <Image source={avatarImage} style={{ width: 120, height: 120, borderRadius: 32, backgroundColor: colors.surface, alignSelf: 'center' }} />
        </FadeIn>
        <FadeIn delay={90}>
          <Text style={{ fontFamily: fonts.semi, fontSize: 30, letterSpacing: -0.7, color: colors.text, textAlign: 'center', marginTop: sp.x3 }}>
            Amina Bello
          </Text>
          <Text style={{ fontFamily: fonts.medium, fontSize: 15.5, color: colors.subtext, textAlign: 'center', marginTop: 4 }}>
            Founder
          </Text>
          <Text style={{ fontFamily: fonts.regular, fontSize: 14, color: colors.muted, textAlign: 'center', marginTop: 2 }}>
            Aurelia Homes
          </Text>
        </FadeIn>

        <FadeIn delay={150}>
          <View style={{ flexDirection: 'row', gap: sp.x2_, marginTop: sp.x5 }}>
            {actions.map((a) => (
              <Pressable key={a.label} style={{ alignItems: 'center', gap: 7 }} onPress={() => Linking.openURL(a.href)}>
                <View
                  style={{
                    width: 58,
                    height: 58,
                    borderRadius: radius.lg,
                    backgroundColor: colors.surface,
                    borderWidth: 1,
                    borderColor: colors.hairline,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Ionicons name={a.icon as any} size={20} color={colors.text} />
                </View>
                <Text style={{ fontFamily: fonts.medium, fontSize: 12.5, color: colors.subtext }}>{a.label}</Text>
              </Pressable>
            ))}
          </View>
        </FadeIn>

        <FadeIn delay={200}>
          <View style={{ flexDirection: 'row', gap: sp.x2_, marginTop: sp.x4 }}>
            {socials.map((s) => (
              <Pressable
                key={s}
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 21,
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: colors.hairline,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Ionicons name={s as any} size={17} color={colors.subtext} />
              </Pressable>
            ))}
          </View>
        </FadeIn>

        <FadeIn delay={240}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 7,
              backgroundColor: colors.limeDim,
              borderRadius: 999,
              paddingHorizontal: 16,
              paddingVertical: 9,
              marginTop: sp.x4,
            }}>
            <Ionicons name="checkmark-circle" size={15} color={colors.isDark ? colors.lime : '#5E8A0D'} />
            <Text style={{ fontFamily: fonts.semi, fontSize: 13, color: colors.isDark ? colors.lime : '#5E8A0D' }}>
              NFC Connected
            </Text>
          </View>
        </FadeIn>

        <FadeIn delay={280} style={{ gap: sp.x2_, alignSelf: 'stretch', marginTop: sp.x5 }}>
          <Pressable
            style={{ backgroundColor: colors.lime, borderRadius: radius.md, paddingVertical: 17, alignItems: 'center' }}
            onPress={() => router.push('/nfc')}>
            <Text style={{ fontFamily: fonts.semi, fontSize: 16, color: colors.onLime }}>Preview Card</Text>
          </Pressable>
          <Pressable
            style={{ backgroundColor: colors.surface2, borderRadius: radius.md, paddingVertical: 17, alignItems: 'center' }}
            onPress={() => router.push('/chat')}>
            <Text style={{ fontFamily: fonts.semi, fontSize: 16, color: colors.text }}>Edit Profile</Text>
          </Pressable>
        </FadeIn>

        <FadeIn delay={320}>
          <Text style={{ fontFamily: fonts.regular, fontSize: 13.5, lineHeight: 20, color: colors.muted, textAlign: 'center', marginTop: sp.x5, maxWidth: 340 }}>
            This is the page your customers see when they tap your Pixel Studios NFC card.
          </Text>
        </FadeIn>
      </Container>
    </ScrollView>
  );
}
