import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { fonts } from '../constants/theme';
import { BusinessType, CardTemplate, landingConfigs, slugify } from '../data/cardTemplates';

export type LandingData = {
  template: CardTemplate;
  businessType: BusinessType;
  name: string;
  business: string;
  rank?: string;
  profileUri?: string | null;
  logoUri?: string | null;
  phone?: string;
  address?: string;
  description?: string;
};

const shadow = (opacity: number, radius: number, y: number) => ({
  shadowColor: '#000',
  shadowOpacity: opacity,
  shadowRadius: radius,
  shadowOffset: { width: 0, height: y },
  elevation: Math.min(24, Math.round(y * 0.8)),
});

/* ============================== shared pieces ============================== */

function chipRow(bg: string) {
  return {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 5,
    backgroundColor: bg,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  };
}

/** Owner photo / initial avatar + bold name — the hero identity of the page. */
function OwnerBlock({
  d,
  text,
  sub,
  accent,
  center,
}: {
  d: LandingData;
  text: string;
  sub: string;
  accent: string;
  center?: boolean;
}) {
  const displayName = d.business || d.businessType.sample;
  const initial = (d.name || displayName).trim().charAt(0).toUpperCase() || 'O';
  const avatar = d.profileUri ? (
    <Image source={{ uri: d.profileUri }} style={{ width: 62, height: 62, borderRadius: 31, borderWidth: 2.5, borderColor: accent }} />
  ) : (
    <View style={{ width: 62, height: 62, borderRadius: 31, backgroundColor: accent + '26', borderWidth: 2.5, borderColor: accent, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontFamily: fonts.extrabold, fontSize: 24, color: accent }}>{initial}</Text>
    </View>
  );

  const rank = (d.rank || 'Owner').trim();

  if (center) {
    return (
      <View style={{ alignItems: 'center', marginTop: 18 }}>
        {avatar}
        <Text style={{ fontFamily: fonts.extrabold, fontSize: 22, letterSpacing: -0.6, color: text, marginTop: 10 }}>
          {d.name || displayName}
        </Text>
        <Text style={{ fontFamily: fonts.bold, fontSize: 10.5, letterSpacing: 2, color: accent, marginTop: 4 }}>
          {rank.toUpperCase()}
        </Text>
        <Text style={{ fontFamily: fonts.medium, fontSize: 12.5, color: sub, marginTop: 2 }}>
          {displayName}
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 13, marginTop: 18 }}>
      {avatar}
      <View style={{ flex: 1 }}>
        <Text style={{ fontFamily: fonts.extrabold, fontSize: 19, letterSpacing: -0.4, color: text }} numberOfLines={1}>
          {d.name || displayName}
        </Text>
        <Text style={{ fontFamily: fonts.bold, fontSize: 10, letterSpacing: 1.6, color: accent, marginTop: 2 }}>
          {rank.toUpperCase()}
        </Text>
        <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: sub, marginTop: 2 }}>
          {d.businessType.label}
        </Text>
      </View>
      <View style={chipRow(accent + '1F')}>
        <Ionicons name="checkmark-circle" size={12} color={accent} />
        <Text style={{ fontFamily: fonts.semi, fontSize: 10, color: text }}>Verified</Text>
      </View>
    </View>
  );
}

function StatsHours({ d, text, sub, accent }: { d: LandingData; text: string; sub: string; accent: string }) {
  return (
    <View style={{ gap: 7, marginTop: 14 }}>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <View style={[chipRow(accent + '14'), { flex: 1, justifyContent: 'center' }]}>
          <Ionicons name="star" size={11} color="#FBBF24" />
          <Text style={{ fontFamily: fonts.bold, fontSize: 11, color: text }}>{d.businessType.rating}</Text>
          <Text style={{ fontFamily: fonts.regular, fontSize: 10, color: sub }}>rating</Text>
        </View>
        <View style={[chipRow(accent + '14'), { flex: 1.4, justifyContent: 'center' }]}>
          <Ionicons name="people-outline" size={11} color={accent} />
          <Text style={{ fontFamily: fonts.bold, fontSize: 11, color: text }}>{d.businessType.reviews}</Text>
        </View>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 2 }}>
        <Ionicons name="time-outline" size={12} color={sub} />
        <Text style={{ fontFamily: fonts.medium, fontSize: 11.5, color: sub }}>{d.businessType.hours}</Text>
      </View>
    </View>
  );
}

function ActionButtons({ accent, surface, border }: { accent: string; surface: string; border: string }) {
  return (
    <View style={{ flexDirection: 'row', gap: 10, marginTop: 15 }}>
      {[
        { icon: 'logo-whatsapp', label: 'Chat' },
        { icon: 'call-outline', label: 'Call' },
        { icon: 'logo-instagram', label: 'Insta' },
        { icon: 'map-outline', label: 'Map' },
      ].map((a) => (
        <View key={a.icon} style={{ flex: 1, alignItems: 'center', gap: 4 }}>
          <View style={{ width: 46, height: 46, borderRadius: 14, backgroundColor: surface, borderWidth: StyleSheet.hairlineWidth, borderColor: border, alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name={a.icon as any} size={18} color={accent} />
          </View>
          <Text style={{ fontFamily: fonts.medium, fontSize: 9, color: '#9B9BA1' }}>{a.label}</Text>
        </View>
      ))}
    </View>
  );
}

function BusinessSection({ d, dark }: { d: LandingData; dark: boolean }) {
  const cfg = landingConfigs[d.businessType.id] ?? landingConfigs.general;
  const accent = d.businessType.accent;

  if (cfg.urgentNote) {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#DC2626', borderRadius: 11, paddingVertical: 10, marginTop: 16 }}>
        <Ionicons name="flash" size={13} color="#FFFFFF" />
        <Text style={{ fontFamily: fonts.bold, fontSize: 12, color: '#FFFFFF', letterSpacing: 0.8 }}>{cfg.urgentNote}</Text>
      </View>
    );
  }

  if (cfg.layout === 'menu' || cfg.layout === 'services') {
    return (
      <View style={{ marginTop: 16, borderRadius: 14, backgroundColor: dark ? 'rgba(255,255,255,0.05)' : '#FFFFFF', borderWidth: StyleSheet.hairlineWidth, borderColor: dark ? 'rgba(255,255,255,0.1)' : 'rgba(20,20,22,0.1)', paddingHorizontal: 14, paddingVertical: 2 }}>
        {cfg.items.map((it, i) => (
          <View key={it.label} style={[{ flexDirection: 'row', alignItems: 'center', paddingVertical: 11 }, i > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: dark ? 'rgba(255,255,255,0.1)' : 'rgba(20,20,22,0.1)' }]}>
            <Ionicons name="checkmark-circle" size={14} color={accent} style={{ marginRight: 10 }} />
            <Text style={{ flex: 1, fontFamily: fonts.semi, fontSize: 13, color: dark ? '#F4F4F2' : '#141416' }}>{it.label}</Text>
            {it.price ? <Text style={{ fontFamily: fonts.bold, fontSize: 12.5, color: accent }}>{it.price}</Text> : null}
          </View>
        ))}
      </View>
    );
  }

  const tiles = cfg.items.slice(0, cfg.layout === 'shop' ? 4 : 3);
  return (
    <View style={{ flexDirection: 'row', gap: 8, marginTop: 16 }}>
      <View style={{ flex: 1.2, borderRadius: 12, overflow: 'hidden', ...shadow(0.4, 12, 7) }}>
        <Image source={d.businessType.hero} style={{ width: '100%', height: 84 }} contentFit="cover" />
      </View>
      {tiles.slice(0, 2).map((it, i) => (
        <View key={it.label} style={{ flex: 1, borderRadius: 12, backgroundColor: accent + (i === 0 ? '40' : '22'), alignItems: 'center', justifyContent: 'center', height: 84, gap: 4 }}>
          <Ionicons name={d.businessType.icon as any} size={20} color={dark ? '#F4F4F2' : '#141416'} />
          <Text style={{ fontFamily: fonts.semi, fontSize: 9.5, color: dark ? '#F4F4F2' : '#141416', textAlign: 'center', paddingHorizontal: 4 }}>{it.label}</Text>
        </View>
      ))}
    </View>
  );
}

function ContactRows({ d, text, sub }: { d: LandingData; text: string; sub: string }) {
  const rows = [
    d.phone ? { icon: 'call-outline', value: d.phone } : null,
    d.address ? { icon: 'location-outline', value: d.address } : null,
  ].filter(Boolean) as { icon: string; value: string }[];
  if (rows.length === 0) return null;
  return (
    <View style={{ marginTop: 14, gap: 7 }}>
      {rows.map((r) => (
        <View key={r.icon} style={{ flexDirection: 'row', alignItems: 'center', gap: 9 }}>
          <Ionicons name={r.icon as any} size={13} color={sub} />
          <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: text }}>{r.value}</Text>
        </View>
      ))}
    </View>
  );
}

function Footer({ d, sub, text }: { d: LandingData; sub: string; text?: string }) {
  const displayName = d.business || d.businessType.sample;
  return (
    <View style={{ alignItems: 'center', marginTop: 22, gap: 4 }}>
      <Text style={{ fontFamily: fonts.bold, fontSize: 12, letterSpacing: 1.2, color: text ?? sub }}>{displayName.toUpperCase()}</Text>
      <Text style={{ fontFamily: fonts.bold, fontSize: 8, letterSpacing: 2.2, color: sub }}>POWERED BY ▚ PIXEL STUDIOS</Text>
    </View>
  );
}

/* ===========================================================================
 * 1 · SIGNATURE DARK — immersive studio showcase, 3D hero, glass testimonial.
 * ========================================================================= */
function SignatureDark({ d }: { d: LandingData }) {
  const cfg = landingConfigs[d.businessType.id] ?? landingConfigs.general;
  const displayName = d.business || d.businessType.sample;
  const accent = d.businessType.accent;

  return (
    <View style={{ backgroundColor: '#0C0C0F', paddingBottom: 26 }}>
      <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.35 }}>
        {[0, 1, 2, 3].map((i) => (
          <View key={i} style={{ borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'rgba(255,255,255,0.06)', height: 90 }} />
        ))}
      </View>
      <View style={{ paddingHorizontal: 22, paddingTop: 22 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={chipRow('rgba(191,245,73,0.12)')}>
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#BFF549' }} />
            <Text style={{ fontFamily: fonts.semi, fontSize: 10.5, color: '#BFF549', letterSpacing: 0.4 }}>Open now</Text>
          </View>
          <View style={chipRow('rgba(255,255,255,0.07)')}>
            <Ionicons name="star" size={10} color="#FBBF24" />
            <Text style={{ fontFamily: fonts.semi, fontSize: 10.5, color: '#F4F4F2' }}>{d.businessType.rating}</Text>
            <Text style={{ fontFamily: fonts.regular, fontSize: 10, color: '#9B9BA1' }}>· {d.businessType.reviews}</Text>
          </View>
        </View>

        <Text style={{ fontFamily: fonts.extrabold, fontSize: 27, lineHeight: 31, letterSpacing: -0.9, color: '#F4F4F2', marginTop: 16, maxWidth: 330 }}>
          {cfg.headline}
        </Text>
        <Text style={{ fontFamily: fonts.regular, fontSize: 13.5, color: '#9B9BA1', marginTop: 6, maxWidth: 330 }}>
          {displayName} · {d.businessType.tagline}
        </Text>

        {/* 3D hero */}
        <View style={{ marginTop: 20, marginBottom: 10 }}>
          <View style={{ transform: [{ perspective: 1000 }] }}>
            <View style={{ transform: [{ rotateX: '5deg' }, { rotateY: '-6deg' }], borderRadius: 18, overflow: 'hidden', ...shadow(0.65, 28, 18) }}>
              <Image source={d.businessType.hero} style={{ width: '100%', height: 200 }} contentFit="cover" />
              <LinearGradient colors={['rgba(12,12,15,0.6)', 'transparent']} locations={[0, 0.4]} style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 70 }} />
            </View>
          </View>
          <View style={{ position: 'absolute', top: -12, left: -6, flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#0C0C0F', borderRadius: 999, borderWidth: 1, borderColor: 'rgba(255,255,255,0.14)', paddingHorizontal: 11, paddingVertical: 7, transform: [{ rotate: '-3deg' }], ...shadow(0.45, 12, 6) }}>
            <Ionicons name={d.businessType.icon as any} size={12} color={accent} />
            <Text style={{ fontFamily: fonts.bold, fontSize: 10.5, color: '#F4F4F2', letterSpacing: 0.8 }}>{d.businessType.badge}</Text>
          </View>
          <View style={{ position: 'absolute', bottom: -10, right: -4, flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#0C0C0F', borderRadius: 999, borderWidth: 1, borderColor: 'rgba(191,245,73,0.4)', paddingHorizontal: 11, paddingVertical: 7, transform: [{ rotate: '2deg' }], ...shadow(0.45, 12, 6) }}>
            <Ionicons name="checkmark-circle" size={13} color="#BFF549" />
            <Text style={{ fontFamily: fonts.semi, fontSize: 10.5, color: '#BFF549' }}>Verified Business</Text>
          </View>
        </View>

        <OwnerBlock d={d} text="#F4F4F2" sub="#9B9BA1" accent={accent} />
        <ActionButtons accent={accent} surface="rgba(255,255,255,0.07)" border="rgba(255,255,255,0.12)" />
        <BusinessSection d={d} dark />
        <StatsHours d={d} text="#F4F4F2" sub="#9B9BA1" accent={accent} />

        {d.description ? (
          <Text style={{ fontFamily: fonts.regular, fontSize: 12.5, lineHeight: 18, color: '#9B9BA1', marginTop: 16 }}>{d.description}</Text>
        ) : null}

        <View style={{ marginTop: 16, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: StyleSheet.hairlineWidth, borderColor: 'rgba(255,255,255,0.1)', padding: 14 }}>
          <View style={{ flexDirection: 'row', gap: 2, marginBottom: 6 }}>
            {[0, 1, 2, 3, 4].map((i) => <Ionicons key={i} name="star" size={10} color="#FBBF24" />)}
          </View>
          <Text style={{ fontFamily: fonts.regular, fontSize: 12.5, lineHeight: 18, color: '#F4F4F2', fontStyle: 'italic' }}>
            "Absolutely reliable — the quality speaks for itself. I recommend {displayName} to everyone."
          </Text>
          <Text style={{ fontFamily: fonts.semi, fontSize: 10.5, color: '#9B9BA1', marginTop: 6 }}>— A happy customer</Text>
        </View>

        <ContactRows d={d} text="#F4F4F2" sub="#9B9BA1" />

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 18, borderRadius: 13, paddingVertical: 14, backgroundColor: accent, ...shadow(0.5, 18, 8) }}>
          <Ionicons name={cfg.ctaIcon as any} size={16} color="#0C0C0F" />
          <Text style={{ fontFamily: fonts.bold, fontSize: 14.5, color: '#0C0C0F' }}>{cfg.cta}</Text>
        </View>
        <Footer d={d} sub="#5E5E66" />
      </View>
    </View>
  );
}

/* ===========================================================================
 * 2 · CLEAN LIGHT — editorial magazine: hairlines, framed print, numbered list.
 * ========================================================================= */
function CleanLight({ d }: { d: LandingData }) {
  const cfg = landingConfigs[d.businessType.id] ?? landingConfigs.general;
  const displayName = d.business || d.businessType.sample;

  return (
    <View style={{ backgroundColor: '#F5F4F0', paddingBottom: 26 }}>
      <View style={{ paddingHorizontal: 22, paddingTop: 20 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#141416' }}>
          <Text style={{ fontFamily: fonts.bold, fontSize: 9.5, letterSpacing: 2.4, color: '#141416' }}>PORTFOLIO — {displayName.toUpperCase()}</Text>
          <Text style={{ fontFamily: fonts.medium, fontSize: 9.5, letterSpacing: 1.6, color: '#6B6C72' }}>GUSAU, NG</Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 18 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: fonts.extrabold, fontSize: 30, lineHeight: 32, letterSpacing: -1.1, color: '#141416' }}>{displayName}</Text>
            <Text style={{ fontFamily: fonts.regular, fontSize: 13, color: '#6B6C72', marginTop: 6, maxWidth: 260 }}>{cfg.headline}</Text>
          </View>
          {d.logoUri ? (
            <Image source={{ uri: d.logoUri }} style={{ width: 38, height: 38, borderRadius: 10 }} />
          ) : (
            <View style={{ width: 38, height: 38, borderRadius: 10, backgroundColor: '#141416', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 14, color: '#F5F4F0' }}>▚</Text>
            </View>
          )}
        </View>

        <View style={{ marginTop: 20, transform: [{ perspective: 1000 }] }}>
          <View style={{ backgroundColor: '#FFFFFF', padding: 10, borderRadius: 6, transform: [{ rotateY: '3deg' }], ...shadow(0.18, 20, 12) }}>
            <Image source={d.businessType.hero} style={{ width: '100%', height: 190, borderRadius: 3 }} contentFit="cover" />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10 }}>
              <Text style={{ fontFamily: fonts.regular, fontSize: 11, fontStyle: 'italic', color: '#6B6C72' }}>
                Fig. 01 — Signature work, {d.businessType.label}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Ionicons name="star" size={9} color="#141416" />
                <Text style={{ fontFamily: fonts.semi, fontSize: 10, color: '#141416' }}>{d.businessType.rating}</Text>
              </View>
            </View>
          </View>
        </View>

        <OwnerBlock d={d} text="#141416" sub="#6B6C72" accent="#141416" />

        <View style={{ marginTop: 22 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <Text style={{ fontFamily: fonts.extrabold, fontSize: 12, color: '#141416' }}>01</Text>
            <View style={{ flex: 1, height: 1, backgroundColor: '#141416' }} />
            <Text style={{ fontFamily: fonts.semi, fontSize: 10, letterSpacing: 2, color: '#6B6C72' }}>
              {cfg.layout === 'menu' ? 'MENU' : cfg.layout === 'services' ? 'SERVICES' : 'WHAT WE DO'}
            </Text>
          </View>
          {cfg.items.map((it, i) => (
            <View key={it.label} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'rgba(20,20,22,0.18)' }}>
              <Text style={{ fontFamily: fonts.medium, fontSize: 10.5, color: '#9C9DA3', width: 24 }}>{String(i + 1).padStart(2, '0')}</Text>
              <Text style={{ flex: 1, fontFamily: fonts.semi, fontSize: 14, color: '#141416' }}>{it.label}</Text>
              {it.price ? (
                <Text style={{ fontFamily: fonts.semi, fontSize: 13, color: '#141416' }}>{it.price}</Text>
              ) : (
                <Ionicons name="arrow-forward" size={13} color="#141416" />
              )}
            </View>
          ))}
        </View>

        <StatsHours d={d} text="#141416" sub="#6B6C72" accent="#141416" />
        {d.description ? (
          <Text style={{ fontFamily: fonts.regular, fontSize: 12.5, lineHeight: 18, color: '#6B6C72', marginTop: 16 }}>{d.description}</Text>
        ) : null}
        <ContactRows d={d} text="#141416" sub="#6B6C72" />

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 18, borderRadius: 4, paddingVertical: 14, paddingHorizontal: 18, backgroundColor: '#141416' }}>
          <Text style={{ fontFamily: fonts.bold, fontSize: 14, color: '#F5F4F0' }}>{cfg.cta}</Text>
          <Ionicons name="arrow-forward" size={16} color="#F5F4F0" />
        </View>
        <Footer d={d} sub="#9C9DA3" />
      </View>
    </View>
  );
}

/* ===========================================================================
 * 3 · BOLD BRAND — vivid neobrutalist: sticker badges, polaroid stack.
 * ========================================================================= */
function BoldBrand({ d }: { d: LandingData }) {
  const cfg = landingConfigs[d.businessType.id] ?? landingConfigs.general;
  const displayName = d.business || d.businessType.sample;
  const accent = d.businessType.accent;

  return (
    <View style={{ paddingBottom: 26 }}>
      <LinearGradient colors={['#16102E', '#2A1650']} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
      <LinearGradient colors={[accent + '55', 'transparent']} style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 240 }} />

      <View style={{ paddingHorizontal: 22, paddingTop: 20 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ backgroundColor: '#FFFFFF', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, transform: [{ rotate: '-4deg' }], ...shadow(0.4, 10, 5) }}>
            <Text style={{ fontFamily: fonts.extrabold, fontSize: 10.5, color: '#141416', letterSpacing: 1 }}>★ {d.businessType.badge}</Text>
          </View>
          {d.logoUri ? (
            <Image source={{ uri: d.logoUri }} style={{ width: 34, height: 34, borderRadius: 8, borderWidth: 2, borderColor: '#FFFFFF' }} />
          ) : (
            <View style={{ width: 34, height: 34, borderRadius: 8, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 13, color: '#2A1650' }}>▚</Text>
            </View>
          )}
        </View>

        <Text style={{ fontFamily: fonts.extrabold, fontSize: 31, lineHeight: 33, letterSpacing: -1, color: '#FFFFFF', marginTop: 18 }}>
          {displayName}
        </Text>
        <Text style={{ fontFamily: fonts.semi, fontSize: 14, color: accent, marginTop: 4 }}>{cfg.headline}</Text>

        <View style={{ flexDirection: 'row', marginTop: 20, marginBottom: 6 }}>
          <View style={{ width: '58%', backgroundColor: '#FFFFFF', padding: 7, paddingBottom: 18, borderRadius: 6, transform: [{ rotate: '-4deg' }], ...shadow(0.55, 18, 12) }}>
            <Image source={d.businessType.hero} style={{ width: '100%', height: 120, borderRadius: 3 }} contentFit="cover" />
            <Text style={{ fontFamily: fonts.semi, fontSize: 9.5, color: '#141416', textAlign: 'center', marginTop: 6 }}>{d.businessType.label}</Text>
          </View>
          <View style={{ flex: 1, marginLeft: -14, marginTop: 26 }}>
            <View style={{ backgroundColor: accent, borderRadius: 6, padding: 10, transform: [{ rotate: '5deg' }], ...shadow(0.45, 14, 10), marginBottom: 14 }}>
              <Ionicons name={d.businessType.icon as any} size={20} color="#141416" />
              <Text style={{ fontFamily: fonts.extrabold, fontSize: 11, color: '#141416', marginTop: 4 }}>{d.businessType.rating} ★</Text>
              <Text style={{ fontFamily: fonts.semi, fontSize: 8.5, color: 'rgba(20,20,22,0.7)' }}>{d.businessType.reviews}</Text>
            </View>
            {d.profileUri ? (
              <Image source={{ uri: d.profileUri }} style={{ width: 62, height: 62, borderRadius: 31, borderWidth: 3, borderColor: '#FFFFFF', transform: [{ rotate: '3deg' }], ...shadow(0.4, 10, 6) }} />
            ) : (
              <View style={{ width: 62, height: 62, borderRadius: 31, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '3deg' }], ...shadow(0.4, 10, 6) }}>
                <Ionicons name={d.businessType.icon as any} size={24} color="#2A1650" />
              </View>
            )}
          </View>
        </View>

        <OwnerBlock d={d} text="#FFFFFF" sub="rgba(255,255,255,0.6)" accent={accent} />

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
          {cfg.items.map((it) => (
            <View key={it.label} style={{ backgroundColor: '#FFFFFF', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 7, borderWidth: 2, borderColor: '#141416', ...shadow(0.4, 6, 3) }}>
              <Text style={{ fontFamily: fonts.semi, fontSize: 11, color: '#141416' }}>
                {it.label}{it.price ? ` · ${it.price}` : ''}
              </Text>
            </View>
          ))}
        </View>

        {d.description ? (
          <Text style={{ fontFamily: fonts.regular, fontSize: 12.5, lineHeight: 18, color: 'rgba(255,255,255,0.75)', marginTop: 14 }}>{d.description}</Text>
        ) : null}
        <ContactRows d={d} text="#FFFFFF" sub="rgba(255,255,255,0.6)" />

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 18, borderRadius: 12, borderWidth: 2, borderColor: '#141416', backgroundColor: accent, paddingVertical: 14, ...shadow(0.5, 8, 5) }}>
          <Ionicons name={cfg.ctaIcon as any} size={16} color="#141416" />
          <Text style={{ fontFamily: fonts.extrabold, fontSize: 14.5, color: '#141416' }}>{cfg.cta}</Text>
        </View>
        <View style={{ marginTop: 16, overflow: 'hidden' }}>
          <Text style={{ fontFamily: fonts.bold, fontSize: 9, letterSpacing: 3, color: accent, textAlign: 'center' }}>
            ★ SCAN · TAP · ORDER · SCAN · TAP · ORDER · SCAN · TAP · ORDER ★
          </Text>
        </View>
        <Footer d={d} sub="rgba(255,255,255,0.4)" />
      </View>
    </View>
  );
}

/* ===========================================================================
 * 4 · ELEGANT LUXE — centered, gold on black, arch image, fine hairlines.
 * ========================================================================= */
function ElegantLuxe({ d }: { d: LandingData }) {
  const cfg = landingConfigs[d.businessType.id] ?? landingConfigs.general;
  const displayName = d.business || d.businessType.sample;
  const gold = '#E6C079';

  return (
    <View style={{ backgroundColor: '#100D09', paddingBottom: 26 }}>
      <LinearGradient colors={['rgba(230,192,121,0.14)', 'transparent']} style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 200 }} />
      <View style={{ paddingHorizontal: 24, paddingTop: 24, alignItems: 'center' }}>
        <Text style={{ fontFamily: fonts.medium, fontSize: 9.5, letterSpacing: 3.4, color: gold }}>{displayName.toUpperCase()}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 }}>
          <View style={{ width: 34, height: StyleSheet.hairlineWidth, backgroundColor: gold }} />
          <Ionicons name="diamond-outline" size={11} color={gold} />
          <View style={{ width: 34, height: StyleSheet.hairlineWidth, backgroundColor: gold }} />
        </View>
        <Text style={{ fontFamily: fonts.thin, fontSize: 26, lineHeight: 32, letterSpacing: 0.2, color: '#F3EADA', textAlign: 'center', marginTop: 14, maxWidth: 300 }}>
          {cfg.headline}
        </Text>

        {/* Arch portrait — tall so the full image stays visible */}
        <View style={{ marginTop: 22, alignSelf: 'stretch', marginHorizontal: 8, ...shadow(0.6, 24, 14) }}>
          <View style={{ borderTopLeftRadius: 130, borderTopRightRadius: 130, borderBottomLeftRadius: 18, borderBottomRightRadius: 18, overflow: 'hidden', borderWidth: 1.5, borderColor: gold + '88' }}>
            <Image source={d.businessType.hero} style={{ width: '100%', height: 300 }} contentFit="cover" />
          </View>
        </View>

        <OwnerBlock d={d} text="#F3EADA" sub="#A79B85" accent={gold} center />
        <Text style={{ fontFamily: fonts.regular, fontSize: 12.5, color: '#A79B85', textAlign: 'center', marginTop: 10, maxWidth: 300, lineHeight: 18 }}>
          {d.businessType.tagline} · {d.businessType.hours}
        </Text>

        <View style={{ flexDirection: 'row', gap: 14, marginTop: 18 }}>
          {['logo-whatsapp', 'call-outline', 'map-outline'].map((icon) => (
            <View key={icon} style={{ width: 46, height: 46, borderRadius: 23, borderWidth: 1, borderColor: gold + '66', alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name={icon as any} size={17} color={gold} />
            </View>
          ))}
        </View>

        {/* Refined list */}
        <View style={{ alignSelf: 'stretch', marginTop: 22 }}>
          {cfg.items.map((it, i) => (
            <View key={it.label} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, paddingVertical: 11, borderTopWidth: StyleSheet.hairlineWidth, borderBottomWidth: i === cfg.items.length - 1 ? StyleSheet.hairlineWidth : 0, borderColor: 'rgba(230,192,121,0.25)' }}>
              <Text style={{ fontFamily: fonts.regular, fontSize: 13.5, color: '#F3EADA', letterSpacing: 0.6 }}>{it.label}</Text>
              {it.price ? <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: gold }}>{it.price}</Text> : null}
            </View>
          ))}
        </View>

        {d.description ? (
          <Text style={{ fontFamily: fonts.regular, fontSize: 12.5, lineHeight: 18, color: '#A79B85', marginTop: 16, textAlign: 'center' }}>{d.description}</Text>
        ) : null}
        <ContactRows d={d} text="#F3EADA" sub="#A79B85" />

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 20, alignSelf: 'stretch', borderRadius: 999, borderWidth: 1, borderColor: gold, backgroundColor: gold, paddingVertical: 13 }}>
          <Ionicons name={cfg.ctaIcon as any} size={15} color="#100D09" />
          <Text style={{ fontFamily: fonts.semi, fontSize: 13.5, letterSpacing: 1.4, color: '#100D09' }}>{cfg.cta.toUpperCase()}</Text>
        </View>
        <Footer d={d} sub="#6E6250" />
      </View>
    </View>
  );
}

/* ===========================================================================
 * 5 · TRUST PRO — corporate light: trust bar, checklist cards, blue CTA.
 * ========================================================================= */
function TrustPro({ d }: { d: LandingData }) {
  const cfg = landingConfigs[d.businessType.id] ?? landingConfigs.general;
  const displayName = d.business || d.businessType.sample;
  const blue = '#1D6FE0';

  return (
    <View style={{ backgroundColor: '#F4F7FB', paddingBottom: 26 }}>
      {/* trust bar */}
      <View style={{ backgroundColor: '#0F1B2D', flexDirection: 'row', justifyContent: 'center', gap: 14, paddingVertical: 8 }}>
        {[
          { icon: 'shield-checkmark-outline', label: 'Verified' },
          { icon: 'star-outline', label: `${d.businessType.rating} rated` },
          { icon: 'time-outline', label: 'Fast response' },
        ].map((t) => (
          <View key={t.label} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Ionicons name={t.icon as any} size={11} color="#7EB3FF" />
            <Text style={{ fontFamily: fonts.semi, fontSize: 9.5, color: '#DCE8FA' }}>{t.label}</Text>
          </View>
        ))}
      </View>

      <View style={{ paddingHorizontal: 22, paddingTop: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          {d.logoUri ? (
            <Image source={{ uri: d.logoUri }} style={{ width: 40, height: 40, borderRadius: 10 }} />
          ) : (
            <View style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: blue, alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name={d.businessType.icon as any} size={18} color="#FFFFFF" />
            </View>
          )}
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: fonts.extrabold, fontSize: 19, letterSpacing: -0.4, color: '#0F1B2D' }} numberOfLines={1}>{displayName}</Text>
            <Text style={{ fontFamily: fonts.medium, fontSize: 11.5, color: '#5A6B84' }}>{d.businessType.label}</Text>
          </View>
          <View style={chipRow('#E3F0E7')}>
            <Ionicons name="checkmark-circle" size={12} color="#16A34A" />
            <Text style={{ fontFamily: fonts.semi, fontSize: 10, color: '#166534' }}>Trusted</Text>
          </View>
        </View>

        <Text style={{ fontFamily: fonts.extrabold, fontSize: 25, lineHeight: 29, letterSpacing: -0.8, color: '#0F1B2D', marginTop: 16 }}>
          {cfg.headline}
        </Text>

        <View style={{ marginTop: 16, borderRadius: 16, overflow: 'hidden', ...shadow(0.25, 18, 10) }}>
          <Image source={d.businessType.hero} style={{ width: '100%', height: 170 }} contentFit="cover" />
        </View>

        <OwnerBlock d={d} text="#0F1B2D" sub="#5A6B84" accent={blue} />

        {/* checklist card */}
        <View style={{ marginTop: 16, borderRadius: 16, backgroundColor: '#FFFFFF', padding: 16, ...shadow(0.12, 12, 6) }}>
          <Text style={{ fontFamily: fonts.bold, fontSize: 13.5, color: '#0F1B2D', marginBottom: 4 }}>
            {cfg.layout === 'menu' ? 'Popular orders' : cfg.layout === 'services' ? 'Our services' : 'What we do'}
          </Text>
          {cfg.items.map((it) => (
            <View key={it.label} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8 }}>
              <Ionicons name="checkmark-circle" size={16} color={blue} style={{ marginRight: 10 }} />
              <Text style={{ flex: 1, fontFamily: fonts.medium, fontSize: 13, color: '#0F1B2D' }}>{it.label}</Text>
              {it.price ? <Text style={{ fontFamily: fonts.bold, fontSize: 12.5, color: blue }}>{it.price}</Text> : null}
            </View>
          ))}
        </View>

        {cfg.urgentNote ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#DC2626', borderRadius: 11, paddingVertical: 10, marginTop: 12 }}>
            <Ionicons name="flash" size={13} color="#FFFFFF" />
            <Text style={{ fontFamily: fonts.bold, fontSize: 12, color: '#FFFFFF' }}>{cfg.urgentNote}</Text>
          </View>
        ) : null}

        <StatsHours d={d} text="#0F1B2D" sub="#5A6B84" accent={blue} />
        {d.description ? (
          <Text style={{ fontFamily: fonts.regular, fontSize: 12.5, lineHeight: 18, color: '#5A6B84', marginTop: 16 }}>{d.description}</Text>
        ) : null}
        <ContactRows d={d} text="#0F1B2D" sub="#5A6B84" />

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 18, borderRadius: 12, backgroundColor: blue, paddingVertical: 14, ...shadow(0.35, 14, 7) }}>
          <Ionicons name={cfg.ctaIcon as any} size={16} color="#FFFFFF" />
          <Text style={{ fontFamily: fonts.bold, fontSize: 14.5, color: '#FFFFFF' }}>{cfg.cta}</Text>
        </View>
        <Footer d={d} sub="#9DAEC6" />
      </View>
    </View>
  );
}

/* ===========================================================================
 * 6 · FRESH POP — playful warm: rounded color blocks, sticker image, fun chips.
 * ========================================================================= */
function FreshPop({ d }: { d: LandingData }) {
  const cfg = landingConfigs[d.businessType.id] ?? landingConfigs.general;
  const displayName = d.business || d.businessType.sample;
  const orange = '#FF7A45';
  const accent = d.businessType.accent;

  return (
    <View style={{ backgroundColor: '#FFF8EF', paddingBottom: 26 }}>
      <View style={{ paddingHorizontal: 22, paddingTop: 20 }}>
        {/* candy header */}
        <View style={{ borderRadius: 26, backgroundColor: orange, padding: 18, transform: [{ rotate: '-1.2deg' }], ...shadow(0.35, 14, 8) }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ backgroundColor: '#FFF8EF', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5 }}>
              <Text style={{ fontFamily: fonts.extrabold, fontSize: 10, color: orange, letterSpacing: 1 }}>✦ {d.businessType.badge}</Text>
            </View>
            {d.logoUri ? (
              <Image source={{ uri: d.logoUri }} style={{ width: 30, height: 30, borderRadius: 15, borderWidth: 2, borderColor: '#FFF8EF' }} />
            ) : (
              <View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: '#FFF8EF', alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name={d.businessType.icon as any} size={14} color={orange} />
              </View>
            )}
          </View>
          <Text style={{ fontFamily: fonts.extrabold, fontSize: 26, lineHeight: 28, letterSpacing: -0.8, color: '#FFFFFF', marginTop: 12 }}>
            {displayName}
          </Text>
          <Text style={{ fontFamily: fonts.semi, fontSize: 13, color: '#FFE3D4', marginTop: 3 }}>{cfg.headline}</Text>
        </View>

        {/* sticker photo */}
        <View style={{ flexDirection: 'row', marginTop: -18, justifyContent: 'center' }}>
          <View style={{ width: 150, backgroundColor: '#FFFFFF', borderRadius: 20, padding: 8, transform: [{ rotate: '2.5deg' }], ...shadow(0.4, 16, 10) }}>
            <View style={{ borderRadius: 14, overflow: 'hidden' }}>
              <Image source={d.businessType.hero} style={{ width: '100%', height: 120 }} contentFit="cover" />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, marginTop: 6 }}>
              <Ionicons name="star" size={10} color="#FBBF24" />
              <Text style={{ fontFamily: fonts.bold, fontSize: 10.5, color: '#2A1E14' }}>{d.businessType.rating}</Text>
              <Text style={{ fontFamily: fonts.medium, fontSize: 9, color: '#8A7360' }}>· {d.businessType.reviews}</Text>
            </View>
          </View>
        </View>

        <OwnerBlock d={d} text="#2A1E14" sub="#8A7360" accent={orange} />

        {/* fun chips */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
          {cfg.items.map((it, i) => (
            <View key={it.label} style={{ backgroundColor: i % 2 === 0 ? accent + '33' : orange + '22', borderRadius: 999, paddingHorizontal: 13, paddingVertical: 8 }}>
              <Text style={{ fontFamily: fonts.bold, fontSize: 11.5, color: '#2A1E14' }}>
                {it.label}{it.price ? ` · ${it.price}` : ''}
              </Text>
            </View>
          ))}
        </View>

        <StatsHours d={d} text="#2A1E14" sub="#8A7360" accent={orange} />
        {d.description ? (
          <Text style={{ fontFamily: fonts.regular, fontSize: 12.5, lineHeight: 18, color: '#8A7360', marginTop: 16 }}>{d.description}</Text>
        ) : null}
        <ContactRows d={d} text="#2A1E14" sub="#8A7360" />

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 18, borderRadius: 999, backgroundColor: orange, paddingVertical: 15, ...shadow(0.4, 14, 8) }}>
          <Ionicons name={cfg.ctaIcon as any} size={16} color="#FFFFFF" />
          <Text style={{ fontFamily: fonts.extrabold, fontSize: 15, color: '#FFFFFF' }}>{cfg.cta}</Text>
        </View>
        <Footer d={d} sub="#C4AE97" />
      </View>
    </View>
  );
}

/* ===========================================================================
 * Institutional helpers — team rows with ranks (schools & organizations).
 * ========================================================================= */
function TeamSection({ d, text, sub, accent, surface }: { d: LandingData; text: string; sub: string; accent: string; surface: string }) {
  const team = d.businessType.team ?? [];
  if (team.length === 0) return null;
  return (
    <View style={{ alignSelf: 'stretch', marginTop: 20 }}>
      <Text style={{ fontFamily: fonts.bold, fontSize: 12, letterSpacing: 2, color: sub, marginBottom: 10 }}>
        {d.businessType.institutional ? 'OUR LEADERSHIP' : 'OUR TEAM'}
      </Text>
      <View style={{ borderRadius: 16, backgroundColor: surface, borderWidth: StyleSheet.hairlineWidth, borderColor: accent + '33', overflow: 'hidden' }}>
        {team.map((m, i) => {
          const initial = m.name.replace(/^(Mrs?\.|Ms\.|Alhaji)\s+/i, '').charAt(0).toUpperCase();
          return (
            <View
              key={m.name}
              style={[
                { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, paddingVertical: 12 },
                i > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: accent + '22' },
              ]}>
              <View style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: accent + '22', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontFamily: fonts.bold, fontSize: 14, color: accent }}>{initial}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: fonts.bold, fontSize: 13.5, color: text }}>{m.name}</Text>
                <Text style={{ fontFamily: fonts.bold, fontSize: 9, letterSpacing: 1.6, color: accent, marginTop: 2 }}>
                  {m.rank.toUpperCase()}
                </Text>
              </View>
              <Ionicons name="chatbubble-outline" size={14} color={sub} />
            </View>
          );
        })}
      </View>
    </View>
  );
}

/* ===========================================================================
 * 7 · CAMPUS CREST — for schools & academies: crest header, motto, noticeboard.
 * ========================================================================= */
function CampusCrest({ d }: { d: LandingData }) {
  const cfg = landingConfigs[d.businessType.id] ?? landingConfigs.general;
  const displayName = d.business || d.businessType.sample;
  const gold = '#E9C46A';

  return (
    <View style={{ backgroundColor: '#0E1B2C', paddingBottom: 26 }}>
      <LinearGradient colors={['rgba(233,196,106,0.12)', 'transparent']} style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 180 }} />
      <View style={{ paddingHorizontal: 22, paddingTop: 22 }}>
        {/* Crest header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          {d.logoUri ? (
            <Image source={{ uri: d.logoUri }} style={{ width: 52, height: 52, borderRadius: 26, borderWidth: 2, borderColor: gold }} />
          ) : (
            <View style={{ width: 52, height: 52, borderRadius: 26, borderWidth: 2, borderColor: gold, backgroundColor: '#16263C', alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="school" size={22} color={gold} />
            </View>
          )}
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: fonts.extrabold, fontSize: 19, letterSpacing: -0.3, color: '#EAF1FA' }} numberOfLines={1}>{displayName}</Text>
            <Text style={{ fontFamily: fonts.bold, fontSize: 8.5, letterSpacing: 2.2, color: gold, marginTop: 3 }}>
              KNOWLEDGE · DISCIPLINE · SERVICE
            </Text>
          </View>
          <View style={chipRow('rgba(233,196,106,0.14)')}>
            <Ionicons name="ribbon-outline" size={12} color={gold} />
            <Text style={{ fontFamily: fonts.semi, fontSize: 10, color: gold }}>{d.businessType.badge}</Text>
          </View>
        </View>

        <Text style={{ fontFamily: fonts.extrabold, fontSize: 25, lineHeight: 30, letterSpacing: -0.8, color: '#EAF1FA', marginTop: 18 }}>
          {cfg.headline}
        </Text>
        <Text style={{ fontFamily: fonts.regular, fontSize: 13, color: '#8FA5BF', marginTop: 6 }}>{d.businessType.tagline}</Text>

        <View style={{ marginTop: 16, borderRadius: 16, overflow: 'hidden', ...shadow(0.5, 20, 12) }}>
          <Image source={d.businessType.hero} style={{ width: '100%', height: 170 }} contentFit="cover" />
        </View>

        <OwnerBlock d={d} text="#EAF1FA" sub="#8FA5BF" accent={gold} />
        <TeamSection d={d} text="#EAF1FA" sub="#8FA5BF" accent={gold} surface="#16263C" />

        {/* Noticeboard */}
        <View style={{ marginTop: 16, borderRadius: 14, backgroundColor: '#16263C', borderWidth: StyleSheet.hairlineWidth, borderColor: 'rgba(233,196,106,0.25)', padding: 14 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <Ionicons name="megaphone-outline" size={13} color={gold} />
            <Text style={{ fontFamily: fonts.bold, fontSize: 11, letterSpacing: 1.6, color: gold }}>NOTICEBOARD</Text>
          </View>
          {cfg.items.map((it) => (
            <View key={it.label} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 6 }}>
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: gold, marginRight: 10 }} />
              <Text style={{ flex: 1, fontFamily: fonts.medium, fontSize: 12.5, color: '#EAF1FA' }}>{it.label}</Text>
              {it.price ? <Text style={{ fontFamily: fonts.semi, fontSize: 11.5, color: gold }}>{it.price}</Text> : null}
            </View>
          ))}
        </View>

        <StatsHours d={d} text="#EAF1FA" sub="#8FA5BF" accent={gold} />
        {d.description ? (
          <Text style={{ fontFamily: fonts.regular, fontSize: 12.5, lineHeight: 18, color: '#8FA5BF', marginTop: 16 }}>{d.description}</Text>
        ) : null}
        <ContactRows d={d} text="#EAF1FA" sub="#8FA5BF" />

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 18, borderRadius: 12, backgroundColor: gold, paddingVertical: 14 }}>
          <Ionicons name={cfg.ctaIcon as any} size={16} color="#0E1B2C" />
          <Text style={{ fontFamily: fonts.bold, fontSize: 14.5, color: '#0E1B2C' }}>{cfg.cta}</Text>
        </View>
        <Footer d={d} sub="#5D7290" text="#EAF1FA" />
      </View>
    </View>
  );
}

/* ===========================================================================
 * 8 · CORPORATE SUITE — for organizations: clean white, org chart, brief.
 * ========================================================================= */
function CorporateSuite({ d }: { d: LandingData }) {
  const cfg = landingConfigs[d.businessType.id] ?? landingConfigs.general;
  const displayName = d.business || d.businessType.sample;
  const blue = '#1D6FE0';

  return (
    <View style={{ backgroundColor: '#FFFFFF', paddingBottom: 26 }}>
      <View style={{ height: 5, backgroundColor: blue }} />
      <View style={{ paddingHorizontal: 22, paddingTop: 18 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          {d.logoUri ? (
            <Image source={{ uri: d.logoUri }} style={{ width: 46, height: 46, borderRadius: 12 }} />
          ) : (
            <View style={{ width: 46, height: 46, borderRadius: 12, backgroundColor: '#F2F5F9', borderWidth: 1, borderColor: '#E1E8F2', alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name={d.businessType.icon as any} size={20} color={blue} />
            </View>
          )}
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: fonts.extrabold, fontSize: 18, letterSpacing: -0.3, color: '#101B2B' }} numberOfLines={1}>{displayName}</Text>
            <Text style={{ fontFamily: fonts.medium, fontSize: 11.5, color: '#5E6E85' }}>{d.businessType.label}</Text>
          </View>
          <View style={chipRow('#EAF2FD')}>
            <Ionicons name="shield-checkmark-outline" size={12} color={blue} />
            <Text style={{ fontFamily: fonts.semi, fontSize: 10, color: blue }}>Registered</Text>
          </View>
        </View>

        <Text style={{ fontFamily: fonts.extrabold, fontSize: 25, lineHeight: 30, letterSpacing: -0.8, color: '#101B2B', marginTop: 18 }}>
          {cfg.headline}
        </Text>
        <Text style={{ fontFamily: fonts.regular, fontSize: 13, lineHeight: 19, color: '#5E6E85', marginTop: 6 }}>
          {d.description || d.businessType.tagline}
        </Text>

        <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
          {[
            { v: d.businessType.rating, l: 'Rating' },
            { v: d.businessType.reviews, l: 'Track record' },
            { v: '2019', l: 'Established' },
          ].map((s) => (
            <View key={s.l} style={{ flex: 1, borderRadius: 12, backgroundColor: '#F2F5F9', paddingVertical: 12, alignItems: 'center' }}>
              <Text style={{ fontFamily: fonts.extrabold, fontSize: 14, color: '#101B2B' }}>{s.v}</Text>
              <Text style={{ fontFamily: fonts.medium, fontSize: 9.5, color: '#5E6E85', marginTop: 2 }}>{s.l}</Text>
            </View>
          ))}
        </View>

        <OwnerBlock d={d} text="#101B2B" sub="#5E6E85" accent={blue} />
        <TeamSection d={d} text="#101B2B" sub="#5E6E85" accent={blue} surface="#F7F9FC" />

        {/* Focus areas */}
        <View style={{ marginTop: 16 }}>
          <Text style={{ fontFamily: fonts.bold, fontSize: 12, letterSpacing: 2, color: '#5E6E85', marginBottom: 8 }}>WHAT WE DO</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {cfg.items.map((it) => (
              <View key={it.label} style={{ borderRadius: 10, backgroundColor: '#EAF2FD', paddingHorizontal: 13, paddingVertical: 9 }}>
                <Text style={{ fontFamily: fonts.semi, fontSize: 12, color: '#1D6FE0' }}>{it.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <ContactRows d={d} text="#101B2B" sub="#5E6E85" />

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 18, borderRadius: 10, backgroundColor: blue, paddingVertical: 14 }}>
          <Ionicons name={cfg.ctaIcon as any} size={16} color="#FFFFFF" />
          <Text style={{ fontFamily: fonts.bold, fontSize: 14.5, color: '#FFFFFF' }}>{cfg.cta}</Text>
        </View>
        <Footer d={d} sub="#9DAEC6" text="#101B2B" />
      </View>
    </View>
  );
}

/* ===========================================================================
 * 9 · COMMUNITY WARM — for NGOs & community orgs: warm green, mission first.
 * ========================================================================= */
function CommunityWarm({ d }: { d: LandingData }) {
  const cfg = landingConfigs[d.businessType.id] ?? landingConfigs.general;
  const displayName = d.business || d.businessType.sample;
  const green = '#3E9B4F';

  return (
    <View style={{ backgroundColor: '#F1F7F0', paddingBottom: 26 }}>
      <View style={{ paddingHorizontal: 22, paddingTop: 20 }}>
        <View style={chipRow('#DFF0E2')}>
          <Ionicons name="heart" size={11} color={green} />
          <Text style={{ fontFamily: fonts.bold, fontSize: 10, color: green, letterSpacing: 1 }}>COMMUNITY FIRST</Text>
        </View>

        <Text style={{ fontFamily: fonts.extrabold, fontSize: 27, lineHeight: 31, letterSpacing: -0.9, color: '#1C2B1A', marginTop: 14 }}>
          {displayName}
        </Text>
        <Text style={{ fontFamily: fonts.regular, fontSize: 14, lineHeight: 20, color: '#66795F', marginTop: 6 }}>
          {cfg.headline}. {d.businessType.tagline}.
        </Text>

        <View style={{ marginTop: 16, borderRadius: 20, overflow: 'hidden', ...shadow(0.3, 16, 9) }}>
          <Image source={d.businessType.hero} style={{ width: '100%', height: 165 }} contentFit="cover" />
        </View>

        <OwnerBlock d={d} text="#1C2B1A" sub="#66795F" accent={green} />
        <TeamSection d={d} text="#1C2B1A" sub="#66795F" accent={green} surface="#FFFFFF" />

        {/* Programs */}
        <View style={{ marginTop: 16, gap: 8 }}>
          {cfg.items.map((it, i) => (
            <View key={it.label} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#FFFFFF', borderRadius: 14, padding: 13, ...shadow(0.12, 8, 4) }}>
              <View style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: green + (i === 1 ? '33' : '1F'), alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name={d.businessType.icon as any} size={15} color={green} />
              </View>
              <Text style={{ flex: 1, fontFamily: fonts.semi, fontSize: 13.5, color: '#1C2B1A' }}>{it.label}</Text>
              <Ionicons name="arrow-forward" size={13} color="#66795F" />
            </View>
          ))}
        </View>

        {d.description ? (
          <Text style={{ fontFamily: fonts.regular, fontSize: 12.5, lineHeight: 18, color: '#66795F', marginTop: 16 }}>{d.description}</Text>
        ) : null}
        <ContactRows d={d} text="#1C2B1A" sub="#66795F" />

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 18, borderRadius: 999, backgroundColor: green, paddingVertical: 14 }}>
          <Ionicons name={cfg.ctaIcon as any} size={16} color="#FFFFFF" />
          <Text style={{ fontFamily: fonts.bold, fontSize: 14.5, color: '#FFFFFF' }}>{cfg.cta}</Text>
        </View>
        <Footer d={d} sub="#9DB49A" text="#1C2B1A" />
      </View>
    </View>
  );
}

/* ================================ dispatch ================================= */

export default function LandingPage(props: LandingData) {
  switch (props.template.id) {
    case 'clean':
      return <CleanLight d={props} />;
    case 'bold':
      return <BoldBrand d={props} />;
    case 'luxe':
      return <ElegantLuxe d={props} />;
    case 'trust':
      return <TrustPro d={props} />;
    case 'pop':
      return <FreshPop d={props} />;
    case 'campus':
      return <CampusCrest d={props} />;
    case 'corporate':
      return <CorporateSuite d={props} />;
    case 'community':
      return <CommunityWarm d={props} />;
    default:
      return <SignatureDark d={props} />;
  }
}
