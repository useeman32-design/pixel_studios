import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
  Animated,
  Image,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackBar, Container, FadeIn, Stepper } from '../../components/ui';
import { waLink } from '../../constants/contact';
import { colors, fonts, radius, sp } from '../../constants/theme';
import { formatNaira, getProduct } from '../../data/products';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const product = getProduct(id);
  const [qty, setQty] = useState(1);
  const [material, setMaterial] = useState<string | undefined>(undefined);
  const [finish, setFinish] = useState<string | undefined>(undefined);
  const toast = useRef(new Animated.Value(0)).current;

  if (!product) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top + sp.x2 }]}>
        <Container>
          <BackBar title="Product" onBack={() => router.back()} />
        </Container>
      </View>
    );
  }

  const selectedMaterial = material ?? product.materials?.[0];
  const selectedFinish = finish ?? product.finishes?.[0];

  const addToCart = () => {
    Animated.sequence([
      Animated.timing(toast, { toValue: 1, duration: 220, useNativeDriver: true }),
      Animated.delay(1600),
      Animated.timing(toast, { toValue: 0, duration: 260, useNativeDriver: true }),
    ]).start();
  };

  const waMessage = `Hello Pixel Studios! I'd like to order *${product.name}*.

Quantity: ${qty}${selectedMaterial ? `\nMaterial: ${selectedMaterial}` : ''}${selectedFinish ? `\nFinish: ${selectedFinish}` : ''}

Please share the total and payment options.`;

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={{ paddingBottom: 150 }} showsVerticalScrollIndicator={false}>
        <Image source={product.image} style={[styles.image, { marginTop: insets.top }]} resizeMode="cover" />

        <Container style={{ marginTop: sp.x3 }}>
          <BackBar onBack={() => router.back()} />
        </Container>

        <Container style={{ marginTop: sp.x2_ }}>
          <FadeIn>
            <Text style={styles.name}>{product.name}</Text>
            <Text style={styles.description}>{product.description}</Text>
            {!product.quoteOnly && (
              <Text style={styles.price}>{formatNaira(product.price ?? 0)}</Text>
            )}
          </FadeIn>

          <FadeIn delay={80} style={{ marginTop: sp.x4 }}>
            {product.features.map((f) => (
              <View key={f} style={styles.featureRow}>
                <Ionicons name="checkmark" size={14} color={colors.lime} />
                <Text style={styles.featureText}>{f}</Text>
              </View>
            ))}
          </FadeIn>

          {product.materials && (
            <FadeIn delay={120}>
              <Text style={styles.optionTitle}>Material</Text>
              <View style={styles.chipRow}>
                {product.materials.map((m) => (
                  <OptChip
                    key={m}
                    label={m}
                    active={selectedMaterial === m}
                    onPress={() => setMaterial(m)}
                  />
                ))}
              </View>
            </FadeIn>
          )}

          {product.finishes && (
            <FadeIn delay={140}>
              <Text style={styles.optionTitle}>Finish</Text>
              <View style={styles.chipRow}>
                {product.finishes.map((f) => (
                  <OptChip
                    key={f}
                    label={f}
                    active={selectedFinish === f}
                    onPress={() => setFinish(f)}
                  />
                ))}
              </View>
            </FadeIn>
          )}

          <FadeIn delay={160}>
            <Text style={styles.optionTitle}>Quantity</Text>
            <Stepper value={qty} onChange={setQty} />
          </FadeIn>
        </Container>
      </ScrollView>

      {/* Sticky bottom bar */}
      <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 14) }]}>
        <Container style={{ flexDirection: 'row', alignItems: 'center', gap: sp.x3 }}>
          <View style={{ flex: 1 }}>
            <Text style={styles.barLabel}>{product.quoteOnly ? 'Custom pricing' : 'Total estimate'}</Text>
            <Text style={styles.barPrice}>
              {product.quoteOnly ? 'On request' : formatNaira((product.price ?? 0) * qty)}
            </Text>
          </View>
          {product.quoteOnly ? (
            <Pressable style={styles.cartBtn} onPress={() => Linking.openURL(waLink(waMessage))}>
              <Text style={styles.cartBtnText}>Request Quote</Text>
            </Pressable>
          ) : (
            <>
              <Pressable style={styles.waBtn} onPress={() => Linking.openURL(waLink(waMessage))}>
                <Ionicons name="logo-whatsapp" size={20} color={colors.text} />
              </Pressable>
              <Pressable style={styles.cartBtn} onPress={addToCart}>
                <Text style={styles.cartBtnText}>Add to Cart</Text>
              </Pressable>
            </>
          )}
        </Container>

        {/* Toast */}
        <Animated.View style={[styles.toast, { opacity: toast, transform: [{ translateY: toast.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) }] }]}>
          <Ionicons name="checkmark-circle" size={16} color={colors.onLime} />
          <Text style={styles.toastText}>Added to cart</Text>
        </Animated.View>
      </View>
    </View>
  );
}

function OptChip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.optChip, active && styles.optChipActive]}>
      <Text style={[styles.optChipText, active && styles.optChipTextActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  image: { width: '100%', height: 360, backgroundColor: colors.surface },
  name: {
    fontFamily: fonts.semi,
    fontSize: 32,
    lineHeight: 36,
    letterSpacing: -0.9,
    color: colors.text,
  },
  description: {
    fontFamily: fonts.regular,
    fontSize: 17,
    lineHeight: 25,
    color: colors.subtext,
    marginTop: sp.x1,
  },
  price: {
    fontFamily: fonts.medium,
    fontSize: 15,
    color: colors.muted,
    marginTop: sp.x2_,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 9,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.hairline,
  },
  featureText: { fontFamily: fonts.regular, fontSize: 15.5, color: colors.subtext },
  optionTitle: {
    fontFamily: fonts.semi,
    fontSize: 16,
    color: colors.text,
    marginTop: sp.x4,
    marginBottom: sp.x2_,
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: sp.x1 },
  optChip: {
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.hairline,
  },
  optChipActive: { backgroundColor: colors.limeDim, borderColor: colors.lime },
  optChipText: { fontFamily: fonts.medium, fontSize: 14, color: colors.subtext },
  optChipTextActive: { color: colors.lime },
  bar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.bg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.hairline,
    paddingTop: sp.x2_,
  },
  barLabel: { fontFamily: fonts.regular, fontSize: 12.5, color: colors.muted },
  barPrice: { fontFamily: fonts.semi, fontSize: 20, color: colors.text, marginTop: 2 },
  waBtn: {
    width: 54,
    height: 54,
    borderRadius: radius.md,
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.hairline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBtn: {
    height: 54,
    borderRadius: radius.md,
    backgroundColor: colors.lime,
    paddingHorizontal: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBtnText: { fontFamily: fonts.semi, fontSize: 16, color: colors.onLime },
  toast: {
    position: 'absolute',
    top: -52,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.lime,
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 11,
  },
  toastText: { fontFamily: fonts.semi, fontSize: 14, color: colors.onLime },
});
