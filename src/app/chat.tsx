import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackBar, Container, LogoMark } from '../components/ui';
import { colors, fonts, radius, sp } from '../constants/theme';

type Msg = { id: number; from: 'studio' | 'me'; text: string };

const initialMessages: Msg[] = [
  { id: 1, from: 'studio', text: 'Hi Amina! 👋 Welcome to Pixel Studios. How can we help you today?' },
  { id: 2, from: 'me', text: 'Hi! I need 2 NFC business cards and 200 premium business cards.' },
  { id: 3, from: 'studio', text: 'Great choice. Here is your quotation:\n\nNFC Business Card × 2 — ₦50,000\nPremium Business Cards × 200 — ₦30,000\n\nTotal: ₦80,000\nDelivery: 5–7 working days.' },
  { id: 4, from: 'me', text: 'Perfect. Let’s go ahead.' },
  { id: 5, from: 'studio', text: 'Wonderful! We have created order #PS-2847. You can track it anytime in the Orders tab.' },
];

export default function ChatScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<Msg[]>(initialMessages);
  const [draft, setDraft] = useState('');

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { id: Date.now(), from: 'me', text }]);
    setDraft('');
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          from: 'studio',
          text: 'Thanks for your message! A member of the studio will reply shortly. For urgent requests call us directly.',
        },
      ]);
    }, 900);
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Container style={{ marginTop: insets.top + sp.x1 }}>
        <View style={styles.head}>
          <BackBar onBack={() => router.back()} />
          <View style={styles.headInfo}>
            <LogoMark size={16} />
            <View>
              <Text style={styles.headTitle}>Pixel Studios</Text>
              <View style={styles.onlineRow}>
                <View style={styles.onlineDot} />
                <Text style={styles.onlineText}>Online now</Text>
              </View>
            </View>
          </View>
          <View style={{ width: 40 }} />
        </View>
      </Container>

      <ScrollView
        contentContainerStyle={{ paddingVertical: sp.x3 }}
        showsVerticalScrollIndicator={false}>
        <Container style={{ gap: sp.x2_ }}>
          {messages.map((m) => (
            <View
              key={m.id}
              style={[
                styles.bubble,
                m.from === 'me' ? styles.bubbleMe : styles.bubbleStudio,
              ]}>
              <Text style={[styles.bubbleText, m.from === 'me' && styles.bubbleTextMe]}>
                {m.text}
              </Text>
            </View>
          ))}
        </Container>
      </ScrollView>

      <View style={[styles.inputBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <Container style={{ flexDirection: 'row', alignItems: 'center', gap: sp.x2_ }}>
          <Pressable style={styles.attachBtn}>
            <Ionicons name="attach-outline" size={20} color={colors.subtext} />
          </Pressable>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Ask a question, discuss a project…"
            placeholderTextColor={colors.muted}
            style={styles.input}
            multiline
            onSubmitEditing={send}
          />
          <Pressable style={styles.sendBtn} onPress={send}>
            <Ionicons name="arrow-up" size={20} color={colors.onLime} />
          </Pressable>
        </Container>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  head: { flexDirection: 'row', alignItems: 'center' },
  headInfo: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: sp.x2_ },
  headTitle: { fontFamily: fonts.semi, fontSize: 15.5, color: colors.text },
  onlineRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 },
  onlineDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.lime },
  onlineText: { fontFamily: fonts.regular, fontSize: 12, color: colors.muted },
  bubble: {
    maxWidth: '82%',
    borderRadius: radius.lg,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  bubbleStudio: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.hairline,
    borderBottomLeftRadius: 6,
  },
  bubbleMe: {
    alignSelf: 'flex-end',
    backgroundColor: colors.lime,
    borderBottomRightRadius: 6,
  },
  bubbleText: { fontFamily: fonts.regular, fontSize: 15.5, lineHeight: 23, color: colors.text },
  bubbleTextMe: { color: colors.onLime },
  inputBar: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.hairline,
    backgroundColor: colors.bg,
    paddingTop: sp.x2_,
  },
  attachBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.hairline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: radius.md,
    paddingHorizontal: 18,
    paddingVertical: 13,
    color: colors.text,
    fontFamily: fonts.regular,
    fontSize: 15.5,
    maxHeight: 100,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.lime,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
