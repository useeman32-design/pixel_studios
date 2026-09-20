import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { fonts } from '../constants/theme';

export type MenuItem = {
  id: string;
  name: string;
  price: string;
  category: string;
};

export type MenuTemplate = {
  id: string;
  name: string;
};

export const menuTemplates: MenuTemplate[] = [
  { id: 'chalk', name: 'Classic Chalk' },
  { id: 'cafe', name: 'Café Light' },
  { id: 'gold', name: 'Fine Dining Gold' },
];

export const MENU_CATEGORIES = ['Starters', 'Mains', 'Drinks', 'Desserts'];

function groupItems(items: MenuItem[]): { category: string; rows: MenuItem[] }[] {
  const order = [...MENU_CATEGORIES, 'Other'];
  return order
    .map((c) => ({ category: c, rows: items.filter((i) => (i.category || 'Other') === c) }))
    .filter((g) => g.rows.length > 0);
}

/** Full-size digital menu page — what customers see when they scan the QR. */
export default function MenuPage({
  templateId,
  name,
  tagline,
  items,
}: {
  templateId: string;
  name: string;
  tagline: string;
  items: MenuItem[];
}) {
  const displayName = name || 'Your Restaurant';
  const groups = groupItems(items);

  /* ------------------------------- CHALK ------------------------------- */
  if (templateId === 'chalk') {
    return (
      <View style={{ backgroundColor: '#14161A', paddingBottom: 24 }}>
        <View style={{ paddingHorizontal: 24, paddingTop: 26, alignItems: 'center' }}>
          <Ionicons name="restaurant-outline" size={20} color="#E8E4DA" />
          <Text style={{ fontFamily: fonts.extrabold, fontSize: 26, letterSpacing: -0.6, color: '#F2EFE8', marginTop: 10, textAlign: 'center' }}>
            {displayName}
          </Text>
          <Text style={{ fontFamily: fonts.regular, fontSize: 12.5, color: '#8D8A82', marginTop: 4, textAlign: 'center' }}>
            {tagline || 'Fresh · Local · Delicious'}
          </Text>
          <View style={{ width: 46, height: 2, backgroundColor: '#E8E4DA', opacity: 0.5, marginTop: 14 }} />

          {groups.map((g) => (
            <View key={g.category} style={{ alignSelf: 'stretch', marginTop: 20 }}>
              <Text style={{ fontFamily: fonts.bold, fontSize: 11, letterSpacing: 3, color: '#B8B4A9', textAlign: 'center' }}>
                {g.category.toUpperCase()}
              </Text>
              <View style={{ marginHorizontal: 6, marginTop: 8 }}>
                {g.rows.map((it) => (
                  <View key={it.id} style={{ flexDirection: 'row', alignItems: 'baseline', paddingVertical: 8 }}>
                    <Text style={{ fontFamily: fonts.semi, fontSize: 14.5, color: '#F2EFE8' }}>{it.name}</Text>
                    <View style={{ flex: 1, borderBottomWidth: 1, borderStyle: 'dashed', borderColor: 'rgba(232,228,218,0.3)', marginHorizontal: 8, marginBottom: 3 }} />
                    <Text style={{ fontFamily: fonts.bold, fontSize: 13, color: '#E8E4DA' }}>{it.price}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
          <MenuFooter name={displayName} sub="#6F6C64" />
        </View>
      </View>
    );
  }

  /* -------------------------------- CAFE -------------------------------- */
  if (templateId === 'cafe') {
    return (
      <View style={{ backgroundColor: '#FBF6EE', paddingBottom: 24 }}>
        <View style={{ paddingHorizontal: 22, paddingTop: 24 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <View style={{ width: 42, height: 42, borderRadius: 14, backgroundColor: '#8C5A3C', alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="cafe" size={18} color="#FFF6EC" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: fonts.extrabold, fontSize: 20, letterSpacing: -0.4, color: '#3D2B1F' }}>{displayName}</Text>
              <Text style={{ fontFamily: fonts.medium, fontSize: 11.5, color: '#9A8271' }}>{tagline || 'Coffee · Bites · Good vibes'}</Text>
            </View>
          </View>

          {groups.map((g) => (
            <View key={g.category} style={{ marginTop: 18 }}>
              <Text style={{ fontFamily: fonts.bold, fontSize: 12, letterSpacing: 2, color: '#8C5A3C', marginBottom: 8 }}>
                {g.category.toUpperCase()}
              </Text>
              <View style={{ gap: 8 }}>
                {g.rows.map((it) => (
                  <View key={it.id} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 13, paddingHorizontal: 14, paddingVertical: 12, ...menuShadow() }}>
                    <Text style={{ flex: 1, fontFamily: fonts.semi, fontSize: 14, color: '#3D2B1F' }}>{it.name}</Text>
                    <View style={{ backgroundColor: '#F3E5D6', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5 }}>
                      <Text style={{ fontFamily: fonts.bold, fontSize: 12, color: '#8C5A3C' }}>{it.price}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          ))}
          <MenuFooter name={displayName} sub="#B4A08E" />
        </View>
      </View>
    );
  }

  /* ----------------------------- FINE DINING ---------------------------- */
  return (
    <View style={{ backgroundColor: '#0D0B08', paddingBottom: 24 }}>
      <View style={{ paddingHorizontal: 26, paddingTop: 28, alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <View style={{ width: 30, height: StyleSheet.hairlineWidth, backgroundColor: '#D9B36C' }} />
          <Ionicons name="wine-outline" size={15} color="#D9B36C" />
          <View style={{ width: 30, height: StyleSheet.hairlineWidth, backgroundColor: '#D9B36C' }} />
        </View>
        <Text style={{ fontFamily: fonts.thin, fontSize: 28, letterSpacing: 2, color: '#F0E8D8', marginTop: 14, textAlign: 'center' }}>
          {displayName.toUpperCase()}
        </Text>
        <Text style={{ fontFamily: fonts.regular, fontSize: 11.5, letterSpacing: 1.4, color: '#8E826E', marginTop: 6, textAlign: 'center' }}>
          {(tagline || 'A fine dining experience').toUpperCase()}
        </Text>

        {groups.map((g) => (
          <View key={g.category} style={{ alignSelf: 'stretch', marginTop: 24 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={{ flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: 'rgba(217,179,108,0.4)' }} />
              <Text style={{ fontFamily: fonts.bold, fontSize: 11, letterSpacing: 3.4, color: '#D9B36C' }}>{g.category.toUpperCase()}</Text>
              <View style={{ flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: 'rgba(217,179,108,0.4)' }} />
            </View>
            {g.rows.map((it) => (
              <View key={it.id} style={{ marginTop: 14 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <Text style={{ fontFamily: fonts.semi, fontSize: 14.5, color: '#F0E8D8' }}>{it.name}</Text>
                  <Text style={{ fontFamily: fonts.semi, fontSize: 13, color: '#D9B36C' }}>{it.price}</Text>
                </View>
                <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: 'rgba(240,232,216,0.12)', marginTop: 8 }} />
              </View>
            ))}
          </View>
        ))}
        <MenuFooter name={displayName} sub="#6E6452" />
      </View>
    </View>
  );
}

function menuShadow() {
  return {
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  };
}

function MenuFooter({ name, sub }: { name: string; sub: string }) {
  return (
    <View style={{ alignItems: 'center', marginTop: 26, gap: 4 }}>
      <Text style={{ fontFamily: fonts.bold, fontSize: 11.5, letterSpacing: 1.2, color: sub }}>{name.toUpperCase()}</Text>
      <Text style={{ fontFamily: fonts.bold, fontSize: 7.5, letterSpacing: 2.2, color: sub }}>POWERED BY ▚ PIXEL STUDIOS</Text>
    </View>
  );
}

/** Scaled thumbnail of the real menu — WYSIWYG in the template picker. */
export function MenuThumb({
  templateId,
  name,
  tagline,
  items,
}: {
  templateId: string;
  name: string;
  tagline: string;
  items: MenuItem[];
}) {
  const W = 420;
  const scale = 264 / W;
  return (
    <View style={{ width: 264, height: 400, borderRadius: 20, overflow: 'hidden' }}>
      <View style={{ width: W, transform: [{ scale }], transformOrigin: 'top left' }}>
        <MenuPage templateId={templateId} name={name} tagline={tagline} items={items} />
      </View>
    </View>
  );
}
