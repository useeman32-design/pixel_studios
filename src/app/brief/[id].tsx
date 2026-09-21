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
  'social-media': [
    { label: 'Feed designs', desc: 'A set of matching posts for your grid' },
    { label: 'Campaign pack', desc: 'One campaign — banners, posts and status designs' },
    { label: 'Full month', desc: 'A month of content designed as one story' },
    { label: 'Story & video covers', desc: 'WhatsApp status, reels and TikTok covers' },
  ],
  'flyer-design': [
    { label: 'Single flyer', desc: 'One sharp one-page design, print ready' },
    { label: 'Double-sided', desc: 'Front and back with a clear call to action' },
    { label: 'Tri-fold brochure', desc: 'Folded layout for detailed information' },
    { label: 'Campaign series', desc: 'Matching flyers for a run of promotions' },
  ],
  websites: [
    { label: 'One-page site', desc: 'One clean page — who you are, what you do, contact' },
    { label: 'Business site', desc: 'Multiple pages: services, about, gallery, contact' },
    { label: 'Portfolio site', desc: 'Show your work beautifully' },
    { label: 'Online store', desc: 'Products, cart and WhatsApp or card checkout' },
    { label: 'Booking site', desc: 'Appointments, reservations or scheduling' },
    { label: 'School / organization portal', desc: 'Admissions, results, members or staff areas' },
    { label: 'Blog / news site', desc: 'Publish articles and updates regularly' },
    { label: 'Other', desc: 'Something else — describe it below' },
  ],
  'mobile-apps': [
    { label: 'Customer app', desc: 'Your customers order, book or browse from their phones' },
    { label: 'Business app', desc: 'Internal tool for your staff and operations' },
    { label: 'Booking & delivery', desc: 'Orders, scheduling or dispatch with tracking' },
    { label: 'Fintech / wallet', desc: 'Payments, transfers and balance features' },
    { label: 'Other', desc: 'Something else — describe it below' },
  ],
};

const COLOR_COMBOS: { name: string; colors: string[] }[] = [
  { name: 'Charcoal & Lime', colors: ['#141416', '#BFF549'] },
  { name: 'Black & White', colors: ['#0C0C0F', '#F5F5F1'] },
  { name: 'Navy & Gold', colors: ['#1E3A5F', '#E8C36A'] },
  { name: 'Forest & Cream', colors: ['#1E3B2C', '#F3EBDD'] },
  { name: 'Burgundy & Blush', colors: ['#5C1F2E', '#F2C9CF'] },
  { name: 'Ocean & Sand', colors: ['#155E75', '#EAD9B0'] },
  { name: 'Royal Purple', colors: ['#5B21B6', '#FFD8C2'] },
  { name: 'Terracotta & Ivory', colors: ['#B4552D', '#FAF3E7'] },
];

/** Custom color builder palette. */
const PALETTE = [
  '#0C0C0F', '#141416', '#3B3B40', '#8A8A90', '#F5F5F1', '#FFFFFF',
  '#BFF549', '#5E8A0D', '#1E3B2C', '#2DD4BF', '#155E75', '#1E3A8A',
  '#5B21B6', '#7C3AED', '#EC4899', '#5C1F2E', '#EF4444', '#B4552D',
  '#F59E0B', '#E8C36A', '#F3EBDD', '#8C5A3C', '#1E3A5F', '#0EA5E9',
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
  // Creative & digital work gets guided type options; everything else
  // (printing products etc.) simply uses the offer's own type list.
  const guided = BRIEF_TYPES[offer.id];
  const typeOptions: { label: string; desc: string }[] =
    guided ?? offer.types.map((t) => ({ label: t, desc: '' }));
  const isCreative = offer.categoryId === 'creative' || offer.categoryId === 'digital';

  const [briefType, setBriefType] = useState(typeOptions[0].label);
  const [customType, setCustomType] = useState('');
  const [combo, setCombo] = useState<string | null>(null);
  const [customColors, setCustomColors] = useState<string[]>([]);
  const [typo, setTypo] = useState<string | null>(null);
  const [budget, setBudget] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [referenceUri, setReferenceUri] = useState<string | null>(null);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState<string | null>(null);

  const togglePaletteColor = (c: string) => {
    hapticSelect();
    setCombo(null); // switching to custom
    setCustomColors((prev) => {
      if (prev.includes(c)) return prev.filter((x) => x !== c);
      if (prev.length >= 4) return [...prev.slice(1), c];
      return [...prev, c];
    });
  };

  const pickPreset = (name: string) => {
    hapticSelect();
    if (combo === name) {
      setCombo(null);
    } else {
      setCombo(name);
      setCustomColors([]);
    }
  };

  const colorChoice =
    combo ??
    (customColors.length >= 2
      ? `Custom (${customColors.length} colors)`
      : null);

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

  const finalType = briefType === 'Other' ? `Other — ${customType.trim() || 'describe below'}` : briefType;

  const briefSummary = () => `Hello Pixel Studios! I'd like a *${offer.name}* brief:

Type: ${finalType}
Colors: ${colorChoice ?? 'Designer’s choice'}${customColors.length >= 2 ? ` — ${customColors.join(', ')}` : ''}
${isCreative ? `Typography: ${typo ?? 'Designer’s choice'}\n` : ''}Budget: ${budget ?? 'Flexible'}

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
              Our team will study your {offer.name.toLowerCase()} brief and get back to you
              within 48 hours on {phone}.
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

  let step = 0;
  const stepLabel = (text: string) => {
    step += 1;
    return `0${step} · ${text}`;
  };

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
          <Eyebrow>{isCreative ? 'Creative Brief' : 'Order Brief'}</Eyebrow>
          <Text style={styles.title}>{offer.name}</Text>
          <Text style={styles.subtitle}>
            No design knowledge needed — tell us what you want in plain words and our studio handles the rest.
            {offer.priceFrom ? ` Starts from ₦${offer.priceFrom.toLocaleString('en-NG')}.` : ''}
          </Text>
        </FadeIn>

        {/* TYPE — plain language */}
        <Text style={styles.stepLabel}>{stepLabel('What exactly do you need?')}</Text>
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
                  {t.desc ? <Text style={styles.typeDesc}>{t.desc}</Text> : null}
                </View>
              </Pressable>
            );
          })}
        </View>
        {briefType === 'Other' && (
          <TextInput
            value={customType}
            onChangeText={setCustomType}
            placeholder="Describe the system / product you need…"
            placeholderTextColor={colors.muted}
            style={[styles.input, { marginTop: sp.x2_ }]}
          />
        )}

        {/* COLOR COMBINATION */}
        <Text style={styles.stepLabel}>{stepLabel('Pick a color combination')}</Text>
        <Text style={styles.hint}>Choose a ready-made palette, or build your own with 2–4 colors.</Text>
        <View style={styles.comboGrid}>
          {COLOR_COMBOS.map((c) => {
            const active = combo === c.name;
            return (
              <Pressable
                key={c.name}
                onPress={() => pickPreset(c.name)}
                style={[styles.comboCard, { backgroundColor: colors.surface, borderColor: active ? colors.lime : colors.hairline }]}>
                <View style={styles.comboSwatches}>
                  {c.colors.map((col) => (
                    <View key={col} style={[styles.comboSwatch, { backgroundColor: col }]} />
                  ))}
                </View>
                <Text style={[styles.comboName, { color: colors.text }]} numberOfLines={2}>{c.name}</Text>
                {active && <Ionicons name="checkmark-circle" size={16} color={colors.isDark ? colors.lime : '#5E8A0D'} style={{ position: 'absolute', top: 10, right: 10 }} />}
              </Pressable>
            );
          })}
        </View>

        {/* Custom color builder */}
        <View style={[styles.customColorCard, { backgroundColor: colors.surface, borderColor: customColors.length >= 2 ? colors.lime : colors.hairline }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Ionicons name="color-palette-outline" size={17} color={customColors.length >= 2 ? (colors.isDark ? colors.lime : '#5E8A0D') : colors.muted} />
            <Text style={[styles.customColorTitle, { color: colors.text }]}>Build your own combination</Text>
            {customColors.length >= 2 && <Ionicons name="checkmark-circle" size={16} color={colors.isDark ? colors.lime : '#5E8A0D'} />}
          </View>
          <Text style={styles.customColorHint}>
            Tap 2 to 4 colors{customColors.length > 0 ? ` — ${customColors.length} selected` : ''}
          </Text>
          <View style={styles.paletteGrid}>
            {PALETTE.map((c) => {
              const active = customColors.includes(c);
              return (
                <Pressable key={c} onPress={() => togglePaletteColor(c)} style={styles.paletteCell}>
                  <View style={[styles.paletteSwatch, { backgroundColor: c, borderColor: active ? colors.lime : 'rgba(120,120,120,0.3)', borderWidth: active ? 2.5 : StyleSheet.hairlineWidth }]} />
                  {active && (
                    <View style={styles.paletteCheck}>
                      <Ionicons name="checkmark" size={11} color={c === '#FFFFFF' || c === '#F5F5F1' || c === '#F3EBDD' || c === '#BFF549' || c === '#E8C36A' || c === '#F2C9CF' || c === '#EAD9B0' || c === '#FFD8C2' || c === '#FAF3E7' ? '#141416' : '#FFFFFF'} />
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>
          {customColors.length > 0 && (
            <View style={styles.customPreviewRow}>
              {customColors.map((c) => (
                <View key={c} style={[styles.customPreviewSwatch, { backgroundColor: c }]} />
              ))}
              <Pressable onPress={() => setCustomColors([])} style={{ marginLeft: 4 }}>
                <Text style={{ fontFamily: fonts.medium, fontSize: 12.5, color: colors.muted, textDecorationLine: 'underline' }}>Clear</Text>
              </Pressable>
            </View>
          )}
        </View>

        {/* TYPOGRAPHY — creative & digital only */}
        {isCreative && (
          <>
            <Text style={styles.stepLabel}>{stepLabel('Typography style')}</Text>
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
          </>
        )}

        {/* DESCRIPTION */}
        <Text style={styles.stepLabel}>{stepLabel('Describe it in detail')}</Text>
        <Text style={styles.hint}>What does your business do? What feeling should it give?</Text>
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
        <Text style={styles.stepLabel}>{stepLabel('Reference (optional)')}</Text>
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
            <Text style={[styles.refPickText, { color: colors.subtext }]}>Upload an image you like — a style, a product photo, anything</Text>
          </Pressable>
        )}

        {/* BUDGET */}
        <Text style={styles.stepLabel}>{stepLabel('Budget')}</Text>
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
        <Text style={styles.stepLabel}>{stepLabel('Where do we reach you?')}</Text>
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
    customColorCard: { marginTop: sp.x3, borderWidth: 1, borderRadius: radius.lg, padding: sp.x3 },
    customColorTitle: { fontFamily: fonts.semi, fontSize: 14.5, flex: 1 },
    customColorHint: { fontFamily: fonts.regular, fontSize: 12.5, color: colors.muted, marginTop: 2, marginBottom: sp.x2_ },
    paletteGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 9 },
    paletteCell: { width: 38, height: 38 },
    paletteSwatch: { width: 38, height: 38, borderRadius: 12 },
    paletteCheck: {
      position: 'absolute',
      bottom: -3,
      right: -3,
      width: 16,
      height: 16,
      borderRadius: 8,
      backgroundColor: colors.lime,
      alignItems: 'center',
      justifyContent: 'center',
    },
    customPreviewRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: sp.x3 },
    customPreviewSwatch: { width: 26, height: 26, borderRadius: 8, borderWidth: StyleSheet.hairlineWidth, borderColor: 'rgba(120,120,120,0.25)' },
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
