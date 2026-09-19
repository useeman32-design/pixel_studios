import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackBar, Container, FadeIn } from '../../components/ui';
import { waLink } from '../../constants/contact';
import { colors, fonts, radius, sp } from '../../constants/theme';
import { getCategory } from '../../data/services';
import { Linking } from 'react-native';

export default function ServiceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const category = getCategory(id);

  if (!category) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top + sp.x2 }]}>
        <Container>
          <BackBar title="Service" onBack={() => router.back()} />
        </Container>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{ paddingBottom: sp.x8 }}
      showsVerticalScrollIndicator={false}>
      <Container style={{ marginTop: insets.top + sp.x1 }}>
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
          <Pressable style={styles.primaryBtn} onPress={() => router.push('/start')}>
            <Text style={styles.primaryBtnText}>Start a Project</Text>
          </Pressable>
          <Pressable style={styles.secondaryBtn} onPress={() => router.push('/shop')}>
            <Text style={styles.secondaryBtnText}>Browse related products</Text>
          </Pressable>
        </FadeIn>
      </Container>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  image: {
    width: '100%',
    height: 240,
    borderRadius: radius.xl,
    backgroundColor: colors.surface,
  },
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
  primaryBtn: {
    backgroundColor: colors.lime,
    borderRadius: radius.md,
    paddingVertical: 17,
    alignItems: 'center',
  },
  primaryBtnText: { fontFamily: fonts.semi, fontSize: 16, color: colors.onLime },
  secondaryBtn: {
    backgroundColor: colors.surface2,
    borderRadius: radius.md,
    paddingVertical: 17,
    alignItems: 'center',
  },
  secondaryBtnText: { fontFamily: fonts.semi, fontSize: 16, color: colors.text },
});
