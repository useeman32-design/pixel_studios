import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { Image, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackBar, Container, FadeIn } from '../../components/ui';
import { waLink } from '../../constants/contact';
import { fonts, Palette, radius, sp, useTheme } from '../../constants/theme';
import { getCategory } from '../../data/services';

export default function ServiceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const category = getCategory(id);

  if (!category) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, paddingTop: insets.top + sp.x3 }}>
        <Container>
          <BackBar title="Service" onBack={() => router.back()} />
        </Container>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={{ paddingBottom: sp.x8 }}
      showsVerticalScrollIndicator={false}>
      <Container style={{ marginTop: insets.top + sp.x3 }}>
        <BackBar onBack={() => router.back()} />
      </Container>

      <Container style={{ marginTop: sp.x3 }}>
        <FadeIn>
          <Image source={category.image} style={styles.image} resizeMode="cover" />
        </FadeIn>

        <FadeIn delay={90} style={{ marginTop: sp.x5 }}>
          <Text style={styles.title}>{category.name}</Text>
          <Text style={styles.subtitle}>{category.subtitle}</Text>
        </FadeIn>

        <View style={{ marginTop: sp.x5 }}>
          {category.services.map((service, i) => (
            <FadeIn key={service} delay={120 + i * 40}>
              <Pressable
                style={styles.row}
                onPress={() =>
                  Linking.openURL(
                    waLink(`Hello Pixel Studios! I'm interested in *${service}* (${category.name}). Can we discuss?`),
                  )
                }>
                <Text style={styles.rowText}>{service}</Text>
                <Ionicons name="arrow-forward" size={16} color={colors.muted} />
              </Pressable>
            </FadeIn>
          ))}
        </View>

        <FadeIn delay={220} style={{ marginTop: sp.x6, gap: sp.x2_ }}>
          <Pressable style={[styles.primaryBtn, { backgroundColor: colors.lime }]} onPress={() => router.push('/start')}>
            <Text style={{ fontFamily: fonts.semi, fontSize: 16, color: colors.onLime }}>Start a Project</Text>
          </Pressable>
          <Pressable style={styles.secondaryBtn} onPress={() => router.push('/ai')}>
            <Text style={{ fontFamily: fonts.semi, fontSize: 16, color: colors.text }}>Ask Pixel AI about this</Text>
          </Pressable>
        </FadeIn>
      </Container>
    </ScrollView>
  );
}

function useStyles(colors: Palette) {
  return useMemo(
    () =>
      StyleSheet.create({
        image: { width: '100%', height: 240, borderRadius: radius.xl, backgroundColor: colors.surface },
        title: {
          fontFamily: fonts.semi,
          fontSize: 36,
          lineHeight: 40,
          letterSpacing: -1.1,
          color: colors.text,
        },
        subtitle: { fontFamily: fonts.regular, fontSize: 16.5, color: colors.subtext, marginTop: sp.x1 },
        row: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingVertical: sp.x3,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: colors.hairline,
        },
        rowText: { fontFamily: fonts.medium, fontSize: 17, color: colors.text },
        primaryBtn: { borderRadius: radius.md, paddingVertical: 17, alignItems: 'center' },
        secondaryBtn: {
          backgroundColor: colors.surface2,
          borderRadius: radius.md,
          paddingVertical: 17,
          alignItems: 'center',
        },
      }),
    [colors],
  );
}
