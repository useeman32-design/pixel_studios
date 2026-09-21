import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, Linking, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import CheckoutModal from '../../components/CheckoutModal';
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

  const [type, setType] = useState(offer.types[0]);
  const [qty, setQty] = useState(1);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [order, setOrder] = useState<{ id: string; method: 'delivery' | 'pickup' } | null>(null);
  const [checkoutVisible, setCheckoutVisible] = useState(false);

  const base = offer.priceFrom ?? 0;
  const estimated = base * qty;
  const categoryName = category?.name ?? 'Services';

  const waMessage = `Hello Pixel Studios! I'd like to order:

*${offer.name}* (${categoryName})
${offer.types.length > 1 ? `Type: ${type}\n` : ''}Quantity: ${qty}
${offer.priceFrom ? `Budget: ₦${estimated.toLocaleString('en-NG')} (${qty} × ₦${base.toLocaleString('en-NG')})` : 'Please send me a quote'}
Name: ${name || '-'}
Phone: ${phone || '-'}`;

  /* ------------------------------ SUCCESS ------------------------------ */
  if (order) {
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
            <Text style={[styles.doneOrder, { color: colors.isDark ? colors.lime : '#5E8A0D' }]}>#{order.id}</Text>
            <Text style={[styles.doneText, { color: colors.subtext }]}>
              {qty} × {offer.name}.{' '}
              {order.method === 'delivery'
                ? "You'll be notified as soon as your order is ready for delivery."
                : "You'll be notified as soon as your order is ready for pickup at our studio."}
            </Text>
          </FadeIn>
          <FadeIn delay={200} style={{ gap: sp.x2_, alignSelf: 'stretch', marginTop: sp.x5 }}>
            <Button title="Confirm on WhatsApp" icon="logo-whatsapp" href={waLink(`Hello! I just placed order #${order.id} — ${qty} × ${offer.name}.`)} />
            <Button title="Back to services" variant="secondary" onPress={() => router.back()} />
          </FadeIn>
        </Container>
      </View>
    );
  }

  return (
    <>
      <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ paddingBottom: sp.x8 + 40 }} showsVerticalScrollIndicator={false}>
        <Image source={offer.image} style={{ width: '100%', height: 280, backgroundColor: colors.surface, marginTop: insets.top }} resizeMode="cover" />

        <Container style={{ marginTop: sp.x2_ }}>
          <BackBar onBack={() => router.back()} />
        </Container>

        <Container style={{ marginTop: sp.x2_ }}>
          <FadeIn>
            <Eyebrow>{categoryName}</Eyebrow>
            <Text style={styles.title}>{offer.name}</Text>
            <Text style={styles.blurb}>{offer.blurb}</Text>
          </FadeIn>

          {/* TYPE */}
          {offer.types.length > 1 && (
            <>
              <Text style={styles.stepLabel}>01 · Choose a type</Text>
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
          <Text style={styles.stepLabel}>0{offer.types.length > 1 ? 2 : 1} · Quantity</Text>
          <Stepper value={qty} onChange={setQty} />
          {!offer.quoteOnly && (
            <Text style={styles.estimate}>
              Estimated: <Text style={{ color: colors.isDark ? colors.lime : '#5E8A0D' }}>₦{estimated.toLocaleString('en-NG')}</Text>
              {'  '}({qty} × ₦{base.toLocaleString('en-NG')})
            </Text>
          )}

          {/* DETAILS */}
          <Text style={styles.stepLabel}>0{offer.types.length > 1 ? 3 : 2} · Your details</Text>
          <TextInput value={name} onChangeText={setName} placeholder="Your name" placeholderTextColor={colors.muted} style={styles.input} />
          <TextInput value={phone} onChangeText={setPhone} placeholder="Phone / WhatsApp" placeholderTextColor={colors.muted} keyboardType="phone-pad" style={[styles.input, { marginTop: sp.x2_ }]} />

          {/* ORDER ACTIONS */}
          <View style={styles.orderCard}>
            <Button title="Order in App" icon="checkmark" onPress={() => setCheckoutVisible(true)} />
            <Button title="Order on WhatsApp" variant="secondary" icon="logo-whatsapp" href={waLink(waMessage)} />
            <Pressable onPress={() => Linking.openURL(`tel:${CONTACT.phoneRaw}`)} style={[styles.callRow, { borderColor: colors.hairline }]}>
              <Ionicons name="call-outline" size={18} color={colors.text} />
              <Text style={{ fontFamily: fonts.semi, fontSize: 15.5, color: colors.text }}>Or call {CONTACT.phone}</Text>
            </Pressable>
          </View>
        </Container>
      </ScrollView>

      <CheckoutModal
        visible={checkoutVisible}
        summary={`${qty} × ${offer.name}${offer.types.length > 1 ? ` · ${type}` : ''}`}
        priceLabel={offer.quoteOnly ? undefined : `₦${estimated.toLocaleString('en-NG')}`}
        onClose={() => setCheckoutVisible(false)}
        onPlaced={(id, method) => {
          setCheckoutVisible(false);
          setOrder({ id, method });
        }}
      />
    </>
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
    typeChip: {
      paddingHorizontal: 14,
      paddingVertical: 9,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: colors.hairline,
      backgroundColor: colors.surface,
    },
    typeChipText: { fontFamily: fonts.medium, fontSize: 13.5, color: colors.subtext },
    estimate: { fontFamily: fonts.regular, fontSize: 14, color: colors.subtext, marginTop: sp.x2_ },
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
      paddingVertical: 14,
      borderWidth: 1,
    },
    doneIcon: { width: 88, height: 88, borderRadius: 44, alignItems: 'center', justifyContent: 'center', alignSelf: 'center' },
    doneTitle: { fontFamily: fonts.semi, fontSize: 32, letterSpacing: -0.8, textAlign: 'center', marginTop: sp.x4 },
    doneOrder: { fontFamily: fonts.bold, fontSize: 18, letterSpacing: 2, textAlign: 'center', marginTop: sp.x1 },
    doneText: { fontFamily: fonts.regular, fontSize: 15.5, lineHeight: 23, textAlign: 'center', marginTop: sp.x2_, maxWidth: 420 },
  });
}
