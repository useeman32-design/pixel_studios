import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { fonts } from '../constants/theme';
import { BusinessType, CardTemplate, landingConfigs, slugify } from '../data/cardTemplates';

/**
 * Full-size rendering of the customer's portfolio landing page
 * (pixelstudios.com/card/username) — exactly what their clients will see
 * when they scan the Smart Card.
 */
export default function LandingPage({
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
  const config = landingConfigs[businessType.id] ?? landingConfigs.general;
  const displayName = business || businessType.sample;
  const user = slugify(name || displayName);
  const accent = businessType.accent;

  return (
    <View style={[styles.wrap, { backgroundColor: template.bg }]}>
      {/* Hero */}
      <View style={[styles.hero, { backgroundColor: accent + '24' }]}>
        <Text style={styles.heroEmoji}>{businessType.emoji}</Text>
        <Text style={[styles.heroHeadline, { color: template.text }]}>{config.headline}</Text>
        {logoUri ? (
          <Image source={{ uri: logoUri }} style={styles.heroLogo} />
        ) : (
          <View style={[styles.heroLogoBadge, { backgroundColor: accent + '26' }]}>
            <Text style={{ fontSize: 14, color: accent }}>▚</Text>
          </View>
        )}
      </View>

      {/* Identity */}
      <View style={styles.identity}>
        {profileUri ? (
          <Image source={{ uri: profileUri }} style={[styles.avatar, { borderColor: accent }]} />
        ) : (
          <View style={[styles.avatar, styles.avatarFallback, { backgroundColor: accent + '33', borderColor: accent }]}>
            <Text style={{ fontSize: 34 }}>{businessType.emoji}</Text>
          </View>
        )}
        <Text style={[styles.bizName, { color: template.text }]}>{displayName}</Text>
        <Text style={[styles.tagline, { color: template.subtext }]}>{businessType.tagline}</Text>

        {/* Quick actions */}
        <View style={styles.actions}>
          {['logo-whatsapp', 'call-outline', 'logo-instagram', 'map-outline'].map((icon) => (
            <View key={icon} style={[styles.actionBtn, { backgroundColor: template.surface }]}>
              <Ionicons name={icon as any} size={20} color={accent} />
            </View>
          ))}
        </View>
      </View>

      {/* Urgent strip */}
      {config.urgentNote && (
        <View style={styles.urgentStrip}>
          <Ionicons name="flash" size={13} color="#FFFFFF" />
          <Text style={styles.urgentText}>{config.urgentNote}</Text>
        </View>
      )}

      {/* Sections */}
      {(config.layout === 'gallery' || config.layout === 'urgent') && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: template.text }]}>What we do</Text>
          <View style={styles.gallery}>
            {config.items.map((it, i) => (
              <View key={it.label} style={{ flex: 1, gap: 6 }}>
                <View style={[styles.galleryTile, { backgroundColor: accent + (i === 1 ? '55' : '2B') }]}>
                  <Text style={{ fontSize: 26 }}>{businessType.emoji}</Text>
                </View>
                <Text style={[styles.itemLabel, { color: template.subtext }]} numberOfLines={1}>
                  {it.label}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {config.layout === 'shop' && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: template.text }]}>New in store</Text>
          <View style={styles.shopGrid}>
            {config.items.map((it, i) => (
              <View key={it.label} style={{ gap: 6, width: '47%' }}>
                <View style={[styles.shopTile, { backgroundColor: accent + (i % 2 === 0 ? '40' : '26') }]}>
                  <Text style={{ fontSize: 30 }}>{businessType.emoji}</Text>
                </View>
                <Text style={[styles.itemLabel, { color: template.subtext }]} numberOfLines={1}>
                  {it.label}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {(config.layout === 'menu' || config.layout === 'services') && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: template.text }]}>
            {config.layout === 'menu' ? 'Menu highlights' : 'Our services'}
          </Text>
          <View style={[styles.listWrap, { backgroundColor: template.surface }]}>
            {config.items.map((it, i) => (
              <View
                key={it.label}
                style={[
                  styles.listRow,
                  i > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: 'rgba(128,128,128,0.25)' },
                ]}>
                <View style={[styles.listDot, { backgroundColor: accent }]} />
                <Text style={[styles.listLabel, { color: template.text }]}>{it.label}</Text>
                {it.price && <Text style={[styles.listPrice, { color: accent }]}>{it.price}</Text>}
              </View>
            ))}
          </View>
        </View>
      )}

      {/* CTA */}
      <View style={styles.ctaWrap}>
        <View style={[styles.cta, { backgroundColor: accent }]}>
          <Ionicons name={config.ctaIcon as any} size={17} color="#0C0C0F" />
          <Text style={styles.ctaText}>{config.cta}</Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: template.subtext }]}>
          pixelstudios.com/card/{user}
        </Text>
        <Text style={[styles.footerMade, { color: template.subtext }]}>MADE WITH ▚ PIXEL STUDIOS</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { borderRadius: 24, overflow: 'hidden', paddingBottom: 8 },
  hero: {
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 44,
    paddingHorizontal: 24,
  },
  heroEmoji: { fontSize: 40 },
  heroHeadline: {
    fontFamily: fonts.semi,
    fontSize: 19,
    lineHeight: 24,
    letterSpacing: -0.3,
    textAlign: 'center',
    marginTop: 10,
    maxWidth: 300,
  },
  heroLogo: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(128,128,128,0.18)',
  },
  heroLogoBadge: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  identity: { alignItems: 'center', marginTop: -34 },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 3,
    backgroundColor: 'rgba(128,128,128,0.18)',
  },
  avatarFallback: { alignItems: 'center', justifyContent: 'center' },
  bizName: {
    fontFamily: fonts.semi,
    fontSize: 24,
    letterSpacing: -0.5,
    marginTop: 12,
  },
  tagline: {
    fontFamily: fonts.regular,
    fontSize: 14,
    marginTop: 3,
    textAlign: 'center',
    paddingHorizontal: 30,
  },
  actions: { flexDirection: 'row', gap: 12, marginTop: 16 },
  actionBtn: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  urgentStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#DC2626',
    marginHorizontal: 20,
    borderRadius: 10,
    paddingVertical: 9,
    marginTop: 18,
  },
  urgentText: { fontFamily: fonts.semi, fontSize: 12.5, color: '#FFFFFF', letterSpacing: 0.6 },
  section: { paddingHorizontal: 20, marginTop: 22 },
  sectionTitle: { fontFamily: fonts.semi, fontSize: 16, letterSpacing: -0.2, marginBottom: 10 },
  gallery: { flexDirection: 'row', gap: 10 },
  galleryTile: {
    height: 86,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemLabel: { fontFamily: fonts.medium, fontSize: 12, textAlign: 'center' },
  shopGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 10 },
  shopTile: {
    height: 88,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listWrap: { borderRadius: 14, paddingHorizontal: 16, paddingVertical: 4 },
  listRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 13 },
  listDot: { width: 8, height: 8, borderRadius: 4 },
  listLabel: { flex: 1, fontFamily: fonts.medium, fontSize: 14.5 },
  listPrice: { fontFamily: fonts.semi, fontSize: 13.5 },
  ctaWrap: { paddingHorizontal: 20, marginTop: 24 },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 13,
    paddingVertical: 14,
  },
  ctaText: { fontFamily: fonts.semi, fontSize: 15.5, color: '#0C0C0F' },
  footer: { alignItems: 'center', marginTop: 24, paddingBottom: 14, gap: 4 },
  footerText: { fontFamily: fonts.medium, fontSize: 12 },
  footerMade: { fontFamily: fonts.bold, fontSize: 8.5, letterSpacing: 2.2 },
});
