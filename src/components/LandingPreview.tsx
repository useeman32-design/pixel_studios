import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { fonts } from '../constants/theme';
import { BusinessType, CardTemplate, slugify } from '../data/cardTemplates';

/* ---------------------------------------------------------------------------
 * Per-profession landing designs — every business type gets its own layout,
 * sections and call-to-action, all themed by the chosen card template.
 * ------------------------------------------------------------------------- */

type LandingConfig = {
  headline: string;
  cta: string;
  ctaIcon: string;
  layout: 'gallery' | 'shop' | 'menu' | 'services' | 'urgent';
  items: { label: string; price?: string }[];
  urgentNote?: string;
};

const landingConfigs: Record<string, LandingConfig> = {
  catering: {
    headline: 'Sweet treats for every celebration',
    cta: 'Order on WhatsApp',
    ctaIcon: 'logo-whatsapp',
    layout: 'gallery',
    items: [{ label: 'Signature Cakes' }, { label: 'Cupcake Boxes' }, { label: 'Small Chops' }],
  },
  tailor: {
    headline: 'Tailored to fit you perfectly',
    cta: 'Book a Fitting',
    ctaIcon: 'calendar-outline',
    layout: 'gallery',
    items: [{ label: 'Senator Wear' }, { label: 'Agbada' }, { label: 'Aso Ebi' }],
  },
  salon: {
    headline: 'Look your best, every day',
    cta: 'Book Appointment',
    ctaIcon: 'calendar-outline',
    layout: 'services',
    items: [
      { label: 'Box Braids', price: '₦8,000' },
      { label: 'Wig Install', price: '₦5,500' },
      { label: 'Makeup', price: '₦12,000' },
    ],
  },
  plumber: {
    headline: 'Fast fixes, day or night',
    cta: 'Call Now',
    ctaIcon: 'call',
    layout: 'urgent',
    items: [{ label: 'Pipe Repairs' }, { label: 'Water Heaters' }, { label: 'Bathroom Fitting' }],
    urgentNote: '24/7 Emergency Service',
  },
  doctor: {
    headline: 'Quality care, close to home',
    cta: 'Book Consultation',
    ctaIcon: 'calendar-outline',
    layout: 'services',
    items: [
      { label: 'General Check-up', price: '₦5,000' },
      { label: 'Pediatrics', price: '₦6,000' },
      { label: 'Lab Tests', price: 'From ₦2,500' },
    ],
  },
  restaurant: {
    headline: 'Fresh. Local. Delicious.',
    cta: 'Order Food',
    ctaIcon: 'logo-whatsapp',
    layout: 'menu',
    items: [
      { label: 'Jollof Rice', price: '₦2,500' },
      { label: 'Suya Platter', price: '₦4,000' },
      { label: 'Zobo Drink', price: '₦800' },
    ],
  },
  boutique: {
    headline: 'New arrivals every week',
    cta: 'Shop on WhatsApp',
    ctaIcon: 'bag-outline',
    layout: 'shop',
    items: [{ label: 'Dresses' }, { label: 'Bags' }, { label: 'Accessories' }, { label: 'Shoes' }],
  },
  general: {
    headline: 'Your business, one beautiful page',
    cta: 'Contact on WhatsApp',
    ctaIcon: 'logo-whatsapp',
    layout: 'gallery',
    items: [{ label: 'Our Work' }, { label: 'Reviews' }, { label: 'Location' }],
  },
};

/**
 * Miniature preview of the portfolio landing page a Premium card opens
 * (pixelstudios.com/card/username) — designed for the customer's profession.
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
  const config = landingConfigs[businessType.id] ?? landingConfigs.general;
  const displayName = business || businessType.sample;
  const user = slugify(name || displayName);

  return (
    <View style={[styles.frame, { backgroundColor: template.bg, borderColor: 'rgba(128,128,128,0.25)' }]}>
      {/* Browser chrome hint */}
      <View style={styles.chrome}>
        <View style={{ flexDirection: 'row', gap: 4 }}>
          <View style={[styles.chromeDot, { backgroundColor: '#FF5F57' }]} />
          <View style={[styles.chromeDot, { backgroundColor: '#FEBC2E' }]} />
          <View style={[styles.chromeDot, { backgroundColor: '#28C840' }]} />
        </View>
        <View style={[styles.urlBar, { backgroundColor: template.surface }]}>
          <Text style={[styles.urlText, { color: template.subtext }]} numberOfLines={1}>
            pixelstudios.com/card/{user}
          </Text>
        </View>
      </View>

      {/* Page */}
      <View style={styles.page}>
        {/* Hero band */}
        <View style={[styles.heroBand, { backgroundColor: businessType.accent + '2E' }]}>
          <Text style={styles.heroEmoji}>{businessType.emoji}</Text>
          <View style={{ flex: 1 }}>
            <Text style={[styles.headline, { color: template.text }]} numberOfLines={2}>
              {config.headline}
            </Text>
          </View>
        </View>

        {/* Identity */}
        <View style={styles.identity}>
          {profileUri ? (
            <Image source={{ uri: profileUri }} style={styles.profileImg} />
          ) : (
            <View style={[styles.avatar, { backgroundColor: businessType.accent + '33' }]}>
              <Text style={{ fontSize: 24 }}>{businessType.emoji}</Text>
            </View>
          )}
          <View style={{ flex: 1 }}>
            <Text style={[styles.bizName, { color: template.text }]} numberOfLines={1}>
              {displayName}
            </Text>
            <Text style={[styles.tagline, { color: template.subtext }]} numberOfLines={1}>
              {businessType.tagline}
            </Text>
          </View>
          {logoUri ? (
            <Image source={{ uri: logoUri }} style={styles.logoImg} />
          ) : (
            <View style={[styles.logoBadge, { backgroundColor: businessType.accent + '22' }]}>
              <Text style={{ fontSize: 10, color: businessType.accent }}>▚</Text>
            </View>
          )}
        </View>

        {/* Urgent strip for emergency services */}
        {config.urgentNote && (
          <View style={styles.urgentStrip}>
            <Ionicons name="flash" size={11} color="#FFFFFF" />
            <Text style={styles.urgentText}>{config.urgentNote}</Text>
          </View>
        )}

        {/* Sections per layout */}
        {(config.layout === 'gallery' || config.layout === 'urgent') && (
          <View style={styles.gallery}>
            {config.items.slice(0, 3).map((it, i) => (
              <View key={it.label} style={{ flex: 1, gap: 4 }}>
                <View
                  style={[styles.galleryTile, { backgroundColor: businessType.accent + (i === 1 ? '59' : '2E') }]}
                />
                <Text style={[styles.itemLabel, { color: template.subtext }]} numberOfLines={1}>
                  {it.label}
                </Text>
              </View>
            ))}
          </View>
        )}

        {config.layout === 'shop' && (
          <View style={styles.shopGrid}>
            {config.items.map((it, i) => (
              <View key={it.label} style={{ gap: 4 }}>
                <View style={[styles.shopTile, { backgroundColor: businessType.accent + (i % 2 === 0 ? '40' : '26') }]} />
                <Text style={[styles.itemLabel, { color: template.subtext }]} numberOfLines={1}>
                  {it.label}
                </Text>
              </View>
            ))}
          </View>
        )}

        {(config.layout === 'menu' || config.layout === 'services') && (
          <View style={[styles.listWrap, { backgroundColor: template.surface }]}>
            {config.items.map((it, i) => (
              <View
                key={it.label}
                style={[
                  styles.listRow,
                  i > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: 'rgba(128,128,128,0.25)' },
                ]}>
                <View style={[styles.listDot, { backgroundColor: businessType.accent }]} />
                <Text style={[styles.listLabel, { color: template.text }]}>{it.label}</Text>
                {it.price && <Text style={[styles.listPrice, { color: businessType.accent }]}>{it.price}</Text>}
              </View>
            ))}
          </View>
        )}

        {/* CTA */}
        <View style={[styles.cta, { backgroundColor: businessType.accent }]}>
          <Ionicons name={config.ctaIcon as any} size={13} color="#0C0C0F" />
          <Text style={styles.ctaText}>{config.cta}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
  },
  chrome: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(128,128,128,0.25)',
  },
  chromeDot: { width: 7, height: 7, borderRadius: 4 },
  urlBar: { flex: 1, borderRadius: 7, paddingHorizontal: 10, paddingVertical: 4 },
  urlText: { fontFamily: fonts.medium, fontSize: 9.5 },
  page: { padding: 14 },
  heroBand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  heroEmoji: { fontSize: 26 },
  headline: { fontFamily: fonts.semi, fontSize: 13, lineHeight: 16, letterSpacing: -0.2 },
  identity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImg: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(128,128,128,0.2)' },
  logoImg: { width: 28, height: 28, borderRadius: 8, backgroundColor: 'rgba(128,128,128,0.2)' },
  logoBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bizName: { fontFamily: fonts.semi, fontSize: 15.5, letterSpacing: -0.3 },
  tagline: { fontFamily: fonts.regular, fontSize: 10.5, marginTop: 1 },
  urgentStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    backgroundColor: '#DC2626',
    borderRadius: 8,
    paddingVertical: 6,
    marginTop: 10,
  },
  urgentText: { fontFamily: fonts.semi, fontSize: 10, color: '#FFFFFF', letterSpacing: 0.6 },
  gallery: { flexDirection: 'row', gap: 8, marginTop: 12 },
  galleryTile: { height: 52, borderRadius: 9 },
  itemLabel: { fontFamily: fonts.medium, fontSize: 8.5, textAlign: 'center' },
  shopGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  shopTile: { width: 100, height: 44, borderRadius: 9 },
  listWrap: { borderRadius: 12, marginTop: 12, paddingHorizontal: 12, paddingVertical: 2 },
  listRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 7 },
  listDot: { width: 6, height: 6, borderRadius: 3 },
  listLabel: { flex: 1, fontFamily: fonts.medium, fontSize: 10.5 },
  listPrice: { fontFamily: fonts.semi, fontSize: 10 },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 14,
    borderRadius: 10,
    paddingVertical: 9,
  },
  ctaText: { fontFamily: fonts.semi, fontSize: 11.5, color: '#0C0C0F' },
});
