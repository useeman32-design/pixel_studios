import { Ionicons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import { Animated, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useRef } from 'react';

import { colors, fonts } from '../../constants/theme';

const tabs = [
  { name: 'index', label: 'Home', icon: 'home-outline', activeIcon: 'home' },
  { name: 'services', label: 'Services', icon: 'apps-outline', activeIcon: 'apps' },
  { name: 'shop', label: 'Shop', icon: 'bag-outline', activeIcon: 'bag' },
  { name: 'orders', label: 'Orders', icon: 'receipt-outline', activeIcon: 'receipt' },
  { name: 'profile', label: 'Profile', icon: 'person-outline', activeIcon: 'person' },
];

function TabButton({
  label,
  icon,
  activeIcon,
  focused,
  onPress,
}: {
  label: string;
  icon: any;
  activeIcon: any;
  focused: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 4, paddingTop: 6 }}>
      <Ionicons
        name={focused ? activeIcon : icon}
        size={22}
        color={focused ? colors.text : colors.muted}
      />
      <Text
        style={{
          fontFamily: fonts.medium,
          fontSize: 10.5,
          letterSpacing: 0.3,
          color: focused ? colors.text : colors.muted,
        }}>
        {label}
      </Text>
      <View
        style={{
          width: 4,
          height: 4,
          borderRadius: 2,
          backgroundColor: focused ? colors.lime : 'transparent',
        }}
      />
    </Pressable>
  );
}

function StartButton({ onPress }: { onPress: () => void }) {
  const scale = useRef(new Animated.Value(1)).current;
  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        onPress={onPress}
        onPressIn={() => Animated.spring(scale, { toValue: 0.92, useNativeDriver: true }).start()}
        onPressOut={() => Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start()}
        style={{
          position: 'absolute',
          right: 20,
          top: -28,
          width: 58,
          height: 58,
          borderRadius: 29,
          backgroundColor: colors.lime,
          alignItems: 'center',
          justifyContent: 'center',
          ...Platform.select({
            ios: { shadowColor: '#000', shadowOpacity: 0.4, shadowRadius: 12, shadowOffset: { width: 0, height: 6 } },
            android: { elevation: 8 },
          }),
        }}>
        <Ionicons name="add" size={30} color={colors.onLime} />
      </Pressable>
    </Animated.View>
  );
}

export default function TabsLayout() {
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: colors.bg } }}
      tabBar={(props) => {
        const { state, navigation } = props;
        return (
          <View>
            <StartButton onPress={() => router.push('/start')} />
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: colors.bg,
                borderTopWidth: StyleSheet.hairlineWidth,
                borderTopColor: colors.hairline,
                height: Platform.OS === 'ios' ? 86 : 64,
                paddingBottom: Platform.OS === 'ios' ? 24 : 8,
              }}>
              {tabs.map((tab) => {
                const index = state.routes.findIndex((r) => r.name === tab.name);
                const focused = state.index === index;
                return (
                  <TabButton
                    key={tab.name}
                    label={tab.label}
                    icon={tab.icon}
                    activeIcon={tab.activeIcon}
                    focused={focused}
                    onPress={() => navigation.navigate(tab.name)}
                  />
                );
              })}
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
