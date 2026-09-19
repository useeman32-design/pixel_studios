import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Outfit_300Light,
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
  Outfit_800ExtraBold,
} from '@expo-google-fonts/outfit';
import { DarkTheme, DefaultTheme, ThemeProvider, Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';

import {
  darkPalette,
  lightPalette,
  Palette,
  ThemeContext,
  ThemeMode,
} from '../constants/theme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  const [mode, setMode] = useState<ThemeMode>('dark');
  const [booted, setBooted] = useState(false);

  const [loaded] = useFonts({
    Outfit_300Light,
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
    Outfit_700Bold,
    Outfit_800ExtraBold,
  });

  // Restore persisted preferences, then route first-time users to onboarding.
  useEffect(() => {
    (async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('ps_theme');
        if (savedTheme === 'light' || savedTheme === 'dark') setMode(savedTheme);
        const onboarded = await AsyncStorage.getItem('ps_onboarded');
        if (onboarded !== '1') {
          router.replace('/onboarding');
        }
      } catch {
        // storage unavailable — defaults are fine
      } finally {
        setBooted(true);
      }
    })();
  }, [router]);

  useEffect(() => {
    if (loaded && booted) {
      SplashScreen.hideAsync();
    }
  }, [loaded, booted]);

  const toggleTheme = useCallback(() => {
    setMode((m) => {
      const next = m === 'dark' ? 'light' : 'dark';
      AsyncStorage.setItem('ps_theme', next);
      return next;
    });
  }, []);

  const setTheme = useCallback((m: ThemeMode) => {
    setMode(m);
    AsyncStorage.setItem('ps_theme', m);
  }, []);

  const themeValue = useMemo(() => {
    const base = mode === 'dark' ? darkPalette : lightPalette;
    const colors: Palette = { ...base, isDark: mode === 'dark' };
    return {
      mode,
      colors,
      isDark: mode === 'dark',
      toggleTheme,
      setTheme,
    };
  }, [mode, toggleTheme, setTheme]);

  const navTheme = useMemo(() => {
    const base = mode === 'dark' ? DarkTheme : DefaultTheme;
    const p = mode === 'dark' ? darkPalette : lightPalette;
    return {
      ...base,
      colors: {
        ...base.colors,
        primary: p.lime,
        background: p.bg,
        card: p.bg,
        text: p.text,
        border: p.hairline,
        notification: p.lime,
      },
    };
  }, [mode]);

  if (!loaded || !booted) {
    return <View style={{ flex: 1, backgroundColor: darkPalette.bg }} />;
  }

  return (
    <ThemeContext.Provider value={themeValue}>
      <ThemeProvider value={navTheme}>
        <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: themeValue.colors.bg },
            animation: 'fade',
          }}
        />
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}
