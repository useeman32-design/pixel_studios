import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';

import { colors, fonts, isWeb, MAX_CONTENT_WIDTH, radius } from '../constants/theme';

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
  const translateY = useRef(new Animated.Value(14)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 450, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 0, duration: 450, useNativeDriver: true }),
      ]).start();
    }, delay);
    return () => clearTimeout(timer);
  }, [delay, opacity, translateY]);

  return (
    <Animated.View style={[{ opacity, transform: [{ translateY }] }, style]}>
      {children}
    </Animated.View>
  );
}

/* ------------------------------- Container --------------------------------- */

export function Container({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return (
    <View style={[styles.container, style]}>{children}</View>
  );
}

/* -------------------------------- GlassCard -------------------------------- */

export function GlassCard({
  children,
  style,
  onPress,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const pressIn = () => Animated.spring(scale, { toValue: 0.97, useNativeDriver: true }).start();
  const pressOut = () => Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();

  const content = <View style={[styles.card, style]}>{children}</View>;

  if (!onPress) return content;
  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable onPress={onPress} onPressIn={pressIn} onPressOut={pressOut}>
        {content}
      </Pressable>
    </Animated.View>
  );
}

/* ---------------------------------- Button --------------------------------- */

type ButtonVariant = 'gradient' | 'glass' | 'outline' | 'whatsapp' | 'dark';

export function Button({
  title,
  onPress,
  variant = 'gradient',
  icon,
  href,
  style,
  compact,
}: {
  title: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  icon?: keyof typeof Ionicons.glyphMap;
  href?: string;
  style?: ViewStyle;
  compact?: boolean;
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const pressIn = () => Animated.spring(scale, { toValue: 0.96, useNativeDriver: true }).start();
  const pressOut = () => Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();

  const handle = () => {
    if (href) {
      Linking.openURL(href);
      return;
    }
    onPress?.();
  };

  const row = (
    <View
      style={[
        styles.buttonRow,
        compact && styles.buttonRowCompact,
        variant === 'glass' && styles.buttonGlass,
        variant === 'outline' && styles.buttonOutline,
        variant === 'whatsapp' && { backgroundColor: colors.whatsapp },
        variant === 'dark' && { backgroundColor: '#0A0B12' },
        style,
      ]}>
      {icon && (
        <Ionicons
          name={icon}
          size={compact ? 16 : 18}
          color={variant === 'gradient' || variant === 'outline' ? '#fff' : variant === 'whatsapp' ? '#fff' : colors.text}
          style={{ marginRight: 8 }}
        />
      )}
      <Text
        style={[
          styles.buttonText,
          compact && { fontSize: 14 },
          (variant === 'glass' || variant === 'outline') && { color: colors.text },
        ]}>
        {title}
      </Text>
    </View>
  );

  const pressable = (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        onPress={handle}
        onPressIn={pressIn}
        onPressOut={pressOut}
        style={isWeb ? ({ hovered }: any) => ({ opacity: hovered ? 0.92 : 1 }) : undefined}>
        {variant === 'gradient' ? (
          <LinearGradient
            colors={['#7C3AED', '#6D5BF0', '#22D3EE']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ borderRadius: radius.pill }}>
            {row}
          </LinearGradient>
        ) : (
          row
        )}
      </Pressable>
    </Animated.View>
  );

  return pressable;
}

/* ------------------------------- SectionHeader ------------------------------ */

export function SectionHeader({
  title,
  subtitle,
  actionLabel,
  onAction,
}: {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.sectionHeader}>
      <View style={{ flex: 1 }}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {subtitle ? <Text style={styles.sectionSubtitle}>{subtitle}</Text> : null}
      </View>
      {actionLabel && (
        <Pressable onPress={onAction} hitSlop={8}>
          <Text style={styles.sectionAction}>{actionLabel} →</Text>
        </Pressable>
      )}
    </View>
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
      style={[styles.chip, active && styles.chipActive]}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </Pressable>
  );
}

/* ---------------------------------- Stars ---------------------------------- */

export function Stars({ rating }: { rating: number }) {
  return (
    <View style={{ flexDirection: 'row', gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Ionicons
          key={i}
          name={i <= rating ? 'star' : 'star-outline'}
          size={14}
          color={colors.amber}
        />
      ))}
    </View>
  );
}

/* -------------------------------- BackHeader ------------------------------- */

export function BackHeader({
  title,
  onBack,
  right,
}: {
  title: string;
  onBack: () => void;
  right?: React.ReactNode;
}) {
  return (
    <View style={styles.backHeader}>
      <Pressable onPress={onBack} style={styles.backButton} hitSlop={10}>
        <Ionicons name="arrow-back" size={20} color={colors.text} />
      </Pressable>
      <Text style={styles.backTitle} numberOfLines={1}>
        {title}
      </Text>
      <View style={{ width: 40, alignItems: 'flex-end' }}>{right}</View>
    </View>
  );
}

/* ---------------------------------- styles --------------------------------- */

const styles = StyleSheet.create({
  container: {
    maxWidth: MAX_CONTENT_WIDTH,
    width: '100%',
    alignSelf: 'center',
  },
  card: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderRadius: radius.lg,
    overflow: 'hidden',
    ...Platform.select({ web: { backdropFilter: 'blur(12px)' } as any }),
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 26,
    borderRadius: radius.pill,
  },
  buttonRowCompact: {
    paddingVertical: 11,
    paddingHorizontal: 18,
  },
  buttonGlass: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: colors.borderStrong,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1.4,
    borderColor: 'rgba(124,58,237,0.65)',
  },
  buttonText: {
    color: '#fff',
    fontFamily: fonts.bodySemi,
    fontSize: 15.5,
    letterSpacing: 0.2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  sectionTitle: {
    color: colors.text,
    fontFamily: fonts.displaySemi,
    fontSize: 24,
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    color: colors.subtext,
    fontFamily: fonts.body,
    fontSize: 14.5,
    marginTop: 4,
    lineHeight: 20,
  },
  sectionAction: {
    color: colors.cyan,
    fontFamily: fonts.bodySemi,
    fontSize: 14,
    marginBottom: 3,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.violetSoft,
    borderColor: 'rgba(139,92,246,0.7)',
  },
  chipText: {
    color: colors.subtext,
    fontFamily: fonts.bodyMedium,
    fontSize: 13.5,
  },
  chipTextActive: {
    color: '#C4B5FD',
  },
  backHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: colors.border,
  },
  backTitle: {
    flex: 1,
    color: colors.text,
    fontFamily: fonts.displaySemi,
    fontSize: 18,
    textAlign: 'center',
  },
});
