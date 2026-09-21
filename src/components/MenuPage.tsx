import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

import { fonts } from '../constants/theme';

export type MenuItem = {
  id: string;
  name: string;
  price: string;
  category: string;
  /** Optional dish photo uploaded by the owner (local URI). */
  image?: string | null;
};

export type MenuContact = {
  phone?: string;
  whatsapp?: string;
  address?: string;
};

export type MenuTemplate = {
  id: string;
  name: string;
  tag: 'classic' | 'modern';
};

export const menuTemplates: MenuTemplate[] = [
  { id: 'slate', name: 'Slate Modern', tag: 'modern' },
  { id: 'paper', name: 'Paper Minimal', tag: 'modern' },
  { id: 'fresh', name: 'Fresh Market', tag: 'modern' },
  { id: 'noir', name: 'Noir Luxe', tag: 'modern' },
  { id: 'street', name: 'Street Bold', tag: 'modern' },
  { id: 'chalk', name: 'Classic Chalk', tag: 'classic' },
  { id: 'cafe', name: 'Café Light', tag: 'classic' },
  { id: 'gold', name: 'Fine Dining Gold', tag: 'classic' },
];

export const MENU_CATEGORIES = ['Starters', 'Mains', 'Drinks', 'Desserts'];

function groupItems(items: MenuItem[]): { category: string; rows: MenuItem[] }[] {
  const order = [...MENU_CATEGORIES, 'Other'];
  return order
    .map((c) => ({ category: c, rows: items.filter((i) => (i.category || 'Other') === c) }))
    .filter((g) => g.rows.length > 0);
}

/* ------------------------------ motion & chrome ---------------------------- */

/** Gentle staggered rise used across templates — menus feel alive, not static. */
function Rise({ delay, children }: { delay: number; children: React.ReactNode }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, { toValue: 1, duration: 520, delay, useNativeDriver: true }).start();
  }, [anim, delay]);
  return (
    <Animated.View
      style={{
        opacity: anim,
        transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) }],
      }}>
      {children}
    </Animated.View>
  );
}

/** Rounded dish photo used by every template that supports imagery. */
function DishImage({ uri, size = 54, radius = 14, circle = false }: { uri: string; size?: number; radius?: number; circle?: boolean }) {
  return (
    <Animated.Image
      source={{ uri }}
      style={{
        width: size,
        height: size,
        borderRadius: circle ? size / 2 : radius,
        backgroundColor: 'rgba(128,128,128,0.15)',
      }}
      resizeMode="cover"
    />
  );
}

function MenuContactStrip({ contact, color, hairline }: { contact?: MenuContact; color: string; hairline: string }) {
  if (!contact || (!contact.phone && !contact.whatsapp && !contact.address)) return null;
  const rows: { icon: keyof typeof Ionicons.glyphMap; text: string }[] = [];
  if (contact.phone) rows.push({ icon: 'call-outline', text: contact.phone });
  if (contact.whatsapp) rows.push({ icon: 'logo-whatsapp', text: `WhatsApp · ${contact.whatsapp}` });
  if (contact.address) rows.push({ icon: 'location-outline', text: contact.address });
  return (
    <View style={{ alignSelf: 'stretch', marginTop: 24, paddingTop: 14, borderTopWidth: StyleSheet.hairlineWidth, borderColor: hairline, gap: 6 }}>
      {rows.map((r, i) => (
        <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
          <Ionicons name={r.icon} size={11} color={color} />
          <Text style={{ fontFamily: fonts.medium, fontSize: 11, color, textAlign: 'center' }}>{r.text}</Text>
        </View>
      ))}
    </View>
  );
}

function MenuFooter({ name, sub }: { name: string; sub: string }) {
  return (
    <View style={{ alignItems: 'center', marginTop: 22, gap: 4 }}>
      <Text style={{ fontFamily: fonts.bold, fontSize: 11.5, letterSpacing: 1.2, color: sub }}>{name.toUpperCase()}</Text>
      <Text style={{ fontFamily: fonts.bold, fontSize: 7.5, letterSpacing: 2.2, color: sub }}>POWERED BY ▚ PIXEL STUDIOS</Text>
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

/* ============================================================================
 * Full-size digital menu page — what customers see when they scan the QR.
 * 8 templates: five modern looks + three classics, all supporting dish photos,
 * contact details and gentle entrance animation.
 * ========================================================================== */

export default function MenuPage({
  templateId,
  name,
  tagline,
  items,
  contact,
}: {
  templateId: string;
  name: string;
  tagline: string;
  items: MenuItem[];
  contact?: MenuContact;
}) {
  const displayName = name || 'Your Restaurant';
  const groups = groupItems(items);

  /* ------------------------------ SLATE (modern dark) --------------------- */
  if (templateId === 'slate') {
    return (
      <View style={{ backgroundColor: '#16171B', paddingBottom: 26 }}>
        <View style={{ paddingHorizontal: 22, paddingTop: 26 }}>
          <Rise delay={0}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: '#BFF549', alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name="flame" size={21} color="#111113" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: fonts.extrabold, fontSize: 23, letterSpacing: -0.6, color: '#F5F5F3' }}>{displayName}</Text>
                <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: '#8B8D94', marginTop: 1 }}>{tagline || 'Great food, no noise'}</Text>
              </View>
            </View>
          </Rise>

          {groups.map((g, gi) => (
            <Rise key={g.category} delay={120 + gi * 90}>
              <View style={{ marginTop: 22 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <View style={{ width: 4, height: 14, borderRadius: 2, backgroundColor: '#BFF549' }} />
                  <Text style={{ fontFamily: fonts.bold, fontSize: 12, letterSpacing: 2.4, color: '#F5F5F3' }}>{g.category.toUpperCase()}</Text>
                  <View style={{ flex: 1, height: 1, backgroundColor: 'rgba(245,245,243,0.08)' }} />
                </View>
                {g.rows.map((it) => (
                  <View key={it.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'rgba(245,245,243,0.07)' }}>
                    {it.image ? <DishImage uri={it.image} size={52} /> : null}
                    <Text style={{ flex: 1, fontFamily: fonts.semi, fontSize: 14.5, color: '#F5F5F3' }}>{it.name}</Text>
                    <View style={{ backgroundColor: 'rgba(191,245,73,0.12)', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5 }}>
                      <Text style={{ fontFamily: fonts.bold, fontSize: 12.5, color: '#BFF549' }}>{it.price}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </Rise>
          ))}
          <MenuContactStrip contact={contact} color="#9FA1A8" hairline="rgba(245,245,243,0.12)" />
          <MenuFooter name={displayName} sub="#70727A" />
        </View>
      </View>
    );
  }

  /* --------------------------- PAPER (ultra-minimal) ----------------------- */
  if (templateId === 'paper') {
    return (
      <View style={{ backgroundColor: '#FCFBF8', paddingBottom: 26 }}>
        <View style={{ paddingHorizontal: 26, paddingTop: 30 }}>
          <Rise delay={0}>
            <Text style={{ fontFamily: fonts.thin, fontSize: 32, letterSpacing: -0.5, color: '#191A1C' }}>{displayName}</Text>
            <Text style={{ fontFamily: fonts.regular, fontSize: 12.5, color: '#8D8F94', marginTop: 4 }}>{tagline || 'Simple food, done well'}</Text>
            <View style={{ width: 34, height: 3, backgroundColor: '#191A1C', marginTop: 14 }} />
          </Rise>

          {groups.map((g, gi) => (
            <Rise key={g.category} delay={120 + gi * 90}>
              <View style={{ marginTop: 26 }}>
                <Text style={{ fontFamily: fonts.semi, fontSize: 11, letterSpacing: 3.2, color: '#8D8F94' }}>{g.category.toUpperCase()}</Text>
                {g.rows.map((it, i) => (
                  <View key={it.id}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingTop: 12 }}>
                      {it.image ? <DishImage uri={it.image} size={44} radius={22} circle /> : null}
                      <Text style={{ fontFamily: fonts.medium, fontSize: 15, color: '#191A1C', flexShrink: 1 }}>{it.name}</Text>
                      <View style={{ flex: 1, borderBottomWidth: 1, borderStyle: 'dotted', borderColor: '#D8D7D2', marginBottom: 3 }} />
                      <Text style={{ fontFamily: fonts.medium, fontSize: 14, color: '#191A1C' }}>{it.price}</Text>
                    </View>
                    {i < g.rows.length - 1 && !it.image && <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: '#E8E7E2', marginTop: 12 }} />}
                  </View>
                ))}
              </View>
            </Rise>
          ))}
          <MenuContactStrip contact={contact} color="#8D8F94" hairline="#E8E7E2" />
          <MenuFooter name={displayName} sub="#B3B4B8" />
        </View>
      </View>
    );
  }

  /* ---------------------------- FRESH (market green) ----------------------- */
  if (templateId === 'fresh') {
    return (
      <View style={{ backgroundColor: '#F3F7F0', paddingBottom: 26 }}>
        <View style={{ paddingHorizontal: 22, paddingTop: 24 }}>
          <Rise delay={0}>
            <View style={{ backgroundColor: '#FFFFFF', borderRadius: 18, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12, ...menuShadow() }}>
              <View style={{ width: 46, height: 46, borderRadius: 23, backgroundColor: '#E4F0DC', alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name="leaf" size={20} color="#4E7A3C" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: fonts.extrabold, fontSize: 20, letterSpacing: -0.4, color: '#24331C' }}>{displayName}</Text>
                <Text style={{ fontFamily: fonts.medium, fontSize: 11.5, color: '#7C8E70' }}>{tagline || 'Fresh every morning'}</Text>
              </View>
            </View>
          </Rise>

          {groups.map((g, gi) => (
            <Rise key={g.category} delay={120 + gi * 90}>
              <View style={{ marginTop: 18 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 9 }}>
                  <View style={{ width: 7, height: 7, borderRadius: 3.5, backgroundColor: '#4E7A3C' }} />
                  <Text style={{ fontFamily: fonts.bold, fontSize: 12, letterSpacing: 1.8, color: '#24331C' }}>{g.category.toUpperCase()}</Text>
                </View>
                <View style={{ gap: 7 }}>
                  {g.rows.map((it) => (
                    <View key={it.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#FFFFFF', borderRadius: 14, padding: 8, paddingRight: 12, ...menuShadow() }}>
                      {it.image ? <DishImage uri={it.image} size={50} radius={11} /> : null}
                      <Text style={{ flex: 1, fontFamily: fonts.semi, fontSize: 14, color: '#24331C' }}>{it.name}</Text>
                      <View style={{ backgroundColor: '#E4F0DC', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5 }}>
                        <Text style={{ fontFamily: fonts.bold, fontSize: 12, color: '#3E6330' }}>{it.price}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            </Rise>
          ))}
          <MenuContactStrip contact={contact} color="#7C8E70" hairline="#D8E3D0" />
          <MenuFooter name={displayName} sub="#9AAA8E" />
        </View>
      </View>
    );
  }

  /* ------------------------------- NOIR (luxury) --------------------------- */
  if (templateId === 'noir') {
    return (
      <View style={{ backgroundColor: '#0B0A09', paddingBottom: 26 }}>
        <View style={{ paddingHorizontal: 26, paddingTop: 30, alignItems: 'center' }}>
          <Rise delay={0}>
            <View style={{ borderWidth: StyleSheet.hairlineWidth, borderColor: 'rgba(216,180,110,0.55)', paddingHorizontal: 22, paddingVertical: 16, alignItems: 'center', width: '100%' }}>
              <Text style={{ fontFamily: fonts.thin, fontSize: 27, letterSpacing: 4, color: '#EFE6D4', textAlign: 'center' }}>{displayName.toUpperCase()}</Text>
              <View style={{ width: 40, height: 1, backgroundColor: '#D8B46E', marginTop: 10 }} />
              <Text style={{ fontFamily: fonts.regular, fontSize: 10.5, letterSpacing: 2.4, color: '#8C8069', marginTop: 8, textAlign: 'center' }}>
                {(tagline || 'EST. TASTE').toUpperCase()}
              </Text>
            </View>
          </Rise>

          {groups.map((g, gi) => (
            <Rise key={g.category} delay={120 + gi * 90}>
              <View style={{ alignSelf: 'stretch', marginTop: 24 }}>
                <Text style={{ fontFamily: fonts.semi, fontSize: 12, letterSpacing: 4, color: '#D8B46E', textAlign: 'center' }}>{g.category.toUpperCase()}</Text>
                {g.rows.map((it) => (
                  <View key={it.id} style={{ marginTop: 14, alignItems: 'center' }}>
                    {it.image ? (
                      <View style={{ borderWidth: 1, borderColor: 'rgba(216,180,110,0.5)', borderRadius: 34, padding: 3, marginBottom: 8 }}>
                        <DishImage uri={it.image} size={62} circle />
                      </View>
                    ) : null}
                    <Text style={{ fontFamily: fonts.medium, fontSize: 14.5, color: '#EFE6D4', textAlign: 'center' }}>{it.name}</Text>
                    <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: '#D8B46E', textAlign: 'center', marginTop: 3 }}>{it.price}</Text>
                  </View>
                ))}
                <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: 'rgba(216,180,110,0.25)', marginTop: 18 }} />
              </View>
            </Rise>
          ))}
          <MenuContactStrip contact={contact} color="#8C8069" hairline="rgba(216,180,110,0.3)" />
          <MenuFooter name={displayName} sub="#6E6450" />
        </View>
      </View>
    );
  }

  /* ----------------------------- STREET (bold poster) ---------------------- */
  if (templateId === 'street') {
    return (
      <View style={{ backgroundColor: '#121212', paddingBottom: 26 }}>
        <Rise delay={0}>
          <View style={{ backgroundColor: '#F5D322', paddingHorizontal: 22, paddingVertical: 20 }}>
            <Text style={{ fontFamily: fonts.extrabold, fontSize: 30, letterSpacing: -1, color: '#141414', textTransform: 'uppercase' }}>{displayName}</Text>
            <Text style={{ fontFamily: fonts.bold, fontSize: 12, color: 'rgba(20,20,20,0.72)', marginTop: 3, textTransform: 'uppercase', letterSpacing: 1 }}>
              {tagline || 'Big flavour · small prices'}
            </Text>
          </View>
        </Rise>
        <View style={{ paddingHorizontal: 22, paddingTop: 20 }}>
          {groups.map((g, gi) => (
            <Rise key={g.category} delay={120 + gi * 90}>
              <View style={{ marginTop: 16 }}>
                <View style={{ alignSelf: 'flex-start', backgroundColor: '#F5D322', paddingHorizontal: 10, paddingVertical: 4, transform: [{ rotate: '-1.5deg' }] }}>
                  <Text style={{ fontFamily: fonts.extrabold, fontSize: 12, letterSpacing: 1.4, color: '#141414' }}>{g.category.toUpperCase()}</Text>
                </View>
                {g.rows.map((it) => (
                  <View key={it.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 9 }}>
                    {it.image ? <DishImage uri={it.image} size={44} radius={10} /> : null}
                    <Text style={{ flex: 1, fontFamily: fonts.bold, fontSize: 15, color: '#F5F5F0', textTransform: 'uppercase' }}>{it.name}</Text>
                    <Text style={{ fontFamily: fonts.extrabold, fontSize: 14, color: '#F5D322' }}>{it.price}</Text>
                  </View>
                ))}
                <View style={{ height: 2, backgroundColor: 'rgba(245,245,240,0.08)', marginTop: 6 }} />
              </View>
            </Rise>
          ))}
          <MenuContactStrip contact={contact} color="#8F8F88" hairline="rgba(245,245,240,0.14)" />
          <MenuFooter name={displayName} sub="#77776F" />
        </View>
      </View>
    );
  }

  /* ============================ CLASSIC TEMPLATES =========================== */

  /* ------------------------------- CHALK ------------------------------- */
  if (templateId === 'chalk') {
    return (
      <View style={{ backgroundColor: '#14161A', paddingBottom: 24 }}>
        <View style={{ paddingHorizontal: 24, paddingTop: 26, alignItems: 'center' }}>
          <Rise delay={0}>
            <Ionicons name="restaurant-outline" size={20} color="#E8E4DA" />
            <Text style={{ fontFamily: fonts.extrabold, fontSize: 26, letterSpacing: -0.6, color: '#F2EFE8', marginTop: 10, textAlign: 'center' }}>
              {displayName}
            </Text>
            <Text style={{ fontFamily: fonts.regular, fontSize: 12.5, color: '#8D8A82', marginTop: 4, textAlign: 'center' }}>
              {tagline || 'Fresh · Local · Delicious'}
            </Text>
            <View style={{ width: 46, height: 2, backgroundColor: '#E8E4DA', opacity: 0.5, marginTop: 14, alignSelf: 'center' }} />
          </Rise>

          {groups.map((g, gi) => (
            <Rise key={g.category} delay={120 + gi * 90}>
              <View style={{ alignSelf: 'stretch', marginTop: 20 }}>
                <Text style={{ fontFamily: fonts.bold, fontSize: 11, letterSpacing: 3, color: '#B8B4A9', textAlign: 'center' }}>
                  {g.category.toUpperCase()}
                </Text>
                <View style={{ marginHorizontal: 6, marginTop: 8 }}>
                  {g.rows.map((it) => (
                    <View key={it.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8 }}>
                      {it.image ? <DishImage uri={it.image} size={40} radius={10} /> : null}
                      <Text style={{ fontFamily: fonts.semi, fontSize: 14.5, color: '#F2EFE8' }}>{it.name}</Text>
                      <View style={{ flex: 1, borderBottomWidth: 1, borderStyle: 'dashed', borderColor: 'rgba(232,228,218,0.3)', marginHorizontal: 4 }} />
                      <Text style={{ fontFamily: fonts.bold, fontSize: 13, color: '#E8E4DA' }}>{it.price}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </Rise>
          ))}
          <MenuContactStrip contact={contact} color="#8D8A82" hairline="rgba(232,228,218,0.2)" />
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
          <Rise delay={0}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={{ width: 42, height: 42, borderRadius: 14, backgroundColor: '#8C5A3C', alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name="cafe" size={18} color="#FFF6EC" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: fonts.extrabold, fontSize: 20, letterSpacing: -0.4, color: '#3D2B1F' }}>{displayName}</Text>
                <Text style={{ fontFamily: fonts.medium, fontSize: 11.5, color: '#9A8271' }}>{tagline || 'Coffee · Bites · Good vibes'}</Text>
              </View>
            </View>
          </Rise>

          {groups.map((g, gi) => (
            <Rise key={g.category} delay={120 + gi * 90}>
              <View style={{ marginTop: 18 }}>
                <Text style={{ fontFamily: fonts.bold, fontSize: 12, letterSpacing: 2, color: '#8C5A3C', marginBottom: 8 }}>
                  {g.category.toUpperCase()}
                </Text>
                <View style={{ gap: 8 }}>
                  {g.rows.map((it) => (
                    <View key={it.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#FFFFFF', borderRadius: 13, padding: 8, paddingRight: 12, ...menuShadow() }}>
                      {it.image ? <DishImage uri={it.image} size={46} radius={10} /> : null}
                      <Text style={{ flex: 1, fontFamily: fonts.semi, fontSize: 14, color: '#3D2B1F' }}>{it.name}</Text>
                      <View style={{ backgroundColor: '#F3E5D6', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5 }}>
                        <Text style={{ fontFamily: fonts.bold, fontSize: 12, color: '#8C5A3C' }}>{it.price}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            </Rise>
          ))}
          <MenuContactStrip contact={contact} color="#9A8271" hairline="#EBDFD0" />
          <MenuFooter name={displayName} sub="#B4A08E" />
        </View>
      </View>
    );
  }

  /* ----------------------------- FINE DINING ---------------------------- */
  return (
    <View style={{ backgroundColor: '#0D0B08', paddingBottom: 24 }}>
      <View style={{ paddingHorizontal: 26, paddingTop: 28, alignItems: 'center' }}>
        <Rise delay={0}>
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
        </Rise>

        {groups.map((g, gi) => (
          <Rise key={g.category} delay={120 + gi * 90}>
            <View style={{ alignSelf: 'stretch', marginTop: 24 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <View style={{ flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: 'rgba(217,179,108,0.4)' }} />
                <Text style={{ fontFamily: fonts.bold, fontSize: 11, letterSpacing: 3.4, color: '#D9B36C' }}>{g.category.toUpperCase()}</Text>
                <View style={{ flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: 'rgba(217,179,108,0.4)' }} />
              </View>
              {g.rows.map((it) => (
                <View key={it.id} style={{ marginTop: 14 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                    {it.image ? <DishImage uri={it.image} size={38} circle /> : null}
                    <Text style={{ flex: 1, fontFamily: fonts.semi, fontSize: 14.5, color: '#F0E8D8' }}>{it.name}</Text>
                    <Text style={{ fontFamily: fonts.semi, fontSize: 13, color: '#D9B36C' }}>{it.price}</Text>
                  </View>
                  <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: 'rgba(240,232,216,0.12)', marginTop: 8 }} />
                </View>
              ))}
            </View>
          </Rise>
        ))}
        <MenuContactStrip contact={contact} color="#8E826E" hairline="rgba(217,179,108,0.35)" />
        <MenuFooter name={displayName} sub="#6E6452" />
      </View>
    </View>
  );
}

/** Scaled thumbnail of the real menu — WYSIWYG in the template picker. */
export function MenuThumb({
  templateId,
  name,
  tagline,
  items,
  contact,
}: {
  templateId: string;
  name: string;
  tagline: string;
  items: MenuItem[];
  contact?: MenuContact;
}) {
  const W = 420;
  const scale = 264 / W;
  return (
    <View style={{ width: 264, height: 400, borderRadius: 20, overflow: 'hidden' }}>
      <View style={{ width: W, transform: [{ scale }], transformOrigin: 'top left' }}>
        <MenuPage templateId={templateId} name={name} tagline={tagline} items={items} contact={contact} />
      </View>
    </View>
  );
}
