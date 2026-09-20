import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { fonts } from '../constants/theme';
import { CONTACT } from '../constants/contact';
import { CardDesign } from '../data/cardTemplates';
import { generateQR } from '../lib/qr';

export type CardConfig = {
  tier: 'direct' | 'premium';
  directTarget: string;
  directValue?: string;
  material: 'paper' | 'plastic';
  designMode: 'studio' | 'custom';
  cardDesign: CardDesign;
  logoUri?: string | null;
  name: string;
  business: string;
  rank?: string;
  username: string;
  phone?: string;
  address?: string;
  description?: string;
};

/* --------------------------------- Real QR --------------------------------- */

function RealQR({ payload, size = 62 }: { payload: string; size?: number }) {
  const matrix = useMemo(() => generateQR(payload), [payload]);
  if (!matrix) return null;
  const n = matrix.length;
  const cell = size / (n + 2); // +2 quiet zone

  return (
    <View style={{ width: cell * (n + 2), height: cell * (n + 2), backgroundColor: '#FFFFFF', borderRadius: 8, padding: cell }}>
      <View style={{ width: size, height: size }}>
        {matrix.map((row, y) => (
          <View key={y} style={{ flexDirection: 'row' }}>
            {row.map((dark, x) => (
              <View
                key={x}
                style={{ width: cell, height: cell, backgroundColor: dark ? '#0B0B0E' : 'transparent' }}
              />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

/* ------------------------------ Design decors ------------------------------ */

/** Soft, subtle decorations for light card faces. */
function Deco({ deco, accent }: { deco: CardDesign['deco']; accent: string }) {
  if (deco === 'halo') {
    return (
      <>
        <View style={{ position: 'absolute', top: -54, right: -46, width: 170, height: 170, borderRadius: 85, backgroundColor: accent, opacity: 0.13 }} />
        <View style={{ position: 'absolute', bottom: -64, left: -50, width: 150, height: 150, borderRadius: 75, backgroundColor: accent, opacity: 0.09 }} />
      </>
    );
  }
  if (deco === 'line') {
    return (
      <>
        <View style={{ position: 'absolute', top: 52, left: 22, width: 44, height: 3, borderRadius: 2, backgroundColor: accent, opacity: 0.85 }} />
        <View style={{ position: 'absolute', bottom: 46, right: 22, width: 24, height: 3, borderRadius: 2, backgroundColor: accent, opacity: 0.4 }} />
      </>
    );
  }
  if (deco === 'corner') {
    return (
      <>
        <View style={{ position: 'absolute', top: 44, left: 16, width: 30, height: 30, borderLeftWidth: 1.5, borderTopWidth: 1.5, borderColor: accent, opacity: 0.75 }} />
        <View style={{ position: 'absolute', bottom: 40, right: 16, width: 30, height: 30, borderRightWidth: 1.5, borderBottomWidth: 1.5, borderColor: accent, opacity: 0.75 }} />
      </>
    );
  }
  if (deco === 'frame') {
    return (
      <View style={{ position: 'absolute', top: 9, left: 9, right: 9, bottom: 9, borderWidth: 1, borderColor: accent + '4D', borderRadius: 14 }} />
    );
  }
  // dots
  return (
    <View style={{ position: 'absolute', right: 20, top: 56, flexDirection: 'row', gap: 4 }}>
      {[1, 0.65, 0.4, 0.65, 1].map((op, i) => (
        <View key={i} style={{ width: 4.5, height: 4.5, borderRadius: 2.25, backgroundColor: accent, opacity: op }} />
      ))}
    </View>
  );
}

/**
 * Interactive 3D smart card.
 * Front: the CUSTOMER's brand (logo + business) at the top, owner name bold,
 * Pixel Studios branding at the bottom. Back: real QR + full contact details.
 */
export default function SmartCard({ config }: { config: CardConfig }) {
  const flip = useRef(new Animated.Value(0)).current; // 0 = front, 1 = back
  const sway = useRef(new Animated.Value(0)).current;
  const [showingBack, setShowingBack] = useState(false);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(sway, { toValue: 1, duration: 2800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(sway, { toValue: -1, duration: 5600, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(sway, { toValue: 0, duration: 2800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [sway]);

  const flipCard = () => {
    const to = showingBack ? 0 : 1;
    setShowingBack(!showingBack);
    Animated.spring(flip, { toValue: to, useNativeDriver: true, damping: 19, stiffness: 150, mass: 0.9 }).start();
  };

  const swayY = sway.interpolate({ inputRange: [-1, 1], outputRange: ['4deg', '-4deg'] });
  const flipY = flip.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });
  // Deterministic face swap at the 90° midpoint — the faces themselves carry
  // no backfaceVisibility so the back can never render empty.
  const frontOpacity = flip.interpolate({ inputRange: [0, 0.49, 0.5, 1], outputRange: [1, 1, 0, 0] });
  const backOpacity = flip.interpolate({ inputRange: [0, 0.49, 0.5, 1], outputRange: [0, 0, 1, 1] });

  const d = config.cardDesign;
  const isPlastic = config.material === 'plastic';

  const faceBase: any = [
    styles.face,
    { backgroundColor: d.bg, borderColor: d.text + '22' },
  ];

  const businessName = config.business || 'Your Business';
  const ownerName = config.name || 'Your Name';
  const initial = businessName.trim().charAt(0).toUpperCase() || 'B';

  const qrPayload = useMemo(() => {
    if (config.tier === 'premium') return `https://pixelstudios.com/card/${config.username}`;
    const v = (config.directValue || '').trim();
    const isUrl = /^https?:\/\//i.test(v);
    switch (config.directTarget) {
      case 'whatsapp': {
        if (isUrl) return v;
        const digits = v.replace(/\D/g, '');
        return `https://wa.me/${digits || CONTACT.whatsappNumber}`;
      }
      case 'instagram':
        return isUrl ? v : `https://instagram.com/${v.replace(/^@/, '') || 'pixelstudios.ng'}`;
      case 'x':
        return isUrl ? v : `https://x.com/${v.replace(/^@/, '') || ''}`;
      case 'linkedin':
        return isUrl ? v : `https://linkedin.com/in/${v}`;
      case 'facebook':
        return isUrl ? v : `https://facebook.com/${v}`;
      case 'email':
        return v ? `mailto:${v}` : `https://pixelstudios.com/card/${config.username}`;
      default:
        return v ? (isUrl ? v : `https://${v}`) : `https://pixelstudios.com/card/${config.username}`;
    }
  }, [config.tier, config.directTarget, config.directValue, config.username]);

  /* -------------------------------- FRONT -------------------------------- */
  const front = (
    <View style={faceBase}>
      {isPlastic && <View style={styles.plasticSheen} />}
      {config.designMode === 'studio' && <Deco deco={d.deco} accent={d.accent} />}

      {/* Customer brand — top */}
      <View style={styles.topRow}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
          {config.logoUri ? (
            <Image source={{ uri: config.logoUri }} style={styles.logoImg} />
          ) : (
            <View style={[styles.pixelBadge, { backgroundColor: d.accent + '26' }]}>
              <Text style={{ fontFamily: fonts.bold, fontSize: 12, color: d.accent }}>{initial}</Text>
            </View>
          )}
          <Text style={[styles.bizBrand, { color: d.text }]} numberOfLines={1}>
            {businessName}
          </Text>
        </View>
        <Ionicons name={config.tier === 'direct' ? 'qr-code-outline' : 'wifi-outline'} size={15} color={d.accent} />
      </View>

      {/* Owner — bold, with rank */}
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        <Text style={[styles.name, { color: d.text }]} numberOfLines={1}>
          {ownerName}
        </Text>
        {(config.rank || '').trim().length > 0 && (
          <Text style={[styles.rankText, { color: d.accent }]} numberOfLines={1}>
            {(config.rank || '').toUpperCase()}
          </Text>
        )}
        <View style={styles.bottomRow}>
          {/* Studio credit — bottom */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <Text style={{ fontSize: 10, color: d.accent }}>▚</Text>
            <Text style={[styles.studioCredit, { color: d.sub }]}>PIXEL STUDIOS</Text>
          </View>
          <View style={[styles.tapBadge, { backgroundColor: d.accent + '26' }]}>
            <Ionicons name="flash" size={9} color={d.accent} />
            <Text style={[styles.tapText, { color: d.accent }]}>
              {config.tier === 'premium' ? 'PREMIUM' : 'DIRECT'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  /* --------------------------------- BACK --------------------------------- */
  const back = (
    <View style={faceBase}>
      {isPlastic && <View style={styles.plasticSheen} />}
      <View style={{ flexDirection: 'row', gap: 14 }}>
        <RealQR payload={qrPayload} size={58} />
        <View style={{ flex: 1 }}>
          <Text style={[styles.backName, { color: d.text }]} numberOfLines={1}>
            {ownerName}
          </Text>
          <Text style={[styles.backBusiness, { color: d.accent }]} numberOfLines={1}>
            {businessName}
          </Text>
          <View style={{ marginTop: 5, gap: 3 }}>
            <View style={styles.backRow}>
              <Ionicons name="call-outline" size={9} color={d.sub} />
              <Text style={[styles.backDetail, { color: d.sub }]} numberOfLines={1}>
                {config.phone || '+234 903 152 8732'}
              </Text>
            </View>
            <View style={styles.backRow}>
              <Ionicons name="location-outline" size={9} color={d.sub} />
              <Text style={[styles.backDetail, { color: d.sub }]} numberOfLines={1}>
                {config.address || 'Gusau, Zamfara State'}
              </Text>
            </View>
          </View>
          <Text style={[styles.backDesc, { color: d.sub }]} numberOfLines={2}>
            {(config.description || '').trim() ||
              (config.tier === 'premium'
                ? 'Scan for portfolio, pricing & instant booking.'
                : 'Scan or tap to connect instantly.')}
          </Text>
        </View>
      </View>
      <View style={styles.backFooter}>
        <Text style={[styles.backFooterText, { color: d.sub }]}>SCAN · TAP · CONNECT</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Text style={{ fontSize: 8, color: d.accent }}>▚</Text>
          <Text style={[styles.backFooterText, { color: d.sub }]}>PIXEL STUDIOS</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View>
      <Pressable onPress={flipCard} hitSlop={8}>
        {/* Sway layer */}
        <Animated.View style={{ transform: [{ rotateY: swayY }] }}>
          {/* Flip layer */}
          <Animated.View style={{ transform: [{ perspective: 1200 }, { rotateY: flipY }] }}>
            <Animated.View style={{ opacity: frontOpacity }}>{front}</Animated.View>
            <Animated.View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                opacity: backOpacity,
                transform: [{ rotateY: '180deg' }],
              }}>
              {back}
            </Animated.View>
          </Animated.View>
        </Animated.View>
      </Pressable>
      <View style={styles.flipHintRow}>
        <Ionicons name="sync-outline" size={13} color="#9B9BA1" />
        <Text style={[styles.flipHint, { color: '#9B9BA1' }]}>
          Tap the card to flip {showingBack ? 'to front' : 'to back'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  face: {
    aspectRatio: 1.586,
    borderRadius: 20,
    borderWidth: 1,
    padding: 22,
    overflow: 'hidden',
  },
  plasticSheen: {
    position: 'absolute',
    top: -40,
    right: -60,
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  logoImg: { width: 28, height: 28, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.12)' },
  pixelBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bizBrand: { fontFamily: fonts.bold, fontSize: 12, letterSpacing: 1.4, textTransform: 'uppercase' },
  name: { fontFamily: fonts.bold, fontSize: 23, letterSpacing: -0.4 },
  rankText: { fontFamily: fonts.bold, fontSize: 8.5, letterSpacing: 2, marginTop: 3 },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
  },
  studioCredit: { fontFamily: fonts.bold, fontSize: 8.5, letterSpacing: 2.2 },
  tapBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  tapText: { fontFamily: fonts.semi, fontSize: 8.5, letterSpacing: 1 },
  backName: { fontFamily: fonts.bold, fontSize: 14, letterSpacing: -0.2 },
  backBusiness: { fontFamily: fonts.bold, fontSize: 11, marginTop: 1 },
  backRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  backDetail: { fontFamily: fonts.medium, fontSize: 9.5 },
  backDesc: { fontFamily: fonts.regular, fontSize: 8.5, lineHeight: 11.5, marginTop: 5 },
  backFooter: {
    position: 'absolute',
    left: 22,
    right: 22,
    bottom: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  backFooterText: { fontFamily: fonts.bold, fontSize: 7, letterSpacing: 1.6 },
  flipHintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 12,
  },
  flipHint: { fontFamily: fonts.medium, fontSize: 12 },
});
