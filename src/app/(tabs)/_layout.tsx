import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { fonts, isWeb, useTheme } from '../../constants/theme';

const tabs = [
  { name: 'index', label: 'Home', icon: 'home-outline', activeIcon: 'home' },
  { name: 'services', label: 'Services', icon: 'apps-outline', activeIcon: 'apps' },
  { name: 'shop', label: 'Shop', icon: 'bag-outline', activeIcon: 'bag' },
  { name: 'orders', label: 'Orders', icon: 'receipt-outline', activeIcon: 'receipt' },
  { name: 'profile', label: 'Profile', icon: 'person-outline', activeIcon: 'person' },
];

const ITEM_W = 58;
const BAR_H = 64;

/* -------------------------------- Glass bar -------------------------------- */

function GlassBar({ index, onNavigate }: { index: number; onNavigate: (name: string) => void }) {
  const { colors, isDark } = useTheme();
  const anim = useRef(new Animated.Value(index)).current;

  useEffect(() => {
    // Gentle, calm slide — no bounce.
    Animated.timing(anim, { toValue: index, duration: 260, useNativeDriver: true }).start();
  }, [index, anim]);

  const translateX = anim.interpolate({
    inputRange: [0, tabs.length - 1],
    outputRange: [0, (tabs.length - 1) * ITEM_W],
  });

  const glassInner = (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        height: BAR_H,
        paddingHorizontal: 8,
      }}>
      {/* sliding indicator */}
      <Animated.View
        style={{
          position: 'absolute',
          left: 8 + 5,
          width: ITEM_W - 10,
          height: 46,
          borderRadius: 15,
          backgroundColor: colors.limeDim,
          transform: [{ translateX }],
        }}
      />
      {tabs.map((tab, i) => {
        const focused = index === i;
        return (
          <Pressable
            key={tab.name}
            onPress={() => onNavigate(tab.name)}
            style={{ width: ITEM_W, height: BAR_H, alignItems: 'center', justifyContent: 'center' }}
            accessibilityLabel={tab.label}>
            <Ionicons
              name={focused ? (tab.activeIcon as any) : (tab.icon as any)}
              size={22}
              color={focused ? colors.text : colors.muted}
            />
            <View
              style={{
                width: 4,
                height: 4,
                borderRadius: 2,
                marginTop: 5,
                backgroundColor: focused ? colors.lime : 'transparent',
              }}
            />
          </Pressable>
        );
      })}
    </View>
  );

  return (
    <View
      style={{
        borderRadius: 32,
        overflow: 'hidden',
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: colors.hairlineStrong,
        ...Platform.select({
          ios: {
            shadowColor: '#000',
            shadowOpacity: isDark ? 0.5 : 0.15,
            shadowRadius: 22,
            shadowOffset: { width: 0, height: 8 },
          },
          android: { elevation: 10 },
        }),
      }}>
      {isWeb ? (
        <View
          style={{
            backgroundColor: colors.navGlass,
            ...({ backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' } as any),
          }}>
          {glassInner}
        </View>
      ) : (
        <BlurView intensity={55} tint={isDark ? 'dark' : 'light'} style={{ overflow: 'hidden' }}>
          {glassInner}
        </BlurView>
      )}
    </View>
  );
}

/* ------------------------------ Ask AI button ------------------------------ */
/**
 * Floating Ask AI shortcut on the right. Every few seconds it gently expands
 * to reveal the "Ask AI" label, then quietly hides it again.
 */
function AskAiButton({ onPress }: { onPress: () => void }) {
  const { colors, isDark } = useTheme();
  const expand = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(2400),
        Animated.timing(expand, { toValue: 1, duration: 650, useNativeDriver: false }),
        Animated.delay(2600),
        Animated.timing(expand, { toValue: 0, duration: 650, useNativeDriver: false }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [expand]);

  const width = expand.interpolate({ inputRange: [0, 1], outputRange: [52, 132] });
  const labelOpacity = expand.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 0, 1] });

  return (
    <Animated.View style={{ width, height: 52, borderRadius: 26 }}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          StyleSheet.absoluteFill,
          styles.askAi,
          {
            backgroundColor: isDark ? 'rgba(20,20,22,0.78)' : 'rgba(255,255,255,0.88)',
            borderColor: isDark ? 'rgba(255,255,255,0.14)' : 'rgba(12,12,14,0.12)',
            opacity: pressed ? 0.85 : 1,
          },
        ]}>
        <Ionicons name="sparkles" size={19} color={colors.lime} />
        <Animated.Text style={[styles.askAiText, { color: colors.text, opacity: labelOpacity }]} numberOfLines={1}>
          Ask AI
        </Animated.Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  askAi: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 26,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.35, shadowRadius: 12, shadowOffset: { width: 0, height: 5 } },
      android: { elevation: 6 },
    }),
  },
  askAiText: { fontFamily: fonts.semi, fontSize: 14.5, width: 58, textAlign: 'left' },
});

/* ---------------------------------- Layout --------------------------------- */

export default function TabsLayout() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: 'transparent' } }}
      tabBar={(props) => {
        const { state, navigation } = props;
        const bottom = Math.max(insets.bottom, 12) + 10;
        return (
          <View pointerEvents="box-none" style={{ position: 'absolute', left: 0, right: 0, bottom }}>
            {/* Ask AI — floating on the right, above the bar */}
            <View
              pointerEvents="box-none"
              style={{
                position: 'absolute',
                top: -66,
                left: 20,
                right: 20,
                flexDirection: 'row',
                justifyContent: 'flex-end',
              }}>
              <AskAiButton onPress={() => router.push('/ai')} />
            </View>

            <View style={{ alignItems: 'center' }}>
              <GlassBar index={state.index} onNavigate={(name) => navigation.navigate(name)} />
            </View>
          </View>
        );
      }}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="services" />
      <Tabs.Screen name="shop" />
      <Tabs.Screen name="orders" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
