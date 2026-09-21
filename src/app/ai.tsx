import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
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

import { BackBar, Container } from '../components/ui';
import { fonts, Palette, radius, sp, useTheme } from '../constants/theme';
import { AiChip, aiRespond, greeting } from '../lib/assistant';
import { askGroq, getGroqKey } from '../lib/ai';

type Msg = {
  id: number;
  from: 'ai' | 'user';
  text: string;
  chips?: AiChip[];
};

let nextId = 1;

export default function AiScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const [messages, setMessages] = useState<Msg[]>([
    { id: nextId++, from: 'ai', text: greeting.text, chips: greeting.chips },
  ]);
  const [draft, setDraft] = useState('');
  const [typing, setTyping] = useState(false);
  const [groqEnabled, setGroqEnabled] = useState(false);
  const list = useRef<ScrollView>(null);

  useEffect(() => {
    setTimeout(() => list.current?.scrollToEnd({ animated: true }), 60);
  }, [messages, typing]);

  // Reflect whether Pixel AI is currently wired to Groq.
  useEffect(() => {
    let live = true;
    getGroqKey().then((k) => live && setGroqEnabled(!!k));
    return () => {
      live = false;
    };
  });

  const send = async (text: string) => {
    const clean = text.trim();
    if (!clean || typing) return;
    const userMsg: Msg = { id: nextId++, from: 'user', text: clean };
    setMessages((prev) => [...prev, userMsg]);
    setDraft('');
    setTyping(true);

    // Prefer Groq when the owner has connected a key; fall back to the
    // built-in assistant on any failure so Pixel AI never goes silent.
    const key = await getGroqKey();
    if (key) {
      try {
        const history = [...messages, userMsg].slice(-12).map((m) => ({
          role: (m.from === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
          content: m.text,
        }));
        const replyText = await askGroq(history);
        setTyping(false);
        setMessages((prev) => [...prev, { id: nextId++, from: 'ai', text: replyText }]);
        return;
      } catch {
        /* fall through to the local assistant */
      }
    }

    setTimeout(() => {
      const reply = aiRespond(clean);
      setTyping(false);
      setMessages((prev) => [...prev, { id: nextId++, from: 'ai', text: reply.text, chips: reply.chips }]);
    }, 850);
  };

  const onChip = (chip: AiChip) => {
    if (chip.route) {
      router.push(chip.route as any);
    } else if (chip.reply) {
      send(chip.reply);
    }
  };

  const lastAiId = [...messages].reverse().find((m) => m.from === 'ai')?.id;

  return (
    <KeyboardAvoidingView
      style={[styles.screen, { backgroundColor: colors.bg }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {/* Header */}
      <Container style={{ marginTop: insets.top + sp.x2 }}>
        <View style={styles.head}>
          <BackBar onBack={() => router.back()} />
          <View style={styles.headCenter}>
            <View style={[styles.aiAvatar, { backgroundColor: colors.lime }]}>
              <Ionicons name="sparkles" size={17} color={colors.onLime} />
            </View>
            <View>
              <Text style={[styles.headTitle, { color: colors.text }]}>Pixel AI</Text>
              <View style={styles.onlineRow}>
                <View style={[styles.onlineDot, { backgroundColor: colors.lime }]} />
                <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: colors.muted }}>
                  {groqEnabled ? 'Powered by Groq' : 'Always here'}
                </Text>
              </View>
            </View>
          </View>
          <Pressable
            onPress={() => router.push('/ai-settings' as any)}
            hitSlop={8}
            style={styles.settingsBtn}
            accessibilityLabel="AI connection settings">
            <Ionicons name="settings-outline" size={19} color={colors.text} />
          </Pressable>
        </View>
      </Container>

      {/* Messages */}
      <ScrollView
        ref={list}
        contentContainerStyle={{ paddingVertical: sp.x3 }}
        showsVerticalScrollIndicator={false}>
        <Container style={{ gap: sp.x2_ }}>
          {messages.map((m) => (
            <View key={m.id}>
              <View
                style={[
                  styles.bubble,
                  m.from === 'ai' ? styles.bubbleAi : styles.bubbleUser,
                  m.from === 'user' && { backgroundColor: colors.lime },
                ]}>
                <Text
                  style={[
                    styles.bubbleText,
                    { color: colors.text },
                    m.from === 'user' && { color: colors.onLime },
                  ]}>
                  {m.text}
                </Text>
              </View>

              {/* Action chips under the latest AI message */}
              {m.from === 'ai' && m.chips && m.id === lastAiId && !typing && (
                <View style={styles.chipRow}>
                  {m.chips.map((chip) => (
                    <Pressable key={chip.label} onPress={() => onChip(chip)} style={styles.chip}>
                      {chip.route ? (
                        <Ionicons name="arrow-forward" size={13} color={colors.isDark ? colors.lime : '#5E8A0D'} />
                      ) : null}
                      <Text style={styles.chipText}>{chip.label}</Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>
          ))}

          {typing && (
            <View style={[styles.bubble, styles.bubbleAi, { flexDirection: 'row', gap: 5 }]}>
              {[0, 1, 2].map((i) => (
                <TypingDot key={i} delay={i * 180} />
              ))}
            </View>
          )}
        </Container>
      </ScrollView>

      {/* Input */}
      <View style={[styles.inputBar, { paddingBottom: Math.max(insets.bottom, 12), borderColor: colors.hairline }]}>
        <Container style={{ flexDirection: 'row', alignItems: 'flex-end', gap: sp.x2_ }}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Ask about products, pricing, branding…"
            placeholderTextColor={colors.muted}
            style={[styles.input, { borderColor: colors.hairline, backgroundColor: colors.surface, color: colors.text }]}
            multiline
            onSubmitEditing={() => send(draft)}
          />
          <Pressable
            onPress={() => send(draft)}
            style={[styles.sendBtn, { backgroundColor: draft.trim() ? colors.lime : colors.surface2 }]}>
            <Ionicons
              name="arrow-up"
              size={20}
              color={draft.trim() ? colors.onLime : colors.muted}
            />
          </Pressable>
        </Container>
      </View>
    </KeyboardAvoidingView>
  );
}

function TypingDot({ delay }: { delay: number }) {
  const { colors } = useTheme();
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(v, { toValue: 1, duration: 240, useNativeDriver: true }),
        Animated.timing(v, { toValue: 0, duration: 240, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [delay, v]);
  const op = v.interpolate({ inputRange: [0, 1], outputRange: [0.25, 1] });
  return (
    <Animated.View
      style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: colors.subtext, opacity: op }}
    />
  );
}

function useStyles(colors: Palette) {
  return StyleSheet.create({
    screen: { flex: 1 },
    head: { flexDirection: 'row', alignItems: 'center' },
    headCenter: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: sp.x2_, marginLeft: sp.x2_ },
    aiAvatar: {
      width: 38,
      height: 38,
      borderRadius: 13,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headTitle: { fontFamily: fonts.semi, fontSize: 16 },
    onlineRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 1 },
    onlineDot: { width: 6, height: 6, borderRadius: 3 },
    settingsBtn: {
      width: 40,
      height: 40,
      borderRadius: radius.sm,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.hairline,
      alignItems: 'center',
      justifyContent: 'center',
    },
    bubble: {
      maxWidth: '85%',
      borderRadius: radius.lg,
      paddingHorizontal: 18,
      paddingVertical: 14,
    },
    bubbleAi: {
      alignSelf: 'flex-start',
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.hairline,
      borderBottomLeftRadius: 6,
    },
    bubbleUser: {
      alignSelf: 'flex-end',
      borderBottomRightRadius: 6,
    },
    bubbleText: { fontFamily: fonts.regular, fontSize: 15.5, lineHeight: 23 },
    chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: sp.x1, marginTop: sp.x2_, maxWidth: '92%' },
    chip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 15,
      paddingVertical: 10,
      borderRadius: 999,
      backgroundColor: colors.limeDim,
      borderWidth: 1,
      borderColor: colors.isDark ? 'rgba(191,245,73,0.3)' : 'rgba(120,180,20,0.35)',
    },
    chipText: { fontFamily: fonts.medium, fontSize: 13.5, color: colors.text },
    inputBar: {
      borderTopWidth: StyleSheet.hairlineWidth,
      backgroundColor: colors.bg,
      paddingTop: sp.x2_,
    },
    input: {
      flex: 1,
      borderWidth: 1,
      borderRadius: radius.md,
      paddingHorizontal: 18,
      paddingVertical: 13,
      fontFamily: fonts.regular,
      fontSize: 15.5,
      maxHeight: 100,
    },
    sendBtn: {
      width: 46,
      height: 46,
      borderRadius: 23,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
}
