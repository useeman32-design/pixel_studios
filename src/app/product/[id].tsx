import { Ionicons } from '@expo/vector-icons';
import { Image as ExpoImage } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, Linking, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import CheckoutModal from '../../components/CheckoutModal';
import { BackBar, Button, Container, Eyebrow, FadeIn, OptChip, Stepper } from '../../components/ui';
import { CONTACT, waLink } from '../../constants/contact';
import { fonts, Palette, radius, sp, useTheme } from '../../constants/theme';
import { formatNaira, getProduct } from '../../data/products';
import { hapticSelect } from '../../lib/haptics';

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
  const [description, setDescription] = useState('');
  const [referenceUri, setReferenceUri] = useState<string | null>(null);
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
  const valid = name.trim().length > 1 && phone.trim().length > 6;

  const pickReference = async () => {
    try {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) return;
      const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.8 });
      if (!res.canceled && res.assets[0]?.uri) setReferenceUri(res.assets[0].uri);
    } catch {
      /* picker unavailable */
    }
  };

  const waMessage = `Hello Pixel Studios! I'd like to order *${product.name}*.

Quantity: ${qty}${selectedMaterial ? `\nMaterial: ${selectedMaterial}` : ''}${selectedFinish ? `\nFinish: ${selectedFinish}` : ''}
${product.quoteOnly ? 'Please send me a quote.' : `Estimated total: ${formatNaira(estimated)}`}

Order details:
${description.trim() || '(I’ll explain over chat)'}
${referenceUri ? '\nI have a reference design — attaching it here.' : ''}

Name: ${name || '-'}
Phone: ${phone || '-'}`;

  /* ------------------------------ SUCCESS ------------------------------ */
  if (order) {
    return (
      <View style={[{ flex: 1, backgroundColor: colors.bg }, { paddingTop: insets.top + sp.x7 }]}>
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

  let step = 0;
  const stepLabel = (text: string) => {
    step += 1;
    return `0${step} · ${text}`;
  };

  return (
    <>
      <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ paddingBottom: sp.x8 + 40 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <Image source={product.image} style={{ width: '100%', height: 320, backgroundColor: colors.surface, marginTop: insets.top }} resizeMode="cover" />

        <Container style={{ marginTop: sp.x2_ }}>
          <BackBar onBack={() => router.back()} />
        </Container>

        <Container style={{ marginTop: sp.x2_ }}>
          <FadeIn>
            <Eyebrow>Shop · {product.category}</Eyebrow>
            <Text style={styles.title}>{product.name}</Text>
            <Text style={styles.subtitle}>{product.description}</Text>
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

          {/* MATERIAL */}
          {product.materials && (
            <>
              <Text style={styles.stepLabel}>{stepLabel('Choose a material')}</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: sp.x1 }}>
                {product.materials.map((m) => (
                  <OptChip key={m} label={m} active={selectedMaterial === m} onPress={() => { hapticSelect(); setMaterial(m); }} />
                ))}
              </View>
            </>
          )}

          {/* FINISH */}
          {product.finishes && (
            <>
              <Text style={styles.stepLabel}>{stepLabel('Choose a finish')}</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: sp.x1 }}>
                {product.finishes.map((f) => (
                  <OptChip key={f} label={f} active={selectedFinish === f} onPress={() => { hapticSelect(); setFinish(f); }} />
                ))}
              </View>
            </>
          )}

          {/* QUANTITY */}
          <Text style={styles.stepLabel}>{stepLabel('Quantity')}</Text>
          <Stepper value={qty} onChange={setQty} />
          {!product.quoteOnly && (
            <Text style={styles.estimate}>
              Estimated: <Text style={{ color: colors.isDark ? colors.lime : '#5E8A0D' }}>{formatNaira(estimated)}</Text>
              {'  '}({qty} × {formatNaira(unit)})
            </Text>
          )}

          {/* DESCRIPTION */}
          <Text style={styles.stepLabel}>{stepLabel('Describe your order in detail')}</Text>
          <Text style={styles.hint}>Text, sizes, colors, deadline — anything we should know.</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
            placeholder="e.g. 100 double-sided cards, our logo in gold, needed before the 15th."
            placeholderTextColor={colors.muted}
            style={[styles.input, { minHeight: 120 }]}
          />

          {/* REFERENCE */}
          <Text style={styles.stepLabel}>{stepLabel('Reference design (optional)')}</Text>
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
              <Text style={[styles.refPickText, { color: colors.subtext }]}>Upload a design, artwork or example you like</Text>
            </Pressable>
          )}

          {/* DETAILS */}
          <Text style={styles.stepLabel}>{stepLabel('Where do we reach you?')}</Text>
          <TextInput value={name} onChangeText={setName} placeholder="Full name" placeholderTextColor={colors.muted} style={styles.input} />
          <TextInput value={phone} onChangeText={setPhone} placeholder="Phone / WhatsApp number" placeholderTextColor={colors.muted} keyboardType="phone-pad" style={[styles.input, { marginTop: sp.x2_ }]} />

          {/* ORDER ACTIONS */}
          <View style={styles.actionCard}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <Text style={styles.totalLabel}>{product.quoteOnly ? 'Custom pricing' : 'Total estimate'}</Text>
              <Text style={styles.totalValue}>{product.quoteOnly ? 'On request' : formatNaira(estimated)}</Text>
            </View>
            {product.quoteOnly ? (
              <Button title="Request Quote on WhatsApp" icon="logo-whatsapp" href={waLink(waMessage)} />
            ) : (
              <Button title="Order in App" icon="checkmark" disabled={!valid} onPress={() => setCheckoutVisible(true)} />
            )}
            {!valid && !product.quoteOnly && <Text style={styles.validNote}>Add your name and phone number to order.</Text>}
            <Button title="Order on WhatsApp" variant="secondary" icon="logo-whatsapp" href={waLink(waMessage)} />
            <Pressable onPress={() => Linking.openURL(`tel:${CONTACT.phoneRaw}`)} style={[styles.callBtn, { backgroundColor: colors.surface2, borderColor: colors.hairline }]}>
              <Ionicons name="call-outline" size={18} color={colors.text} />
              <Text style={{ fontFamily: fonts.semi, fontSize: 15, color: colors.text }}>Call</Text>
            </Pressable>
          </View>
        </Container>
      </ScrollView>

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
    </>
  );
}

function useStyles(colors: Palette) {
  return StyleSheet.create({
    title: { fontFamily: fonts.semi, fontSize: 34, lineHeight: 38, letterSpacing: -1, color: colors.text, marginTop: sp.x1 },
    subtitle: { fontFamily: fonts.regular, fontSize: 16, lineHeight: 24, color: colors.subtext, marginTop: sp.x1, maxWidth: 540 },
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
    stepLabel: { fontFamily: fonts.semi, fontSize: 16, letterSpacing: 0.1, color: colors.text, marginTop: sp.x6, marginBottom: sp.x2_ },
    hint: { fontFamily: fonts.regular, fontSize: 13.5, color: colors.muted, marginTop: -sp.x1, marginBottom: sp.x2_ },
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
    totalLabel: { fontFamily: fonts.regular, fontSize: 13, color: colors.muted },
    totalValue: { fontFamily: fonts.semi, fontSize: 24, letterSpacing: -0.5, color: colors.text },
    validNote: { fontFamily: fonts.regular, fontSize: 12.5, color: colors.muted, marginTop: -sp.x2_ },
    callBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      borderRadius: radius.md,
      paddingHorizontal: 20,
      borderWidth: 1,
      paddingVertical: 13,
    },
    doneIcon: { width: 88, height: 88, borderRadius: 44, alignItems: 'center', justifyContent: 'center', alignSelf: 'center' },
    doneTitle: { fontFamily: fonts.semi, fontSize: 32, letterSpacing: -0.8, textAlign: 'center', marginTop: sp.x4 },
    doneOrder: { fontFamily: fonts.bold, fontSize: 18, letterSpacing: 2, textAlign: 'center', marginTop: sp.x1 },
    doneText: { fontFamily: fonts.regular, fontSize: 15.5, lineHeight: 23, textAlign: 'center', marginTop: sp.x2_, maxWidth: 420 },
  });
}
