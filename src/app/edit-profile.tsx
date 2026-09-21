import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackBar, Button, Container, Eyebrow, FadeIn } from '../components/ui';
import { fonts, Palette, radius, sp, useTheme } from '../constants/theme';
import { hapticTap } from '../lib/haptics';
import { DEFAULT_PROFILE, loadProfile, saveProfile, StoredProfile } from '../lib/profile';

const avatarImage = require('../../assets/images/avatar.jpg');

const SOCIAL_FIELDS: { key: keyof StoredProfile; label: string; icon: keyof typeof Ionicons.glyphMap; placeholder: string }[] = [
  { key: 'instagram', label: 'Instagram', icon: 'logo-instagram', placeholder: '@yourbusiness' },
  { key: 'x', label: 'X (Twitter)', icon: 'logo-x', placeholder: '@yourbusiness' },
  { key: 'facebook', label: 'Facebook', icon: 'logo-facebook', placeholder: 'facebook.com/yourbusiness' },
  { key: 'linkedin', label: 'LinkedIn', icon: 'logo-linkedin', placeholder: 'linkedin.com/in/you' },
  { key: 'website', label: 'Website', icon: 'globe-outline', placeholder: 'yourbusiness.com' },
];

export default function EditProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = useStyles(colors);

  const [draft, setDraft] = useState<StoredProfile>(DEFAULT_PROFILE);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadProfile().then(setDraft);
  }, []);

  const set = (key: keyof StoredProfile) => (text: string) => setDraft((d) => ({ ...d, [key]: text }));

  const pickAvatar = async () => {
    try {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) return;
      const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.8 });
      if (!res.canceled && res.assets[0]?.uri) setAvatarUri(res.assets[0].uri);
    } catch {
      /* picker unavailable */
    }
  };

  const save = async () => {
    hapticTap();
    await saveProfile(draft);
    setSaved(true);
    setTimeout(() => router.back(), 700);
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled">
      <Container style={{ marginTop: insets.top + sp.x2 }}>
        <BackBar title="Edit Profile" onBack={() => router.back()} />
      </Container>

      <Container style={{ marginTop: sp.x3 }}>
        <FadeIn>
          <Eyebrow>Your account</Eyebrow>
          <Text style={styles.title}>Edit Profile</Text>
          <Text style={styles.subtitle}>Update your details and connect your socials.</Text>
        </FadeIn>

        {/* Avatar */}
        <FadeIn delay={80} style={{ alignItems: 'center', marginTop: sp.x4 }}>
          <View style={styles.avatarWrap}>
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.avatar} />
            ) : (
              <Image source={avatarImage} style={styles.avatar} />
            )}
            <Pressable onPress={pickAvatar} style={[styles.avatarEdit, { backgroundColor: colors.lime }]}>
              <Ionicons name="camera" size={16} color={colors.onLime} />
            </Pressable>
          </View>
        </FadeIn>

        {/* Basics */}
        <FadeIn delay={120}>
          <Text style={styles.section}>Basic details</Text>
          <TextInput value={draft.name} onChangeText={set('name')} placeholder="Full name" placeholderTextColor={colors.muted} style={styles.input} />
          <TextInput value={draft.email} onChangeText={set('email')} placeholder="Email address" placeholderTextColor={colors.muted} keyboardType="email-address" autoCapitalize="none" style={[styles.input, { marginTop: sp.x2_ }]} />
          <TextInput value={draft.phone} onChangeText={set('phone')} placeholder="Phone number" placeholderTextColor={colors.muted} keyboardType="phone-pad" style={[styles.input, { marginTop: sp.x2_ }]} />
        </FadeIn>

        {/* Socials */}
        <FadeIn delay={160}>
          <Text style={styles.section}>Social media</Text>
          <Text style={styles.hint}>Shown on your digital profile and smart card.</Text>
          <View style={{ gap: sp.x2_ }}>
            {SOCIAL_FIELDS.map((f) => (
              <View key={f.key} style={[styles.socialRow, { backgroundColor: colors.surface, borderColor: colors.hairline }]}>
                <Ionicons name={f.icon} size={18} color={colors.muted} />
                <TextInput
                  value={draft[f.key] as string}
                  onChangeText={set(f.key)}
                  placeholder={f.placeholder}
                  placeholderTextColor={colors.muted}
                  autoCapitalize="none"
                  style={[styles.socialInput, { color: colors.text }]}
                />
              </View>
            ))}
          </View>
        </FadeIn>

        <FadeIn delay={200} style={{ marginTop: sp.x5 }}>
          <Button title={saved ? 'Saved ✓' : 'Save changes'} icon={saved ? 'checkmark' : 'save-outline'} onPress={save} disabled={saved} />
        </FadeIn>
      </Container>
    </ScrollView>
  );
}

function useStyles(colors: Palette) {
  return StyleSheet.create({
    title: { fontFamily: fonts.semi, fontSize: 32, letterSpacing: -0.9, color: colors.text, marginTop: sp.x1 },
    subtitle: { fontFamily: fonts.regular, fontSize: 15.5, color: colors.subtext, marginTop: sp.x1 },
    avatarWrap: { position: 'relative' },
    avatar: { width: 92, height: 92, borderRadius: 30, backgroundColor: colors.surface },
    avatarEdit: {
      position: 'absolute',
      bottom: -4,
      right: -4,
      width: 34,
      height: 34,
      borderRadius: 17,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: colors.bg,
    },
    section: { fontFamily: fonts.semi, fontSize: 16, color: colors.text, marginTop: sp.x5, marginBottom: sp.x2_ },
    hint: { fontFamily: fonts.regular, fontSize: 13, color: colors.muted, marginTop: -sp.x1, marginBottom: sp.x2_ },
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
    socialRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      borderWidth: 1,
      borderRadius: radius.md,
      paddingHorizontal: 14,
    },
    socialInput: { flex: 1, paddingVertical: 14, fontFamily: fonts.regular, fontSize: 15 },
  });
}
