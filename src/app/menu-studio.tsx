import { Ionicons } from '@expo/vector-icons';
import { Image as ExpoImage } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Linking,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import CheckoutModal from '../components/CheckoutModal';
import MenuPage, { MenuThumb, MENU_CATEGORIES, MenuItem, menuTemplates } from '../components/MenuPage';
import { BackBar, Button, Container, Eyebrow, FadeIn } from '../components/ui';
import { CONTACT, waLink } from '../constants/contact';
import { fonts, Palette, radius, sp, useTheme } from '../constants/theme';

const packages = [
  { id: 'page', name: 'Digital Menu Page', desc: 'pixelstudios.com/menu/you — one link, always up to date', price: 25000 },
  { id: 'qr', name: 'Menu + QR Table Cards', desc: 'Menu page + 5 printed QR cards for your tables', price: 40000 },
  { id: 'smart', name: 'Menu + Smart Menu Card', desc: 'Menu page + tap-to-open smart card for staff & counters', price: 45000 },
];

const sampleItems: MenuItem[] = [
  { id: 'i1', name: 'Jollof Rice', price: '₦2,500', category: 'Mains' },
  { id: 'i2', name: 'Grilled Chicken', price: '₦4,000', category: 'Mains' },
  { id: 'i3', name: 'Small Chops', price: '₦2,000', category: 'Starters' },
  { id: 'i4', name: 'Zobo Drink', price: '₦800', category: 'Drinks' },
  { id: 'i5', name: 'Puff Puff (6 pcs)', price: '₦1,000', category: 'Desserts' },
];

export default function MenuStudioScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = useStyles(colors);

  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [address, setAddress] = useState('');
  const [items, setItems] = useState<MenuItem[]>(sampleItems);
  const [newItem, setNewItem] = useState<{ name: string; price: string; category: string; image: string | null }>({ name: '', price: '', category: 'Mains', image: null });
  const [templateId, setTemplateId] = useState('slate');
  const [packId, setPackId] = useState('page');
  const [material, setMaterial] = useState<'paper' | 'plastic'>('paper');
  const [order, setOrder] = useState<{ id: string; method: 'delivery' | 'pickup' } | null>(null);
  const [checkoutVisible, setCheckoutVisible] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);

  const pack = packages.find((p) => p.id === packId)!;
  const hasPhysical = packId !== 'page';
  const slug = (name || 'your-restaurant').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'your-restaurant';
  const menuContact = { phone: phone.trim(), whatsapp: whatsapp.trim(), address: address.trim() };

  const addItem = () => {
    if (!newItem.name.trim() || !newItem.price.trim()) return;
    setItems((prev) => [
      ...prev,
      {
        id: `i${Date.now()}`,
        name: newItem.name.trim(),
        price: newItem.price.trim().startsWith('₦') ? newItem.price.trim() : `₦${newItem.price.trim()}`,
        category: newItem.category,
        image: newItem.image,
      },
    ]);
    setNewItem({ name: '', price: '', category: newItem.category, image: null });
  };

  const pickItemImage = async () => {
    try {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) return;
      const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.7 });
      if (!res.canceled && res.assets[0]?.uri) setNewItem((s) => ({ ...s, image: res.assets[0].uri }));
    } catch {
      /* picker unavailable */
    }
  };

  const removeItem = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));

  const waMessage = `Hello Pixel Studios! I'd like to order a *Digital Menu*.

Package: ${pack.name} — ₦${pack.price.toLocaleString('en-NG')}
Template: ${menuTemplates.find((t) => t.id === templateId)?.name}
Restaurant: ${name || '-'}
Menu page: pixelstudios.com/menu/${slug}
Items: ${items.length} menu items (I'll send the full list)${hasPhysical ? `\nCard material: ${material === 'plastic' ? 'Plastic (PVC)' : 'Card stock paper'}` : ''}
Contact on menu: ${phone || '-'} / WA: ${whatsapp || '-'}

Please share payment details!`;

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
              {order.method === 'delivery'
                ? hasPhysical
                  ? "We'll build your digital menu and notify you when it's live and your cards are ready for delivery."
                  : "We'll build your digital menu and notify you the moment it goes live."
                : "We'll build your digital menu and notify you when everything is ready for pickup."}
            </Text>
          </FadeIn>
          <FadeIn delay={200} style={{ gap: sp.x2_, alignSelf: 'stretch', marginTop: sp.x5 }}>
            <Button title="Confirm on WhatsApp" icon="logo-whatsapp" href={waLink(`Hello! I just placed order #${order.id} for a Digital Menu (${pack.name}).`)} />
            <Button title="Back to Menu Studio" variant="secondary" onPress={() => setOrder(null)} />
          </FadeIn>
        </Container>
      </View>
    );
  }

  return (
    <>
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
            <Eyebrow>Pixel Menu</Eyebrow>
            <Text style={styles.title}>Digital Menu</Text>
            <Text style={styles.subtitle}>
              A beautiful, always-up-to-date menu your customers open with a scan — built exactly like your smart card.
            </Text>
          </FadeIn>

          {/* STEP 1 — restaurant + contact */}
          <Text style={styles.stepLabel}>01 · Your restaurant</Text>
          <TextInput value={name} onChangeText={setName} placeholder="Restaurant name" placeholderTextColor={colors.muted} style={styles.input} />
          <TextInput value={tagline} onChangeText={setTagline} placeholder="Tagline (e.g. Fresh. Local. Delicious.)" placeholderTextColor={colors.muted} style={[styles.input, { marginTop: sp.x2_ }]} />
          <Text style={styles.hint}>These details are printed on your menu so customers can reach you.</Text>
          <TextInput value={phone} onChangeText={setPhone} placeholder="Phone number (shown on menu)" placeholderTextColor={colors.muted} keyboardType="phone-pad" style={[styles.input, { marginTop: sp.x2_ }]} />
          <TextInput value={whatsapp} onChangeText={setWhatsapp} placeholder="WhatsApp number (optional)" placeholderTextColor={colors.muted} keyboardType="phone-pad" style={[styles.input, { marginTop: sp.x2_ }]} />
          <TextInput value={address} onChangeText={setAddress} placeholder="Address (optional)" placeholderTextColor={colors.muted} style={[styles.input, { marginTop: sp.x2_ }]} />

          {/* STEP 2 — items */}
          <Text style={styles.stepLabel}>02 · Your menu items</Text>
          <View style={{ gap: sp.x2_ }}>
            {items.map((it) => (
              <View key={it.id} style={[styles.itemRow, { backgroundColor: colors.surface, borderColor: colors.hairline }]}>
                {it.image ? (
                  <ExpoImage source={{ uri: it.image }} style={{ width: 40, height: 40, borderRadius: 10 }} contentFit="cover" />
                ) : null}
                <View style={{ flex: 1 }}>
                  <Text style={[styles.itemName, { color: colors.text }]}>{it.name}</Text>
                  <Text style={styles.itemMeta}>{it.category}</Text>
                </View>
                <Text style={[styles.itemPrice, { color: colors.isDark ? colors.lime : '#5E8A0D' }]}>{it.price}</Text>
                <Pressable onPress={() => removeItem(it.id)} hitSlop={8}>
                  <Ionicons name="trash-outline" size={17} color={colors.muted} />
                </Pressable>
              </View>
            ))}
          </View>

          <View style={[styles.addItemCard, { backgroundColor: colors.surface, borderColor: colors.hairline }]}>
            <TextInput value={newItem.name} onChangeText={(v) => setNewItem((s) => ({ ...s, name: v }))} placeholder="Dish / drink name" placeholderTextColor={colors.muted} style={styles.input} />
            <View style={{ flexDirection: 'row', gap: sp.x2_ }}>
              <View style={{ flex: 1 }}>
                <TextInput value={newItem.price} onChangeText={(v) => setNewItem((s) => ({ ...s, price: v }))} placeholder="Price (₦)" placeholderTextColor={colors.muted} keyboardType="numeric" style={[styles.input, { marginTop: sp.x2_ }]} />
              </View>
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: sp.x2_ }}>
              {MENU_CATEGORIES.map((c) => (
                <Pressable
                  key={c}
                  onPress={() => setNewItem((s) => ({ ...s, category: c }))}
                  style={[styles.catChip, { backgroundColor: colors.bg, borderColor: newItem.category === c ? colors.lime : colors.hairline }]}>
                  <Text style={[styles.catChipText, { color: newItem.category === c ? (colors.isDark ? colors.lime : '#5E8A0D') : colors.subtext }]}>{c}</Text>
                </Pressable>
              ))}
            </View>

            {/* Optional dish photo */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: sp.x2_ }}>
              {newItem.image ? (
                <View>
                  <ExpoImage source={{ uri: newItem.image }} style={{ width: 52, height: 52, borderRadius: 12 }} contentFit="cover" />
                  <Pressable
                    onPress={() => setNewItem((s) => ({ ...s, image: null }))}
                    hitSlop={6}
                    style={{ position: 'absolute', top: -6, right: -6, width: 20, height: 20, borderRadius: 10, backgroundColor: colors.text, alignItems: 'center', justifyContent: 'center' }}>
                    <Ionicons name="close" size={12} color={colors.bg} />
                  </Pressable>
                </View>
              ) : (
                <Pressable onPress={pickItemImage} style={[styles.photoPick, { borderColor: colors.hairline }]}>
                  <Ionicons name="camera-outline" size={17} color={colors.muted} />
                  <Text style={[styles.photoPickText, { color: colors.muted }]}>Add dish photo (optional)</Text>
                </Pressable>
              )}
            </View>

            <View style={{ marginTop: sp.x2_ }}>
              <Button title="Add item" variant="secondary" icon="add" onPress={addItem} />
            </View>
          </View>

          {/* STEP 3 — template */}
          <Text style={styles.stepLabel}>03 · Choose a template</Text>
          <Text style={styles.hint}>Real preview — exactly how your customers will see it.</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -24 }}>
            <View style={{ flexDirection: 'row', gap: sp.x3, paddingHorizontal: 24 }}>
              {menuTemplates.map((t) => (
                <Pressable key={t.id} onPress={() => setTemplateId(t.id)}>
                  <View style={[styles.templateWrap, templateId === t.id && { borderColor: colors.lime }]}>
                    <MenuThumb templateId={t.id} name={name} tagline={tagline} items={items} contact={menuContact} />
                    {t.tag === 'modern' && (
                      <View style={[styles.modernBadge, { backgroundColor: colors.lime }]}>
                        <Text style={[styles.modernBadgeText, { color: colors.onLime }]}>NEW</Text>
                      </View>
                    )}
                  </View>
                  <Text style={[styles.templateName, templateId === t.id && { color: colors.isDark ? colors.lime : '#5E8A0D' }]}>
                    {t.name} {templateId === t.id ? '✓' : ''}
                  </Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>
          <View style={{ marginTop: sp.x3 }}>
            <Button title="Preview your menu" variant="secondary" icon="eye-outline" onPress={() => setPreviewVisible(true)} />
          </View>

          {/* STEP 4 — package */}
          <Text style={styles.stepLabel}>04 · Choose a package</Text>
          <View style={{ gap: sp.x2_ }}>
            {packages.map((p) => (
              <Pressable
                key={p.id}
                onPress={() => setPackId(p.id)}
                style={[styles.packCard, { backgroundColor: colors.surface, borderColor: packId === p.id ? colors.lime : colors.hairline }]}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.packName}>{p.name}</Text>
                  <Text style={styles.packDesc}>{p.desc}</Text>
                </View>
                <Text style={styles.packPrice}>₦{p.price.toLocaleString('en-NG')}</Text>
              </Pressable>
            ))}
          </View>

          {/* STEP 5 — material for the physical card, same choice as smart cards */}
          {hasPhysical && (
            <>
              <Text style={styles.stepLabel}>05 · Card material</Text>
              <Text style={styles.hint}>For your {packId === 'qr' ? 'QR table cards' : 'smart menu card'} — same two finishes as our smart cards.</Text>
              <View style={{ flexDirection: 'row', gap: sp.x2_ }}>
                {[
                  { id: 'paper' as const, name: 'Card Stock', desc: 'Thick matte paper, soft-touch finish', icon: 'albums-outline' },
                  { id: 'plastic' as const, name: 'Plastic PVC', desc: 'Rigid card, water & spill proof', icon: 'card-outline' },
                ].map((m) => {
                  const active = material === m.id;
                  return (
                    <Pressable
                      key={m.id}
                      onPress={() => setMaterial(m.id)}
                      style={[styles.materialCard, { backgroundColor: colors.surface, borderColor: active ? colors.lime : colors.hairline }, { flex: 1 }]}>
                      <Ionicons name={m.icon as any} size={20} color={active ? (colors.isDark ? colors.lime : '#5E8A0D') : colors.muted} />
                      <Text style={[styles.materialName, { color: colors.text }]}>{m.name}</Text>
                      <Text style={styles.materialDesc}>{m.desc}</Text>
                      {active && (
                        <View style={[styles.materialCheck, { backgroundColor: colors.lime }]}>
                          <Ionicons name="checkmark" size={12} color={colors.onLime} />
                        </View>
                      )}
                    </Pressable>
                  );
                })}
              </View>
            </>
          )}

          {/* Order */}
          <View style={styles.orderCard}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <Text style={styles.totalLabel}>pixelstudios.com/menu/{slug}</Text>
              <Text style={styles.totalValue}>₦{pack.price.toLocaleString('en-NG')}</Text>
            </View>
            <Button title="Order in App" icon="checkmark" onPress={() => setCheckoutVisible(true)} />
            <View style={{ flexDirection: 'row', gap: sp.x2_ }}>
              <View style={{ flex: 1 }}>
                <Button title="Order on WhatsApp" variant="secondary" icon="logo-whatsapp" href={waLink(waMessage)} />
              </View>
              <Pressable onPress={() => Linking.openURL(`tel:${CONTACT.phoneRaw}`)} style={[styles.callBtn, { backgroundColor: colors.surface2, borderColor: colors.hairline }]}>
                <Ionicons name="call-outline" size={18} color={colors.text} />
                <Text style={{ fontFamily: fonts.semi, fontSize: 15, color: colors.text }}>Call</Text>
              </Pressable>
            </View>
          </View>
        </Container>
      </ScrollView>

      <CheckoutModal
        visible={checkoutVisible}
        summary={`Digital Menu · ${pack.name}`}
        priceLabel={`₦${pack.price.toLocaleString('en-NG')}`}
        onClose={() => setCheckoutVisible(false)}
        onPlaced={(id, method) => {
          setCheckoutVisible(false);
          setOrder({ id, method });
        }}
      />

      {/* Full menu preview */}
      <Modal visible={previewVisible} transparent animationType="slide" onRequestClose={() => setPreviewVisible(false)}>
        <View style={[styles.modalBackdrop, { backgroundColor: 'rgba(5,5,7,0.7)' }]}>
          <View style={[styles.modalSheet, { backgroundColor: colors.bg, borderColor: colors.hairlineStrong }]}>
            <View style={styles.modalHead}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.modalTitle, { color: colors.text }]}>Your digital menu</Text>
                <Text style={[styles.modalUrl, { color: colors.isDark ? colors.lime : '#5E8A0D' }]}>pixelstudios.com/menu/{slug}</Text>
              </View>
              <Pressable onPress={() => setPreviewVisible(false)} hitSlop={8} style={[styles.modalClose, { backgroundColor: colors.surface2 }]}>
                <Ionicons name="close" size={20} color={colors.text} />
              </Pressable>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 36 }}>
              <View style={{ maxWidth: 420, width: '100%', alignSelf: 'center', borderRadius: 24, overflow: 'hidden', borderWidth: StyleSheet.hairlineWidth, borderColor: colors.hairline }}>
                <MenuPage templateId={templateId} name={name} tagline={tagline} items={items} contact={menuContact} />
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

function useStyles(colors: Palette) {
  return StyleSheet.create({
    title: { fontFamily: fonts.semi, fontSize: 36, lineHeight: 40, letterSpacing: -1.1, color: colors.text, marginTop: sp.x1 },
    subtitle: { fontFamily: fonts.regular, fontSize: 16.5, color: colors.subtext, marginTop: sp.x1, maxWidth: 520 },
    stepLabel: { fontFamily: fonts.semi, fontSize: 15, letterSpacing: 0.3, color: colors.text, marginTop: sp.x6, marginBottom: sp.x2_ },
    hint: { fontFamily: fonts.regular, fontSize: 13.5, color: colors.muted, marginBottom: sp.x2_ },
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
    itemRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      borderWidth: 1,
      borderRadius: radius.md,
      paddingHorizontal: 16,
      paddingVertical: 13,
    },
    itemName: { fontFamily: fonts.semi, fontSize: 15 },
    itemMeta: { fontFamily: fonts.regular, fontSize: 12, color: colors.muted, marginTop: 1 },
    itemPrice: { fontFamily: fonts.bold, fontSize: 14 },
    addItemCard: { borderWidth: 1, borderStyle: 'dashed', borderRadius: radius.md, padding: 16, marginTop: sp.x2_ },
    catChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, borderWidth: 1 },
    catChipText: { fontFamily: fonts.medium, fontSize: 13 },
    photoPick: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      borderStyle: 'dashed',
      borderWidth: 1,
      borderRadius: radius.md,
      paddingVertical: 13,
    },
    photoPickText: { fontFamily: fonts.medium, fontSize: 13 },
    templateWrap: { borderRadius: 20, borderWidth: 2, borderColor: 'transparent', overflow: 'hidden' },
    modernBadge: { position: 'absolute', top: 10, right: 10, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 4 },
    modernBadgeText: { fontFamily: fonts.bold, fontSize: 9, letterSpacing: 1.2 },
    templateName: { fontFamily: fonts.semi, fontSize: 13.5, color: colors.subtext, marginTop: sp.x1, textAlign: 'center' },
    materialCard: {
      borderWidth: 1,
      borderRadius: radius.lg,
      padding: sp.x3,
      gap: 7,
    },
    materialName: { fontFamily: fonts.semi, fontSize: 15 },
    materialDesc: { fontFamily: fonts.regular, fontSize: 12.5, color: colors.subtext, lineHeight: 17 },
    materialCheck: {
      position: 'absolute',
      top: 12,
      right: 12,
      width: 22,
      height: 22,
      borderRadius: 11,
      alignItems: 'center',
      justifyContent: 'center',
    },
    packCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: sp.x3,
      borderWidth: 1,
      borderRadius: radius.lg,
      padding: sp.x3,
    },
    packName: { fontFamily: fonts.semi, fontSize: 16, color: colors.text },
    packDesc: { fontFamily: fonts.regular, fontSize: 13, color: colors.subtext, marginTop: 3 },
    packPrice: { fontFamily: fonts.semi, fontSize: 14, color: colors.isDark ? colors.lime : '#5E8A0D' },
    orderCard: {
      marginTop: sp.x6,
      backgroundColor: colors.surface,
      borderColor: colors.hairline,
      borderWidth: 1,
      borderRadius: radius.lg,
      padding: sp.x3,
      gap: sp.x3,
    },
    totalLabel: { fontFamily: fonts.regular, fontSize: 13, color: colors.muted, flex: 1, marginRight: 8 },
    totalValue: { fontFamily: fonts.semi, fontSize: 26, letterSpacing: -0.5, color: colors.text },
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
    modalBackdrop: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 18 },
    modalSheet: { width: '100%', maxWidth: 480, maxHeight: '94%', borderRadius: 24, borderWidth: StyleSheet.hairlineWidth, overflow: 'hidden' },
    modalHead: { flexDirection: 'row', alignItems: 'center', gap: sp.x2_, paddingHorizontal: 20, paddingVertical: 16 },
    modalTitle: { fontFamily: fonts.semi, fontSize: 18, letterSpacing: -0.3 },
    modalUrl: { fontFamily: fonts.medium, fontSize: 12.5, marginTop: 2 },
    modalClose: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  });
}
