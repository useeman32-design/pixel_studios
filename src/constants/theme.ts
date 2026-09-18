import { Platform } from 'react-native';

export const colors = {
  bg: '#07070D',
  bgElevated: '#0B0C13',
  surface: '#101120',
  surfaceLight: '#171A2B',
  card: 'rgba(255,255,255,0.045)',
  cardSolid: '#12141F',
  border: 'rgba(255,255,255,0.09)',
  borderStrong: 'rgba(255,255,255,0.18)',
  text: '#F5F6FA',
  subtext: '#A0A6BA',
  muted: '#6E7389',
  primary: '#7C3AED',
  violet: '#8B5CF6',
  cyan: '#22D3EE',
  cyanSoft: 'rgba(34,211,238,0.12)',
  violetSoft: 'rgba(139,92,246,0.14)',
  whatsapp: '#25D366',
  whatsappDark: '#1DA851',
  amber: '#FBBF24',
  success: '#34D399',
  danger: '#F87171',
} as const;

export const gradients = {
  primary: ['#7C3AED', '#22D3EE'] as [string, string],
  violet: ['#8B5CF6', '#6366F1'] as [string, string],
  ember: ['#F59E0B', '#EF4444'] as [string, string],
  mint: ['#10B981', '#22D3EE'] as [string, string],
  rose: ['#EC4899', '#8B5CF6'] as [string, string],
  sky: ['#0EA5E9', '#22D3EE'] as [string, string],
  gold: ['#F59E0B', '#FBBF24'] as [string, string],
  slate: ['#475569', '#64748B'] as [string, string],
} as const;

export const fonts = {
  display: 'SpaceGrotesk_700Bold',
  displaySemi: 'SpaceGrotesk_600SemiBold',
  displayMedium: 'SpaceGrotesk_500Medium',
  body: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  bodySemi: 'Inter_600SemiBold',
} as const;

export const radius = {
  sm: 12,
  md: 16,
  lg: 22,
  xl: 28,
  pill: 999,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

/** Max content width so the web version stays elegant on large screens. */
export const MAX_CONTENT_WIDTH = 1080;

export const isWeb = Platform.OS === 'web';
