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
  elevation: Math.round(y / 2),
});

/* ===========================================================================
 * TEMPLATE 1 — "Signature Dark": immersive studio showcase.
 * Dark canvas, 3D-tilted hero with floating proof chips, glass testimonial.
 * ========================================================================= */
function SignatureDark({ d }: { d: LandingData }) {
  const cfg = landingConfigs[d.businessType.id] ?? landingConfigs.general;
  const displayName = d.business || d.businessType.sample;
  const accent = d.businessType.accent;

  return (
    <View style={{ backgroundColor: '#0C0C0F', paddingBottom: 26 }}>
      {/* subtle grid texture */}
      <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.35 }}>
        {[0, 1, 2, 3].map((i) => (
          <View key={i} style={{ borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'rgba(255,255,255,0.06)', height: 90 }} />
        ))}
      </View>

      <View style={{ paddingHorizontal: 22, paddingTop: 22 }}>
        {/* status + rating */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={chip('rgba(191,245,73,0.12)')}>
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#BFF549' }} />
            <Text style={{ fontFamily: fonts.semi, fontSize: 10.5, color: '#BFF549', letterSpacing: 0.4 }}>Open now</Text>
          </View>
          <View style={chip('rgba(255,255,255,0.07)')}>
            <Ionicons name="star" size={10} color="#FBBF24" />
            <Text style={{ fontFamily: fonts.semi, fontSize: 10.5, color: '#F4F4F2' }}>{d.businessType.rating}</Text>
            <Text style={{ fontFamily: fonts.regular, fontSize: 10, color: '#9B9BA1' }}>· {d.businessType.reviews}</Text>
          </View>
        </View>

        {/* headline */}
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
          {/* floating chips */}
          <View style={[floatChip('#0C0C0F'), { top: -12, left: -6, borderColor: 'rgba(255,255,255,0.14)', transform: [{ rotate: '-3deg' }] }]}>
            <Text style={{ fontSize: 13 }}>{d.businessType.emoji}</Text>
            <Text style={{ fontFamily: fonts.bold, fontSize: 10.5, color: '#F4F4F2', letterSpacing: 0.8 }}>{d.businessType.badge}</Text>
          </View>
          <View style={[floatChip('#0C0C0F'), { bottom: -10, right: -4, borderColor: 'rgba(191,245,73,0.4)', transform: [{ rotate: '2deg' }] }]}>
            <Ionicons name="checkmark-circle" size={13} color="#BFF549" />
            <Text style={{ fontFamily: fonts.semi, fontSize: 10.5, color: '#BFF549' }}>Verified Business</Text>
          </View>
        </View>

        {/* identity */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 22 }}>
          {d.profileUri ? (
            <Image source={{ uri: d.profileUri }} style={{ width: 52, height: 52, borderRadius: 26, borderWidth: 2, borderColor: accent }} />
          ) : (
            <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: accent + '26', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: accent }}>
              <Text style={{ fontSize: 22 }}>{d.businessType.emoji}</Text>
            </View>
          )}
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: fonts.bold, fontSize: 18, color: '#F4F4F2', letterSpacing: -0.3 }}>{displayName}</Text>
            <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: '#9B9BA1', marginTop: 1 }}>{d.businessType.label} · Gusau, Nigeria</Text>
          </View>
          {d.logoUri ? (
            <Image source={{ uri: d.logoUri }} style={{ width: 34, height: 34, borderRadius: 9 }} />
          ) : (
            <View style={{ width: 34, height: 34, borderRadius: 9, backgroundColor: accent + '22', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 12, color: accent }}>▚</Text>
            </View>
          )}
        </View>

        {/* actions */}
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
          {['logo-whatsapp', 'call-outline', 'logo-instagram', 'map-outline'].map((icon) => (
            <View key={icon} style={{ flex: 1, height: 44, borderRadius: 13, backgroundColor: 'rgba(255,255,255,0.07)', borderWidth: StyleSheet.hairlineWidth, borderColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name={icon as any} size={18} color={accent} />
            </View>
          ))}
        </View>

        {/* profession section */}
        <BusinessSection d={d} dark />

        {/* description */}
        {d.description ? (
          <Text style={{ fontFamily: fonts.regular, fontSize: 12.5, lineHeight: 18, color: '#9B9BA1', marginTop: 16 }}>
            {d.description}
          </Text>
        ) : null}

        {/* testimonial */}
        <View style={{ marginTop: 16, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: StyleSheet.hairlineWidth, borderColor: 'rgba(255,255,255,0.1)', padding: 14 }}>
          <View style={{ flexDirection: 'row', gap: 2, marginBottom: 6 }}>
            {[0, 1, 2, 3, 4].map((i) => <Ionicons key={i} name="star" size={10} color="#FBBF24" />)}
          </View>
          <Text style={{ fontFamily: fonts.regular, fontSize: 12.5, lineHeight: 18, color: '#F4F4F2', fontStyle: 'italic' }}>
            "Absolutely reliable — the quality speaks for itself. I recommend {displayName} to everyone."
          </Text>
          <Text style={{ fontFamily: fonts.semi, fontSize: 10.5, color: '#9B9BA1', marginTop: 6 }}>— A happy customer</Text>
        </View>

        {/* contact */}
        <ContactRows d={d} dark />

        {/* CTA */}
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
 * TEMPLATE 2 — "Clean Light": editorial magazine layout.
 * Hairlines, numbered sections, framed print with caption.
 * ========================================================================= */
function CleanLight({ d }: { d: LandingData }) {
  const cfg = landingConfigs[d.businessType.id] ?? landingConfigs.general;
  const displayName = d.business || d.businessType.sample;

  return (
    <View style={{ backgroundColor: '#F5F4F0', paddingBottom: 26 }}>
      <View style={{ paddingHorizontal: 22, paddingTop: 20 }}>
        {/* masthead */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#141416' }}>
          <Text style={{ fontFamily: fonts.bold, fontSize: 9.5, letterSpacing: 2.4, color: '#141416' }}>PORTFOLIO — {displayName.toUpperCase()}</Text>
          <Text style={{ fontFamily: fonts.medium, fontSize: 9.5, letterSpacing: 1.6, color: '#6B6C72' }}>GUSAU, NG</Text>
        </View>

        {/* title block */}
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

        {/* framed print */}
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

        {/* identity */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 22 }}>
          {d.profileUri ? (
            <Image source={{ uri: d.profileUri }} style={{ width: 48, height: 48, borderRadius: 24, borderWidth: 2, borderColor: '#141416' }} />
          ) : (
            <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#141416', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 20 }}>{d.businessType.emoji}</Text>
            </View>
          )}
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: fonts.bold, fontSize: 16, color: '#141416' }}>{d.name || 'Owner'}</Text>
            <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: '#6B6C72', marginTop: 1 }}>{d.businessType.label} · {d.businessType.reviews}</Text>
          </View>
          <View style={chip('#FFFFFF')}>
            <Ionicons name="checkmark-circle" size={12} color="#16A34A" />
            <Text style={{ fontFamily: fonts.semi, fontSize: 10, color: '#141416' }}>Verified</Text>
          </View>
        </View>

        {/* numbered section */}
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

        {/* description */}
        {d.description ? (
          <Text style={{ fontFamily: fonts.regular, fontSize: 12.5, lineHeight: 18, color: '#6B6C72', marginTop: 16 }}>
            {d.description}
          </Text>
        ) : null}

        <ContactRows d={d} dark={false} />

        {/* CTA */}
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
 * TEMPLATE 3 — "Bold Brand": vivid neobrutalist layout.
 * Gradient canvas, sticker badges, polaroid stack, hard offset shadows.
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
        {/* sticker + name */}
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

        {/* polaroid stack */}
        <View style={{ flexDirection: 'row', marginTop: 20, marginBottom: 6 }}>
          <View style={{ width: '58%', backgroundColor: '#FFFFFF', padding: 7, paddingBottom: 18, borderRadius: 6, transform: [{ rotate: '-4deg' }], ...shadow(0.55, 18, 12) }}>
            <Image source={d.businessType.hero} style={{ width: '100%', height: 120, borderRadius: 3 }} contentFit="cover" />
            <Text style={{ fontFamily: fonts.semi, fontSize: 9.5, color: '#141416', textAlign: 'center', marginTop: 6 }}>{d.businessType.label}</Text>
          </View>
          <View style={{ flex: 1, marginLeft: -14, marginTop: 26 }}>
            <View style={{ backgroundColor: accent, borderRadius: 6, padding: 10, transform: [{ rotate: '5deg' }], ...shadow(0.45, 14, 10), marginBottom: 14 }}>
              <Text style={{ fontSize: 22 }}>{d.businessType.emoji}</Text>
              <Text style={{ fontFamily: fonts.extrabold, fontSize: 11, color: '#141416', marginTop: 4 }}>{d.businessType.rating} ★</Text>
              <Text style={{ fontFamily: fonts.semi, fontSize: 8.5, color: 'rgba(20,20,22,0.7)' }}>{d.businessType.reviews}</Text>
            </View>
            {d.profileUri ? (
              <Image source={{ uri: d.profileUri }} style={{ width: 62, height: 62, borderRadius: 31, borderWidth: 3, borderColor: '#FFFFFF', transform: [{ rotate: '3deg' }], ...shadow(0.4, 10, 6) }} />
            ) : (
              <View style={{ width: 62, height: 62, borderRadius: 31, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '3deg' }], ...shadow(0.4, 10, 6) }}>
                <Text style={{ fontSize: 26 }}>{d.businessType.emoji}</Text>
              </View>
            )}
          </View>
        </View>

        {/* item chips */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
          {cfg.items.map((it) => (
            <View key={it.label} style={{ backgroundColor: '#FFFFFF', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 7, borderWidth: 2, borderColor: '#141416', ...shadow(0.4, 6, 3) }}>
              <Text style={{ fontFamily: fonts.semi, fontSize: 11, color: '#141416' }}>
                {it.label}{it.price ? ` · ${it.price}` : ''}
              </Text>
            </View>
          ))}
        </View>

        {/* description */}
        {d.description ? (
          <Text style={{ fontFamily: fonts.regular, fontSize: 12.5, lineHeight: 18, color: 'rgba(255,255,255,0.75)', marginTop: 14 }}>
            {d.description}
          </Text>
        ) : null}

        <ContactRows d={d} dark />

        {/* CTA */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 18, borderRadius: 12, borderWidth: 2, borderColor: '#141416', backgroundColor: accent, paddingVertical: 14, ...shadow(0.5, 8, 5) }}>
          <Ionicons name={cfg.ctaIcon as any} size={16} color="#141416" />
          <Text style={{ fontFamily: fonts.extrabold, fontSize: 14.5, color: '#141416' }}>{cfg.cta}</Text>
        </View>

        {/* marquee strip */}
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

/* ================================ shared ================================== */

function chip(bg: string) {
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

function floatChip(bg: string) {
  return {
    position: 'absolute' as const,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 6,
    backgroundColor: bg,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 11,
    paddingVertical: 7,
    ...shadow(0.45, 12, 6),
  };
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
            <View style={{ width: 7, height: 7, borderRadius: 3.5, backgroundColor: accent, marginRight: 10 }} />
            <Text style={{ flex: 1, fontFamily: fonts.semi, fontSize: 13, color: dark ? '#F4F4F2' : '#141416' }}>{it.label}</Text>
            {it.price ? <Text style={{ fontFamily: fonts.bold, fontSize: 12.5, color: accent }}>{it.price}</Text> : null}
          </View>
        ))}
      </View>
    );
  }

  // gallery / shop
  const tiles = cfg.layout === 'shop' ? cfg.items.slice(0, 4) : cfg.items.slice(0, 3);
  return (
    <View style={{ flexDirection: 'row', gap: 8, marginTop: 16 }}>
      <View style={{ flex: 1.2, borderRadius: 12, overflow: 'hidden', ...shadow(0.4, 12, 7) }}>
        <Image source={d.businessType.hero} style={{ width: '100%', height: 84 }} contentFit="cover" />
      </View>
      {tiles.slice(0, cfg.layout === 'shop' ? 2 : 2).map((it, i) => (
        <View key={it.label} style={{ flex: 1, borderRadius: 12, backgroundColor: accent + (i === 0 ? '40' : '22'), alignItems: 'center', justifyContent: 'center', height: 84 }}>
          <Text style={{ fontSize: 22 }}>{d.businessType.emoji}</Text>
          <Text style={{ fontFamily: fonts.semi, fontSize: 9.5, color: dark ? '#F4F4F2' : '#141416', marginTop: 3, textAlign: 'center', paddingHorizontal: 4 }}>{it.label}</Text>
        </View>
      ))}
    </View>
  );
}

function ContactRows({ d, dark }: { d: LandingData; dark: boolean }) {
  const text = dark ? '#F4F4F2' : '#141416';
  const sub = dark ? '#9B9BA1' : '#6B6C72';
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

function Footer({ d, sub }: { d: LandingData; sub: string }) {
  const user = slugify(d.name || d.business || d.businessType.sample);
  return (
    <View style={{ alignItems: 'center', marginTop: 22, gap: 4 }}>
      <Text style={{ fontFamily: fonts.medium, fontSize: 11.5, color: sub }}>pixelstudios.com/card/{user}</Text>
      <Text style={{ fontFamily: fonts.bold, fontSize: 8, letterSpacing: 2.2, color: sub }}>MADE WITH ▚ PIXEL STUDIOS</Text>
    </View>
  );
}

/* ================================ dispatch ================================= */

export default function LandingPage(props: LandingData) {
  if (props.template.id === 'clean') return <CleanLight d={props} />;
  if (props.template.id === 'bold') return <BoldBrand d={props} />;
  return <SignatureDark d={props} />;
}
