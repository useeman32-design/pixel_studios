import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackBar, Container, Eyebrow, FadeIn } from '../../components/ui';
import { fonts, Palette, radius, sp, useTheme } from '../../constants/theme';
import { MAX_CONTENT_WIDTH } from '../../constants/theme';
import { getCategory, serviceCategories } from '../../data/services';
import { offersFor } from '../../data/offers';

export default function ServiceDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const styles = useStyles(colors);

  const idx = serviceCategories.findIndex((s) => s.id === params.id);
  const svc = getCategory(params.id) ?? serviceCategories[0];
  const offers = offersFor(svc.id);

  const go = (to: string) => {
    router.push(to as any);
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ paddingBottom: sp.x8 }}>
      {/* Banner */}
      <View style={{ height: 240 }}>
        <Image source={svc.image} style={StyleSheet.absoluteFill} contentFit="cover" />
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(6,6,8,0.5)' }} />
        <Container style={{ marginTop: insets.top + sp.x2 }}>
          <BackBar onBack={() => router.back()} />
        </Container>
        <Container style={{ position: 'absolute', bottom: 18, left: 0, right: 0, width: '100%', alignSelf: 'center', maxWidth: MAX_CONTENT_WIDTH, paddingHorizontal: sp.x3 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#BFF549' }} />
            <Text style={{ fontFamily: fonts.semi, fontSize: 10, letterSpacing: 2.5, color: '#BFF549' }}>
              {svc.subtitle}
            </Text>
          </View>
          <Text style={{ fontFamily: fonts.semi, fontSize: 34, lineHeight: 38, letterSpacing: -1, color: '#FFFFFF' }}>{svc.name}</Text>
        </Container>
      </View>

      <Container style={{ marginTop: sp.x4 }}>
        <FadeIn>
          <Eyebrow>What we offer</Eyebrow>
          <Text style={styles.title}>Choose a service</Text>
          <Text style={styles.subtitle}>
            Tap any service to see designs, pick a type and place your order.
          </Text>
        </FadeIn>

        <View style={styles.grid}>
          {offers.map((o, i) => (
            <FadeIn key={o.id} delay={i * 40} style={{ width: '48%', maxWidth: 340, flexGrow: 1 }}>
              <Pressable
                onPress={() => go(o.link ?? `/offer/${o.id}`)}
                style={({ pressed }) => [styles.tile, { borderColor: colors.hairline, backgroundColor: colors.surface }, pressed && { opacity: 0.88, transform: [{ scale: 0.98 }] }]}>
                <Image source={o.image} style={styles.tileImg} contentFit="cover" />
                <View style={styles.tileBody}>
                  <Text style={styles.tileName} numberOfLines={2}>{o.name}</Text>
                  <Text style={styles.tileBlurb} numberOfLines={2}>{o.blurb}</Text>
                  <View style={styles.tileFooter}>
                    <Text style={styles.tilePrice}>
                      {o.quoteOnly ? 'From quote' : o.priceFrom !== undefined ? `₦${o.priceFrom.toLocaleString('en-NG')}` : ''}
                    </Text>
                    <Ionicons name="arrow-forward" size={14} color={colors.isDark ? colors.lime : '#5E8A0D'} />
                  </View>
                </View>
              </Pressable>
            </FadeIn>
          ))}
        </View>

        {/* Prev / next */}
        <View style={styles.pager}>
          <Pressable
            disabled={idx <= 0}
            onPress={() => idx > 0 && go(`/service/${serviceCategories[idx - 1].id}`)}
            style={[styles.pagerBtn, idx <= 0 && { opacity: 0.4 }]}>
            <Ionicons name="chevron-back" size={16} color={colors.text} />
            <Text style={styles.pagerText}>{idx > 0 ? serviceCategories[idx - 1].name : ''}</Text>
          </Pressable>
          {idx >= 0 && idx < serviceCategories.length - 1 && (
            <Pressable onPress={() => go(`/service/${serviceCategories[idx + 1].id}`)} style={styles.pagerBtn}>
              <Text style={styles.pagerText}>{serviceCategories[idx + 1].name}</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.text} />
            </Pressable>
          )}
        </View>
      </Container>
    </ScrollView>
  );
}

function useStyles(colors: Palette) {
  return StyleSheet.create({
    title: { fontFamily: fonts.semi, fontSize: 30, lineHeight: 34, letterSpacing: -0.9, color: colors.text, marginTop: sp.x1 },
    subtitle: { fontFamily: fonts.regular, fontSize: 16, color: colors.subtext, marginTop: sp.x2_, maxWidth: 560 },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: sp.x3,
      marginTop: sp.x4,
      justifyContent: 'flex-start',
    },
    tile: {
      borderRadius: radius.lg,
      borderWidth: 1,
      overflow: 'hidden',
      height: '100%',
    },
    tileImg: { width: '100%', height: 120 },
    tileBody: { padding: 16, gap: 5 },
    tileName: { fontFamily: fonts.semi, fontSize: 16, letterSpacing: -0.2, color: colors.text },
    tileBlurb: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 18, color: colors.subtext },
    tileFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 8,
      paddingTop: 10,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.hairline,
    },
    tilePrice: { fontFamily: fonts.semi, fontSize: 14, color: colors.isDark ? colors.lime : '#5E8A0D' },
    pager: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: sp.x6,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.hairline,
      paddingTop: sp.x3,
      gap: sp.x3,
    },
    pagerBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingVertical: 8,
    },
    pagerText: { fontFamily: fonts.medium, fontSize: 14, color: colors.text },
  });
}
