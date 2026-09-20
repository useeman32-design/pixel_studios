import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Image,
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

type Employee = {
  id: string;
  name: string;
  rank: string;
  avatar: any;
  replies: string[];
};

const TEAM: Employee[] = [
  {
    id: 'aisha',
    name: 'Aisha Mohammed',
    rank: 'Customer Care Lead',
    avatar: require('../../assets/images/team/aisha.jpg'),
    replies: [
      "Noted! I'll get that processed for you right away. Anything else?",
      'Great question — delivery within Gusau is usually 24–48 hours after production.',
      "I've shared this with the team. You'll get a confirmation shortly!",
    ],
  },
  {
    id: 'musa',
    name: 'Musa Ibrahim',
    rank: 'Lead Designer',
    avatar: require('../../assets/images/team/musa.jpg'),
    replies: [
      "I can work on that design — please share any logos or colors you'd like used.",
      "I'll send you 2 concepts to pick from before we print. Sound good?",
      'Love that idea! Let me mock something up and send a preview here.',
    ],
  },
  {
    id: 'grace',
    name: 'Grace Danladi',
    rank: 'Production Manager',
    avatar: require('../../assets/images/team/grace.jpg'),
    replies: [
      "We'll start production as soon as your design is approved.",
      'The plastic PVC cards take 2–3 days; cardstock is faster — 1–2 days.',
      "I'll notify you the moment your order is ready. You can also pick it up at the studio.",
    ],
  },
];

type Msg = {
  id: number;
  from: 'me' | string; // employee id or 'me'
  text: string;
};

const initialMessages: Msg[] = [
  { id: 1, from: 'aisha', text: 'Hi! 👋 Welcome to Pixel Studios. Whoever is online will attend to you here — how can we help today?' },
  { id: 2, from: 'me', text: 'Hello! I want to order 2 smart cards and 200 business cards.' },
  { id: 3, from: 'musa', text: "Great choice! I'll handle the designs. Please share your logo and any brand colors you'd like." },
  { id: 4, from: 'grace', text: "And I'll schedule production once the designs are approved. PVC smart cards take 2–3 days." },
];

export default function ChatScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const [messages, setMessages] = useState<Msg[]>(initialMessages);
  const [draft, setDraft] = useState('');
  const [typing, setTyping] = useState<Employee | null>(null);
  const scrollRef = useRef<ScrollView>(null);
  const nextEmployee = useRef(0);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages, typing]);

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { id: Date.now(), from: 'me', text }]);
    setDraft('');

    // The next online employee responds.
    const emp = TEAM[nextEmployee.current % TEAM.length];
    nextEmployee.current += 1;
    setTimeout(() => setTyping(emp), 600);
    setTimeout(() => {
      setTyping(null);
      const reply = emp.replies[Math.floor(Math.random() * emp.replies.length)];
      setMessages((prev) => [...prev, { id: Date.now(), from: emp.id, text: reply }]);
    }, 2100);
  };

  const onlineNames = TEAM.map((t) => t.name.split(' ')[0]).join(', ');

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {/* Header — the whole team, one chat */}
      <Container style={{ marginTop: insets.top + sp.x3 }}>
        <View style={styles.head}>
          <BackBar onBack={() => router.back()} />
          <View style={styles.headInfo}>
            <View style={styles.avatarStack}>
              {TEAM.map((t, i) => (
                <Image
                  key={t.id}
                  source={t.avatar}
                  style={[styles.headAvatar, { marginLeft: i === 0 ? 0 : -10, zIndex: TEAM.length - i, borderColor: colors.bg }]}
                />
              ))}
            </View>
            <View>
              <Text style={{ fontFamily: fonts.semi, fontSize: 15.5, color: colors.text }}>Pixel Studios Team</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 }}>
                <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.lime }} />
                <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: colors.muted }} numberOfLines={1}>
                  {TEAM.length} online — {onlineNames}
                </Text>
              </View>
            </View>
          </View>
          <View style={{ width: 40 }} />
        </View>
      </Container>

      {/* Messages */}
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={{ paddingVertical: sp.x3 }}
        showsVerticalScrollIndicator={false}>
        <Container style={{ gap: sp.x3 }}>
          {messages.map((m) => {
            if (m.from === 'me') {
              return (
                <View key={m.id} style={[styles.bubble, styles.bubbleMe]}>
                  <Text style={[styles.bubbleText, { color: colors.onLime }]}>{m.text}</Text>
                </View>
              );
            }
            const emp = TEAM.find((t) => t.id === m.from)!;
            return (
              <View key={m.id} style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-end' }}>
                <Image source={emp.avatar} style={styles.msgAvatar} />
                <View style={{ flexShrink: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6, marginBottom: 4 }}>
                    <Text style={{ fontFamily: fonts.semi, fontSize: 13, color: colors.text }}>{emp.name}</Text>
                    <Text style={{ fontFamily: fonts.bold, fontSize: 9, letterSpacing: 1.2, color: colors.isDark ? colors.lime : '#5E8A0D' }}>
                      {emp.rank.toUpperCase()}
                    </Text>
                  </View>
                  <View style={[styles.bubble, styles.bubbleStudio]}>
                    <Text style={[styles.bubbleText, { color: colors.text }]}>{m.text}</Text>
                  </View>
                </View>
              </View>
            );
          })}

          {typing && (
            <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
              <Image source={typing.avatar} style={styles.msgAvatar} />
              <View style={[styles.bubble, styles.bubbleStudio, { flexDirection: 'row', gap: 5, alignItems: 'center' }]}>
                <Text style={{ fontFamily: fonts.medium, fontSize: 12.5, color: colors.subtext }}>
                  {typing.name.split(' ')[0]} is typing
                </Text>
                <Text style={{ color: colors.subtext }}>…</Text>
              </View>
            </View>
          )}
        </Container>
      </ScrollView>

      {/* Input */}
      <View style={[styles.inputBar, { paddingBottom: Math.max(insets.bottom, 12), borderColor: colors.hairline }]}>
        <Container style={{ flexDirection: 'row', alignItems: 'center', gap: sp.x2_ }}>
          <Pressable style={styles.attachBtn}>
            <Ionicons name="attach-outline" size={20} color={colors.subtext} />
          </Pressable>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Message the team…"
            placeholderTextColor={colors.muted}
            style={styles.input}
            multiline
            onSubmitEditing={send}
          />
          <Pressable style={[styles.sendBtn, { backgroundColor: colors.lime }]} onPress={send}>
            <Ionicons name="arrow-up" size={20} color={colors.onLime} />
          </Pressable>
        </Container>
      </View>
    </KeyboardAvoidingView>
  );
}

function useStyles(colors: Palette) {
  return StyleSheet.create({
    head: { flexDirection: 'row', alignItems: 'center' },
    headInfo: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: sp.x2_, marginLeft: sp.x2_ },
    avatarStack: { flexDirection: 'row' },
    headAvatar: {
      width: 34,
      height: 34,
      borderRadius: 17,
      borderWidth: 2,
    },
    msgAvatar: { width: 32, height: 32, borderRadius: 16 },
    bubble: { maxWidth: '100%', borderRadius: radius.lg, paddingHorizontal: 16, paddingVertical: 12 },
    bubbleStudio: {
      alignSelf: 'flex-start',
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.hairline,
      borderBottomLeftRadius: 6,
      maxWidth: '88%',
    },
    bubbleMe: { alignSelf: 'flex-end', backgroundColor: colors.lime, borderBottomRightRadius: 6, maxWidth: '82%' },
    bubbleText: { fontFamily: fonts.regular, fontSize: 15, lineHeight: 22 },
    inputBar: {
      borderTopWidth: StyleSheet.hairlineWidth,
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
    sendBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  });
}
