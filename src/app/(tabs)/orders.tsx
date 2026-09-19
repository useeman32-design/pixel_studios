import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Container, FadeIn } from '../../components/ui';
import { colors, fonts, radius, sp } from '../../constants/theme';
import { orders } from '../../data/orders';
import { formatNaira } from '../../data/products';

export default function OrdersScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{ paddingBottom: sp.x8 }}
      showsVerticalScrollIndicator={false}>
      <Container style={{ marginTop: insets.top + sp.x4 }}>
        <FadeIn>
          <Text style={styles.title}>Your orders</Text>
          <Text style={styles.subtitle}>Track everything from design approval to delivery.</Text>
        </FadeIn>

        <View style={{ gap: sp.x2_, marginTop: sp.x5 }}>
          {orders.map((order, i) => (
            <FadeIn key={order.id} delay={i * 70}>
              <Pressable
                onPress={() => router.push(`/order/${order.id}` as any)}
                style={styles.card}>
                <View style={styles.topRow}>
                  <Text style={styles.orderId}>#{order.id}</Text>
                  <StatusPill status={order.status} />
                </View>
                <Text style={styles.product}>{order.product}</Text>
                <View style={styles.bottomRow}>
                  <Text style={styles.price}>{formatNaira(order.price)}</Text>
                  <Text style={styles.date}>{order.date}</Text>
                </View>
              </Pressable>
            </FadeIn>
          ))}
        </View>

        <FadeIn delay={250}>
          <View style={styles.help}>
            <Text style={styles.helpText}>Need help with an order?</Text>
            <Pressable onPress={() => router.push('/chat')} style={styles.helpLink}>
              <Text style={styles.helpLinkText}>Chat with us</Text>
              <Ionicons name="arrow-forward" size={14} color={colors.lime} />
            </Pressable>
          </View>
        </FadeIn>
      </Container>
    </ScrollView>
  );
}

export function StatusPill({ status }: { status: string }) {
  const active = status === 'In Production' || status === 'Design Approval';
  return (
    <View style={styles.pill}>
      <View style={[styles.dot, active && { backgroundColor: colors.lime }]} />
      <Text style={styles.pillText}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  title: { fontFamily: fonts.semi, fontSize: 36, letterSpacing: -1.1, color: colors.text },
  subtitle: { fontFamily: fonts.regular, fontSize: 16, color: colors.subtext, marginTop: sp.x1 },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.hairline,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: sp.x3,
  },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  orderId: { fontFamily: fonts.medium, fontSize: 13, letterSpacing: 1, color: colors.muted },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: colors.surface2,
    borderRadius: radius.sm,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.muted },
  pillText: { fontFamily: fonts.medium, fontSize: 12.5, color: colors.subtext },
  product: {
    fontFamily: fonts.semi,
    fontSize: 18,
    letterSpacing: -0.2,
    color: colors.text,
    marginTop: sp.x2_,
  },
  bottomRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: sp.x2_ },
  price: { fontFamily: fonts.medium, fontSize: 15, color: colors.text },
  date: { fontFamily: fonts.regular, fontSize: 13.5, color: colors.muted },
  help: {
    marginTop: sp.x5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: sp.x3,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.hairline,
  },
  helpText: { fontFamily: fonts.regular, fontSize: 15, color: colors.subtext },
  helpLink: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  helpLinkText: { fontFamily: fonts.semi, fontSize: 15, color: colors.lime },
});
