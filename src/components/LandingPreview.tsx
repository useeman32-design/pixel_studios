import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { fonts } from '../constants/theme';
import { BusinessType, CardTemplate, landingConfigs, slugify } from '../data/cardTemplates';

/**
 * Miniature preview of each template style for the picker carousel —
 * each thumbnail mirrors the structure of its full-size design.
 */
export default function LandingPreview({
  template,
  businessType,
  name,
  business,
  profileUri,
  logoUri,
}: {
  template: CardTemplate;
  businessType: BusinessType;
  name: string;
  business: string;
  profileUri?: string | null;
  logoUri?: string | null;
}) {
  const cfg = landingConfigs[businessType.id] ?? landingConfigs.general;
  const displayName = business || businessType.sample;
  const user = slugify(name || displayName);
  const accent = businessType.accent;

  const chrome = (
    <View style={styles.chrome}>
      <View style={{ flexDirection: 'row', gap: 4 }}>
        <View style={[styles.chromeDot, { backgroundColor: '#FF5F57' }]} />
        <View style={[styles.chromeDot, { backgroundColor: '#FEBC2E' }]} />
        <View style={[styles.chromeDot, { backgroundColor: '#28C840' }]} />
      </View>
      <View style={[styles.urlBar, { backgroundColor: template.id === 'clean' ? '#FFFFFF' : template.surface }]}>
        <Text style={[styles.urlText, { color: template.subtext }]} numberOfLines={1}>
          pixelstudios.com/card/{user}
        </Text>
      </View>
    </View>
  );

  /* ---- Signature Dark mini ---- */
  if (template.id === 'signature') {
    return (
      <View style={[styles.frame, { backgroundColor: '#0C0C0F', borderColor: 'rgba(128,128,128,0.25)' }]}>
        {chrome}
        <View style={{ padding: 12 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={miniChip('rgba(191,245,73,0.12)')}>
              <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: '#BFF549' }} />
              <Text style={{ fontFamily: fonts.semi, fontSize: 7, color: '#BFF549' }}>Open now</Text>
            </View>
            <View style={miniChip('rgba(255,255,255,0.08)')}>
              <Ionicons name="star" size={7} color="#FBBF24" />
              <Text style={{ fontFamily: fonts.semi, fontSize: 7, color: '#F4F4F2' }}>{businessType.rating}</Text>
            </View>
          </View>
          <Text style={{ fontFamily: fonts.extrabold, fontSize: 13, lineHeight: 15, letterSpacing: -0.4, color: '#F4F4F2', marginTop: 8 }} numberOfLines={2}>
            {cfg.headline}
          </Text>
          <View style={{ marginTop: 8, borderRadius: 9, overflow: 'hidden', transform: [{ rotateY: '-4deg' }] }}>
            <Image source={businessType.hero} style={{ width: '100%', height: 78 }} contentFit="cover" />
          </View>
          <View style={[styles.miniCta, { backgroundColor: accent }]}>
            <Text style={{ fontFamily: fonts.bold, fontSize: 8, color: '#0C0C0F' }}>{cfg.cta}</Text>
          </View>
        </View>
      </View>
    );
  }

  /* ---- Clean Light mini ---- */
  if (template.id === 'clean') {
    return (
      <View style={[styles.frame, { backgroundColor: '#F5F4F0', borderColor: 'rgba(128,128,128,0.25)' }]}>
        {chrome}
        <View style={{ padding: 12 }}>
          <View style={{ borderBottomWidth: 1, borderBottomColor: '#141416', paddingBottom: 5, flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontFamily: fonts.bold, fontSize: 6.5, letterSpacing: 1.6, color: '#141416' }}>PORTFOLIO — {displayName.toUpperCase()}</Text>
            <Text style={{ fontFamily: fonts.medium, fontSize: 6.5, color: '#6B6C72' }}>GUSAU</Text>
          </View>
          <Text style={{ fontFamily: fonts.extrabold, fontSize: 15, letterSpacing: -0.6, color: '#141416', marginTop: 7 }} numberOfLines={1}>
            {displayName}
          </Text>
          <View style={{ backgroundColor: '#FFFFFF', padding: 4, borderRadius: 3, marginTop: 7, transform: [{ rotateY: '2deg' }] }}>
            <Image source={businessType.hero} style={{ width: '100%', height: 72, borderRadius: 2 }} contentFit="cover" />
            <Text style={{ fontFamily: fonts.regular, fontSize: 6.5, fontStyle: 'italic', color: '#6B6C72', marginTop: 3 }}>
              Fig. 01 — Signature work
            </Text>
          </View>
          <View style={[styles.miniCta, { backgroundColor: '#141416', marginTop: 8 }]}>
            <Text style={{ fontFamily: fonts.bold, fontSize: 8, color: '#F5F4F0' }}>{cfg.cta}</Text>
          </View>
        </View>
      </View>
    );
  }

  /* ---- Bold Brand mini ---- */
  return (
    <View style={[styles.frame, { borderColor: 'rgba(128,128,128,0.25)' }]}>
      <LinearGradient colors={['#16102E', '#2A1650']} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
      <LinearGradient colors={[accent + '55', 'transparent']} style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 70 }} />
      {chrome}
      <View style={{ padding: 12 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ backgroundColor: '#FFFFFF', borderRadius: 5, paddingHorizontal: 7, paddingVertical: 3.5, transform: [{ rotate: '-4deg' }] }}>
            <Text style={{ fontFamily: fonts.extrabold, fontSize: 7, color: '#141416', letterSpacing: 0.6 }}>★ {businessType.badge}</Text>
          </View>
          {logoUri ? (
            <Image source={{ uri: logoUri }} style={{ width: 18, height: 18, borderRadius: 5 }} />
          ) : (
            <View style={{ width: 18, height: 18, borderRadius: 5, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 8, color: '#2A1650' }}>▚</Text>
            </View>
          )}
        </View>
        <Text style={{ fontFamily: fonts.extrabold, fontSize: 16, letterSpacing: -0.6, color: '#FFFFFF', marginTop: 8 }} numberOfLines={1}>
          {displayName}
        </Text>
        <View style={{ flexDirection: 'row', marginTop: 7 }}>
          <View style={{ flex: 1.3, backgroundColor: '#FFFFFF', padding: 3, borderRadius: 3, transform: [{ rotate: '-4deg' }] }}>
            <Image source={businessType.hero} style={{ width: '100%', height: 58, borderRadius: 2 }} contentFit="cover" />
          </View>
          <View style={{ flex: 1, marginLeft: -6, marginTop: 14 }}>
            <View style={{ backgroundColor: accent, borderRadius: 4, padding: 6, transform: [{ rotate: '5deg' }], marginLeft: 10 }}>
              <Text style={{ fontFamily: fonts.extrabold, fontSize: 8, color: '#141416' }}>{businessType.rating} ★</Text>
              <Text style={{ fontFamily: fonts.semi, fontSize: 6, color: 'rgba(20,20,22,0.7)' }}>{businessType.reviews}</Text>
            </View>
          </View>
        </View>
        <View style={[styles.miniCta, { backgroundColor: accent, borderWidth: 1.5, borderColor: '#141416', marginTop: 8 }]}>
          <Text style={{ fontFamily: fonts.extrabold, fontSize: 8, color: '#141416' }}>{cfg.cta}</Text>
        </View>
      </View>
    </View>
  );
}

function miniChip(bg: string) {
  return {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 3,
    backgroundColor: bg,
    borderRadius: 999,
    paddingHorizontal: 6,
    paddingVertical: 3,
  };
}

const styles = StyleSheet.create({
  frame: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    aspectRatio: 0.82,
  },
  chrome: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(128,128,128,0.25)',
  },
  chromeDot: { width: 6, height: 6, borderRadius: 3 },
  urlBar: { flex: 1, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  urlText: { fontFamily: fonts.medium, fontSize: 8 },
  miniCta: {
    borderRadius: 7,
    paddingVertical: 6,
    alignItems: 'center',
    marginTop: 8,
  },
});
