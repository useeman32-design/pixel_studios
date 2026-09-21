import { Ionicons } from '@expo/vector-icons';
import { Image as ExpoImage } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackBar, Button, Container, Eyebrow, FadeIn } from '../../components/ui';
import { CONTACT, waLink } from '../../constants/contact';
import { fonts, Palette, radius, sp, useTheme } from '../../constants/theme';
import { getOffer } from '../../data/offers';
import { hapticSelect } from '../../lib/haptics';

/* ------------------------------ brief options ------------------------------ */

const BRIEF_TYPES: Record<string, { label: string; desc: string }[]> = {
  logo: [
    { label: 'Icon with text', desc: 'A symbol beside your business name — most versatile' },
    { label: 'Text only', desc: 'Your name styled beautifully, no symbol' },
    { label: 'Icon only', desc: 'Just the symbol — great for stamps & avatars' },
    { label: 'Emblem / badge', desc: 'Name inside the symbol, like a crest or seal' },
  ],
  'brand-identity': [
    { label: 'Logo + colors', desc: 'A logo plus the core color palette' },
    { label: 'Full identity', desc: 'Logo, colors, typography and brand guidelines' },
    { label: 'Brand refresh', desc: 'Keep what works, modernize the rest' },
    { label: 'Stationery focus', desc: 'Business cards, letterhead and invoice look' },
  ],
  websites: [
    { label: 'One-page site', desc: 'One clean page — who you are, what you do, contact' },
    { label: 'Business site', desc: 'Multiple pages: services, about, gallery, contact' },
    { label: 'Portfolio site', desc: 'Show your work beautifully' },
    { label: 'Not sure yet', desc: 'Tell us your goal — we will recommend the fit' },
  ],
  'mobile-apps': [
    { label: 'Customer app', desc: 'Your customers order, book or browse from their phones' },
    { label: 'Business app', desc: 'Internal tool for your staff and operations' },
    { label: 'Booking & delivery', desc: 'Orders, scheduling or dispatch with tracking' },
    { label: 'Not sure yet', desc: 'Describe the idea — we will shape it with you' },
  ],
};

const COLOR_COMBOS: { name: string; colors: [string, string] }[] = [
  { name: 'Charcoal & Lime', colors: ['#141416', '#BFF549'] },
  { name: 'Black & White', colors: ['#0C0C0F', '#F5F5F1'] },
  { name: 'Navy & Gold', colors: ['#1E3A5F', '#E8C36A'] },
  { name: 'Forest & Cream', colors: ['#1E3B2C', '#F3EBDD'] },
  { name: 'Burgundy & Blush', colors: ['#5C1F2E', '#F2C9CF'] },
  { name: 'Ocean & Sand', colors: ['#155E75', '#EAD9B0'] },
  { name: 'Royal Purple', colors: ['#5B21B6', '#FFD8C2'] },
  { name: 'Terracotta & Ivory', colors: ['#B4552D', '#FAF3E7'] },
];

const TYPOGRAPHY = [
  'Modern & clean',
  'Bold & strong',
  'Elegant & classic',
  'Soft & friendly',
  'Luxury serif',
  'Designer’s choice',
];

const BUDGETS = ['Under ₦25k', '₦25k – ₦50k', '₦50k – ₦150k', '₦150k+', 'Not sure'];

/* --------------------------------- screen ---------------------------------- */

export default function BriefScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id?: string }>();
  const { colors } = useTheme();
  const styles = useStyles(colors);

  const offer = getOffer(params.id) ?? getOffer('logo')!;
  const typeOptions = BRIEF_TYPES[offer.id] ?? BRIEF_TYPES.logo;

  const [briefType, setBriefType] = useState(typeOptions[0].label);
  const [combo, setCombo] = useState<string | null>(null);
  const [typo, setTypo] = useState<string | null>(null);
  const [budget, setBudget] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [referenceUri, setReferenceUri] = useState<string | null>(null);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState<string | null>(null);

  const pickReference = async () => {
    try {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) return;
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.8,
      });
      if (!res.canceled && res.assets[0]?.uri) setReferenceUri(res.assets[0].uri);
    } catch {
      /* picker unavailable */
    }
  };

  const briefSummary = () => `Hello Pixel Studios! I'd like a *${offer.name}* brief:

Type: ${briefType}
Colors: ${combo ?? 'Designer’s choice'}
Typography: ${typo ?? 'Designer’s choice'}
Budget: ${budget ?? 'Flexible'}

About the business:
${description.trim() || '(I’ll explain over chat)'}
${referenceUri ? '\nI have a reference design — attaching it here.' : ''}

Name: ${fullName || '-'}
Phone: ${phone || '-'}`;

  const submitInApp = () => {
    if (!fullName.trim() || !phone.trim()) return;
    setSubmitted(`PS-${Math.floor(2900 + Math.random() * 600)}`);
  };

  const valid = fullName.trim().length > 1 && phone.trim().length > 6;

  /* -------------------------------- SUCCESS -------------------------------- */
  if (submitted) {
    return (
      <View style={[{ flex: 1, backgroundColor: colors.bg }, { paddingTop: insets.top + sp.x7 }]}>
        <Container style={{ alignItems: 'center' }}>
          <FadeIn>
            <View style={[styles.doneIcon, { backgroundColor: colors.lime }]}>
              <Ionicons name="checkmark" size={40} color={colors.onLime} />
            </View>
          </FadeIn>
          <FadeIn delay={100}>
            <Text style={[styles.doneTitle, { color: colors.text }]}>Brief received 🎉</Text>
            <Text style={[styles.doneOrder, { color: colors.isDark ? colors.lime : '#5E8A0D' }]}>#{submitted}</Text>
            <Text style={[styles.doneText, { color: colors.subtext }]}>
              Our design team will study your {offer.name.toLowerCase()} brief and send first concepts
              within 48 hours. We'll reach you on {phone}.
            </Text>
          </FadeIn>
          <FadeIn delay={200} style={{ gap: sp.x2_, alignSelf: 'stretch', marginTop: sp.x5 }}>
            <Button title="Confirm on WhatsApp" icon="logo-whatsapp" href={waLink(`Hello! I just submitted brief #${submitted} for ${offer.name}.`)} />
            <Button title="Back to Services" variant="secondary" onPress={() => router.replace('/services' as any)} />
          </FadeIn>
        </Container>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={{ paddingBottom: sp.x8 + 40 }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled">
      <Container style={{ marginTop: insets.top + sp.x3 }}>
        <BackBar onBack={() => router.back()} />
      </Container>

      <Container style={{ marginTop: sp.x3 }}>
        <FadeIn>
          <Eyebrow>Creative Brief</Eyebrow>
          <Text style={styles.title}>{offer.name}</Text>
          <Text style={styles.subtitle}>
            No design knowledge needed — tell us what you want in plain words and our studio handles the rest.
            {offer.priceFrom ? ` Starts from ₦${offer.priceFrom.toLocaleString('en-NG')}.` : ''}
          </Text>
        </FadeIn>

        {/* TYPE — plain language */}
        <Text style={styles.stepLabel}>01 · What kind of {offer.name.toLowerCase()} do you want?</Text>
        <View style={{ gap: sp.x2_ }}>
          {typeOptions.map((t) => {
            const active = briefType === t.label;
            return (
              <Pressable
                key={t.label}
                onPress={() => {
                  hapticSelect();
                  setBriefType(t.label);
                }}
                style={[styles.typeRow, { backgroundColor: colors.surface, borderColor: active ? colors.lime : colors.hairline }]}>
                <Ionicons
                  name={active ? 'checkmark-circle' : 'ellipse-outline'}
                  size={20}
                  color={active ? (colors.isDark ? colors.lime : '#5E8A0D') : colors.muted}
                />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.typeLabel, { color: colors.text }]}>{t.label}</Text>
                  <Text style={styles.typeDesc}>{t.desc}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* COLOR COMBINATION */}
        <Text style={styles.stepLabel}>02 · Pick a color combination</Text>
        <Text style={styles.hint}>Tap the palette that feels most like your brand.</Text>
        <View style={styles.comboGrid}>
          {COLOR_COMBOS.map((c) => {
            const active = combo === c.name;
            return (
              <Pressable
                key={c.name}
                onPress={() => {
                  hapticSelect();
                  setCombo(active ? null : c.name);
                }}
                style={[styles.comboCard, { backgroundColor: colors.surface, borderColor: active ? colors.lime : colors.hairline }]}>
                <View style={styles.comboSwatches}>
                  <View style={[styles.comboSwatch, { backgroundColor: c.colors[0] }]} />
                  <View style={[styles.comboSwatch, { backgroundColor: c.colors[1] }]} />
                </View>
                <Text style={[styles.comboName, { color: colors.text }]} numberOfLines={2}>{c.name}</Text>
                {active && <Ionicons name="checkmark-circle" size={16} color={colors.isDark ? colors.lime : '#5E8A0D'} style={{ position: 'absolute', top: 10, right: 10 }} />}
              </Pressable>
            );
          })}
        </View>

        {/* TYPOGRAPHY */}
        <Text style={styles.stepLabel}>03 · Typography style</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {TYPOGRAPHY.map((t) => {
            const active = typo === t;
            return (
              <Pressable
                key={t}
                onPress={() => {
                  hapticSelect();
                  setTypo(active ? null : t);
                }}
                style={[styles.chip, { backgroundColor: active ? colors.lime : colors.surface, borderColor: active ? colors.lime : colors.hairline }]}>
                <Text style={[styles.chipText, { color: active ? colors.onLime : colors.subtext }]}>{t}</Text>
              </Pressable>
            );
          })}
        </View>

        {/* DESCRIPTION */}
        <Text style={styles.stepLabel}>04 · Describe it in detail</Text>
        <Text style={styles.hint}>What does your business do? What feeling should the design give?</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={5}
          textAlignVertical="top"
          placeholder="e.g. We run a modern bakery in Gusau called Sweet Crumbs. Warm, welcoming, a little playful — like fresh bread smells."
          placeholderTextColor={colors.muted}
          style={[styles.input, { minHeight: 130 }]}
        />

        {/* REFERENCE */}
        <Text style={styles.stepLabel}>05 · Reference design (optional)</Text>
        {referenceUri ? (
          <View style={[styles.refWrap, { borderColor: colors.hairline }]}>
            <ExpoImage source={{ uri: referenceUri }} style={styles.refImage} contentFit="cover" />
            <Pressable onPress={() => setReferenceUri(null)} style={[styles.refRemove, { backgroundColor: colors.surface2 }]}>
              <Ionicons name="close" size={16} color={colors.text} />
            </Pressable>
          </View>
        ) : (
          <Pressable onPress={pickReference} style={[styles.refPick, { backgroundColor: colors.surface, borderColor: colors.hairline }]}>
            <Ionicons name="image-outline" size={22} color={colors.muted} />
            <Text style={[styles.refPickText, { color: colors.subtext }]}>Upload an image you like — a logo, a style, anything</Text>
          </Pressable>
        )}

        {/* BUDGET */}
        <Text style={styles.stepLabel}>06 · Budget</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {BUDGETS.map((b) => {
            const active = budget === b;
            return (
              <Pressable
                key={b}
                onPress={() => {
                  hapticSelect();
                  setBudget(active ? null : b);
                }}
                style={[styles.chip, { backgroundColor: active ? colors.lime : colors.surface, borderColor: active ? colors.lime : colors.hairline }]}>
                <Text style={[styles.chipText, { color: active ? colors.onLime : colors.subtext }]}>{b}</Text>
              </Pressable>
            );
          })}
        </View>

        {/* CONTACT */}
        <Text style={styles.stepLabel}>07 · Where do we reach you?</Text>
        <TextInput value={fullName} onChangeText={setFullName} placeholder="Full name" placeholderTextColor={colors.muted} style={styles.input} />
        <TextInput value={phone} onChangeText={setPhone} placeholder="Phone / WhatsApp number" placeholderTextColor={colors.muted} keyboardType="phone-pad" style={[styles.input, { marginTop: sp.x2_ }]} />

        {/* ACTIONS */}
        <View style={styles.actionCard}>
          <Button title="Submit brief in app" icon="paper-plane-outline" disabled={!valid} onPress={submitInApp} />
          {!valid && <Text style={styles.validNote}>Add your name and phone number to submit.</Text>}
          <View style={{ flexDirection: 'row', gap: sp.x2_ }}>
            <View style={{ flex: 1 }}>
              <Button title="Send on WhatsApp" variant="secondary" icon="logo-whatsapp" href={waLink(briefSummary())} />
            </View>
            <Pressable onPress={() => Linking.openURL(`tel:${CONTACT.phoneRaw}`)} style={[styles.callBtn, { backgroundColor: colors.surface2, borderColor: colors.hairline }]}>
              <Ionicons name="call-outline" size={18} color={colors.text} />
              <Text style={{ fontFamily: fonts.semi, fontSize: 15, color: colors.text }}>Call</Text>
            </Pressable>
          </View>
        </View>
      </Container>
    </ScrollView>
  );
}

function useStyles(colors: Palette) {
  return StyleSheet.create({
    title: { fontFamily: fonts.semi, fontSize: 36, lineHeight: 40, letterSpacing: -1.1, color: colors.text, marginTop: sp.x1 },
    subtitle: { fontFamily: fonts.regular, fontSize: 16, lineHeight: 24, color: colors.subtext, marginTop: sp.x1, maxWidth: 540 },
    stepLabel: { fontFamily: fonts.semi, fontSize: 16, letterSpacing: 0.1, color: colors.text, marginTop: sp.x6, marginBottom: sp.x2_ },
    hint: { fontFamily: fonts.regular, fontSize: 13.5, color: colors.muted, marginTop: -sp.x1, marginBottom: sp.x2_ },
    typeRow: { flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderRadius: radius.md, padding: sp.x3 },
    typeLabel: { fontFamily: fonts.semi, fontSize: 15.5, color: colors.text },
    typeDesc: { fontFamily: fonts.regular, fontSize: 13, color: colors.subtext, marginTop: 2 },
    comboGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: sp.x2_ },
    comboCard: { width: '30.5%', minWidth: 104, flexGrow: 1, borderWidth: 1, borderRadius: radius.md, padding: 12, gap: 8 },
    comboSwatches: { flexDirection: 'row', gap: 6 },
    comboSwatch: { width: 26, height: 26, borderRadius: 8, borderWidth: StyleSheet.hairlineWidth, borderColor: 'rgba(120,120,120,0.25)' },
    comboName: { fontFamily: fonts.medium, fontSize: 12, lineHeight: 15 },
    chip: { paddingHorizontal: 15, paddingVertical: 10, borderRadius: 999, borderWidth: 1 },
    chipText: { fontFamily: fonts.semi, fontSize: 13.5 },
    input: {
      backgroundColor: colors.surface,
      borderColor: colors.hairline,
      borderWidth: 1,
      borderRadius: radius.md,
      paddingHorizontal: 16,
      paddingVertical: 14,
      color: colors.text,
      fontFamily: fonts.regular,
      fontSize: 15.5,
      lineHeight: 22,
    },
    refPick: {
      borderWidth: 1,
      borderStyle: 'dashed',
      borderRadius: radius.md,
      padding: sp.x4,
      alignItems: 'center',
      gap: 8,
    },
    refPickText: { fontFamily: fonts.medium, fontSize: 13.5, textAlign: 'center' },
    refWrap: { borderRadius: radius.md, borderWidth: 1, overflow: 'hidden', alignSelf: 'flex-start' },
    refImage: { width: 200, height: 200 },
    refRemove: { position: 'absolute', top: 8, right: 8, width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
    actionCard: {
      marginTop: sp.x6,
      backgroundColor: colors.surface,
      borderColor: colors.hairline,
      borderWidth: 1,
      borderRadius: radius.lg,
      padding: sp.x3,
      gap: sp.x3,
    },
    validNote: { fontFamily: fonts.regular, fontSize: 12.5, color: colors.muted, marginTop: -sp.x2_ },
    callBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      borderRadius: radius.md,
      paddingHorizontal: 20,
      borderWidth: 1,
    },
    doneIcon: { width: 88, height: 88, borderRadius: 44, alignItems: 'center', justifyContent: 'center', alignSelf: 'center' },
    doneTitle: { fontFamily: fonts.semi, fontSize: 32, letterSpacing: -0.8, textAlign: 'center', marginTop: sp.x4 },
    doneOrder: { fontFamily: fonts.bold, fontSize: 18, letterSpacing: 2, textAlign: 'center', marginTop: sp.x1 },
    doneText: { fontFamily: fonts.regular, fontSize: 15.5, lineHeight: 23, textAlign: 'center', marginTop: sp.x2_, maxWidth: 420 },
  });
}
