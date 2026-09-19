import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackBar, Container, FadeIn } from '../components/ui';
import { CONTACT, waLink } from '../constants/contact';
import { colors, fonts, radius, sp } from '../constants/theme';

const avatarImage = require('../../assets/images/avatar.jpg');

export default function NfcProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const actions = [
    { icon: 'logo-whatsapp', label: 'WhatsApp', href: waLink('Hello! I got your Pixel Studios NFC card.') },
    { icon: 'call-outline', label: 'Call', href: `tel:${CONTACT.phoneRaw}` },
    { icon: 'mail-outline', label: 'Email', href: `mailto:${CONTACT.email}` },
    { icon: 'globe-outline', label: 'Website', href: 'https://pixelstudios.ng' },
  ];

  const socials = ['logo-instagram', 'logo-facebook', 'logo-linkedin', 'logo-x'];

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{ paddingBottom: sp.x8 }}
      showsVerticalScrollIndicator={false}>
      <Container style={{ marginTop: insets.top + sp.x1 }}>
        <BackBar onBack={() => router.back()} />
      </Container>

      <Container style={{ alignItems: 'center', marginTop: sp.x4 }}>
        <FadeIn>
          <Image source={avatarImage} style={styles.avatar} />
        </FadeIn>
        <FadeIn delay={90}>
          <Text style={styles.name}>Amina Bello</Text>
          <Text style={styles.role}>Founder</Text>
          <Text style={styles.company}>Aurelia Homes</Text>
        </FadeIn>

        {/* Action buttons */}
        <FadeIn delay={150}>
          <View style={styles.actionRow}>
            {actions.map((a) => (
              <Pressable key={a.label} style={styles.actionBtn} onPress={() => Linking.openURL(a.href)}>
                <View style={styles.actionIcon}>
                  <Ionicons name={a.icon as any} size={20} color={colors.text} />
                </View>
                <Text style={styles.actionLabel}>{a.label}</Text>
              </Pressable>
            ))}
          </View>
        </FadeIn>

        {/* Socials */}
        <FadeIn delay={200}>
          <View style={styles.socialRow}>
            {socials.map((s) => (
              <Pressable key={s} style={styles.socialBtn}>
                <Ionicons name={s as any} size={17} color={colors.subtext} />
              </Pressable>
            ))}
          </View>
        </FadeIn>

        {/* NFC status */}
        <FadeIn delay={240}>
          <View style={styles.nfcBadge}>
            <Ionicons name="checkmark-circle" size={15} color={colors.lime} />
            <Text style={styles.nfcText}>NFC Connected</Text>
          </View>
        </FadeIn>

        {/* Controls */}
        <FadeIn delay={280} style={{ gap: sp.x2_, alignSelf: 'stretch', marginTop: sp.x5 }}>
          <Pressable style={styles.primaryBtn} onPress={() => router.push('/nfc')}>
            <Text style={styles.primaryBtnText}>Preview Card</Text>
          </Pressable>
          <Pressable style={styles.secondaryBtn} onPress={() => router.push('/chat')}>
            <Text style={styles.secondaryBtnText}>Edit Profile</Text>
          </Pressable>
        </FadeIn>

        <FadeIn delay={320}>
          <Text style={styles.footerNote}>
            This is the page your customers see when they tap your Pixel Studios NFC card.
          </Text>
        </FadeIn>
      </Container>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 32,
    backgroundColor: colors.surface,
    alignSelf: 'center',
  },
  name: {
    fontFamily: fonts.semi,
    fontSize: 30,
    letterSpacing: -0.7,
    color: colors.text,
    textAlign: 'center',
    marginTop: sp.x3,
  },
  role: {
    fontFamily: fonts.medium,
    fontSize: 15.5,
    color: colors.subtext,
    textAlign: 'center',
    marginTop: 4,
  },
  company: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.muted,
    textAlign: 'center',
    marginTop: 2,
  },
  actionRow: { flexDirection: 'row', gap: sp.x2_, marginTop: sp.x5 },
  actionBtn: { alignItems: 'center', gap: 7 },
  actionIcon: {
    width: 58,
    height: 58,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.hairline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: { fontFamily: fonts.medium, fontSize: 12.5, color: colors.subtext },
  socialRow: { flexDirection: 'row', gap: sp.x2_, marginTop: sp.x4 },
  socialBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.hairline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nfcBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: colors.limeDim,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 9,
    marginTop: sp.x4,
  },
  nfcText: { fontFamily: fonts.semi, fontSize: 13, color: colors.lime },
  primaryBtn: {
    backgroundColor: colors.lime,
    borderRadius: radius.md,
    paddingVertical: 17,
    alignItems: 'center',
  },
  primaryBtnText: { fontFamily: fonts.semi, fontSize: 16, color: colors.onLime },
  secondaryBtn: {
    backgroundColor: colors.surface2,
    borderRadius: radius.md,
    paddingVertical: 17,
    alignItems: 'center',
  },
  secondaryBtnText: { fontFamily: fonts.semi, fontSize: 16, color: colors.text },
  footerNote: {
    fontFamily: fonts.regular,
    fontSize: 13.5,
    lineHeight: 20,
    color: colors.muted,
    textAlign: 'center',
    marginTop: sp.x5,
    maxWidth: 340,
  },
});
