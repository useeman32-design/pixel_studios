import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Image, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Container, FadeIn, RowItem } from '../../components/ui';
import { fonts, Palette, radius, sp, useTheme } from '../../constants/theme';
import { hapticSelect, hapticTap } from '../../lib/haptics';

const avatarImage = require('../../../assets/images/avatar.jpg');

export type StoredProfile = {
  name: string;
  email: string;
  phone: string;
};

const DEFAULT_PROFILE: StoredProfile = {
  name: 'Amina Bello',
  email: 'amina@aureliahomes.ng',
  phone: '0803 000 0000',
};

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, isDark, toggleTheme } = useTheme();
  const styles = useStyles(colors);

  const [profile, setProfile] = useState<StoredProfile>(DEFAULT_PROFILE);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<StoredProfile>(DEFAULT_PROFILE);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem('ps_profile');
        if (raw) setProfile({ ...DEFAULT_PROFILE, ...JSON.parse(raw) });
      } catch {
        /* first launch — keep defaults */
      }
    })();
  }, []);

  const openEdit = () => {
    setDraft(profile);
    setEditing(true);
  };

  const saveProfile = async () => {
    hapticTap();
    const clean = {
      name: draft.name.trim() || DEFAULT_PROFILE.name,
      email: draft.email.trim(),
      phone: draft.phone.trim(),
    };
    setProfile(clean);
    try {
      await AsyncStorage.setItem('ps_profile', JSON.stringify(clean));
    } catch {
      /* storage unavailable */
    }
    setEditing(false);
  };

  const username = profile.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
    .slice(0, 16) || 'you';

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={{ paddingBottom: 150 }}
      showsVerticalScrollIndicator={false}>
      <Container style={{ marginTop: insets.top + sp.x4 }}>
        {/* ============================ DIGITAL PROFILE ============================ */}
        <FadeIn>
          <Pressable onPress={() => router.push('/nfc-profile')} style={styles.digiCard}>
            <View style={styles.digiTop}>
              <Image source={avatarImage} style={styles.digiAvatar} />
              <View style={{ flex: 1 }}>
                <Text style={styles.digiName}>{profile.name}</Text>
                <Text style={styles.digiHandle}>pixelstudios.com/card/{username}</Text>
              </View>
              <View style={styles.digiBadge}>
                <Ionicons name="checkmark-circle" size={13} color={colors.onLime} />
                <Text style={styles.digiBadgeText}>ACTIVE</Text>
              </View>
            </View>
            <View style={styles.digiRow}>
              <Ionicons name="qr-code-outline" size={15} color={colors.muted} />
              <Text style={styles.digiRowText}>Tap to view your digital profile — share it with one tap.</Text>
              <Ionicons name="chevron-forward" size={15} color={colors.muted} />
            </View>
          </Pressable>
        </FadeIn>

        {/* ============================== IDENTITY ROW ============================= */}
        <FadeIn delay={90}>
          <View style={styles.identity}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{profile.name}</Text>
              <Text style={styles.meta}>
                {profile.email}
                {profile.phone ? ` · ${profile.phone}` : ''}
              </Text>
            </View>
            <Pressable onPress={openEdit} style={styles.editBtn}>
              <Ionicons name="create-outline" size={16} color={colors.text} />
              <Text style={styles.editBtnText}>Edit Profile</Text>
            </Pressable>
          </View>
        </FadeIn>

        {/* ================================= ACTIONS =============================== */}
        <FadeIn delay={150}>
          <View style={{ marginTop: sp.x5 }}>
            <RowItem
              icon="receipt-outline"
              label="My Orders"
              sub="Track deliveries and project status"
              onPress={() => {
                hapticSelect();
                router.push('/orders');
              }}
            />
            <RowItem icon="folder-open-outline" label="My Projects" onPress={() => router.push('/start')} />
            <RowItem icon="sparkles-outline" label="Pixel AI Assistant" onPress={() => router.push('/ai')} />
            <RowItem icon="key-outline" label="AI Connection" sub="Groq API key & model" onPress={() => router.push('/ai-settings' as any)} />
            <RowItem
              icon={isDark ? 'moon-outline' : 'sunny-outline'}
              label="Appearance"
              sub={isDark ? 'Dark theme' : 'Light theme'}
              onPress={toggleTheme}
              right={
                <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: colors.muted }}>
                  {isDark ? 'Dark' : 'Light'}
                </Text>
              }
            />
            <RowItem icon="help-buoy-outline" label="Help & Support" onPress={() => router.push('/chat')} />
            <RowItem icon="settings-outline" label="Settings" isLast onPress={() => router.push('/chat')} />
          </View>
        </FadeIn>

        <FadeIn delay={210}>
          <Text style={styles.version}>Pixel Studios · v3.0.0</Text>
        </FadeIn>
      </Container>

      {/* ============================ EDIT PROFILE MODAL =========================== */}
      <Modal visible={editing} transparent animationType="slide" onRequestClose={() => setEditing(false)}>
        <View style={[styles.sheetBackdrop, { backgroundColor: 'rgba(5,5,7,0.7)' }]}>
          <View style={[styles.sheet, { backgroundColor: colors.bg, borderColor: colors.hairlineStrong }]}>
            <View style={styles.sheetHead}>
              <Text style={[styles.sheetTitle, { color: colors.text }]}>Edit Profile</Text>
              <Pressable onPress={() => setEditing(false)} hitSlop={8} style={[styles.sheetClose, { backgroundColor: colors.surface2 }]}>
                <Ionicons name="close" size={19} color={colors.text} />
              </Pressable>
            </View>
            <ScrollView contentContainerStyle={{ padding: 20, gap: sp.x3 }} keyboardShouldPersistTaps="handled">
              {[
                { key: 'name', label: 'Full name', placeholder: 'e.g. Amina Bello' },
                { key: 'email', label: 'Email address', placeholder: 'you@business.ng' },
                { key: 'phone', label: 'Phone number', placeholder: '0800 000 0000' },
              ].map((f) => (
                <View key={f.key}>
                  <Text style={[styles.fieldLabel, { color: colors.subtext }]}>{f.label}</Text>
                  <TextInput
                    value={draft[f.key as keyof StoredProfile]}
                    onChangeText={(t) => setDraft((d) => ({ ...d, [f.key]: t }))}
                    placeholder={f.placeholder}
                    placeholderTextColor={colors.muted}
                    style={[
                      styles.field,
                      {
                        backgroundColor: colors.surface,
                        borderColor: colors.hairline,
                        color: colors.text,
                      },
                    ]}
                  />
                </View>
              ))}
              <Pressable onPress={saveProfile} style={[styles.saveBtn, { backgroundColor: colors.lime }]}>
                <Ionicons name="checkmark" size={18} color={colors.onLime} />
                <Text style={[styles.saveBtnText, { color: colors.onLime }]}>Save changes</Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

function useStyles(colors: Palette) {
  return useMemo(
    () =>
      StyleSheet.create({
        digiCard: {
          backgroundColor: colors.surface,
          borderColor: colors.hairline,
          borderWidth: 1,
          borderRadius: radius.xl,
          padding: sp.x3,
        },
        digiTop: { flexDirection: 'row', alignItems: 'center', gap: sp.x2_ },
        digiAvatar: { width: 52, height: 52, borderRadius: 16 },
        digiName: { fontFamily: fonts.semi, fontSize: 17, letterSpacing: -0.3, color: colors.text },
        digiHandle: { fontFamily: fonts.regular, fontSize: 12.5, color: colors.lime, marginTop: 2 },
        digiBadge: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 4,
          backgroundColor: colors.lime,
          borderRadius: 999,
          paddingHorizontal: 9,
          paddingVertical: 5,
        },
        digiBadgeText: { fontFamily: fonts.bold, fontSize: 9.5, letterSpacing: 1, color: colors.onLime },
        digiRow: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          marginTop: sp.x3,
          paddingTop: sp.x3,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: colors.hairline,
        },
        digiRowText: { flex: 1, fontFamily: fonts.regular, fontSize: 13, color: colors.subtext },
        identity: { flexDirection: 'row', alignItems: 'center', gap: sp.x3, marginTop: sp.x4 },
        name: { fontFamily: fonts.semi, fontSize: 22, letterSpacing: -0.4, color: colors.text },
        meta: { fontFamily: fonts.regular, fontSize: 13, color: colors.muted, marginTop: 3 },
        editBtn: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          borderRadius: radius.sm,
          borderWidth: 1,
          borderColor: colors.hairline,
          backgroundColor: colors.surface,
          paddingHorizontal: 13,
          paddingVertical: 10,
        },
        editBtnText: { fontFamily: fonts.semi, fontSize: 13.5, color: colors.text },
        version: {
          fontFamily: fonts.regular,
          fontSize: 12.5,
          color: colors.muted,
          textAlign: 'center',
          marginTop: sp.x5,
        },
        sheetBackdrop: { flex: 1, alignItems: 'center', justifyContent: 'flex-end' },
        sheet: {
          width: '100%',
          maxWidth: 520,
          maxHeight: '88%',
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          borderWidth: StyleSheet.hairlineWidth,
        },
        sheetHead: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 20,
          paddingTop: 18,
          paddingBottom: 4,
        },
        sheetTitle: { fontFamily: fonts.semi, fontSize: 19, letterSpacing: -0.3 },
        sheetClose: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
        fieldLabel: { fontFamily: fonts.medium, fontSize: 13, marginBottom: 7 },
        field: {
          borderWidth: 1,
          borderRadius: radius.md,
          paddingHorizontal: 14,
          paddingVertical: 13,
          fontFamily: fonts.regular,
          fontSize: 15,
        },
        saveBtn: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 7,
          borderRadius: radius.md,
          paddingVertical: 15,
          marginTop: sp.x1,
        },
        saveBtnText: { fontFamily: fonts.bold, fontSize: 15 },
      }),
    [colors],
  );
}
