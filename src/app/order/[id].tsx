import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackBar, Container, FadeIn } from '../../components/ui';
import { colors, fonts, radius, sp } from '../../constants/theme';
import { getOrder, orderSteps } from '../../data/orders';
import { formatNaira } from '../../data/products';

export default function OrderTrackingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const order = getOrder(id);

  if (!order) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top + sp.x2 }]}>
        <Container>
          <BackBar title="Order" onBack={() => router.back()} />
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

      <Container style={{ marginTop: sp.x4 }}>
        <FadeIn>
          <Text style={styles.orderId}>#{order.id}</Text>
          <Text style={styles.product}>{order.product}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.meta}>{formatNaira(order.price)}</Text>
            <Text style={styles.meta}>·</Text>
            <Text style={styles.meta}>{order.date}</Text>
            <Text style={styles.meta}>·</Text>
            <Text style={styles.meta}>{order.status}</Text>
          </View>
        </FadeIn>

        {/* Timeline */}
        <View style={{ marginTop: sp.x6 }}>
          {orderSteps.map((step, i) => {
            const completed = i < order.step;
            const current = i === order.step;
            const isLast = i === orderSteps.length - 1;
            return (
              <FadeIn key={step} delay={i * 90}>
                <View style={styles.stepRow}>
                  <View style={styles.stepCol}>
                    <View
                      style={[
                        styles.dotOuter,
                        completed && styles.dotCompleted,
                        current && styles.dotCurrent,
                      ]}>
                      {completed && <Ionicons name="checkmark" size={13} color={colors.onLime} />}
                      {current && <View style={styles.dotCurrentInner} />}
                    </View>
                    {!isLast && (
                      <View style={[styles.line, completed && styles.lineCompleted]} />
                    )}
                  </View>
                  <View style={{ paddingBottom: isLast ? 0 : 40, paddingTop: 8, flex: 1 }}>
                    <Text
                      style={[
                        styles.stepLabel,
                        (completed || current) && { color: colors.text },
                      ]}>
                      {step}
                    </Text>
                    {current && <Text style={styles.stepNow}>In progress</Text>}
                  </View>
                </View>
              </FadeIn>
            );
          })}
        </View>

        {/* ETA */}
        <FadeIn delay={200}>
          <View style={styles.etaCard}>
            <Ionicons name="time-outline" size={18} color={colors.lime} />
            <Text style={styles.etaText}>{order.eta}</Text>
          </View>
        </FadeIn>
      </Container>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  orderId: {
    fontFamily: fonts.bold,
    fontSize: 40,
    letterSpacing: -1.2,
    color: colors.text,
  },
  product: {
    fontFamily: fonts.medium,
    fontSize: 17,
    color: colors.subtext,
    marginTop: sp.x1,
  },
  metaRow: { flexDirection: 'row', gap: 8, marginTop: sp.x2_ },
  meta: { fontFamily: fonts.regular, fontSize: 14, color: colors.muted },
  stepRow: { flexDirection: 'row' },
  stepCol: { alignItems: 'center', width: 32 },
  dotOuter: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: colors.hairlineStrong,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg,
  },
  dotCompleted: { backgroundColor: colors.lime, borderColor: colors.lime },
  dotCurrent: { borderColor: colors.lime },
  dotCurrentInner: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.lime },
  line: { flex: 1, width: 1.5, backgroundColor: colors.hairline, marginVertical: 4 },
  lineCompleted: { backgroundColor: colors.lime },
  stepLabel: { fontFamily: fonts.medium, fontSize: 16.5, color: colors.muted },
  stepNow: { fontFamily: fonts.regular, fontSize: 13, color: colors.lime, marginTop: 3 },
  etaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.surface,
    borderColor: colors.hairline,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: sp.x3,
    marginTop: sp.x4,
  },
  etaText: { fontFamily: fonts.medium, fontSize: 14.5, color: colors.subtext, flex: 1 },
});
