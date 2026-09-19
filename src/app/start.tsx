import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackBar, Button, Container, FadeIn } from '../components/ui';
import { waLink } from '../constants/contact';
import { colors, fonts, radius, sp } from '../constants/theme';

const needOptions = [
  'Printing',
  'Design',
  'Branding',
  'NFC Card',
  'Website',
  'Mobile App',
  'Packaging',
  'Other',
];

const budgets = ['Under ₦50k', '₦50k – ₦200k', '₦200k – ₦500k', 'Above ₦500k', 'Not sure yet'];
const deadlines = ['ASAP', '1 week', '2 weeks', '1 month', 'Flexible'];

export default function StartProjectScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [need, setNeed] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('');
  const [deadline, setDeadline] = useState('');
  const [budget, setBudget] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [done, setDone] = useState(false);

  const canContinue = useMemo(
    () => !!need && description.trim().length > 5,
    [need, description],
  );

  const brief = `*Project request — Pixel Studios app*

Need: ${need || '-'}

About the project:
${description || '-'}

Quantity: ${quantity || '-'}
Deadline: ${deadline || '-'}
Budget: ${budget || '-'}
Name: ${name || '-'}
Phone: ${phone || '-'}`;

  if (done) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top + sp.x7 }]}>
        <Container style={{ alignItems: 'center' }}>
          <FadeIn>
            <View style={styles.doneIcon}>
              <Ionicons name="checkmark" size={40} color={colors.onLime} />
            </View>
          </FadeIn>
          <FadeIn delay={120}>
            <Text style={styles.doneTitle}>Almost there.</Text>
            <Text style={styles.doneText}>
              Send your brief to the studio on WhatsApp and we'll reply with a quotation — usually
              within 24 hours.
            </Text>
          </FadeIn>
          <FadeIn delay={220} style={{ gap: sp.x2_, alignSelf: 'stretch', marginTop: sp.x5 }}>
            <Button title="Send brief on WhatsApp" href={waLink(brief)} />
            <Button title="Back to home" variant="secondary" onPress={() => router.push('/')} />
          </FadeIn>
        </Container>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{ paddingBottom: sp.x8 }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled">
      <Container style={{ marginTop: insets.top + sp.x1 }}>
        <BackBar onBack={() => router.back()} />
      </Container>

      <Container style={{ marginTop: sp.x3 }}>
        <FadeIn>
          <Text style={styles.title}>Let's build something.</Text>
        </FadeIn>

        {/* What do you need */}
        <FadeIn delay={80}>
          <Text style={styles.question}>What do you need?</Text>
          <View style={styles.needGrid}>
            {needOptions.map((option) => {
              const active = need === option;
              return (
                <Pressable
                  key={option}
                  onPress={() => setNeed(option)}
                  style={[styles.needTile, active && styles.needTileActive]}>
                  <Text style={[styles.needText, active && styles.needTextActive]}>{option}</Text>
                  {active && <Ionicons name="checkmark" size={16} color={colors.lime} />}
                </Pressable>
              );
            })}
          </View>
        </FadeIn>

        {/* Description */}
        <FadeIn delay={120}>
          <Text style={styles.question}>Tell us about your project</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Describe what you want to create, your style, references — anything that helps us understand your vision."
            placeholderTextColor={colors.muted}
            multiline
            style={styles.textArea}
          />
        </FadeIn>

        {/* Upload */}
        <FadeIn delay={140}>
          <Pressable style={styles.upload}>
            <Ionicons name="cloud-upload-outline" size={22} color={colors.subtext} />
            <Text style={styles.uploadText}>Upload design / files</Text>
            <Text style={styles.uploadHint}>You can also attach files in the WhatsApp chat</Text>
          </Pressable>
        </FadeIn>

        {/* Quantity */}
        <FadeIn delay={160}>
          <Text style={styles.question}>Quantity</Text>
          <TextInput
            value={quantity}
            onChangeText={setQuantity}
            placeholder="e.g. 200 business cards, 1 website"
            placeholderTextColor={colors.muted}
            style={styles.input}
          />
        </FadeIn>

        {/* Deadline */}
        <FadeIn delay={180}>
          <Text style={styles.question}>Deadline</Text>
          <View style={styles.chipRow}>
            {deadlines.map((d) => (
              <Pressable
                key={d}
                onPress={() => setDeadline(d)}
                style={[styles.optChip, deadline === d && styles.optChipActive]}>
                <Text style={[styles.optChipText, deadline === d && styles.optChipTextActive]}>
                  {d}
                </Text>
              </Pressable>
            ))}
          </View>
        </FadeIn>

        {/* Budget */}
        <FadeIn delay={200}>
          <Text style={styles.question}>Budget</Text>
          <View style={styles.chipRow}>
            {budgets.map((b) => (
              <Pressable
                key={b}
                onPress={() => setBudget(b)}
                style={[styles.optChip, budget === b && styles.optChipActive]}>
                <Text style={[styles.optChipText, budget === b && styles.optChipTextActive]}>
                  {b}
                </Text>
              </Pressable>
            ))}
          </View>
        </FadeIn>

        {/* Contact */}
        <FadeIn delay={220}>
          <Text style={styles.question}>How do we reach you?</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Your name"
            placeholderTextColor={colors.muted}
            style={styles.input}
          />
          <TextInput
            value={phone}
            onChangeText={setPhone}
            placeholder="Phone / WhatsApp number"
            placeholderTextColor={colors.muted}
            keyboardType="phone-pad"
            style={[styles.input, { marginTop: sp.x2_ }]}
          />
        </FadeIn>

        <FadeIn delay={240} style={{ marginTop: sp.x5 }}>
          <Button
            title="Continue"
            icon="arrow-forward"
            disabled={!canContinue}
            onPress={() => setDone(true)}
          />
        </FadeIn>
      </Container>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  title: {
    fontFamily: fonts.semi,
    fontSize: 38,
    lineHeight: 42,
    letterSpacing: -1.2,
    color: colors.text,
  },
  question: {
    fontFamily: fonts.semi,
    fontSize: 17,
    color: colors.text,
    marginTop: sp.x5,
    marginBottom: sp.x2_,
  },
  needGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: sp.x2_ },
  needTile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 22,
    paddingVertical: 16,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.hairline,
  },
  needTileActive: { borderColor: colors.lime, backgroundColor: colors.limeDim },
  needText: { fontFamily: fonts.medium, fontSize: 15.5, color: colors.subtext },
  needTextActive: { color: colors.text },
  textArea: {
    backgroundColor: colors.surface,
    borderColor: colors.hairline,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: 18,
    color: colors.text,
    fontFamily: fonts.regular,
    fontSize: 16,
    lineHeight: 24,
    minHeight: 140,
    textAlignVertical: 'top',
  },
  upload: {
    marginTop: sp.x3,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.hairline,
    borderStyle: 'dashed',
    padding: sp.x4,
    alignItems: 'center',
    gap: 6,
  },
  uploadText: { fontFamily: fonts.medium, fontSize: 15.5, color: colors.subtext },
  uploadHint: { fontFamily: fonts.regular, fontSize: 12.5, color: colors.muted },
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
  doneIcon: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.lime,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  doneTitle: {
    fontFamily: fonts.semi,
    fontSize: 32,
    letterSpacing: -0.8,
    color: colors.text,
    textAlign: 'center',
    marginTop: sp.x4,
  },
  doneText: {
    fontFamily: fonts.regular,
    fontSize: 16,
    lineHeight: 24,
    color: colors.subtext,
    textAlign: 'center',
    marginTop: sp.x1,
    maxWidth: 400,
  },
});
