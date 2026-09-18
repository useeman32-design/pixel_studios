import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackHeader, Button, Container, FadeIn } from '../../components/ui';
import { CONTACT, waLink } from '../../constants/contact';
import { colors, fonts, radius } from '../../constants/theme';
import { formatNaira, getProduct } from '../../data/products';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const product = getProduct(id);
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [note, setNote] = useState('');

  if (!product) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top + 20 }]}>
        <BackHeader title="Product" onBack={() => router.back()} />
        <Text style={{ color: colors.subtext, padding: 24 }}>Product not found.</Text>
      </View>
    );
  }

  const toggleOption = (opt: string) => {
    setSelectedOptions((prev) =>
      prev.includes(opt) ? prev.filter((o) => o !== opt) : [...prev, opt],
    );
  };

  const orderMessage = `Hello Pixel Studios! I'd like to order *${product.name}*.

🔢 Quantity: ${quantity}
${selectedOptions.length > 0 ? `⚙️ Options: ${selectedOptions.join(', ')}` : ''}
${note.trim() ? `📝 Note: ${note.trim()}` : ''}

Please share the total price and payment options. Thank you!`;

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 8 }]}>
      <BackHeader title="Product" onBack={() => router.back()} />
      <ScrollView contentContainerStyle={{ paddingBottom: 140 }} showsVerticalScrollIndicator={false}>
        <Container style={{ paddingHorizontal: 20 }}>
          <FadeIn>
            <View style={styles.imageWrap}>
              <Image source={product.image} style={styles.image} resizeMode="cover" />
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{product.category}</Text>
              </View>
            </View>
          </FadeIn>

          <FadeIn delay={80}>
            <Text style={styles.name}>{product.name}</Text>
            {product.quoteOnly ? (
              <Text style={styles.quotePrice}>Custom pricing — request a quote</Text>
            ) : (
              <View style={styles.priceRow}>
                <Text style={styles.price}>From {formatNaira(product.price ?? 0)}</Text>
                <Text style={styles.priceNote}>{product.priceNote}</Text>
              </View>
            )}
            <Text style={styles.description}>{product.description}</Text>
          </FadeIn>

          <FadeIn delay={140}>
            <Text style={styles.optionsTitle}>Available options</Text>
            <View style={styles.optionsWrap}>
              {product.options.map((opt) => {
                const active = selectedOptions.includes(opt);
                return (
                  <Pressable
                    key={opt}
                    onPress={() => toggleOption(opt)}
                    style={[styles.optionChip, active && styles.optionChipActive]}>
                    {active && <Ionicons name="checkmark-circle" size={15} color="#C4B5FD" />}
                    <Text style={[styles.optionText, active && { color: '#E9D5FF' }]}>{opt}</Text>
                  </Pressable>
                );
              })}
            </View>
          </FadeIn>

          <FadeIn delay={200}>
            <Text style={styles.optionsTitle}>Quantity</Text>
            <View style={styles.qtyRow}>
              <Pressable
                onPress={() => setQuantity((q) => Math.max(1, q - 1))}
                style={styles.qtyButton}>
                <Ionicons name="remove" size={20} color={colors.text} />
              </Pressable>
              <Text style={styles.qtyValue}>{quantity}</Text>
              <Pressable onPress={() => setQuantity((q) => q + 1)} style={styles.qtyButton}>
                <Ionicons name="add" size={20} color={colors.text} />
              </Pressable>
            </View>

            <Text style={styles.optionsTitle}>Note for our team (optional)</Text>
            <TextInput
              value={note}
              onChangeText={setNote}
              placeholder="Colors, sizes, design ideas, delivery location…"
              placeholderTextColor={colors.muted}
              multiline
              style={styles.noteInput}
            />
          </FadeIn>
        </Container>
      </ScrollView>

      {/* sticky order bar */}
      <View style={[styles.orderBar, { paddingBottom: Math.max(insets.bottom, 12) + 8 }]}>
        <Container style={{ flexDirection: 'row', gap: 12, paddingHorizontal: 20 }}>
          <View style={{ flex: 1 }}>
            <Button
              title={product.quoteOnly ? 'Request Quote' : 'Order via WhatsApp'}
              variant="whatsapp"
              icon="logo-whatsapp"
              href={waLink(orderMessage)}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Button title="Customize as project" variant="glass" onPress={() => router.push('/start')} />
          </View>
        </Container>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  imageWrap: { borderRadius: radius.xl, overflow: 'hidden', position: 'relative' },
  image: { width: '100%', height: 260 },
  categoryBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
    backgroundColor: 'rgba(7,7,13,0.65)',
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  categoryText: {
    color: '#fff',
    fontFamily: fonts.bodySemi,
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  name: { color: colors.text, fontFamily: fonts.display, fontSize: 28, letterSpacing: -0.5, marginTop: 20 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 10, marginTop: 8 },
  price: { color: colors.cyan, fontFamily: fonts.displaySemi, fontSize: 22 },
  priceNote: { color: colors.muted, fontFamily: fonts.body, fontSize: 13 },
  quotePrice: { color: colors.amber, fontFamily: fonts.bodySemi, fontSize: 16, marginTop: 8 },
  description: { color: colors.subtext, fontFamily: fonts.body, fontSize: 15, lineHeight: 23, marginTop: 14 },
  optionsTitle: {
    color: colors.text,
    fontFamily: fonts.displaySemi,
    fontSize: 17,
    marginTop: 26,
    marginBottom: 12,
  },
  optionsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  optionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: colors.border,
  },
  optionChipActive: { backgroundColor: colors.violetSoft, borderColor: 'rgba(139,92,246,0.7)' },
  optionText: { color: colors.subtext, fontFamily: fonts.bodyMedium, fontSize: 13 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 18 },
  qtyButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyValue: { color: colors.text, fontFamily: fonts.display, fontSize: 20, minWidth: 36, textAlign: 'center' },
  noteInput: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: colors.text,
    fontFamily: fonts.body,
    fontSize: 14.5,
    minHeight: 90,
    textAlignVertical: 'top',
  },
  orderBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.bg,
    borderTopColor: colors.border,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 12,
  },
});
