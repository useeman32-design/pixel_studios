import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRouter } from 'expo-router';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackHeader, Container, FadeIn, GlassCard } from '../components/ui';
import { CONTACT, waDefaultMessage, waLink } from '../constants/contact';
import { colors, fonts, radius } from '../constants/theme';

export default function ContactScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const channels = [
    {
      icon: 'call-outline',
      title: 'Call us',
      value: CONTACT.phone,
      sub: 'Tap to call directly',
      href: `tel:${CONTACT.phoneRaw}`,
      color: colors.cyan,
    },
    {
      icon: 'mail-outline',
      title: 'Email',
      value: CONTACT.email,
      sub: 'For detailed briefs & documents',
      href: `mailto:${CONTACT.email}`,
      color: colors.amber,
    },
    {
      icon: 'logo-instagram',
      title: 'Instagram',
      value: `@${CONTACT.instagram}`,
      sub: 'See our latest work',
      href: CONTACT.instagramUrl,
      color: '#E1306C',
    },
    {
      icon: 'logo-facebook',
      title: 'Facebook',
      value: CONTACT.facebook,
      sub: 'Follow our page',
      href: CONTACT.facebookUrl,
      color: '#1877F2',
    },
    {
      icon: 'location-outline',
      title: 'Visit us',
      value: CONTACT.location,
      sub: 'Open in Google Maps',
      href: CONTACT.mapsUrl,
      color: colors.success,
    },
  ];

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{ paddingBottom: 48 }}
      showsVerticalScrollIndicator={false}>
      <View style={{ paddingTop: insets.top + 8 }}>
        <Container>
          <BackHeader title="Contact" onBack={() => (navigation.canGoBack() ? router.back() : router.push('/'))} />
        </Container>
      </View>

      <Container style={{ paddingHorizontal: 20 }}>
        {/* WhatsApp hero */}
        <FadeIn>
          <LinearGradient colors={['#1DA851', '#25D366']} style={styles.waCard}>
            <View style={styles.waIconWrap}>
              <Ionicons name="logo-whatsapp" size={30} color="#fff" />
            </View>
            <Text style={styles.waTitle}>Chat with us on WhatsApp</Text>
            <Text style={styles.waText}>
              The fastest way to reach us. Send your request and get a response quickly — usually
              within minutes during work hours.
            </Text>
            <Pressable style={styles.waButton} onPress={() => Linking.openURL(waLink(waDefaultMessage))}>
              <Text style={styles.waButtonText}>Start WhatsApp chat</Text>
              <Ionicons name="arrow-forward" size={18} color="#12512C" />
            </Pressable>
          </LinearGradient>
        </FadeIn>

        {/* Channels */}
        <View style={{ gap: 12, marginTop: 24 }}>
          {channels.map((channel, i) => (
            <FadeIn key={channel.title} delay={i * 60}>
              <GlassCard
                style={styles.channelCard}
                onPress={() => Linking.openURL(channel.href)}>
                <View style={[styles.channelIcon, { backgroundColor: channel.color + '1F' }]}>
                  <Ionicons name={channel.icon as any} size={20} color={channel.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.channelTitle}>{channel.title}</Text>
                  <Text style={styles.channelValue}>{channel.value}</Text>
                  <Text style={styles.channelSub}>{channel.sub}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.muted} />
              </GlassCard>
            </FadeIn>
          ))}
        </View>

        {/* Hours */}
        <FadeIn delay={100}>
          <GlassCard style={styles.hoursCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <Ionicons name="time-outline" size={20} color={colors.cyan} />
              <Text style={styles.hoursTitle}>Business hours</Text>
            </View>
            {CONTACT.hours.map((h) => (
              <View key={h.days} style={styles.hoursRow}>
                <Text style={styles.hoursDays}>{h.days}</Text>
                <Text style={styles.hoursTime}>{h.time}</Text>
              </View>
            ))}
          </GlassCard>
        </FadeIn>

        <FadeIn delay={140}>
          <View style={styles.footerNote}>
            <Text style={styles.footerText}>
              Prefer a structured brief? Use the Start a Project flow and we'll receive everything
              we need in one message.
            </Text>
            <Pressable onPress={() => router.push('/start')} style={styles.footerButton}>
              <Text style={styles.footerButtonText}>Start a Project →</Text>
            </Pressable>
          </View>
        </FadeIn>
      </Container>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  waCard: { borderRadius: radius.xl, padding: 24, marginTop: 12 },
  waIconWrap: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  waTitle: { color: '#fff', fontFamily: fonts.display, fontSize: 22 },
  waText: {
    color: 'rgba(255,255,255,0.92)',
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
  },
  waButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fff',
    borderRadius: radius.pill,
    paddingHorizontal: 22,
    paddingVertical: 13,
    alignSelf: 'flex-start',
    marginTop: 18,
  },
  waButtonText: { color: '#12512C', fontFamily: fonts.bodySemi, fontSize: 14.5 },
  channelCard: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 14 },
  channelIcon: {
    width: 46,
    height: 46,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  channelTitle: { color: colors.muted, fontFamily: fonts.bodyMedium, fontSize: 12 },
  channelValue: { color: colors.text, fontFamily: fonts.displaySemi, fontSize: 15.5, marginTop: 1 },
  channelSub: { color: colors.muted, fontFamily: fonts.body, fontSize: 12, marginTop: 1 },
  hoursCard: { padding: 20, marginTop: 24 },
  hoursTitle: { color: colors.text, fontFamily: fonts.displaySemi, fontSize: 17 },
  hoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 9,
    borderTopColor: colors.border,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  hoursDays: { color: colors.subtext, fontFamily: fonts.body, fontSize: 14 },
  hoursTime: { color: colors.text, fontFamily: fonts.bodyMedium, fontSize: 14 },
  footerNote: {
    marginTop: 24,
    backgroundColor: colors.violetSoft,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(139,92,246,0.35)',
    padding: 20,
    alignItems: 'flex-start',
  },
  footerText: { color: colors.subtext, fontFamily: fonts.body, fontSize: 13.5, lineHeight: 20 },
  footerButton: { marginTop: 12 },
  footerButtonText: { color: '#C4B5FD', fontFamily: fonts.bodySemi, fontSize: 14 },
});
