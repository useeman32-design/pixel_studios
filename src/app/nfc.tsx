import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackBar, Button, Container, Eyebrow, FadeIn, Stepper } from '../components/ui';
import { waLink } from '../constants/contact';
import { colors, fonts, radius, sp } from '../constants/theme';

const cardImage = require('../../assets/images/nfc-card.jpg');

const capabilities = ['NFC', 'Digital Profile', 'WhatsApp', 'Phone', 'Email', 'Social Media', 'Website'];
const materials = ['Matte Black', 'Pure White', 'Transparent'];
const finishes = ['Matte', 'Gloss'];
const designOptions = ['Studio design', 'Your artwork'];

export default function NFCScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [qty, setQty] = useState(1);
  const [material, setMaterial] = useState(materials[0]);
  const [finish, setFinish] = useState(finishes[0]);
  const [design, setDesign] = useState(designOptions[0]);

  const orderMessage = `Hello Pixel Studios! I'd like to order the *Smart NFC Business Card*.

Quantity: ${qty}
Material: ${material}
Finish: ${finish}
Design: ${design}

Please share payment details. Thank you!`;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{ paddingBottom: sp.x8 }}
      showsVerticalScrollIndicator={false}>
      <Container style={{ marginTop: insets.top + sp.x1 }}>
        <BackBar onBack={() => router.back()} />
      </Container>

      <Container>
        <FadeIn>
          <Image source={cardImage} style={styles.cardImage} resizeMode="cover" />
        </FadeIn>

        <FadeIn delay={100} style={{ marginTop: sp.x5 }}>
          <Eyebrow>Pixel Smart</Eyebrow>
          <Text style={styles.title}>Smart Business Card</Text>
          <Text style={styles.subtitle}>One tap. Your entire business.</Text>
          <Text style={styles.price}>From ₦25,000</Text>
        </FadeIn>

        <FadeIn delay={160}>
          <View style={styles.capGrid}>
            {capabilities.map((c) => (
              <View key={c} style={styles.capItem}>
                <Ionicons name="checkmark" size={13} color={colors.lime} />
                <Text style={styles.capText}>{c}</Text>
              </View>
            ))}
          </View>
        </FadeIn>

        <FadeIn delay={200} style={{ marginTop: sp.x5 }}>
          <Text style={styles.optionTitle}>Quantity</Text>
          <Stepper value={qty} onChange={setQty} />

          <Text style={styles.optionTitle}>Card material</Text>
          <View style={styles.chipRow}>
            {materials.map((m) => (
              <OptionChip key={m} label={m} active={material === m} onPress={() => setMaterial(m)} />
            ))}
          </View>

          <Text style={styles.optionTitle}>Finish</Text>
          <View style={styles.chipRow}>
            {finishes.map((f) => (
              <OptionChip key={f} label={f} active={finish === f} onPress={() => setFinish(f)} />
            ))}
          </View>

          <Text style={styles.optionTitle}>Design</Text>
          <View style={styles.chipRow}>
            {designOptions.map((d) => (
              <OptionChip key={d} label={d} active={design === d} onPress={() => setDesign(d)} />
            ))}
          </View>
        </FadeIn>

        <FadeIn delay={240} style={{ marginTop: sp.x5, gap: sp.x2_ }}>
          <Button title="Order Smart Card" href={waLink(orderMessage)} />
          <Pressable onPress={() => router.push('/nfc-profile')} style={styles.demoLink}>
            <Text style={styles.demoLinkText}>See the digital profile it unlocks</Text>
            <Ionicons name="arrow-forward" size={15} color={colors.subtext} />
          </Pressable>
        </FadeIn>
      </Container>
    </ScrollView>
  );
}

function OptionChip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.optChip, active && styles.optChipActive]}>
      <Text style={[styles.optChipText, active && styles.optChipTextActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  cardImage: {
    width: '100%',
    height: 320,
    borderRadius: radius.xl,
    backgroundColor: colors.surface,
    marginTop: sp.x2_,
  },
  title: {
    fontFamily: fonts.semi,
    fontSize: 36,
    lineHeight: 40,
    letterSpacing: -1.1,
    color: colors.text,
    marginTop: sp.x1,
  },
  subtitle: { fontFamily: fonts.regular, fontSize: 18, color: colors.subtext, marginTop: sp.x1 },
  price: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.muted,
    marginTop: sp.x2_,
  },
  capGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: sp.x1,
    marginTop: sp.x4,
  },
  capItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: colors.surface,
    borderColor: colors.hairline,
    borderWidth: 1,
    borderRadius: radius.sm,
    paddingHorizontal: 13,
    paddingVertical: 9,
  },
  capText: { fontFamily: fonts.medium, fontSize: 13.5, color: colors.subtext },
  optionTitle: {
    fontFamily: fonts.semi,
    fontSize: 16,
    color: colors.text,
    marginTop: sp.x4,
    marginBottom: sp.x2_,
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: sp.x1 },
  optChip: {
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.hairline,
  },
  optChipActive: { backgroundColor: colors.limeDim, borderColor: colors.lime },
  optChipText: { fontFamily: fonts.medium, fontSize: 14, color: colors.subtext },
  optChipTextActive: { color: colors.lime },
  demoLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    paddingVertical: sp.x2_,
  },
  demoLinkText: { fontFamily: fonts.medium, fontSize: 14.5, color: colors.subtext },
});
