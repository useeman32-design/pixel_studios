import React, { createContext, useContext } from 'react';
import { Platform } from 'react-native';

/**
 * Pixel Studios design system — v3
 * Dual theme (brand-black dark / off-white light) with brand teal (#00BFB8) accents.
 *
 * Brand palette (sampled from the official logo):
 *   teal   #00BFB8   · black #101418   · off-white #F4F7F7
 * NOTE: the property names `lime` / `limeDim` / `onLime` are legacy; they now
 * carry the brand teal. Renaming them would touch every screen, so the values
 * moved and the names stayed.
 */

export type Palette = {
  bg: string;
  surface: string;
  surface2: string;
  hairline: string;
  hairlineStrong: string;
  text: string;
  subtext: string;
  muted: string;
  lime: string;
  limeDim: string;
  onLime: string;
  overlay: string;
  navGlass: string;
  isDark: boolean;
};

export const darkPalette: Palette = {
  bg: '#0C1011',
  surface: '#141a1b',
  surface2: '#1D2426',
  hairline: 'rgba(255,255,255,0.08)',
  hairlineStrong: 'rgba(255,255,255,0.16)',
  text: '#F2F5F5',
  subtext: '#9B9BA1',
  muted: '#5E5E66',
  lime: '#00BFB8',
  limeDim: 'rgba(0,191,184,0.13)',
  onLime: '#0C1011',
  overlay: 'rgba(6,6,8,0.55)',
  navGlass: 'rgba(18,18,20,0.62)',
  isDark: true,
};

export const lightPalette: Palette = {
  bg: '#F4F7F7',
  surface: '#FFFFFF',
  surface2: '#E9EFEF',
  hairline: 'rgba(12,12,14,0.08)',
  hairlineStrong: 'rgba(12,12,14,0.16)',
  text: '#101418',
  subtext: '#5D5E64',
  muted: '#9C9DA3',
  lime: '#00B3AB',
  limeDim: 'rgba(0,179,171,0.16)',
  onLime: '#101208',
  overlay: 'rgba(20,20,24,0.42)',
  navGlass: 'rgba(255,255,255,0.66)',
  isDark: false,
};

export type ThemeMode = 'dark' | 'light';

export type Theme = {
  mode: ThemeMode;
  colors: Palette;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (m: ThemeMode) => void;
};

export const ThemeContext = createContext<Theme>({
  mode: 'dark',
  colors: darkPalette,
  isDark: true,
  toggleTheme: () => {},
  setTheme: () => {},
});

export function useTheme(): Theme {
  return useContext(ThemeContext);
}

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
