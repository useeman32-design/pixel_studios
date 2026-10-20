import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackBar, Button, Container, Eyebrow, FadeIn } from '../components/ui';
import { fonts, Palette, radius, sp, useTheme } from '../constants/theme';
import { useAuth } from '../lib/auth';

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const { signIn } = useAuth();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (busy) return;
    if (!identifier.trim() || !password) {
      setError('Enter your email (or phone number) and password.');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await signIn(identifier, password);
      router.replace('/');
    } catch (e: any) {
      setError(String(e?.message || 'Sign in failed. Please try again.'));
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
        <BackBar title="Sign in" onBack={() => router.back()} />
      </Container>

      <Container style={{ marginTop: sp.x4 }}>
        <FadeIn>
          <Eyebrow>Welcome back</Eyebrow>
          <Text style={styles.title}>Sign in</Text>
          <Text style={styles.subtitle}>Pick up right where you left off.</Text>
        </FadeIn>

        <FadeIn delay={90}>
          <View style={{ marginTop: sp.x5, gap: sp.x3 }}>
            <View>
              <Text style={styles.fieldLabel}>Email or phone number</Text>
              <TextInput
                value={identifier}
                onChangeText={setIdentifier}
                placeholder="amina@example.com or 0803…"
                placeholderTextColor={colors.muted}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                style={[styles.field, { backgroundColor: colors.surface, borderColor: colors.hairline, color: colors.text }]}
              />
            </View>

            <View>
              <Text style={styles.fieldLabel}>Password</Text>
              <View
                style={[
                  styles.field,
                  styles.passField,
                  { backgroundColor: colors.surface, borderColor: colors.hairline },
                ]}>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Your password"
                  placeholderTextColor={colors.muted}
                  secureTextEntry={!showPass}
                  autoCapitalize="none"
                  style={[styles.passInput, { color: colors.text }]}
                  onSubmitEditing={submit}
                />
                <Pressable onPress={() => setShowPass((s) => !s)} hitSlop={8}>
                  <Ionicons name={showPass ? 'eye-off-outline' : 'eye-outline'} size={18} color={colors.muted} />
                </Pressable>
              </View>
            </View>

            {error && (
              <View style={styles.errorRow}>
                <Ionicons name="alert-circle" size={15} color="#E5484D" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <Button title={busy ? 'Signing in…' : 'Sign in'} icon={busy ? undefined : 'log-in-outline'} onPress={submit} disabled={busy} />
            {busy && <ActivityIndicator color={colors.muted} style={{ marginTop: -sp.x1 }} />}
          </View>
        </FadeIn>

        <FadeIn delay={160}>
          <Pressable onPress={() => router.replace('/register' as any)} style={styles.switchRow}>
            <Text style={[styles.switchText, { color: colors.subtext }]}>New to Pixel Studios?</Text>
            <Text style={[styles.switchLink, { color: colors.isDark ? colors.lime : '#5E8A0D' }]}> Create an account</Text>
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
    switchRow: { flexDirection: 'row', justifyContent: 'center', marginTop: sp.x5, paddingVertical: 8 },
    switchText: { fontFamily: fonts.regular, fontSize: 14.5 },
    switchLink: { fontFamily: fonts.semi, fontSize: 14.5 },
  });
}
