import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors, fonts, radius, MAX_CONTENT_WIDTH, isWeb } from '../constants/theme';

/* ---------------------------------- FadeIn --------------------------------- */

export function FadeIn({
  children,
  delay = 0,
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  style?: ViewStyle;
}) {
  const opacity = useRef(new Animated.Value(0)).current;
  const y = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    const t = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 480, useNativeDriver: true }),
        Animated.timing(y, { toValue: 0, duration: 480, useNativeDriver: true }),
      ]).start();
    }, delay);
    return () => clearTimeout(t);
  }, [delay, opacity, y]);

  return (
    <Animated.View style={[{ opacity, transform: [{ translateY: y }] }, style]}>
      {children}
    </Animated.View>
  );
}

/* -------------------------------- Container -------------------------------- */

export function Container({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return <View style={[styles.container, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    maxWidth: MAX_CONTENT_WIDTH,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 24,
  },
});

/* ----------------------------------- Logo ---------------------------------- */
/** The Pixel Studios mark: a P drawn from a grid of pixels. */
export function LogoMark({ size = 30, accent = colors.lime }: { size?: number; accent?: string }) {
  // 4 cols x 6 rows — cells that form a "P"
  const P = [
    [1, 1, 1, 0],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 0],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
  ];
  const cell = size / 5;
  const gap = cell * 0.28;
  return (
    <View style={{ width: size, height: (size / 5) * 6 * 0.86 }}>
      {P.map((row, r) => (
        <View key={r} style={{ flexDirection: 'row' }}>
          {row.map((on, c) => {
            const isAccent = r === 5 && c === 0;
            return (
              <View
                key={c}
                style={{
                  width: cell - gap,
                  height: cell - gap,
                  borderRadius: (cell - gap) * 0.3,
                  marginRight: gap,
                  marginBottom: gap,
                  backgroundColor: on ? (isAccent ? accent : colors.text) : 'transparent',
                }}
              />
            );
          })}
        </View>
      ))}
    </View>
  );
}

export function Wordmark({ size = 13 }: { size?: number }) {
  return (
    <Text
      style={{
        fontFamily: fonts.bold,
        fontSize: size,
        letterSpacing: 3.2,
        color: colors.text,
      }}>
      PIXEL STUDIOS
    </Text>
  );
}

/* ---------------------------------- Button --------------------------------- */

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline';

export function Button({
  title,
  onPress,
  variant = 'primary',
  icon,
  href,
  style,
  full = true,
  disabled,
}: {
  title: string;
  onPress?: () => void;
  variant?: Variant;
  icon?: keyof typeof Ionicons.glyphMap;
  href?: string;
  style?: ViewStyle;
  full?: boolean;
  disabled?: boolean;
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const pressIn = () => Animated.spring(scale, { toValue: 0.97, useNativeDriver: true }).start();
  const pressOut = () => Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();

  const handle = () => {
    if (disabled) return;
    if (href) {
      Linking.openURL(href);
      return;
    }
    onPress?.();
  };

  const base: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 17,
    paddingHorizontal: 28,
    borderRadius: radius.md,
    ...(full ? {} : { alignSelf: 'flex-start' }),
  };

  const variants: Record<Variant, ViewStyle> = {
    primary: { backgroundColor: colors.lime },
    secondary: { backgroundColor: colors.surface2 },
    ghost: { backgroundColor: 'transparent' },
    outline: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.hairlineStrong },
  };

  const textStyles: Record<Variant, TextStyle> = {
    primary: { color: colors.onLime, fontFamily: fonts.semi, fontSize: 16 },
    secondary: { color: colors.text, fontFamily: fonts.semi, fontSize: 16 },
    ghost: { color: colors.text, fontFamily: fonts.semi, fontSize: 16 },
    outline: { color: colors.text, fontFamily: fonts.semi, fontSize: 16 },
  };

  return (
    <Animated.View style={{ transform: [{ scale }], ...(full ? {} : { alignSelf: 'flex-start' }) }}>
      <Pressable
        onPress={handle}
        onPressIn={pressIn}
        onPressOut={pressOut}
        style={[base, variants[variant], disabled && { opacity: 0.4 }, style]}>
        {icon && (
          <Ionicons
            name={icon}
            size={18}
            color={variant === 'primary' ? colors.onLime : colors.text}
          />
        )}
        <Text style={textStyles[variant]}>{title}</Text>
      </Pressable>
    </Animated.View>
  );
}

/* ----------------------------------- Chip ---------------------------------- */

export function Chip({
  label,
  active,
  onPress,
}: {
  label: string;
  active?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: radius.md,
        backgroundColor: active ? colors.text : colors.surface,
        borderWidth: 1,
        borderColor: active ? colors.text : colors.hairline,
      }}>
      <Text
        style={{
          fontFamily: fonts.medium,
          fontSize: 14,
          color: active ? colors.bg : colors.subtext,
        }}>
        {label}
      </Text>
    </Pressable>
  );
}

/* ---------------------------------- Stepper -------------------------------- */

export function Stepper({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const btn: ViewStyle = {
    width: 44,
    height: 44,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.hairline,
    alignItems: 'center',
    justifyContent: 'center',
  };
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
      <Pressable style={btn} onPress={() => onChange(Math.max(1, value - 1))}>
        <Ionicons name="remove" size={18} color={colors.text} />
      </Pressable>
      <Text style={{ fontFamily: fonts.semi, fontSize: 18, color: colors.text, minWidth: 32, textAlign: 'center' }}>
        {value}
      </Text>
      <Pressable style={btn} onPress={() => onChange(value + 1)}>
        <Ionicons name="add" size={18} color={colors.text} />
      </Pressable>
    </View>
  );
}

/* -------------------------------- RowItem ---------------------------------- */
/** Minimal list row with hairline separator — used for menus & feature lists. */
export function RowItem({
  icon,
  label,
  sub,
  onPress,
  right,
  isLast,
}: {
  icon?: keyof typeof Ionicons.glyphMap;
  label: string;
  sub?: string;
  onPress?: () => void;
  right?: React.ReactNode;
  isLast?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        paddingVertical: 18,
        borderBottomWidth: isLast ? 0 : StyleSheet.hairlineWidth,
        borderBottomColor: colors.hairline,
        opacity: pressed ? 0.6 : 1,
      })}>
      {icon && (
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: radius.sm,
            backgroundColor: colors.surface,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Ionicons name={icon} size={18} color={colors.text} />
        </View>
      )}
      <View style={{ flex: 1 }}>
        <Text style={{ fontFamily: fonts.medium, fontSize: 16, color: colors.text }}>{label}</Text>
        {sub ? (
          <Text style={{ fontFamily: fonts.regular, fontSize: 13.5, color: colors.muted, marginTop: 2 }}>
            {sub}
          </Text>
        ) : null}
      </View>
      {right ?? (onPress ? <Ionicons name="chevron-forward" size={16} color={colors.muted} /> : null)}
    </Pressable>
  );
}

/* -------------------------------- BackBar ---------------------------------- */

export function BackBar({ title, onBack }: { title?: string; onBack: () => void }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8 }}>
      <Pressable
        onPress={onBack}
        style={{
          width: 40,
          height: 40,
          borderRadius: radius.sm,
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.hairline,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        hitSlop={8}>
        <Ionicons name="arrow-back" size={18} color={colors.text} />
      </Pressable>
      {title ? <Text style={{ fontFamily: fonts.semi, fontSize: 17, color: colors.text }}>{title}</Text> : null}
    </View>
  );
}

/* --------------------------------- Eyebrow --------------------------------- */

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <Text
      style={{
        fontFamily: fonts.semi,
        fontSize: 12,
        letterSpacing: 2.2,
        color: colors.lime,
        textTransform: 'uppercase',
      }}>
      {children}
    </Text>
  );
}
