import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackBar, Button, Container, Eyebrow, FadeIn } from '../components/ui';
import { fonts, Palette, radius, sp, useTheme } from '../constants/theme';
import { useAuth } from '../lib/auth';

export default function RegisterScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const { signUp } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validate = (): string | null => {
    if (name.trim().length < 2) return 'Please enter your full name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return 'Please enter a valid email address.';
    if (phone.replace(/\D/g, '').length < 7) return 'Please enter a valid phone number.';
    if (password.length < 6) return 'Password must be at least 6 characters.';
    if (password !== confirm) return 'Passwords do not match.';
    return null;
  };

  const submit = async () => {
    if (busy) return;
    const problem = validate();
    if (problem) {
      setError(problem);
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await signUp({ name: name.trim(), email: email.trim(), phone: phone.trim(), password });
      router.replace('/');
    } catch (e: any) {
      setError(String(e?.message || 'Registration failed. Please try again.'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={{ paddingBottom: 80 }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}>
      <Container style={{ marginTop: insets.top + sp.x2 }}>
        <BackBar title="Create account" onBack={() => router.back()} />
      </Container>

      <Container style={{ marginTop: sp.x4 }}>
        <FadeIn>
          <Eyebrow>Join the studio</Eyebrow>
          <Text style={styles.title}>Create account</Text>
          <Text style={styles.subtitle}>Two minutes now, faster orders forever.</Text>
        </FadeIn>

        <FadeIn delay={90}>
          <View style={{ marginTop: sp.x5, gap: sp.x3 }}>
            <View>
              <Text style={styles.fieldLabel}>Full name</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="e.g. Amina Bello"
                placeholderTextColor={colors.muted}
                style={[styles.field, { backgroundColor: colors.surface, borderColor: colors.hairline, color: colors.text }]}
              />
            </View>

            <View>
              <Text style={styles.fieldLabel}>Email address</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="you@business.ng"
                placeholderTextColor={colors.muted}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                style={[styles.field, { backgroundColor: colors.surface, borderColor: colors.hairline, color: colors.text }]}
              />
            </View>

            <View>
              <Text style={styles.fieldLabel}>Phone number</Text>
              <TextInput
                value={phone}
                onChangeText={setPhone}
                placeholder="0803 000 0000"
                placeholderTextColor={colors.muted}
                keyboardType="phone-pad"
                style={[styles.field, { backgroundColor: colors.surface, borderColor: colors.hairline, color: colors.text }]}
              />
            </View>

            <View>
              <Text style={styles.fieldLabel}>Password</Text>
              <View style={[styles.field, styles.passField, { backgroundColor: colors.surface, borderColor: colors.hairline }]}>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="At least 6 characters"
                  placeholderTextColor={colors.muted}
                  secureTextEntry={!showPass}
                  autoCapitalize="none"
                  style={[styles.passInput, { color: colors.text }]}
                />
                <Pressable onPress={() => setShowPass((s) => !s)} hitSlop={8}>
                  <Ionicons name={showPass ? 'eye-off-outline' : 'eye-outline'} size={18} color={colors.muted} />
                </Pressable>
              </View>
            </View>

            <View>
              <Text style={styles.fieldLabel}>Confirm password</Text>
              <TextInput
                value={confirm}
                onChangeText={setConfirm}
                placeholder="Repeat your password"
                placeholderTextColor={colors.muted}
                secureTextEntry={!showPass}
                autoCapitalize="none"
                style={[styles.field, { backgroundColor: colors.surface, borderColor: colors.hairline, color: colors.text }]}
                onSubmitEditing={submit}
              />
            </View>

            {error && (
              <View style={styles.errorRow}>
                <Ionicons name="alert-circle" size={15} color="#E5484D" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <Button title={busy ? 'Creating account…' : 'Create account'} icon={busy ? undefined : 'checkmark'} onPress={submit} disabled={busy} />
            {busy && <ActivityIndicator color={colors.muted} style={{ marginTop: -sp.x1 }} />}

            <Text style={styles.terms}>
              By creating an account you agree to be contacted by Pixel Studios about your orders
              via phone, WhatsApp or email.
            </Text>
          </View>
        </FadeIn>

        <FadeIn delay={160}>
          <Pressable onPress={() => router.replace('/login' as any)} style={styles.switchRow}>
            <Text style={[styles.switchText, { color: colors.subtext }]}>Already have an account?</Text>
            <Text style={[styles.switchLink, { color: colors.isDark ? colors.lime : '#5E8A0D' }]}> Sign in</Text>
          </Pressable>
        </FadeIn>
      </Container>
    </ScrollView>
  );
}

function useStyles(colors: Palette) {
  return StyleSheet.create({
    title: { fontFamily: fonts.semi, fontSize: 36, letterSpacing: -1.1, color: colors.text, marginTop: sp.x1 },
    subtitle: { fontFamily: fonts.regular, fontSize: 16, color: colors.subtext, marginTop: sp.x1 },
    fieldLabel: { fontFamily: fonts.medium, fontSize: 13.5, color: colors.subtext, marginBottom: 8 },
    field: {
      borderWidth: 1,
      borderRadius: radius.md,
      paddingHorizontal: 16,
      paddingVertical: 14,
      fontFamily: fonts.regular,
      fontSize: 15.5,
    },
    passField: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    passInput: { flex: 1, fontFamily: fonts.regular, fontSize: 15.5, paddingVertical: 0 },
    errorRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
    errorText: { flex: 1, fontFamily: fonts.medium, fontSize: 13.5, lineHeight: 19, color: '#E5484D' },
    terms: { fontFamily: fonts.regular, fontSize: 12, lineHeight: 17, color: colors.muted, textAlign: 'center' },
    switchRow: { flexDirection: 'row', justifyContent: 'center', marginTop: sp.x5, paddingVertical: 8 },
    switchText: { fontFamily: fonts.regular, fontSize: 14.5 },
    switchLink: { fontFamily: fonts.semi, fontSize: 14.5 },
  });
}
