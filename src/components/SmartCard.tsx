import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { fonts } from '../constants/theme';

export type CardConfig = {
  tier: 'direct' | 'premium';
  directTarget: string;
  material: 'paper' | 'plastic';
  designMode: 'pixel' | 'logo' | 'custom';
  logoUri?: string | null;
  name: string;
  business: string;
  username: string;
  accent: string;
  phone?: string;
  address?: string;
  description?: string;
};

/* ----------------------------- Deterministic QR ---------------------------- */
/** Renders a scannable-looking QR pattern seeded from the owner's details. */
function FauxQR({ seed, size = 52, fg }: { seed: string; size?: number; fg: string }) {
  const N = 11;
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const rand = () => {
    h ^= h << 13;
    h ^= h >>> 17;
    h ^= h << 5;
    return ((h >>> 0) % 100) / 100;
  };
  const isFinder = (r: number, c: number) =>
    (r < 3 && c < 3) || (r < 3 && c >= N - 3) || (r >= N - 3 && c < 3);

  const modules: { r: number; c: number }[] = [];
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      if (isFinder(r, c)) continue;
      if (rand() > 0.52) modules.push({ r, c });
    }
  }
  const cell = size / N;
  const border = Math.max(1.4, cell * 0.3);

  const finder = (r0: number, c0: number) => (
    <View
      key={`f${r0}${c0}`}
      style={{
        position: 'absolute',
        left: c0 * cell,
        top: r0 * cell,
        width: cell * 3,
        height: cell * 3,
        borderWidth: border,
        borderColor: fg,
      }}>
      <View
        style={{
          position: 'absolute',
          left: cell * 0.6,
          top: cell * 0.6,
          width: cell * 0.8,
          height: cell * 0.8,
          backgroundColor: fg,
        }}
      />
    </View>
  );

  return (
    <View style={{ width: size, height: size }}>
      {finder(0, 0)}
      {finder(0, N - 3)}
      {finder(N - 3, 0)}
      {modules.map(({ r, c }) => (
        <View
          key={`${r}-${c}`}
          style={{
            position: 'absolute',
            left: c * cell,
            top: r * cell,
            width: cell * 0.9,
            height: cell * 0.9,
            backgroundColor: fg,
          }}
        />
      ))}
    </View>
  );
}

/* ---------------------------- Pixel studio deco ---------------------------- */
function PixelDeco({ accent }: { accent: string }) {
  const rows = [
    [1, 0, 1, 1, 0],
    [0, 1, 0, 1, 1],
    [1, 1, 0, 0, 1],
  ];
  return (
    <View style={{ gap: 2.5 }}>
      {rows.map((row, r) => (
        <View key={r} style={{ flexDirection: 'row', gap: 2.5 }}>
          {row.map((v, c) => (
            <View
              key={c}
              style={{
                width: 4.5,
                height: 4.5,
                borderRadius: 1,
                backgroundColor: v ? accent : 'transparent',
                opacity: v ? ((c + r) % 3 === 0 ? 0.45 : 1) : 0,
              }}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

/**
 * Interactive 3D smart card.
 * Tap to flip front/back — flip and idle sway run on separate nested layers,
 * with a deterministic face swap at the 90° midpoint.
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
    Animated.spring(flip, {
      toValue: to,
      useNativeDriver: true,
      damping: 19,
      stiffness: 150,
      mass: 0.9,
    }).start();
  };

  const swayY = sway.interpolate({ inputRange: [-1, 1], outputRange: ['4deg', '-4deg'] });
  const flipY = flip.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });
  const frontOpacity = flip.interpolate({ inputRange: [0, 0.49, 0.5, 1], outputRange: [1, 1, 0, 0] });
  const backOpacity = flip.interpolate({ inputRange: [0, 0.49, 0.5, 1], outputRange: [0, 0, 1, 1] });

  const isPaper = config.material === 'paper';
  const cardBg = isPaper ? '#F2F0EA' : '#0E0E11';
  const textMain = isPaper ? '#141416' : '#F4F4F2';
  const textSub = isPaper ? 'rgba(20,20,22,0.58)' : 'rgba(244,244,242,0.55)';

  const faceBase: any = [
    styles.face,
    { backgroundColor: cardBg, borderColor: isPaper ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.12)' },
  ];

  /* -------------------------------- FRONT -------------------------------- */
  const front = (
    <View style={faceBase}>
      {!isPaper && <View style={styles.plasticSheen} />}
      {/* Studio design deco */}
      {config.designMode === 'pixel' && (
        <View style={{ position: 'absolute', right: 20, top: 52 }}>
          <PixelDeco accent={config.accent} />
        </View>
      )}
      <View style={styles.topRow}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          {config.designMode === 'logo' && config.logoUri ? (
            <Image source={{ uri: config.logoUri }} style={styles.logoImg} />
          ) : config.designMode === 'custom' ? (
            <View style={[styles.pixelBadge, { backgroundColor: config.accent + '22' }]}>
              <Ionicons name="brush" size={11} color={config.accent} />
            </View>
          ) : (
            <View style={[styles.pixelBadge, { backgroundColor: config.accent + '22' }]}>
              <Text style={{ fontSize: 11, color: config.accent }}>▚</Text>
            </View>
          )}
          <Text style={[styles.brandText, { color: textMain }]}>PIXEL STUDIOS</Text>
        </View>
        <Ionicons name={config.tier === 'direct' ? 'qr-code' : 'wifi'} size={16} color={config.accent} />
      </View>

      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        <Text style={[styles.name, { color: textMain }]} numberOfLines={1}>
          {config.name || 'Your Name'}
        </Text>
        <Text style={[styles.business, { color: textMain }]} numberOfLines={1}>
          {config.business || 'Your Business'}
        </Text>
        <View style={styles.bottomRow}>
          <Text style={[styles.url, { color: textSub }]} numberOfLines={1}>
            {config.tier === 'premium'
              ? `pixelstudios.com/card/${config.username}`
              : config.directTarget === 'whatsapp'
                ? 'Scan → WhatsApp'
                : config.directTarget === 'instagram'
                  ? 'Scan → Instagram'
                  : config.directTarget === 'phone'
                    ? 'Scan → Call'
                    : config.directTarget === 'website'
                      ? 'Scan → Website'
                      : 'Scan → Email'}
          </Text>
          <View style={[styles.tapBadge, { backgroundColor: config.accent + '26' }]}>
            <Ionicons name="flash" size={9} color={config.accent} />
            <Text style={[styles.tapText, { color: config.accent }]}>
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
      {!isPaper && <View style={styles.plasticSheen} />}
      <View style={{ flexDirection: 'row', gap: 14 }}>
        {/* QR on a white tile — always scannable */}
        <View style={styles.qrTile}>
          <FauxQR seed={`${config.name}|${config.business}|${config.username}`} size={54} fg="#101014" />
        </View>
        {/* Contact details */}
        <View style={{ flex: 1 }}>
          <Text style={[styles.backName, { color: textMain }]} numberOfLines={1}>
            {config.name || 'Your Name'}
          </Text>
          <Text style={[styles.backBusiness, { color: config.accent }]} numberOfLines={1}>
            {config.business || 'Your Business'}
          </Text>
          <View style={{ marginTop: 5, gap: 2.5 }}>
            <View style={styles.backRow}>
              <Ionicons name="call-outline" size={9} color={textSub} />
              <Text style={[styles.backDetail, { color: textSub }]} numberOfLines={1}>
                {config.phone || '+234 800 000 0000'}
              </Text>
            </View>
            <View style={styles.backRow}>
              <Ionicons name="location-outline" size={9} color={textSub} />
              <Text style={[styles.backDetail, { color: textSub }]} numberOfLines={1}>
                {config.address || 'Gusau, Zamfara State'}
              </Text>
            </View>
          </View>
          {(config.description || '').trim().length > 0 ? (
            <Text style={[styles.backDesc, { color: textSub }]} numberOfLines={2}>
              {config.description}
            </Text>
          ) : (
            <Text style={[styles.backDesc, { color: textSub }]} numberOfLines={2}>
              {config.tier === 'premium'
                ? 'Scan for portfolio, pricing & instant booking.'
                : 'Scan or tap to connect instantly.'}
            </Text>
          )}
        </View>
      </View>
      <View style={styles.backFooter}>
        <Text style={[styles.backFooterText, { color: textSub }]}>SCAN · TAP · CONNECT</Text>
        <Text style={[styles.backFooterText, { color: textSub }]} numberOfLines={1}>
          pixelstudios.com/card/{config.username}
        </Text>
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
            <Animated.View style={{ opacity: frontOpacity, backfaceVisibility: 'hidden' }}>{front}</Animated.View>
            <Animated.View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                opacity: backOpacity,
                transform: [{ rotateY: '180deg' }],
                backfaceVisibility: 'hidden',
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
  logoImg: { width: 26, height: 26, borderRadius: 7, backgroundColor: 'rgba(255,255,255,0.12)' },
  pixelBadge: {
    width: 26,
    height: 26,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandText: { fontFamily: fonts.bold, fontSize: 8.5, letterSpacing: 2.2 },
  name: { fontFamily: fonts.bold, fontSize: 21, letterSpacing: -0.3 },
  business: { fontFamily: fonts.bold, fontSize: 12.5, marginTop: 2, opacity: 0.85 },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  url: { fontFamily: fonts.medium, fontSize: 10, flex: 1, marginRight: 8 },
  tapBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  tapText: { fontFamily: fonts.semi, fontSize: 8.5, letterSpacing: 1 },
  qrTile: {
    width: 66,
    height: 66,
    borderRadius: 11,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    ...({
      shadowColor: '#000',
      shadowOpacity: 0.25,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
    } as any),
  },
  backName: { fontFamily: fonts.bold, fontSize: 13.5, letterSpacing: -0.2 },
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
