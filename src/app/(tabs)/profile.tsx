import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Container, FadeIn, RowItem } from '../../components/ui';
import { fonts, Palette, radius, sp, useTheme } from '../../constants/theme';

const avatarImage = require('../../../assets/images/avatar.jpg');

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, isDark, toggleTheme } = useTheme();
  const styles = useStyles(colors);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={{ paddingBottom: 140 }}
      showsVerticalScrollIndicator={false}>
      <Container style={{ marginTop: insets.top + sp.x4 }}>
        <FadeIn>
          <View style={styles.head}>
            <Image source={avatarImage} style={styles.avatar} />
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>Amina Bello</Text>
              <Text style={styles.meta}>amina@aureliahomes.ng · 0803 000 0000</Text>
            </View>
            <Pressable onPress={toggleTheme} style={styles.themeBtn} hitSlop={8}>
              <Ionicons
                name={isDark ? 'sunny-outline' : 'moon-outline'}
                size={19}
                color={colors.text}
              />
            </Pressable>
          </View>
        </FadeIn>

        <FadeIn delay={100}>
          <View style={{ marginTop: sp.x5 }}>
            <RowItem icon="receipt-outline" label="My Orders" onPress={() => router.push('/orders')} />
            <RowItem icon="folder-open-outline" label="My Projects" onPress={() => router.push('/start')} />
            <RowItem icon="bookmark-outline" label="Saved Designs" onPress={() => router.push('/portfolio')} />
            <RowItem icon="card-outline" label="Digital Profile" onPress={() => router.push('/nfc-profile')} />
            <RowItem icon="sparkles-outline" label="Pixel AI Assistant" onPress={() => router.push('/ai')} />
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

        <FadeIn delay={160}>
          <Text style={styles.version}>Pixel Studios · v2.0.0</Text>
        </FadeIn>
      </Container>
    </ScrollView>
  );
}

function useStyles(colors: Palette) {
  return useMemo(
    () =>
      StyleSheet.create({
        head: { flexDirection: 'row', alignItems: 'center', gap: sp.x3 },
        avatar: { width: 72, height: 72, borderRadius: radius.lg, backgroundColor: colors.surface },
        name: { fontFamily: fonts.semi, fontSize: 24, letterSpacing: -0.4, color: colors.text },
        meta: { fontFamily: fonts.regular, fontSize: 13.5, color: colors.muted, marginTop: 3 },
        themeBtn: {
          width: 42,
          height: 42,
          borderRadius: radius.sm,
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.hairline,
          alignItems: 'center',
          justifyContent: 'center',
        },
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
