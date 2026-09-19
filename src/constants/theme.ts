import { Platform } from 'react-native';

/**
 * Pixel Studios design system — v2
 * Minimal, editorial, premium. Charcoal + off-white + electric lime.
 * Lime is reserved for primary actions, active states and brand accents.
 */
export const colors = {
  bg: '#0A0A0B',
  surface: '#131315',
  surface2: '#1A1A1D',
  hairline: 'rgba(255,255,255,0.08)',
  hairlineStrong: 'rgba(255,255,255,0.14)',
  text: '#F4F4F2',
  subtext: '#9B9BA1',
  muted: '#5E5E66',
  lime: '#BFF549',
  limeDim: 'rgba(191,245,73,0.12)',
  onLime: '#0A0A0B',
  white: '#FFFFFF',
  offwhite: '#EDEDEA',
} as const;

export const fonts = {
  /** Outfit — modern geometric sans. Each weight is its own family. */
  thin: 'Outfit_300Light',
  regular: 'Outfit_400Regular',
  medium: 'Outfit_500Medium',
  semi: 'Outfit_600SemiBold',
  bold: 'Outfit_700Bold',
  extrabold: 'Outfit_800ExtraBold',
} as const;

/** 8pt spacing scale */
export const sp = {
  x2: 4,
  x1: 8,
  x2_: 12,
  x3: 16,
  x4: 24,
  x5: 32,
  x6: 40,
  x7: 48,
  x8: 64,
} as const;

export const radius = {
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
} as const;

export const MAX_CONTENT_WIDTH = 760;

export const isWeb = Platform.OS === 'web';

/** Type scale — large, confident, readable. */
export const type = {
  hero: { fontFamily: fonts.semi, fontSize: 42, lineHeight: 46, letterSpacing: -1.4, color: colors.text },
  title: { fontFamily: fonts.semi, fontSize: 32, lineHeight: 36, letterSpacing: -0.9, color: colors.text },
  heading: { fontFamily: fonts.semi, fontSize: 24, lineHeight: 28, letterSpacing: -0.5, color: colors.text },
  subtitle: { fontFamily: fonts.regular, fontSize: 17, lineHeight: 25, color: colors.subtext },
  body: { fontFamily: fonts.regular, fontSize: 16, lineHeight: 23, color: colors.text },
  small: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 20, color: colors.subtext },
  label: { fontFamily: fonts.medium, fontSize: 13, lineHeight: 18, letterSpacing: 0.4, color: colors.subtext },
} as const;
