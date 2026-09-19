import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { fonts } from '../constants/theme';
import { BusinessType, CardTemplate, slugify } from '../data/cardTemplates';

/**
 * Miniature preview of the portfolio landing page a Premium card opens
 * (pixelstudios.com/card/username).
 */
export default function LandingPreview({
  template,
  businessType,
  name,
  business,
}: {
  template: CardTemplate;
  businessType: BusinessType;
  name: string;
  business: string;
}) {
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
        <View style={[styles.avatar, { backgroundColor: businessType.accent + '33' }]}>
          <Text style={{ fontSize: 24 }}>{businessType.emoji}</Text>
        </View>
        <Text style={[styles.bizName, { color: template.text }]} numberOfLines={1}>
          {displayName}
        </Text>
        <Text style={[styles.tagline, { color: template.subtext }]} numberOfLines={2}>
          {businessType.tagline}
        </Text>

        {/* Actions */}
        <View style={styles.actions}>
          {['logo-whatsapp', 'call-outline', 'logo-instagram', 'map-outline'].map((icon) => (
            <View key={icon} style={[styles.actionBtn, { backgroundColor: template.surface }]}>
              <Ionicons name={icon as any} size={15} color={template.accent} />
            </View>
          ))}
        </View>

        {/* Gallery */}
        <View style={styles.gallery}>
          {[0, 1, 2].map((i) => (
            <View
              key={i}
              style={[styles.galleryTile, { backgroundColor: businessType.accent + (i === 1 ? '55' : '2E') }]}
            />
          ))}
        </View>

        <View style={[styles.cta, { backgroundColor: template.accent }]}>
          <Text style={[styles.ctaText, { color: template.id === 'clean' ? '#F5F4F0' : '#0C0C0F' }]}>
            Order on WhatsApp
          </Text>
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
  page: { padding: 18, alignItems: 'center' },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bizName: { fontFamily: fonts.semi, fontSize: 17, letterSpacing: -0.3, marginTop: 10 },
  tagline: {
    fontFamily: fonts.regular,
    fontSize: 11.5,
    lineHeight: 15,
    textAlign: 'center',
    marginTop: 3,
    maxWidth: 240,
  },
  actions: { flexDirection: 'row', gap: 10, marginTop: 14 },
  actionBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gallery: { flexDirection: 'row', gap: 8, marginTop: 16, width: '100%' },
  galleryTile: { flex: 1, height: 54, borderRadius: 10 },
  cta: {
    marginTop: 16,
    borderRadius: 10,
    paddingVertical: 9,
    paddingHorizontal: 22,
  },
  ctaText: { fontFamily: fonts.semi, fontSize: 11.5 },
});
