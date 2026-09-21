import { Ionicons } from '@expo/vector-icons';
import { Linking } from 'react-native';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackBar, Container, Eyebrow, FadeIn, RowItem } from '../components/ui';
import { CONTACT, waLink } from '../constants/contact';
import { fonts, sp, useTheme } from '../constants/theme';

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, isDark, toggleTheme } = useTheme();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}>
      <Container style={{ marginTop: insets.top + sp.x2 }}>
        <BackBar title="Settings" onBack={() => router.back()} />
      </Container>

      <Container style={{ marginTop: sp.x3 }}>
        <FadeIn>
          <Eyebrow>Preferences</Eyebrow>
          <Text style={{ fontFamily: fonts.semi, fontSize: 32, letterSpacing: -0.9, color: colors.text, marginTop: sp.x1 }}>
            Settings
          </Text>
        </FadeIn>

        <FadeIn delay={90}>
          <View style={{ marginTop: sp.x4 }}>
            <RowItem
              icon={isDark ? 'moon-outline' : 'sunny-outline'}
              label="Theme"
              sub={isDark ? 'Dark mode is on' : 'Light mode is on'}
              onPress={toggleTheme}
              right={
                <View
                  style={{
                    width: 46,
                    height: 26,
                    borderRadius: 13,
                    backgroundColor: isDark ? colors.lime : colors.surface2,
                    borderWidth: 1,
                    borderColor: colors.hairline,
                    justifyContent: 'center',
                    paddingHorizontal: 2,
                  }}>
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      backgroundColor: isDark ? colors.onLime : colors.muted,
                      alignSelf: isDark ? 'flex-end' : 'flex-start',
                    }}
                  />
                </View>
              }
            />
            <RowItem icon="key-outline" label="AI Connection" sub="Groq API key & model" onPress={() => router.push('/ai-settings' as any)} />
            <RowItem icon="person-outline" label="Edit Profile" sub="Details & social media" onPress={() => router.push('/edit-profile' as any)} />
            <RowItem icon="receipt-outline" label="My Orders" onPress={() => router.push('/orders')} />
            <RowItem icon="help-buoy-outline" label="Help & Support" sub="Chat with the studio team" onPress={() => router.push('/chat')} />
            <RowItem icon="logo-whatsapp" label="WhatsApp us" sub={CONTACT.phone} onPress={() => Linking.openURL(waLink('Hello Pixel Studios!'))} />
            <RowItem icon="information-circle-outline" label="About Pixel Studios" sub="Creative tech & printing · Gusau, Nigeria" isLast onPress={() => Linking.openURL('https://useeman32-design.github.io/pixel_studios/')} />
          </View>
        </FadeIn>

        <FadeIn delay={150}>
          <Text style={{ fontFamily: fonts.regular, fontSize: 12.5, color: colors.muted, textAlign: 'center', marginTop: sp.x5 }}>
            Pixel Studios · v3.1.0 · Built with care in Nigeria 🇳🇬
          </Text>
        </FadeIn>
      </Container>
    </ScrollView>
  );
}
