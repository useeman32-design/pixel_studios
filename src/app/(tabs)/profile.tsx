import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Container, FadeIn, RowItem } from '../../components/ui';
import { fonts, Palette, radius, sp, useTheme } from '../../constants/theme';
import { hapticSelect } from '../../lib/haptics';
import { DEFAULT_PROFILE, loadProfile, profileUsername, StoredProfile } from '../../lib/profile';

const avatarImage = require('../../../assets/images/avatar.jpg');

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, isDark, toggleTheme } = useTheme();
  const styles = useStyles(colors);

  const [profile, setProfile] = useState<StoredProfile>(DEFAULT_PROFILE);

  // Reload whenever the tab regains focus so edits elsewhere appear instantly.
  useEffect(() => {
    loadProfile().then(setProfile);
  });

  const username = profileUsername(profile);
  const socials = (
    [
      ['instagram', profile.instagram, 'logo-instagram'],
      ['x', profile.x, 'logo-x'],
      ['facebook', profile.facebook, 'logo-facebook'],
      ['linkedin', profile.linkedin, 'logo-linkedin'],
      ['website', profile.website, 'globe-outline'],
    ] as const
  ).filter(([, v]) => v && v.trim().length > 0);

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
            {socials.length > 0 && (
              <View style={styles.socialChips}>
                {socials.map(([key, , icon]) => (
                  <View key={key} style={[styles.socialChip, { backgroundColor: colors.surface2 }]}>
                    <Ionicons name={icon as any} size={13} color={colors.text} />
                  </View>
                ))}
              </View>
            )}
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
            <Pressable onPress={() => router.push('/edit-profile' as any)} style={styles.editBtn}>
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
            <RowItem icon="settings-outline" label="Settings" onPress={() => router.push('/settings' as any)} />
            <RowItem icon="help-buoy-outline" label="Help & Support" isLast onPress={() => router.push('/chat')} />
          </View>
        </FadeIn>

        <FadeIn delay={210}>
          <Text style={styles.version}>Pixel Studios · v3.1.0</Text>
        </FadeIn>
      </Container>
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
        socialChips: { flexDirection: 'row', gap: 7, marginTop: sp.x2_ },
        socialChip: {
          width: 30,
          height: 30,
          borderRadius: 10,
          alignItems: 'center',
          justifyContent: 'center',
        },
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
      }),
    [colors],
  );
}
