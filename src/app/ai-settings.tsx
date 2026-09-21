import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackBar, Button, Container, FadeIn } from '../components/ui';
import { fonts, Palette, radius, sp, useTheme } from '../constants/theme';
import {
  DEFAULT_MODEL,
  getGroqKey,
  getGroqModel,
  GROQ_ENDPOINT,
  GROQ_MODELS,
  saveGroqKey,
  saveGroqModel,
  testGroq,
} from '../lib/ai';
import { hapticTap } from '../lib/haptics';

export default function AiSettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = useStyles(colors);

  const [key, setKey] = useState('');
  const [model, setModel] = useState(DEFAULT_MODEL);
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  useEffect(() => {
    (async () => {
      setKey(await getGroqKey());
      setModel(await getGroqModel());
    })();
  }, []);

  const runTest = async () => {
    hapticTap();
    setTesting(true);
    setResult(null);
    await saveGroqKey(key);
    await saveGroqModel(model);
    const r = await testGroq();
    setResult(r);
    setTesting(false);
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}>
      <Container style={{ marginTop: insets.top }}>
        <BackBar title="AI Connection" onBack={() => router.back()} />

        <FadeIn>
          <Text style={styles.title}>Connect Pixel AI to Groq</Text>
          <Text style={styles.lede}>
            Pixel AI runs on a built-in assistant today. Add a Groq API key and it upgrades to a
            full large-language model — smarter answers, product recommendations, ordering help.
          </Text>
        </FadeIn>

        <FadeIn delay={90}>
          <View style={styles.card}>
            <Text style={styles.fieldLabel}>Groq API key</Text>
            <TextInput
              value={key}
              onChangeText={setKey}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="gsk_…"
              placeholderTextColor={colors.muted}
              secureTextEntry
              style={[styles.field, { backgroundColor: colors.surface, borderColor: colors.hairline, color: colors.text }]}
            />
            <Text style={styles.hint}>
              Get a free key at console.groq.com → API Keys. It is stored on this device only and
              never sent anywhere except Groq when Pixel AI answers.
            </Text>

            <Text style={[styles.fieldLabel, { marginTop: sp.x4 }]}>Model</Text>
            <View style={{ gap: 8 }}>
              {GROQ_MODELS.map((m) => {
                const active = model === m.id;
                return (
                  <Pressable
                    key={m.id}
                    onPress={() => {
                      hapticTap();
                      setModel(m.id);
                    }}
                    style={[
                      styles.modelRow,
                      {
                        backgroundColor: active ? colors.limeDim : colors.surface,
                        borderColor: active ? colors.lime : colors.hairline,
                      },
                    ]}>
                    <Ionicons
                      name={active ? 'radio-button-on' : 'radio-button-off'}
                      size={18}
                      color={active ? colors.text : colors.muted}
                    />
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.modelName, { color: colors.text }]}>{m.label}</Text>
                      <Text style={styles.modelId}>{m.id}</Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>

            <View style={{ marginTop: sp.x4 }}>
              <Button title={testing ? 'Testing…' : 'Save & test connection'} onPress={runTest} disabled={testing} />
            </View>

            {testing && (
              <View style={styles.resultRow}>
                <ActivityIndicator size="small" color={colors.muted} />
                <Text style={[styles.resultText, { color: colors.muted }]}>Contacting Groq…</Text>
              </View>
            )}
            {result && !testing && (
              <View style={styles.resultRow}>
                <Ionicons
                  name={result.ok ? 'checkmark-circle' : 'alert-circle'}
                  size={17}
                  color={result.ok ? colors.lime : '#F87171'}
                />
                <Text style={[styles.resultText, { color: result.ok ? colors.text : '#F87171' }]}>
                  {result.ok ? `Connected — Pixel AI now answers via Groq.` : result.message}
                </Text>
              </View>
            )}
          </View>
        </FadeIn>

        <FadeIn delay={160}>
          <View style={[styles.techCard, { backgroundColor: colors.surface, borderColor: colors.hairline }]}>
            <Text style={styles.techTitle}>Endpoint</Text>
            <Text style={styles.techCode}>{GROQ_ENDPOINT}</Text>
            <Text style={[styles.techNote, { color: colors.muted }]}>
              OpenAI-compatible chat completions. The owner dashboard will manage this key remotely
              once the backend is live.
            </Text>
          </View>
        </FadeIn>
      </Container>
    </ScrollView>
  );
}

function useStyles(colors: Palette) {
  return {
    title: { fontFamily: fonts.semi, fontSize: 30, letterSpacing: -0.8, color: colors.text, marginTop: sp.x4 },
    lede: { fontFamily: fonts.regular, fontSize: 15, lineHeight: 23, color: colors.subtext, marginTop: sp.x2_, maxWidth: 560 },
    card: {
      marginTop: sp.x4,
      backgroundColor: colors.bg,
      borderRadius: radius.xl,
      borderWidth: 1,
      borderColor: colors.hairline,
      padding: sp.x4,
    },
    fieldLabel: { fontFamily: fonts.semi, fontSize: 14, color: colors.text, marginBottom: 8 },
    field: {
      borderWidth: 1,
      borderRadius: radius.md,
      paddingHorizontal: 14,
      paddingVertical: 13,
      fontFamily: fonts.regular,
      fontSize: 15,
    },
    hint: { fontFamily: fonts.regular, fontSize: 12.5, lineHeight: 18, color: colors.muted, marginTop: 8 },
    modelRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      borderRadius: radius.md,
      borderWidth: 1,
      paddingHorizontal: 14,
      paddingVertical: 12,
    },
    modelName: { fontFamily: fonts.semi, fontSize: 14 },
    modelId: { fontFamily: fonts.regular, fontSize: 11.5, color: colors.muted, marginTop: 1 },
    resultRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: sp.x3 },
    resultText: { flex: 1, fontFamily: fonts.medium, fontSize: 13.5 },
    techCard: { marginTop: sp.x4, borderRadius: radius.lg, borderWidth: 1, padding: sp.x3 },
    techTitle: { fontFamily: fonts.semi, fontSize: 12, letterSpacing: 1.2, textTransform: 'uppercase', color: colors.muted },
    techCode: { fontFamily: 'monospace', fontSize: 12.5, color: colors.text, marginTop: 6 },
    techNote: { fontFamily: fonts.regular, fontSize: 12.5, lineHeight: 18, marginTop: 8 },
  } as any;
}
