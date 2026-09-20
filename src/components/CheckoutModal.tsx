import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { Button } from './ui';
import { fonts, radius, sp, useTheme } from '../constants/theme';

const states = [
  'Zamfara', 'Kano', 'Kaduna', 'Katsina', 'Sokoto', 'Kebbi', 'Niger', 'FCT Abuja',
  'Lagos', 'Oyo', 'Ogun', 'Rivers', 'Jigawa', 'Borno', 'Plateau', 'Bauchi', 'Gombe',
];

/**
 * In-app checkout: delivery details (fullname, phone, address, state, LGA)
 * or self / shop pickup — no address needed.
 */
export default function CheckoutModal({
  visible,
  summary,
  priceLabel,
  onClose,
  onPlaced,
}: {
  visible: boolean;
  summary: string;
  priceLabel?: string;
  onClose: () => void;
  onPlaced: (orderId: string, method: 'delivery' | 'pickup') => void;
}) {
  const { colors } = useTheme();
  const [method, setMethod] = useState<'delivery' | 'pickup'>('delivery');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [state_, setState] = useState('Zamfara');
  const [lga, setLga] = useState('');

  const valid =
    fullName.trim().length > 1 &&
    phone.trim().length > 6 &&
    (method === 'pickup' || (address.trim().length > 3 && lga.trim().length > 1));

  const place = () => {
    if (!valid) return;
    onPlaced(`PS-${Math.floor(2900 + Math.random() * 600)}`, method);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={[styles.backdrop, { backgroundColor: 'rgba(5,5,7,0.7)' }]}>
        <View style={[styles.sheet, { backgroundColor: colors.bg, borderColor: colors.hairlineStrong }]}>
          <View style={styles.head}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.title, { color: colors.text }]}>Checkout</Text>
              <Text style={[styles.summary, { color: colors.subtext }]} numberOfLines={2}>{summary}</Text>
            </View>
            <Pressable onPress={onClose} hitSlop={8} style={[styles.close, { backgroundColor: colors.surface2 }]}>
              <Ionicons name="close" size={20} color={colors.text} />
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={{ padding: 20, gap: sp.x2_ }} keyboardShouldPersistTaps="handled">
            {/* Delivery method */}
            <View style={{ flexDirection: 'row', gap: sp.x2_ }}>
              <Pressable
                onPress={() => setMethod('delivery')}
                style={[styles.methodCard, { backgroundColor: colors.surface, borderColor: method === 'delivery' ? colors.lime : colors.hairline }]}>
                <Ionicons name="rocket-outline" size={19} color={method === 'delivery' ? (colors.isDark ? colors.lime : '#5E8A0D') : colors.subtext} />
                <Text style={[styles.methodName, { color: colors.text }]}>Home Delivery</Text>
                <Text style={[styles.methodDesc, { color: colors.muted }]}>We bring it to you</Text>
              </Pressable>
              <Pressable
                onPress={() => setMethod('pickup')}
                style={[styles.methodCard, { backgroundColor: colors.surface, borderColor: method === 'pickup' ? colors.lime : colors.hairline }]}>
                <Ionicons name="storefront-outline" size={19} color={method === 'pickup' ? (colors.isDark ? colors.lime : '#5E8A0D') : colors.subtext} />
                <Text style={[styles.methodName, { color: colors.text }]}>Self / Shop Pickup</Text>
                <Text style={[styles.methodDesc, { color: colors.muted }]}>Collect at our studio</Text>
              </Pressable>
            </View>

            <TextInput value={fullName} onChangeText={setFullName} placeholder="Full name" placeholderTextColor={colors.muted} style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.hairline, color: colors.text }]} />
            <TextInput value={phone} onChangeText={setPhone} placeholder="Phone number" placeholderTextColor={colors.muted} keyboardType="phone-pad" style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.hairline, color: colors.text }]} />

            {method === 'delivery' && (
              <>
                <TextInput value={address} onChangeText={setAddress} placeholder="Delivery address" placeholderTextColor={colors.muted} style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.hairline, color: colors.text }]} />
                <View style={{ flexDirection: 'row', gap: sp.x2_ }}>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flex: 1 }} contentContainerStyle={{ gap: 8 }}>
                    {states.map((s) => (
                      <Pressable
                        key={s}
                        onPress={() => setState(s)}
                        style={[styles.stateChip, { backgroundColor: colors.surface, borderColor: state_ === s ? colors.lime : colors.hairline }]}>
                        <Text style={[styles.stateChipText, { color: state_ === s ? (colors.isDark ? colors.lime : '#5E8A0D') : colors.subtext }]}>{s}</Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                </View>
                <TextInput value={lga} onChangeText={setLga} placeholder="Local Government Area (LGA)" placeholderTextColor={colors.muted} style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.hairline, color: colors.text }]} />
              </>
            )}

            {method === 'pickup' && (
              <View style={[styles.pickupNote, { backgroundColor: colors.limeDim, borderColor: colors.lime }]}>
                <Ionicons name="location-outline" size={15} color={colors.isDark ? colors.lime : '#5E8A0D'} />
                <Text style={[styles.pickupText, { color: colors.text }]}>
                  Pickup at Pixel Studios — Gusau, Zamfara State. No address needed.
                </Text>
              </View>
            )}

            <View style={[styles.notifyRow, { borderColor: colors.hairline }]}>
              <Ionicons name="notifications-outline" size={15} color={colors.subtext} />
              <Text style={[styles.notifyText, { color: colors.subtext }]}>
                You'll be notified as soon as your order is ready {method === 'delivery' ? 'for delivery' : 'for pickup'}.
              </Text>
            </View>

            {priceLabel ? (
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 2 }}>
                <Text style={{ fontFamily: fonts.regular, fontSize: 13.5, color: colors.muted }}>Total</Text>
                <Text style={{ fontFamily: fonts.semi, fontSize: 22, letterSpacing: -0.4, color: colors.text }}>{priceLabel}</Text>
              </View>
            ) : null}

            <Button title="Place Order" icon="checkmark" disabled={!valid} onPress={place} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, alignItems: 'center', justifyContent: 'flex-end' },
  sheet: {
    width: '100%',
    maxWidth: 520,
    maxHeight: '92%',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  head: { flexDirection: 'row', alignItems: 'center', gap: sp.x2_, paddingHorizontal: 20, paddingTop: 18, paddingBottom: 10 },
  title: { fontFamily: fonts.semi, fontSize: 20, letterSpacing: -0.3 },
  summary: { fontFamily: fonts.regular, fontSize: 13, marginTop: 2 },
  close: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  methodCard: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: radius.md,
    borderWidth: 1.5,
  },
  methodName: { fontFamily: fonts.semi, fontSize: 13.5 },
  methodDesc: { fontFamily: fonts.regular, fontSize: 11 },
  input: {
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: 18,
    paddingVertical: 16,
    fontFamily: fonts.regular,
    fontSize: 16,
  },
  stateChip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    borderWidth: 1,
  },
  stateChipText: { fontFamily: fonts.medium, fontSize: 13 },
  pickupNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: radius.md,
    borderWidth: 1,
    padding: 14,
  },
  pickupText: { flex: 1, fontFamily: fonts.regular, fontSize: 13, lineHeight: 18 },
  notifyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 12,
  },
  notifyText: { flex: 1, fontFamily: fonts.regular, fontSize: 12.5, lineHeight: 17 },
});
