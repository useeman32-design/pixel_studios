import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackBar, Button, Container, Eyebrow, FadeIn, Stepper } from '../../components/ui';
import { CONTACT, waLink } from '../../constants/contact';
import { fonts, Palette, radius, sp, useTheme } from '../../constants/theme';
import { getOffer } from '../../data/offers';
import { getCategory } from '../../data/services';

export default function OfferScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id?: string }>();
  const { colors } = useTheme();
  const styles = useStyles(colors);

  const offer = getOffer(params.id) ?? getOffer('business-cards');
  if (!offer) return null;
  const category = getCategory(offer.categoryId);

  const [design, setDesign] = useState(offer.designs[0]?.name);
  const [type, setType] = useState(offer.types[0]);
  const [qty, setQty] = useState(1);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [orderId, setOrderId] = useState<string | null>(null);

  const activeDesign = offer.designs.find((d) => d.name === design);
  const base = offer.priceFrom ?? 0;
  const estimated = base * qty;

  const categoryName = category?.name ?? 'Services';
  const waMessage = `Hello Pixel Studios! I'd like to order:

*${offer.name}* (${categoryName})
Design: ${design ?? 'To discuss'}
${offer.types.length > 1 ? `Type: ${type}\n` : ''}Quantity: ${qty}
${offer.priceFrom ? `Budget: ₦${estimated.toLocaleString('en-NG')} (${qty} × ₦${base.toLocaleString('en-NG')})` : 'Please send me a quote'}
Name: ${name || '-'}
Phone: ${phone || '-'}`;

  /* ------------------------------ SUCCESS ------------------------------ */
  if (orderId) {
    return (
      <View style={[{ flex: 1, backgroundColor: colors.bg, justifyContent: 'center' }, { paddingHorizontal: 24, paddingTop: insets.top }]}>
        <Container style={{ alignItems: 'center' }}>
          <FadeIn>
            <View style={[styles.doneIcon, { backgroundColor: colors.lime }]}>
              <Ionicons name="checkmark" size={40} color={colors.onLime} />
            </View>
          </FadeIn>
          <FadeIn delay={100}>
            <Text style={[styles.doneTitle, { color: colors.text }]}>Order received 🎉</Text>
            <Text style={[styles.doneOrder, { color: colors.isDark ? colors.lime : '#5E8A0D' }]}>#{orderId}</Text>
            <Text style={[styles.doneText, { color: colors.subtext }]}>
              {qty} × {offer.name} · {design}. Our team will call you within 2 hours to confirm
              your design files, artwork and delivery details.
            </Text>
          </FadeIn>
          <FadeIn delay={200} style={{ gap: sp.x2_, alignSelf: 'stretch', marginTop: sp.x5 }}>
            <Button title="Confirm on WhatsApp" icon="logo-whatsapp" href={waLink(`Hello! I just placed order #${orderId} — ${qty} × ${offer.name} (${design}).`)} />
            <Button title="Back to services" variant="secondary" onPress={() => router.back()} />
          </FadeIn>
        </Container>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ paddingBottom: sp.x8 + 40 }}>
      <Container style={{ marginTop: insets.top + sp.x3 }}>
        <BackBar onBack={() => router.back()} />
      </Container>

      <Container style={{ marginTop: sp.x3 }}>
        <FadeIn>
          <Eyebrow>{categoryName}</Eyebrow>
          <Text style={styles.title}>{offer.name}</Text>
          <Text style={styles.blurb}>{offer.blurb}</Text>
        </FadeIn>

        {/* DESIGN */}
        <Text style={styles.stepLabel}>01 · Choose a design</Text>
        <View style={styles.designGrid}>
          {offer.designs.map((d) => {
            const active = design === d.name;
            return (
              <Pressable
                key={d.name}
                onPress={() => setDesign(d.name)}
                style={[styles.designTile, { backgroundColor: colors.surface, borderColor: active ? colors.lime : colors.hairline }]}>
                <View style={[styles.swatch, { backgroundColor: d.colors[0] }]}>
                  <View
                    style={{
                      position: 'absolute',
                      top: -22,
                      right: -22,
                      width: 78,
                      height: 78,
                      borderRadius: 14,
                      backgroundColor: d.colors[1],
                      transform: [{ rotate: '35deg' }],
                    }}
                  />
                  {active && (
                    <View style={[styles.swatchCheck, { backgroundColor: colors.isDark ? '#0A0A0B' : '#FFFFFF' }]}>
                      <Ionicons name="checkmark" size={14} color={colors.isDark ? '#BFF549' : '#5E8A0D'} />
                    </View>
                  )}
                </View>
                <Text style={[styles.designName, active && { color: colors.text }]}>{d.name}</Text>
              </Pressable>
            );
          })}
        </View>

        {/* TYPE */}
        {offer.types.length > 1 && (
          <>
            <Text style={styles.stepLabel}>02 · Choose a type</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: sp.x1 }}>
              {offer.types.map((t) => {
                const active = type === t;
                return (
                  <Pressable
                    key={t}
                    onPress={() => setType(t)}
                    style={[styles.typeChip, active && { borderColor: colors.lime, backgroundColor: colors.limeDim }]}>
                    <Text style={[styles.typeChipText, active && { color: colors.text }]}>{t}</Text>
                  </Pressable>
                );
              })}
            </View>
          </>
        )}

        {/* QTY */}
        <Text style={styles.stepLabel}>0{offer.types.length > 1 ? 3 : 2} · Quantity</Text>
        <Stepper value={qty} onChange={setQty} />
        {!offer.quoteOnly && (
          <Text style={styles.estimate}>
            Estimated: <Text style={{ color: colors.isDark ? colors.lime : '#5E8A0D' }}>₦{estimated.toLocaleString('en-NG')}</Text>
            {'  '}({qty} × ₦{base.toLocaleString('en-NG')})
          </Text>
        )}

        {/* DETAILS */}
        <Text style={styles.stepLabel}>0{offer.types.length > 1 ? 4 : 3} · Your details</Text>
        <TextInput value={name} onChangeText={setName} placeholder="Your name" placeholderTextColor={colors.muted} style={styles.input} />
        <TextInput value={phone} onChangeText={setPhone} placeholder="Phone / WhatsApp" placeholderTextColor={colors.muted} keyboardType="phone-pad" style={[styles.input, { marginTop: sp.x2_ }]} />

        {/* ORDER ACTIONS */}
        <View style={styles.orderCard}>
          <Button title="Order in App" icon="checkmark" onPress={() => setOrderId(`PS-${Math.floor(2900 + Math.random() * 600)}`)} />
          <Button title="Order on WhatsApp" variant="secondary" icon="logo-whatsapp" href={waLink(waMessage)} />
          <Pressable onPress={() => Linking.openURL(`tel:${CONTACT.phoneRaw}`)} style={[styles.callRow, { borderColor: colors.hairline }]}>
            <Ionicons name="call-outline" size={18} color={colors.text} />
            <Text style={{ fontFamily: fonts.semi, fontSize: 15.5, color: colors.text }}>Or call {CONTACT.phone}</Text>
          </Pressable>
        </View>
      </Container>
    </ScrollView>
  );
}

function useStyles(colors: Palette) {
  return StyleSheet.create({
    title: { fontFamily: fonts.semi, fontSize: 34, lineHeight: 38, letterSpacing: -1, color: colors.text, marginTop: sp.x1 },
    blurb: { fontFamily: fonts.regular, fontSize: 16, color: colors.subtext, marginTop: sp.x1, maxWidth: 560 },
    stepLabel: {
      fontFamily: fonts.semi,
      fontSize: 15,
      letterSpacing: 0.3,
      color: colors.text,
      marginTop: sp.x6,
      marginBottom: sp.x2_,
    },
    designGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: sp.x2_ },
    designTile: {
      width: 104,
      borderRadius: radius.md,
      borderWidth: 1.5,
      padding: 10,
      alignItems: 'center',
      gap: 7,
    },
    swatch: {
      width: '100%',
      height: 64,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    swatchCheck: {
      width: 26,
      height: 26,
      borderRadius: 13,
      alignItems: 'center',
      justifyContent: 'center',
    },
    designName: { fontFamily: fonts.medium, fontSize: 12, color: colors.subtext, textAlign: 'center' },
    typeChip: {
      paddingHorizontal: 16,
      paddingVertical: 11,
      borderRadius: radius.md,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.hairline,
    },
    typeChipText: { fontFamily: fonts.medium, fontSize: 14, color: colors.subtext },
    estimate: { fontFamily: fonts.regular, fontSize: 13.5, color: colors.muted, marginTop: sp.x2 },
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
    orderCard: {
      marginTop: sp.x6,
      backgroundColor: colors.surface,
      borderColor: colors.hairline,
      borderWidth: 1,
      borderRadius: radius.lg,
      padding: sp.x3,
      gap: sp.x2_,
    },
    callRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      borderRadius: radius.md,
      paddingVertical: 16,
      borderWidth: 1,
      marginTop: sp.x1,
    },
    doneIcon: { width: 88, height: 88, borderRadius: 44, alignItems: 'center', justifyContent: 'center', alignSelf: 'center' },
    doneTitle: { fontFamily: fonts.semi, fontSize: 32, letterSpacing: -0.8, textAlign: 'center', marginTop: sp.x4 },
    doneOrder: { fontFamily: fonts.bold, fontSize: 18, letterSpacing: 2, textAlign: 'center', marginTop: sp.x1 },
    doneText: { fontFamily: fonts.regular, fontSize: 15.5, lineHeight: 23, textAlign: 'center', marginTop: sp.x2_, maxWidth: 420 },
  });
}
