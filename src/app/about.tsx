import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackHeader, Button, Container, FadeIn, GlassCard } from '../components/ui';
import { colors, fonts, radius } from '../constants/theme';
import { serviceCategories } from '../data/services';
import { stats } from '../data/testimonials';

const values = [
  { icon: 'sparkles-outline', title: 'Creativity', text: 'Every project gets fresh thinking, never templates.' },
  { icon: 'flash-outline', title: 'Speed', text: 'We respect your deadlines like they are our own.' },
  { icon: 'shield-checkmark-outline', title: 'Reliability', text: 'Clear communication from first message to delivery.' },
  { icon: 'trending-up-outline', title: 'Growth', text: 'We build things that help your business move forward.' },
];

const team = [
  { initials: 'CD', role: 'Creative Direction', focus: 'Branding · Design · Packaging' },
  { initials: 'PP', role: 'Print Production', focus: 'Quality control · Materials · Delivery' },
  { initials: 'EN', role: 'Engineering', focus: 'Web · Mobile · Systems' },
  { initials: 'MK', role: 'Marketing', focus: 'Campaigns · Content · Growth' },
  { initials: 'CS', role: 'Client Success', focus: 'Quotes · Support · WhatsApp' },
];

export default function AboutScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{ paddingBottom: 48 }}
      showsVerticalScrollIndicator={false}>
      <View style={{ paddingTop: insets.top + 8 }}>
        <Container>
          <BackHeader title="About Pixel Studios" onBack={() => router.back()} />
        </Container>
      </View>

      <Container style={{ paddingHorizontal: 20 }}>
        <FadeIn>
          <Text style={styles.lead}>
            We are a creative and technology studio helping businesses{' '}
            <Text style={styles.leadAccent}>build, brand, print, and grow.</Text>
          </Text>
          <Text style={styles.body}>
            From our base in Gusau, Zamfara State, Pixel Studios combines creative design,
            professional printing, software development, smart products and digital marketing
            under one roof. Bring us an idea — we will turn it into a real, professional business
            presence.
          </Text>
        </FadeIn>

        {/* Stats */}
        <View style={styles.statsRow}>
          {stats.map((s) => (
            <View key={s.label} style={styles.statCell}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Vision & Mission */}
        <View style={{ gap: 12, marginTop: 36 }}>
          <FadeIn>
            <GlassCard style={styles.vmCard}>
              <LinearGradient colors={['#8B5CF6', '#6366F1']} style={styles.vmIcon}>
                <Ionicons name="eye-outline" size={20} color="#fff" />
              </LinearGradient>
              <Text style={styles.vmTitle}>Our Vision</Text>
              <Text style={styles.vmText}>
                To become Nigeria's go-to one-stop business solutions studio — where any
                individual, startup, school or company can get both physical and digital solutions
                of world-class quality.
              </Text>
            </GlassCard>
          </FadeIn>
          <FadeIn delay={80}>
            <GlassCard style={styles.vmCard}>
              <LinearGradient colors={['#22D3EE', '#0EA5E9']} style={styles.vmIcon}>
                <Ionicons name="navigate-outline" size={20} color="#fff" />
              </LinearGradient>
              <Text style={styles.vmTitle}>Our Mission</Text>
              <Text style={styles.vmText}>
                To take every business from idea to complete presence — logo, print, website, app
                and marketing — with speed, quality and technology usually reserved for much
                bigger companies.
              </Text>
            </GlassCard>
          </FadeIn>
        </View>

        {/* Values */}
        <FadeIn delay={120}>
          <Text style={styles.sectionTitle}>What we stand for</Text>
          <View style={styles.valuesGrid}>
            {values.map((v) => (
              <GlassCard key={v.title} style={styles.valueCard}>
                <Ionicons name={v.icon as any} size={22} color={colors.cyan} />
                <Text style={styles.valueTitle}>{v.title}</Text>
                <Text style={styles.valueText}>{v.text}</Text>
              </GlassCard>
            ))}
          </View>
        </FadeIn>

        {/* Divisions */}
        <FadeIn delay={150}>
          <Text style={styles.sectionTitle}>Seven divisions, one studio</Text>
          <View style={{ gap: 10 }}>
            {serviceCategories.map((cat) => (
              <View key={cat.id} style={styles.divisionRow}>
                <LinearGradient colors={[cat.gradient[0], cat.gradient[1]]} style={styles.divisionIcon}>
                  <Text style={{ fontSize: 16 }}>{cat.emoji}</Text>
                </LinearGradient>
                <Text style={styles.divisionName}>{cat.name}</Text>
                <Text style={styles.divisionTag} numberOfLines={1}>
                  {cat.tagline}
                </Text>
              </View>
            ))}
          </View>
        </FadeIn>

        {/* Team */}
        <FadeIn delay={180}>
          <Text style={styles.sectionTitle}>The team behind the pixels</Text>
          <View style={styles.teamGrid}>
            {team.map((member) => (
              <GlassCard key={member.role} style={styles.teamCard}>
                <View style={styles.teamAvatar}>
                  <Text style={styles.teamAvatarText}>{member.initials}</Text>
                </View>
                <Text style={styles.teamRole}>{member.role}</Text>
                <Text style={styles.teamFocus}>{member.focus}</Text>
              </GlassCard>
            ))}
          </View>
        </FadeIn>

        {/* The journey example */}
        <FadeIn delay={200}>
          <LinearGradient
            colors={['#7C3AED', '#5B4BE0', '#0E7490']}
            style={styles.journeyCard}>
            <Text style={styles.journeyTitle}>From idea to business — one studio</Text>
            <Text style={styles.journeyText}>
              A new restaurant could walk in with nothing and leave with:
            </Text>
            <Text style={styles.journeyFlow}>
              Logo → Brand identity → Menu → Packaging → Business cards → NFC menu → Website →
              Social media → Marketing → Management system
            </Text>
            <Text style={styles.journeyCta}>That is the Pixel Studios promise.</Text>
          </LinearGradient>
        </FadeIn>

        <FadeIn delay={220} style={{ marginTop: 26, gap: 12 }}>
          <Button title="Start a Project" icon="rocket-outline" onPress={() => router.push('/start')} />
          <Button title="Get in touch" variant="glass" icon="chatbubbles-outline" onPress={() => router.push('/contact')} />
        </FadeIn>
      </Container>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  lead: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 27,
    lineHeight: 34,
    letterSpacing: -0.5,
    marginTop: 12,
  },
  leadAccent: { color: colors.cyan },
  body: {
    color: colors.subtext,
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 23,
    marginTop: 14,
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: 28,
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.lg,
    paddingVertical: 18,
  },
  statCell: { flex: 1, alignItems: 'center', gap: 3 },
  statValue: { color: colors.cyan, fontFamily: fonts.display, fontSize: 21 },
  statLabel: { color: colors.muted, fontFamily: fonts.body, fontSize: 10.5, textAlign: 'center' },
  vmCard: { padding: 22 },
  vmIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  vmTitle: { color: colors.text, fontFamily: fonts.displaySemi, fontSize: 18 },
  vmText: { color: colors.subtext, fontFamily: fonts.body, fontSize: 14, lineHeight: 21, marginTop: 6 },
  sectionTitle: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 23,
    letterSpacing: -0.4,
    marginTop: 40,
    marginBottom: 16,
  },
  valuesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  valueCard: { padding: 18, width: '48%', flexGrow: 1, gap: 8 },
  valueTitle: { color: colors.text, fontFamily: fonts.displaySemi, fontSize: 15.5 },
  valueText: { color: colors.subtext, fontFamily: fonts.body, fontSize: 12.5, lineHeight: 17 },
  divisionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: 12,
  },
  divisionIcon: {
    width: 36,
    height: 36,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divisionName: { color: colors.text, fontFamily: fonts.bodySemi, fontSize: 13.5, width: 118 },
  divisionTag: { color: colors.muted, fontFamily: fonts.body, fontSize: 12, flex: 1 },
  teamGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  teamCard: { padding: 18, width: '48%', flexGrow: 1, alignItems: 'flex-start' },
  teamAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.violetSoft,
    borderWidth: 1,
    borderColor: 'rgba(139,92,246,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  teamAvatarText: { color: '#C4B5FD', fontFamily: fonts.displaySemi, fontSize: 15 },
  teamRole: { color: colors.text, fontFamily: fonts.displaySemi, fontSize: 14.5 },
  teamFocus: { color: colors.muted, fontFamily: fonts.body, fontSize: 12, marginTop: 3, lineHeight: 16 },
  journeyCard: { borderRadius: radius.xl, padding: 26, marginTop: 8 },
  journeyTitle: { color: '#fff', fontFamily: fonts.display, fontSize: 21 },
  journeyText: { color: 'rgba(255,255,255,0.85)', fontFamily: fonts.body, fontSize: 14, marginTop: 8 },
  journeyFlow: {
    color: '#fff',
    fontFamily: fonts.bodySemi,
    fontSize: 14,
    lineHeight: 24,
    marginTop: 10,
  },
  journeyCta: {
    color: 'rgba(255,255,255,0.9)',
    fontFamily: fonts.bodyMedium,
    fontSize: 13.5,
    marginTop: 12,
  },
});
