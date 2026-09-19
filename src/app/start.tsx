import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
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
import { fonts, Palette, radius, sp, useTheme } from '../constants/theme';

const needOptions = [
  'Print',
  'Design',
  'Smart Cards',
  'Mobile & Web Development',
  'Branding',
  'Packaging',
  'Other',
];

const budgets = ['Under ₦50k', '₦50k – ₦200k', '₦200k – ₦500k', 'Above ₦500k', 'Not sure yet'];
const deadlines = ['ASAP', '1 week', '2 weeks', '1 month', 'Flexible'];

export default function StartProjectScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = useStyles(colors);

  const [needs, setNeeds] = useState<string[]>([]);
  const [otherNeed, setOtherNeed] = useState('');
  const [description, setDescription] = useState('');

  const toggleNeed = (option: string) => {
    setNeeds((prev) =>
      prev.includes(option) ? prev.filter((n) => n !== option) : [...prev, option],
    );
  };
  const [quantity, setQuantity] = useState('');
  const [deadline, setDeadline] = useState('');
  const [budget, setBudget] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [done, setDone] = useState(false);

  const canContinue = useMemo(() => {
    if (needs.length === 0) return false;
    if (needs.includes('Other') && otherNeed.trim().length === 0) return false;
    return description.trim().length > 5;
  }, [needs, otherNeed, description]);

  const needSummary = [
    ...needs.filter((n) => n !== 'Other'),
    ...(needs.includes('Other') ? [`Other — ${otherNeed.trim()}`] : []),
  ].join(', ');

  const brief = `*Project request — Pixel Studios app*

Services: ${needSummary || '-'}

About the project:
${description || '-'}

Quantity: ${quantity || '-'}
Deadline: ${deadline || '-'}
Budget: ${budget || '-'}
Name: ${name || '-'}
Phone: ${phone || '-'}`;

  if (done) {
    return (
      <View style={[{ flex: 1, backgroundColor: colors.bg }, { paddingTop: insets.top + sp.x7 }]}>
        <Container style={{ alignItems: 'center' }}>
          <FadeIn>
            <View style={[styles.doneIcon, { backgroundColor: colors.lime }]}>
              <Ionicons name="checkmark" size={40} color={colors.onLime} />
            </View>
          </FadeIn>
          <FadeIn delay={120}>
            <Text style={[styles.doneTitle, { color: colors.text }]}>Almost there.</Text>
            <Text style={[styles.doneText, { color: colors.subtext }]}>
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
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={{ paddingBottom: sp.x8 }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled">
      <Container style={{ marginTop: insets.top + sp.x3 }}>
        <BackBar onBack={() => router.back()} />
      </Container>

      <Container style={{ marginTop: sp.x3 }}>
        <FadeIn>
          <Text style={styles.title}>Let's build something.</Text>
          <Text style={styles.intro}>Tell us what you need — Pixel AI can also help you decide.</Text>
          <Pressable onPress={() => router.push('/ai')} style={styles.aiLink}>
            <Ionicons name="sparkles" size={14} color={colors.isDark ? colors.lime : '#5E8A0D'} />
            <Text style={styles.aiLinkText}>Ask Pixel AI instead</Text>
          </Pressable>
        </FadeIn>

        <FadeIn delay={80}>
          <Text style={styles.question}>What do you need? <Text style={styles.questionHint}>(select all that apply)</Text></Text>
          <View style={styles.needGrid}>
            {needOptions.map((option) => {
              const active = needs.includes(option);
              return (
                <Pressable
                  key={option}
                  onPress={() => toggleNeed(option)}
                  style={[styles.needTile, active && { borderColor: colors.lime, backgroundColor: colors.limeDim }]}>
                  <Text style={[styles.needText, active && { color: colors.text }]}>{option}</Text>
                  {active && <Ionicons name="checkmark" size={16} color={colors.isDark ? colors.lime : '#5E8A0D'} />}
                </Pressable>
              );
            })}
          </View>
          {needs.includes('Other') && (
            <TextInput
              value={otherNeed}
              onChangeText={setOtherNeed}
              placeholder="Describe what you need…"
              placeholderTextColor={colors.muted}
              style={[styles.input, { marginTop: sp.x2_ }]}
            />
          )}
        </FadeIn>

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

        <FadeIn delay={140}>
          <Pressable style={styles.upload}>
            <Ionicons name="cloud-upload-outline" size={22} color={colors.subtext} />
            <Text style={styles.uploadText}>Upload design / files</Text>
            <Text style={styles.uploadHint}>You can also attach files in the WhatsApp chat</Text>
          </Pressable>
        </FadeIn>

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

        <FadeIn delay={180}>
          <Text style={styles.question}>Deadline</Text>
          <View style={styles.chipRow}>
            {deadlines.map((d) => (
              <Pressable
                key={d}
                onPress={() => setDeadline(d)}
                style={[styles.optChip, deadline === d && { borderColor: colors.lime, backgroundColor: colors.limeDim }]}>
                <Text style={[styles.optChipText, deadline === d && { color: colors.isDark ? colors.lime : '#5E8A0D' }]}>{d}</Text>
              </Pressable>
            ))}
          </View>
        </FadeIn>

        <FadeIn delay={200}>
          <Text style={styles.question}>Budget</Text>
          <View style={styles.chipRow}>
            {budgets.map((b) => (
              <Pressable
                key={b}
                onPress={() => setBudget(b)}
                style={[styles.optChip, budget === b && { borderColor: colors.lime, backgroundColor: colors.limeDim }]}>
                <Text style={[styles.optChipText, budget === b && { color: colors.isDark ? colors.lime : '#5E8A0D' }]}>{b}</Text>
              </Pressable>
            ))}
          </View>
        </FadeIn>

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

function useStyles(colors: Palette) {
  return StyleSheet.create({
    title: {
      fontFamily: fonts.semi,
      fontSize: 38,
      lineHeight: 42,
      letterSpacing: -1.2,
      color: colors.text,
    },
    intro: { fontFamily: fonts.regular, fontSize: 15.5, color: colors.subtext, marginTop: sp.x1 },
    aiLink: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      alignSelf: 'flex-start',
      marginTop: sp.x2_,
      backgroundColor: colors.limeDim,
      borderRadius: 999,
      paddingHorizontal: 14,
      paddingVertical: 8,
    },
    aiLinkText: {
      fontFamily: fonts.semi,
      fontSize: 13,
      color: colors.isDark ? colors.lime : '#5E8A0D',
    },
    question: {
      fontFamily: fonts.semi,
      fontSize: 17,
      color: colors.text,
      marginTop: sp.x5,
      marginBottom: sp.x2_,
    },
    questionHint: { fontFamily: fonts.regular, fontSize: 13.5, color: colors.muted },
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
    needText: { fontFamily: fonts.medium, fontSize: 15.5, color: colors.subtext },
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
    optChipText: { fontFamily: fonts.medium, fontSize: 14, color: colors.subtext },
    doneIcon: {
      width: 88,
      height: 88,
      borderRadius: 44,
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
    },
    doneTitle: {
      fontFamily: fonts.semi,
      fontSize: 32,
      letterSpacing: -0.8,
      textAlign: 'center',
      marginTop: sp.x4,
    },
    doneText: {
      fontFamily: fonts.regular,
      fontSize: 16,
      lineHeight: 24,
      textAlign: 'center',
      marginTop: sp.x1,
      maxWidth: 400,
    },
  });
}
