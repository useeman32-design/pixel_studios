import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Image,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import LandingPage from '../components/LandingPage';
import LandingPreview from '../components/LandingPreview';
import SmartCard from '../components/SmartCard';
import { BackBar, Button, Container, Eyebrow, FadeIn, OptChip } from '../components/ui';
import { CONTACT, waLink } from '../constants/contact';
import { fonts, Palette, radius, sp, useTheme } from '../constants/theme';
import { businessTypes, cardTemplates, getBusinessType, slugify } from '../data/cardTemplates';

type Tier = 'direct' | 'premium';
type Material = 'paper' | 'plastic';
type DesignMode = 'pixel' | 'logo' | 'custom';

const prices: Record<Tier, Record<Material, number>> = {
  direct: { paper: 15000, plastic: 25000 },
  premium: { paper: 35000, plastic: 45000 },
};

const directTargets = [
  { id: 'whatsapp', label: 'WhatsApp', icon: 'logo-whatsapp' },
  { id: 'instagram', label: 'Instagram', icon: 'logo-instagram' },
  { id: 'phone', label: 'Phone call', icon: 'call-outline' },
  { id: 'website', label: 'Website', icon: 'globe-outline' },
  { id: 'email', label: 'Email', icon: 'mail-outline' },
];

export default function NFCScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ tier?: string }>();
  const { colors } = useTheme();
  const styles = useStyles(colors);

  const [tier, setTier] = useState<Tier>(params.tier === 'direct' ? 'direct' : 'premium');
  const [directTarget, setDirectTarget] = useState('whatsapp');
  const [bizTypeId, setBizTypeId] = useState('catering');
  const [templateId, setTemplateId] = useState('signature');
  const [material, setMaterial] = useState<Material>('plastic');
  const [designMode, setDesignMode] = useState<DesignMode>('pixel');
  const [logoUri, setLogoUri] = useState<string | null>(null);
  const [profileUri, setProfileUri] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [business, setBusiness] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [orderId, setOrderId] = useState<string | null>(null);
  const [previewVisible, setPreviewVisible] = useState(false);

  const bizType = getBusinessType(bizTypeId);
  const template = cardTemplates.find((t) => t.id === templateId) ?? cardTemplates[0];
  const price = prices[tier][material];
  const username = slugify(business || name || bizType.sample);

  const cardConfig = useMemo(
    () => ({
      tier,
      directTarget,
      material,
      designMode,
      logoUri,
      name,
      business,
      username,
      accent: tier === 'premium' ? bizType.accent : colors.isDark ? colors.lime : '#6B9B0F',
      phone,
      address,
      description,
    }),
    [tier, directTarget, material, designMode, logoUri, name, business, username, bizType.accent, colors, phone, address, description],
  );

  const pickImage = async (setter: (uri: string) => void) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.8,
      });
      if (!result.canceled && result.assets?.[0]?.uri) {
        setter(result.assets[0].uri);
      }
    } catch {
      // picker unavailable — ignore
    }
  };

  const pickLogo = async () => {
    await pickImage((uri) => {
      setLogoUri(uri);
      setDesignMode('logo');
    });
  };

  const pickProfile = () => pickImage(setProfileUri);

  const waMessage = `Hello Pixel Studios! I'd like to order a *${tier === 'premium' ? 'Premium Portfolio Card' : 'Direct Smart Card'}*.

Tier: ${tier === 'premium' ? 'Premium (portfolio landing page)' : 'Direct (single link)'}
${tier === 'premium' ? `Business type: ${bizType.label}\nTemplate: ${template.name}\nPage: pixelstudios.com/card/${username}` : `Opens: ${directTargets.find((t) => t.id === directTarget)?.label}`}
Material: ${material === 'paper' ? 'Paper / cardstock' : 'Plastic (PVC)'}
Design: ${designMode === 'logo' ? 'My own logo (attached in chat)' : designMode === 'custom' ? 'Request custom design' : 'Pixel Studios generated design'}
${tier === 'premium' ? `My photo: ${profileUri ? 'attached in chat' : 'not added yet'}\nMy logo: ${logoUri ? 'attached in chat' : 'not added yet'}\n` : ''}Name: ${name || '-'}
Business: ${business || '-'}
Phone: ${phone || '-'}
Address: ${address || '-'}
Description: ${description || '-'}

Total: ₦${price.toLocaleString('en-NG')}. Please share payment details!`;

  const placeOrderInApp = () => {
    setOrderId(`PS-${Math.floor(2900 + Math.random() * 600)}`);
  };

  /* ------------------------------ SUCCESS ------------------------------ */
  if (orderId) {
    return (
      <View style={[{ flex: 1, backgroundColor: colors.bg }, { paddingTop: insets.top + sp.x7 }]}>
        <Container style={{ alignItems: 'center' }}>
          <FadeIn>
            <View style={[styles.doneIcon, { backgroundColor: colors.lime }]}>
              <Ionicons name="checkmark" size={40} color={colors.onLime} />
            </View>
          </FadeIn>
          <FadeIn delay={100}>
            <Text style={[styles.doneTitle, { color: colors.text }]}>Order placed 🎉</Text>
            <Text style={[styles.doneOrder, { color: colors.isDark ? colors.lime : '#5E8A0D' }]}>#{orderId}</Text>
            <Text style={[styles.doneText, { color: colors.subtext }]}>
              {tier === 'premium'
                ? `We'll design pixelstudios.com/card/${username}, send you a proof on WhatsApp, then produce your ${material === 'paper' ? 'cardstock' : 'plastic'} card.`
                : `We'll set up your ${material === 'paper' ? 'cardstock' : 'plastic'} card and confirm your link on WhatsApp.`}
            </Text>
          </FadeIn>
          <FadeIn delay={200} style={{ gap: sp.x2_, alignSelf: 'stretch', marginTop: sp.x5 }}>
            <Button title="Confirm on WhatsApp" icon="logo-whatsapp" href={waLink(`Hello! I just placed order #${orderId} for a ${tier === 'premium' ? 'Premium Portfolio Card' : 'Direct Smart Card'}. Here are my details:`)} />
            <Button title="Back to Smart Cards" variant="secondary" onPress={() => setOrderId(null)} />
          </FadeIn>
        </Container>
      </View>
    );
  }

  return (
    <>
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={{ paddingBottom: sp.x8 + 40 }}
      showsVerticalScrollIndicator={false}>
      <Container style={{ marginTop: insets.top + sp.x3 }}>
        <BackBar onBack={() => router.back()} />
      </Container>

      <Container style={{ marginTop: sp.x3 }}>
        <FadeIn>
          <Eyebrow>Pixel Smart</Eyebrow>
          <Text style={styles.title}>Smart Cards</Text>
          <Text style={styles.subtitle}>
            Two functions, two materials — designed live, delivered to your door.
          </Text>
        </FadeIn>

        {/* Live 3D card */}
        <FadeIn delay={80} style={{ marginTop: sp.x5 }}>
          <SmartCard config={cardConfig} />
        </FadeIn>

        {/* STEP 1 — function */}
        <Text style={styles.stepLabel}>01 · Choose function</Text>
        <View style={{ gap: sp.x2_ }}>
          <Pressable
            onPress={() => setTier('direct')}
            style={[styles.tierCard, tier === 'direct' && { borderColor: colors.lime, backgroundColor: colors.limeDim }]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.tierName}>Direct Card</Text>
              <Text style={styles.tierDesc}>
                Scan the QR or tap the card — it opens your WhatsApp, Instagram or any link directly.
              </Text>
            </View>
            <Text style={styles.tierPrice}>from ₦15,000</Text>
          </Pressable>
          <Pressable
            onPress={() => setTier('premium')}
            style={[styles.tierCard, tier === 'premium' && { borderColor: colors.lime, backgroundColor: colors.limeDim }]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.tierName}>Premium Portfolio Card</Text>
              <Text style={styles.tierDesc}>
                Scan to open your own portfolio page — pixelstudios.com/card/you — with your work,
                services and order buttons. Perfect for caterers, tailors, salons, plumbers, doctors…
              </Text>
            </View>
            <Text style={styles.tierPrice}>from ₦35,000</Text>
          </Pressable>
        </View>

        {/* STEP 2 — tier options */}
        {tier === 'direct' ? (
          <>
            <Text style={styles.stepLabel}>02 · Where should it open?</Text>
            <View style={styles.chipRow}>
              {directTargets.map((t) => (
                <Pressable
                  key={t.id}
                  onPress={() => setDirectTarget(t.id)}
                  style={[styles.chip, directTarget === t.id && { borderColor: colors.lime, backgroundColor: colors.limeDim }]}>
                  <Ionicons name={t.icon as any} size={15} color={directTarget === t.id ? (colors.isDark ? colors.lime : '#5E8A0D') : colors.subtext} />
                  <Text style={[styles.chipText, directTarget === t.id && { color: colors.text }]}>{t.label}</Text>
                </Pressable>
              ))}
            </View>
          </>
        ) : (
          <>
            <Text style={styles.stepLabel}>02 · Your business type</Text>
            <View style={styles.bizGrid}>
              {businessTypes.map((b) => (
                <Pressable
                  key={b.id}
                  onPress={() => setBizTypeId(b.id)}
                  style={[styles.bizChip, bizTypeId === b.id && { borderColor: colors.lime, backgroundColor: colors.limeDim }]}>
                  <Text style={{ fontSize: 18 }}>{b.emoji}</Text>
                  <Text style={[styles.bizChipText, bizTypeId === b.id && { color: colors.text }]}>{b.label}</Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.stepLabel}>03 · Choose a template</Text>
            <Text style={styles.hint}>
              A live preview of your portfolio page, filled with your details below.
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: sp.x3 }} style={{ marginHorizontal: -24 }} >
              <View style={{ flexDirection: 'row', gap: sp.x3, paddingHorizontal: 24 }}>
                {cardTemplates.map((t) => (
                  <Pressable key={t.id} onPress={() => setTemplateId(t.id)} style={{ width: 264 }}>
                    <View style={[styles.templateWrap, templateId === t.id && { borderColor: colors.lime }]}>
                      <LandingPreview
                        template={t}
                        businessType={bizType}
                        name={name}
                        business={business}
                        profileUri={profileUri}
                        logoUri={logoUri}
                      />
                    </View>
                    <Text style={[styles.templateName, templateId === t.id && { color: colors.isDark ? colors.lime : '#5E8A0D' }]}>
                      {t.name} {templateId === t.id ? '✓' : ''}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>

            <View style={{ flexDirection: 'row', gap: sp.x2_, marginTop: sp.x3 }}>
              <View style={{ flex: 1 }}>
                <Button
                  title="Preview your page"
                  variant="secondary"
                  icon="eye-outline"
                  onPress={() => setPreviewVisible(true)}
                />
              </View>
            </View>
          </>
        )}

        {/* Photos for the portfolio page */}
        {tier === 'premium' && (
          <>
            <Text style={styles.stepLabel}>04 · Add your photos</Text>
            <Text style={styles.hint}>Shown on your portfolio page — your photo introduces you, your logo builds trust.</Text>
            <View style={{ flexDirection: 'row', gap: sp.x2_ }}>
              <Pressable
                onPress={pickProfile}
                style={[styles.photoTile, profileUri && { borderColor: colors.lime }]}>
                {profileUri ? (
                  <Image source={{ uri: profileUri }} style={styles.photoThumb} />
                ) : (
                  <Ionicons name="person-circle-outline" size={26} color={colors.subtext} />
                )}
                <Text style={styles.photoTitle}>{profileUri ? 'Photo added ✓' : 'Add your photo'}</Text>
                <Text style={styles.photoDesc}>Profile picture on your page</Text>
              </Pressable>
              <Pressable
                onPress={() => pickImage((uri) => { setLogoUri(uri); setDesignMode('logo'); })}
                style={[styles.photoTile, logoUri && { borderColor: colors.lime }]}>
                {logoUri ? (
                  <Image source={{ uri: logoUri }} style={styles.photoThumb} />
                ) : (
                  <Ionicons name="diamond-outline" size={26} color={colors.subtext} />
                )}
                <Text style={styles.photoTitle}>{logoUri ? 'Logo added ✓' : 'Add your logo'}</Text>
                <Text style={styles.photoDesc}>On your page and your card</Text>
              </Pressable>
            </View>
          </>
        )}

        {/* Material */}
        <Text style={styles.stepLabel}>{tier === 'premium' ? '05' : '03'} · Card material</Text>
        <View style={styles.chipRow}>
          <OptChip
            label={`Paper / cardstock — ₦${prices[tier].paper.toLocaleString('en-NG')}`}
            active={material === 'paper'}
            onPress={() => setMaterial('paper')}
          />
          <OptChip
            label={`Plastic (PVC) — ₦${prices[tier].plastic.toLocaleString('en-NG')}`}
            active={material === 'plastic'}
            onPress={() => setMaterial('plastic')}
          />
        </View>

        {/* Design */}
        <Text style={styles.stepLabel}>{tier === 'premium' ? '06' : '04'} · Card design</Text>
        <View style={{ gap: sp.x2_ }}>
          <Pressable onPress={pickLogo} style={[styles.designRow, designMode === 'logo' && { borderColor: colors.lime, backgroundColor: colors.limeDim }]}>
            <Ionicons name="image-outline" size={19} color={colors.text} />
            <View style={{ flex: 1 }}>
              <Text style={styles.designName}>{logoUri ? 'Your logo attached ✓ (tap to change)' : 'Use my logo / design'}</Text>
              <Text style={styles.designDesc}>Attach your logo and it appears on the card instantly.</Text>
            </View>
          </Pressable>
          <Pressable onPress={() => setDesignMode('pixel')} style={[styles.designRow, designMode === 'pixel' && { borderColor: colors.lime, backgroundColor: colors.limeDim }]}>
            <Ionicons name="sparkles-outline" size={19} color={colors.text} />
            <View style={{ flex: 1 }}>
              <Text style={styles.designName}>I don't have a design</Text>
              <Text style={styles.designDesc}>Use a clean Pixel Studios generated design.</Text>
            </View>
          </Pressable>
          <Pressable onPress={() => setDesignMode('custom')} style={[styles.designRow, designMode === 'custom' && { borderColor: colors.lime, backgroundColor: colors.limeDim }]}>
            <Ionicons name="brush-outline" size={19} color={colors.text} />
            <View style={{ flex: 1 }}>
              <Text style={styles.designName}>Request custom design</Text>
              <Text style={styles.designDesc}>Our Creative studio designs something unique for you.</Text>
            </View>
          </Pressable>
        </View>

        {/* Details */}
        <Text style={styles.stepLabel}>{tier === 'premium' ? '07' : '05'} · Your details</Text>
        <Text style={styles.hint}>
          The card above updates live as you type. Phone, address and description appear on the
          back of your card and on your landing page.
        </Text>
        <TextInput value={name} onChangeText={setName} placeholder="Your name" placeholderTextColor={colors.muted} style={styles.input} />
        <TextInput value={business} onChangeText={setBusiness} placeholder="Business name" placeholderTextColor={colors.muted} style={[styles.input, { marginTop: sp.x2_ }]} />
        <TextInput value={phone} onChangeText={setPhone} placeholder="Phone number (e.g. 0803 123 4567)" placeholderTextColor={colors.muted} keyboardType="phone-pad" style={[styles.input, { marginTop: sp.x2_ }]} />
        <TextInput value={address} onChangeText={setAddress} placeholder="Business address" placeholderTextColor={colors.muted} style={[styles.input, { marginTop: sp.x2_ }]} />
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Short description of your business (shown on the back of the card)"
          placeholderTextColor={colors.muted}
          multiline
          style={[styles.input, { marginTop: sp.x2_, minHeight: 84, textAlignVertical: 'top' }]}
        />

        {/* Order */}
        <View style={styles.orderCard}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <Text style={styles.totalLabel}>
              {tier === 'premium' ? 'Premium' : 'Direct'} · {material === 'paper' ? 'cardstock' : 'plastic'}
            </Text>
            <Text style={styles.totalValue}>₦{price.toLocaleString('en-NG')}</Text>
          </View>
          <Button title="Order in App" icon="checkmark" onPress={placeOrderInApp} />
          <View style={{ flexDirection: 'row', gap: sp.x2_ }}>
            <View style={{ flex: 1 }}>
              <Button title="Order on WhatsApp" variant="secondary" icon="logo-whatsapp" href={waLink(waMessage)} />
            </View>
            <Pressable
              onPress={() => Linking.openURL(`tel:${CONTACT.phoneRaw}`)}
              style={[styles.callBtn, { backgroundColor: colors.surface2, borderColor: colors.hairline }]}>
              <Ionicons name="call-outline" size={18} color={colors.text} />
              <Text style={{ fontFamily: fonts.semi, fontSize: 15, color: colors.text }}>Call</Text>
            </Pressable>
          </View>
        </View>
      </Container>
    </ScrollView>

    {/* Full landing-page preview */}
    <Modal
      visible={previewVisible}
      transparent
      animationType="slide"
      onRequestClose={() => setPreviewVisible(false)}>
      <View style={[styles.modalBackdrop, { backgroundColor: 'rgba(5,5,7,0.7)' }]}>
        <View style={[styles.modalSheet, { backgroundColor: colors.bg, borderColor: colors.hairlineStrong }]}>
          <View style={styles.modalHead}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Your landing page</Text>
              <Text style={[styles.modalUrl, { color: colors.isDark ? colors.lime : '#5E8A0D' }]}>
                pixelstudios.com/card/{username}
              </Text>
            </View>
            <Pressable
              onPress={() => setPreviewVisible(false)}
              hitSlop={8}
              style={[styles.modalClose, { backgroundColor: colors.surface2 }]}>
              <Ionicons name="close" size={20} color={colors.text} />
            </Pressable>
          </View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ padding: 16, paddingBottom: 36 }}>
            <View
              style={{
                maxWidth: 420,
                width: '100%',
                alignSelf: 'center',
                borderRadius: 24,
                overflow: 'hidden',
                borderWidth: StyleSheet.hairlineWidth,
                borderColor: colors.hairline,
              }}>
              <LandingPage
                template={template}
                businessType={bizType}
                name={name}
                business={business}
                profileUri={profileUri}
                logoUri={logoUri}
                phone={phone}
                address={address}
                description={description}
              />
            </View>
            <Text style={[styles.modalHint, { color: colors.muted }]}>
              This is exactly what your customers see when they scan or tap your Smart Card.
            </Text>
          </ScrollView>
        </View>
      </View>
    </Modal>
    </>
  );
}

function useStyles(colors: Palette) {
  return StyleSheet.create({
    title: { fontFamily: fonts.semi, fontSize: 36, lineHeight: 40, letterSpacing: -1.1, color: colors.text, marginTop: sp.x1 },
    subtitle: { fontFamily: fonts.regular, fontSize: 16.5, color: colors.subtext, marginTop: sp.x1, maxWidth: 520 },
    stepLabel: {
      fontFamily: fonts.semi,
      fontSize: 15,
      letterSpacing: 0.3,
      color: colors.text,
      marginTop: sp.x6,
      marginBottom: sp.x2_,
    },
    hint: { fontFamily: fonts.regular, fontSize: 13.5, color: colors.muted, marginBottom: sp.x2_ },
    tierCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: sp.x3,
      backgroundColor: colors.surface,
      borderColor: colors.hairline,
      borderWidth: 1,
      borderRadius: radius.lg,
      padding: sp.x3,
    },
    tierName: { fontFamily: fonts.semi, fontSize: 17, color: colors.text },
    tierDesc: { fontFamily: fonts.regular, fontSize: 13.5, lineHeight: 19, color: colors.subtext, marginTop: 4 },
    tierPrice: { fontFamily: fonts.medium, fontSize: 13, color: colors.muted },
    chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: sp.x1 },
    chip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 7,
      paddingHorizontal: 16,
      paddingVertical: 11,
      borderRadius: radius.md,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.hairline,
    },
    chipText: { fontFamily: fonts.medium, fontSize: 14, color: colors.subtext },
    bizGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: sp.x2_ },
    bizChip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingHorizontal: 16,
      paddingVertical: 13,
      borderRadius: radius.md,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.hairline,
    },
    bizChipText: { fontFamily: fonts.medium, fontSize: 14, color: colors.subtext },
    templateWrap: { borderRadius: 20, borderWidth: 2, borderColor: 'transparent', overflow: 'hidden' },
    templateName: { fontFamily: fonts.semi, fontSize: 13.5, color: colors.subtext, marginTop: sp.x1, textAlign: 'center' },
    photoTile: {
      flex: 1,
      alignItems: 'center',
      gap: 4,
      paddingVertical: sp.x3,
      paddingHorizontal: 10,
      borderRadius: radius.md,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.hairline,
    },
    photoThumb: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.surface2 },
    photoTitle: { fontFamily: fonts.semi, fontSize: 13.5, color: colors.text, marginTop: 4, textAlign: 'center' },
    photoDesc: { fontFamily: fonts.regular, fontSize: 11.5, color: colors.muted, textAlign: 'center' },
    designRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: sp.x3,
      backgroundColor: colors.surface,
      borderColor: colors.hairline,
      borderWidth: 1,
      borderRadius: radius.md,
      padding: sp.x3,
    },
    designName: { fontFamily: fonts.semi, fontSize: 15.5, color: colors.text },
    designDesc: { fontFamily: fonts.regular, fontSize: 13, color: colors.subtext, marginTop: 2 },
    input: {
      backgroundColor: colors.surface,
      borderColor: colors.hairline,
      borderWidth: 1,
      borderRadius: radius.md,
      paddingHorizontal: 18,
      paddingVertical: 16,
      color: colors.text,
      fontFamily: fonts.regular,
      fontSize: 16,
    },
    orderCard: {
      marginTop: sp.x6,
      backgroundColor: colors.surface,
      borderColor: colors.hairline,
      borderWidth: 1,
      borderRadius: radius.lg,
      padding: sp.x3,
      gap: sp.x3,
    },
    totalLabel: { fontFamily: fonts.regular, fontSize: 13.5, color: colors.muted },
    totalValue: { fontFamily: fonts.semi, fontSize: 26, letterSpacing: -0.5, color: colors.text },
    callBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      borderRadius: radius.md,
      paddingHorizontal: 20,
      borderWidth: 1,
    },
    doneIcon: { width: 88, height: 88, borderRadius: 44, alignItems: 'center', justifyContent: 'center', alignSelf: 'center' },
    modalBackdrop: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 18 },
    modalSheet: {
      width: '100%',
      maxWidth: 480,
      maxHeight: '94%',
      borderRadius: 24,
      borderWidth: StyleSheet.hairlineWidth,
      overflow: 'hidden',
    },
    modalHead: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: sp.x2_,
      paddingHorizontal: 20,
      paddingVertical: 16,
    },
    modalTitle: { fontFamily: fonts.semi, fontSize: 18, letterSpacing: -0.3 },
    modalUrl: { fontFamily: fonts.medium, fontSize: 12.5, marginTop: 2 },
    modalClose: {
      width: 38,
      height: 38,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    modalHint: {
      fontFamily: fonts.regular,
      fontSize: 13,
      textAlign: 'center',
      marginTop: 14,
      maxWidth: 380,
      alignSelf: 'center',
    },
    doneTitle: { fontFamily: fonts.semi, fontSize: 32, letterSpacing: -0.8, textAlign: 'center', marginTop: sp.x4 },
    doneOrder: { fontFamily: fonts.bold, fontSize: 18, letterSpacing: 2, textAlign: 'center', marginTop: sp.x1 },
    doneText: { fontFamily: fonts.regular, fontSize: 15.5, lineHeight: 23, textAlign: 'center', marginTop: sp.x2_, maxWidth: 420 },
  });
}
