import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Container, FadeIn } from '../../components/ui';
import { fonts, Palette, radius, sp, useTheme } from '../../constants/theme';
import { serviceCategories } from '../../data/services';

export default function ServicesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = useStyles(colors);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={{ paddingBottom: 140 }}
      showsVerticalScrollIndicator={false}>
      <Container style={{ marginTop: insets.top + sp.x4 }}>
        <FadeIn>
          <Text style={styles.title}>What can we create for you?</Text>
          <Text style={styles.subtitle}>Four studios. One standard of excellence.</Text>
        </FadeIn>

        <View style={{ gap: sp.x3, marginTop: sp.x5 }}>
          {serviceCategories.map((cat, i) => (
            <FadeIn key={cat.id} delay={i * 80}>
              <Pressable onPress={() => router.push(`/service/${cat.id}` as any)} style={styles.card}>
                <Image source={cat.image} style={styles.image} resizeMode="cover" />
                <View style={styles.cardBody}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardTitle}>{cat.name}</Text>
                    <Text style={styles.cardSub}>{cat.subtitle}</Text>
                  </View>
                  <View style={styles.arrow}>
                    <Ionicons name="arrow-forward" size={17} color={colors.text} />
                  </View>
                </View>
              </Pressable>
            </FadeIn>
          ))}
        </View>
      </Container>
    </ScrollView>
  );
}

function useStyles(colors: Palette) {
  return useMemo(
    () =>
      StyleSheet.create({
        title: {
          fontFamily: fonts.semi,
          fontSize: 36,
          lineHeight: 40,
          letterSpacing: -1.1,
          color: colors.text,
          maxWidth: 480,
        },
        subtitle: {
          fontFamily: fonts.regular,
          fontSize: 17,
          color: colors.subtext,
          marginTop: sp.x1,
        },
        card: {
          borderRadius: radius.xl,
          overflow: 'hidden',
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.hairline,
        },
        image: { width: '100%', height: 190 },
        cardBody: { flexDirection: 'row', alignItems: 'center', padding: sp.x3 },
        cardTitle: { fontFamily: fonts.semi, fontSize: 21, letterSpacing: -0.3, color: colors.text },
        cardSub: { fontFamily: fonts.regular, fontSize: 14.5, color: colors.subtext, marginTop: 4 },
        arrow: {
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: colors.surface2,
          borderWidth: 1,
          borderColor: colors.hairline,
          alignItems: 'center',
          justifyContent: 'center',
        },
      }),
    [colors],
  );
}
