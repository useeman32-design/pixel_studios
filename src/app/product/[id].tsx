import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, Linking, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import CheckoutModal from '../../components/CheckoutModal';
import { BackBar, Button, Container, FadeIn, OptChip, Stepper } from '../../components/ui';
import { CONTACT, waLink } from '../../constants/contact';
import { fonts, Palette, radius, sp, useTheme } from '../../constants/theme';
import { formatNaira, getProduct } from '../../data/products';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = useStyles(colors);

  const product = getProduct(id);
  const [qty, setQty] = useState(1);
  const [material, setMaterial] = useState<string | undefined>(undefined);
  const [finish, setFinish] = useState<string | undefined>(undefined);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [order, setOrder] = useState<{ id: string; method: 'delivery' | 'pickup' } | null>(null);
  const [checkoutVisible, setCheckoutVisible] = useState(false);

  if (!product) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, paddingTop: insets.top + sp.x3 }}>
        <Container>
          <BackBar title="Product" onBack={() => router.back()} />
        </Container>
      </View>
    );
  }

  const selectedMaterial = material ?? product.materials?.[0];
  const selectedFinish = finish ?? product.finishes?.[0];
  const unit = product.price ?? 0;
  const estimated = unit * qty;

  const waMessage = `Hello Pixel Studios! I'd like to order *${product.name}*.

Quantity: ${qty}${selectedMaterial ? `\nMaterial: ${selectedMaterial}` : ''}${selectedFinish ? `\nFinish: ${selectedFinish}` : ''}
${product.quoteOnly ? 'Please send me a quote.' : `Estimated total: ${formatNaira(estimated)}`}
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
            <Text style={[styles.doneTitle, { color: colors.text }]}>Order placed 🎉</Text>
            <Text style={[styles.doneOrder, { color: colors.isDark ? colors.lime : '#5E8A0D' }]}>#{order.id}</Text>
            <Text style={[styles.doneText, { color: colors.subtext }]}>
              {qty} × {product.name}.{' '}
              {order.method === 'delivery'
                ? "You'll be notified as soon as your order is ready for delivery."
                : "You'll be notified as soon as your order is ready for pickup at our studio."}
            </Text>
          </FadeIn>
          <FadeIn delay={200} style={{ gap: sp.x2_, alignSelf: 'stretch', marginTop: sp.x5 }}>
            <Button title="Confirm on WhatsApp" icon="logo-whatsapp" href={waLink(`Hello! I just placed order #${order.id} — ${qty} × ${product.name}.`)} />
            <Button title="Keep shopping" variant="secondary" onPress={() => router.push('/shop' as any)} />
          </FadeIn>
        </Container>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ paddingBottom: sp.x8 + 40 }} showsVerticalScrollIndicator={false}>
      <Image source={product.image} style={{ width: '100%', height: 340, backgroundColor: colors.surface, marginTop: insets.top }} resizeMode="cover" />

      <Container style={{ marginTop: sp.x2_ }}>
        <BackBar onBack={() => router.back()} />
      </Container>

      <Container style={{ marginTop: sp.x2_ }}>
        <FadeIn>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.description}>{product.description}</Text>
          {!product.quoteOnly && (
            <Text style={styles.price}>
              {formatNaira(unit)} <Text style={{ color: colors.muted, fontSize: 13 }}>per unit</Text>
            </Text>
          )}
        </FadeIn>

        <FadeIn delay={80} style={{ marginTop: sp.x4 }}>
          {product.features.map((f) => (
            <View key={f} style={styles.featureRow}>
              <Ionicons name="checkmark" size={14} color={colors.isDark ? colors.lime : '#5E8A0D'} />
              <Text style={styles.featureText}>{f}</Text>
            </View>
          ))}
        </FadeIn>

        {product.materials && (
          <FadeIn delay={120}>
            <Text style={styles.optionTitle}>Material</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: sp.x1 }}>
              {product.materials.map((m) => (
                <OptChip key={m} label={m} active={selectedMaterial === m} onPress={() => setMaterial(m)} />
              ))}
            </View>
          </FadeIn>
        )}

        {product.finishes && (
          <FadeIn delay={140}>
            <Text style={styles.optionTitle}>Finish</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: sp.x1 }}>
              {product.finishes.map((f) => (
                <OptChip key={f} label={f} active={selectedFinish === f} onPress={() => setFinish(f)} />
              ))}
            </View>
          </FadeIn>
        )}

        <FadeIn delay={160}>
          <Text style={styles.optionTitle}>Quantity</Text>
          <Stepper value={qty} onChange={setQty} />
          {!product.quoteOnly && (
            <Text style={styles.estimate}>
              Estimated: <Text style={{ color: colors.isDark ? colors.lime : '#5E8A0D' }}>{formatNaira(estimated)}</Text>
              {'  '}({qty} × {formatNaira(unit)})
            </Text>
          )}
        </FadeIn>

        <FadeIn delay={180}>
          <Text style={styles.optionTitle}>Your details</Text>
          <TextInput value={name} onChangeText={setName} placeholder="Your name" placeholderTextColor={colors.muted} style={styles.input} />
          <TextInput value={phone} onChangeText={setPhone} placeholder="Phone / WhatsApp" placeholderTextColor={colors.muted} keyboardType="phone-pad" style={[styles.input, { marginTop: sp.x2_ }]} />
        </FadeIn>

        <FadeIn delay={200}>
          <View style={styles.orderCard}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <Text style={styles.totalLabel}>{product.quoteOnly ? 'Custom pricing' : 'Total estimate'}</Text>
              <Text style={styles.totalValue}>{product.quoteOnly ? 'On request' : formatNaira(estimated)}</Text>
            </View>
            {product.quoteOnly ? (
              <Button title="Request Quote on WhatsApp" icon="logo-whatsapp" href={waLink(waMessage)} />
            ) : (
              <Button title="Order in App" icon="checkmark" onPress={() => setCheckoutVisible(true)} />
            )}
            <Button title="Order on WhatsApp" variant="secondary" icon="logo-whatsapp" href={waLink(waMessage)} />
            <Pressable onPress={() => Linking.openURL(`tel:${CONTACT.phoneRaw}`)} style={[styles.callRow, { borderColor: colors.hairline }]}>
              <Ionicons name="call-outline" size={18} color={colors.text} />
              <Text style={{ fontFamily: fonts.semi, fontSize: 15.5, color: colors.text }}>Or call {CONTACT.phone}</Text>
            </Pressable>
          </View>
        </FadeIn>
      </Container>

      <CheckoutModal
        visible={checkoutVisible}
        summary={`${qty} × ${product.name}${selectedMaterial ? ` · ${selectedMaterial}` : ''}${selectedFinish ? ` · ${selectedFinish}` : ''}`}
        priceLabel={formatNaira(estimated)}
        onClose={() => setCheckoutVisible(false)}
        onPlaced={(oid, method) => {
          setCheckoutVisible(false);
          setOrder({ id: oid, method });
        }}
      />
    </ScrollView>
  );
}

function useStyles(colors: Palette) {
  return StyleSheet.create({
    name: { fontFamily: fonts.semi, fontSize: 32, lineHeight: 36, letterSpacing: -0.9, color: colors.text },
    description: { fontFamily: fonts.regular, fontSize: 16.5, lineHeight: 25, color: colors.subtext, marginTop: sp.x1 },
    price: { fontFamily: fonts.semi, fontSize: 18, color: colors.text, marginTop: sp.x2_ },
    featureRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      paddingVertical: 9,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.hairline,
    },
    featureText: { fontFamily: fonts.regular, fontSize: 15.5, color: colors.subtext },
    optionTitle: { fontFamily: fonts.semi, fontSize: 16, color: colors.text, marginTop: sp.x4, marginBottom: sp.x2_ },
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
    totalLabel: { fontFamily: fonts.regular, fontSize: 13, color: colors.muted },
    totalValue: { fontFamily: fonts.semi, fontSize: 24, letterSpacing: -0.5, color: colors.text },
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
