import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { fonts, isWeb, sp, useTheme } from '../../constants/theme';

const tabs = [
  { name: 'index', label: 'Home', icon: 'home-outline', activeIcon: 'home' },
  { name: 'services', label: 'Services', icon: 'apps-outline', activeIcon: 'apps' },
  { name: 'shop', label: 'Shop', icon: 'bag-outline', activeIcon: 'bag' },
  { name: 'orders', label: 'Orders', icon: 'receipt-outline', activeIcon: 'receipt' },
  { name: 'profile', label: 'Profile', icon: 'person-outline', activeIcon: 'person' },
];

const ITEM_W = 58;
const BAR_H = 66;

function LiquidBar({
  index,
  onNavigate,
  onStart,
  onAi,
}: {
  index: number;
  onNavigate: (name: string) => void;
  onStart: () => void;
  onAi: () => void;
}) {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const anim = useRef(new Animated.Value(index)).current;
  const pressScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Liquid spring — slight overshoot gives the blob its settle.
    Animated.spring(anim, {
      toValue: index,
      useNativeDriver: true,
      damping: 13,
      stiffness: 170,
      mass: 0.9,
    }).start();
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
          height: 48,
          borderRadius: 16,
          backgroundColor: colors.limeDim,
          borderWidth: 1,
          borderColor: isDark ? 'rgba(191,245,73,0.35)' : 'rgba(120,180,20,0.4)',
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
            <Animated.View
              style={{ transform: [{ scale: focused ? 1.06 : 1 }] }}>
              <Ionicons
                name={focused ? (tab.activeIcon as any) : (tab.icon as any)}
                size={22}
                color={focused ? colors.text : colors.muted}
              />
            </Animated.View>
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
      pointerEvents="box-none"
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: Math.max(insets.bottom, 12) + 10,
        alignItems: 'center',
      }}>
      {/* Floating AI + Start buttons */}
      <View
        pointerEvents="box-none"
        style={{
          position: 'absolute',
          top: -26,
          left: 24,
          right: 24,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Pressable
          onPress={onAi}
          style={[
            styles.fabGhost,
            {
              backgroundColor: isDark ? 'rgba(20,20,22,0.72)' : 'rgba(255,255,255,0.82)',
              borderColor: isDark ? 'rgba(255,255,255,0.14)' : 'rgba(12,12,14,0.12)',
            },
          ]}>
          <Ionicons name="sparkles" size={19} color={colors.lime} />
          <Text style={{ fontFamily: fonts.semi, fontSize: 12.5, color: colors.text, marginLeft: 6 }}>
            Pixel AI
          </Text>
        </Pressable>
        <Animated.View style={{ transform: [{ scale: pressScale }] }}>
          <Pressable
            onPress={onStart}
            onPressIn={() =>
              Animated.spring(pressScale, { toValue: 0.9, useNativeDriver: true }).start()
            }
            onPressOut={() =>
              Animated.spring(pressScale, { toValue: 1, useNativeDriver: true }).start()
            }
            style={[styles.fabLime, { backgroundColor: colors.lime }]}>
            <Ionicons name="add" size={28} color={colors.onLime} />
          </Pressable>
        </Animated.View>
      </View>

      {/* Glass pill */}
      <View
        style={{
          borderRadius: 33,
          overflow: 'hidden',
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.hairlineStrong,
          ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOpacity: isDark ? 0.55 : 0.18,
              shadowRadius: 24,
              shadowOffset: { width: 0, height: 10 },
            },
            android: { elevation: 12 },
          }),
        }}>
        {isWeb ? (
          <View
            style={{
              backgroundColor: colors.navGlass,
              ...( { backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' } as any),
            }}>
            {glassInner}
          </View>
        ) : (
          <BlurView intensity={55} tint={isDark ? 'dark' : 'light'} style={{ overflow: 'hidden' }}>
            {glassInner}
          </BlurView>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fabLime: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.4, shadowRadius: 14, shadowOffset: { width: 0, height: 6 } },
      android: { elevation: 8 },
    }),
  },
  fabGhost: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 42,
    borderRadius: 21,
    paddingHorizontal: 16,
    borderWidth: StyleSheet.hairlineWidth,
  },
});

export default function TabsLayout() {
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: 'transparent' } }}
      tabBar={(props) => {
        const { state, navigation } = props;
        return (
          <LiquidBar
            index={state.index}
            onNavigate={(name) => navigation.navigate(name)}
            onStart={() => router.push('/start')}
            onAi={() => router.push('/ai')}
          />
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
