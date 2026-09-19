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
};

/**
 * Interactive 3D smart card.
 * Tap to flip front/back — the flip and the idle sway run on separate nested
 * animated layers so the transforms never collide.
 */
export default function SmartCard({ config }: { config: CardConfig }) {
  const flip = useRef(new Animated.Value(0)).current; // 0 = front, 1 = back
  const sway = useRef(new Animated.Value(0)).current;
  const [showingBack, setShowingBack] = useState(false);

  // Gentle idle sway so the card feels 3D even at rest.
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

  const isPaper = config.material === 'paper';
  const cardBg = isPaper ? '#F2F0EA' : '#0E0E11';
  const textMain = isPaper ? '#141416' : '#F4F4F2';
  const textSub = isPaper ? 'rgba(20,20,22,0.55)' : 'rgba(244,244,242,0.55)';

  const faceBase: any = [styles.face, { backgroundColor: cardBg, borderColor: isPaper ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.12)' }];

  const front = (
    <View style={faceBase}>
      {!isPaper && <View style={styles.plasticSheen} />}
      <View style={styles.topRow}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          {config.designMode === 'logo' && config.logoUri ? (
            <Image source={{ uri: config.logoUri }} style={styles.logoImg} />
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
        <Text style={[styles.business, { color: textSub }]} numberOfLines={1}>
          {config.business || 'Your Business'}
        </Text>
        <View style={styles.bottomRow}>
          <Text style={[styles.url, { color: textSub }]}>
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

  const back = (
    <View style={faceBase}>
      {!isPaper && <View style={styles.plasticSheen} />}
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10 }}>
        <View style={[styles.qrBlock, { borderColor: textSub }]}>
          <Ionicons name="qr-code" size={40} color={textMain} />
        </View>
        <Text style={{ fontFamily: fonts.semi, fontSize: 12, letterSpacing: 2, color: textMain }}>
          SCAN · TAP · CONNECT
        </Text>
        <Text style={{ fontFamily: fonts.regular, fontSize: 10.5, color: textSub, textAlign: 'center' }}>
          {config.tier === 'premium'
            ? `Opens pixelstudios.com/card/${config.username}`
            : 'Opens your link instantly — no app needed'}
        </Text>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        <Text style={{ fontFamily: fonts.bold, fontSize: 8.5, letterSpacing: 2.4, color: textSub }}>
          MADE BY PIXEL STUDIOS · GUSAU, NIGERIA
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
            <View style={{ backfaceVisibility: 'hidden' }}>{front}</View>
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                transform: [{ rotateY: '180deg' }],
                backfaceVisibility: 'hidden',
              }}>
              {back}
            </View>
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
  name: { fontFamily: fonts.semi, fontSize: 21, letterSpacing: -0.3 },
  business: { fontFamily: fonts.regular, fontSize: 12.5, marginTop: 2 },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  url: { fontFamily: fonts.medium, fontSize: 10 },
  tapBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  tapText: { fontFamily: fonts.semi, fontSize: 8.5, letterSpacing: 1 },
  qrBlock: {
    width: 74,
    height: 74,
    borderRadius: 14,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flipHintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 12,
  },
  flipHint: { fontFamily: fonts.medium, fontSize: 12 },
});
