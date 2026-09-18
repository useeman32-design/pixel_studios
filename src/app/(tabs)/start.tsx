import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, Chip, Container, FadeIn } from '../../components/ui';
import { waLink } from '../../constants/contact';
import { colors, fonts, radius } from '../../constants/theme';

const needs = [
  { id: 'Branding', emoji: '🎨', label: 'Branding & Logo' },
  { id: 'Printing', emoji: '🖨️', label: 'Printing' },
  { id: 'Website', emoji: '🌐', label: 'Website' },
  { id: 'Mobile App', emoji: '📱', label: 'Mobile App' },
  { id: 'Business System', emoji: '⚙️', label: 'Business System' },
  { id: 'NFC Card', emoji: '📡', label: 'NFC / Smart Product' },
  { id: 'Marketing', emoji: '📣', label: 'Marketing' },
  { id: 'Packaging', emoji: '📦', label: 'Packaging' },
  { id: 'AI Solution', emoji: '🤖', label: 'AI Solution' },
  { id: 'Other', emoji: '✨', label: 'Something else' },
];

const budgets = ['Under ₦50k', '₦50k – ₦200k', '₦200k – ₦500k', '₦500k – ₦1m', 'Above ₦1m', 'Not sure yet'];
const deadlines = ['ASAP', 'Within 1 week', 'Within 2 weeks', 'Within a month', 'Flexible'];
const steps = ['Need', 'About you', 'Details', 'Review'];

export default function StartProjectScreen() {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(0);
  const [need, setNeed] = useState('');
  const [name, setName] = useState('');
  const [business, setBusiness] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('');
  const [budget, setBudget] = useState('');
  const [deadline, setDeadline] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const canNext = useMemo(() => {
    if (step === 0) return !!need;
    if (step === 1) return name.trim().length > 1 && phone.trim().length >= 7;
    if (step === 2) return description.trim().length > 5;
    return true;
  }, [step, need, name, phone, description]);

  const summary = [
    { label: 'Service needed', value: need },
    { label: 'Name', value: name },
    { label: 'Business', value: business || '—' },
    { label: 'Phone', value: phone },
    { label: 'WhatsApp', value: whatsapp || phone },
    { label: 'Email', value: email || '—' },
    { label: 'Quantity', value: quantity || '—' },
    { label: 'Budget', value: budget || '—' },
    { label: 'Deadline', value: deadline || '—' },
  ];

  const whatsappMessage = `*NEW PROJECT REQUEST — Pixel Studios App*

🎯 Service: ${need}
👤 Name: ${name}
🏢 Business: ${business || '-'}
📞 Phone: ${phone}
💬 WhatsApp: ${whatsapp || phone}
✉️ Email: ${email || '-'}

📝 Project description:
${description}

🔢 Quantity: ${quantity || '-'}
💰 Budget: ${budget || '-'}
⏰ Deadline: ${deadline || '-'}`;

  const submitLink = waLink(whatsappMessage);

  if (submitted) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top + 40 }]}>
        <Container style={{ alignItems: 'center' }}>
          <FadeIn>
            <LinearGradient
              colors={['#10B981', '#22D3EE']}
              style={styles.successIcon}>
              <Ionicons name="checkmark" size={44} color="#fff" />
            </LinearGradient>
          </FadeIn>
          <FadeIn delay={120}>
            <Text style={styles.successTitle}>Request ready! 🎉</Text>
          </FadeIn>
          <FadeIn delay={220}>
            <Text style={styles.successText}>
              One last step: send your brief to our team on WhatsApp and we'll reply with a
              quotation — usually within 24 hours.
            </Text>
          </FadeIn>
          <FadeIn delay={320} style={{ marginTop: 28, gap: 12, alignSelf: 'stretch' }}>
            <Button title="Send on WhatsApp" variant="whatsapp" icon="logo-whatsapp" href={submitLink} />
            <Button title="Edit my request" variant="glass" onPress={() => setSubmitted(false)} />
          </FadeIn>
        </Container>
      </View>
    );
  }

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 20 }]}>
      <Container style={{ paddingHorizontal: 0 }}>
        {/* progress */}
        <View style={styles.progressRow}>
          {steps.map((s, i) => (
            <View key={s} style={styles.progressStep}>
              <View style={[styles.progressDot, (i <= step) && styles.progressDotActive]}>
                <Text style={[styles.progressDotText, (i <= step) && { color: '#fff' }]}>
                  {i < step ? '✓' : i + 1}
                </Text>
              </View>
              <Text style={[styles.progressLabel, i === step && { color: colors.text }]}>{s}</Text>
            </View>
          ))}
        </View>

        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          {step === 0 && (
            <FadeIn>
              <Text style={styles.stepTitle}>What do you need? 🎯</Text>
              <Text style={styles.stepSubtitle}>Pick the closest match — you can describe the rest later.</Text>
              <View style={styles.needsGrid}>
                {needs.map((n) => (
                  <Pressable
                    key={n.id}
                    onPress={() => setNeed(n.id)}
                    style={[styles.needCard, need === n.id && styles.needCardActive]}>
                    <Text style={{ fontSize: 24 }}>{n.emoji}</Text>
                    <Text style={[styles.needLabel, need === n.id && { color: colors.text }]}>
                      {n.label}
                    </Text>
                    {need === n.id && (
                      <View style={styles.needCheck}>
                        <Ionicons name="checkmark" size={12} color="#fff" />
                      </View>
                    )}
                  </Pressable>
                ))}
              </View>
            </FadeIn>
          )}

          {step === 1 && (
            <FadeIn>
              <Text style={styles.stepTitle}>Tell us about you 👋</Text>
              <Text style={styles.stepSubtitle}>So we know who to reply to.</Text>
              <View style={{ gap: 14 }}>
                <Field label="Your name *" value={name} onChange={setName} placeholder="e.g. Amina Bello" />
                <Field label="Business / company name" value={business} onChange={setBusiness} placeholder="e.g. Aurelia Homes" />
                <Field label="Phone number *" value={phone} onChange={setPhone} placeholder="e.g. 0803 000 0000" keyboardType="phone-pad" />
                <Field label="WhatsApp number" value={whatsapp} onChange={setWhatsapp} placeholder="Same as phone? Leave blank" keyboardType="phone-pad" />
                <Field label="Email" value={email} onChange={setEmail} placeholder="you@email.com" keyboardType="email-address" />
              </View>
            </FadeIn>
          )}

          {step === 2 && (
            <FadeIn>
              <Text style={styles.stepTitle}>Project details 📝</Text>
              <Text style={styles.stepSubtitle}>The more you share, the more accurate your quote.</Text>
              <Text style={styles.fieldLabel}>Describe your project *</Text>
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Tell us what you want to create, your style, references…"
                placeholderTextColor={colors.muted}
                multiline
                style={styles.textArea}
              />
              <Field label="Quantity (if applicable)" value={quantity} onChange={setQuantity} placeholder="e.g. 200 business cards" />

              <Text style={styles.fieldLabel}>Budget range</Text>
              <View style={styles.chipWrap}>
                {budgets.map((b) => (
                  <Chip key={b} label={b} active={budget === b} onPress={() => setBudget(b)} />
                ))}
              </View>

              <Text style={styles.fieldLabel}>Deadline</Text>
              <View style={styles.chipWrap}>
                {deadlines.map((d) => (
                  <Chip key={d} label={d} active={deadline === d} onPress={() => setDeadline(d)} />
                ))}
              </View>
            </FadeIn>
          )}

          {step === 3 && (
            <FadeIn>
              <Text style={styles.stepTitle}>Review your request ✅</Text>
              <Text style={styles.stepSubtitle}>Make sure everything looks right before sending.</Text>
              <View style={styles.reviewCard}>
                {summary.map((row) => (
                  <View key={row.label} style={styles.reviewRow}>
                    <Text style={styles.reviewLabel}>{row.label}</Text>
                    <Text style={styles.reviewValue}>{row.value}</Text>
                  </View>
                ))}
              </View>
              <Text style={styles.reviewNote}>
                💡 Tip: you can attach reference files directly in the WhatsApp chat after sending.
              </Text>
            </FadeIn>
          )}
        </ScrollView>
      </Container>

      {/* footer nav */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) + 60 }]}>
        <Container style={{ flexDirection: 'row', gap: 12 }}>
          {step > 0 && (
            <View style={{ flex: 1 }}>
              <Button title="Back" variant="glass" onPress={() => setStep((s) => s - 1)} />
            </View>
          )}
          <View style={{ flex: 2 }}>
            {step < 3 ? (
              <Button
                title="Continue"
                onPress={() => canNext && setStep((s) => s + 1)}
                style={!canNext ? { opacity: 0.45 } : undefined}
              />
            ) : (
              <Button title="Submit Project Request" icon="paper-plane-outline" onPress={() => setSubmitted(true)} />
            )}
          </View>
        </Container>
      </View>
    </View>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  keyboardType,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  keyboardType?: any;
}) {
  return (
    <View>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        keyboardType={keyboardType}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginTop: 8,
  },
  progressStep: { alignItems: 'center', gap: 6, flex: 1 },
  progressDot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressDotActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  progressDotText: { color: colors.muted, fontFamily: fonts.bodySemi, fontSize: 13 },
  progressLabel: { color: colors.muted, fontFamily: fonts.bodyMedium, fontSize: 11.5 },
  stepTitle: { color: colors.text, fontFamily: fonts.display, fontSize: 26, letterSpacing: -0.5 },
  stepSubtitle: { color: colors.subtext, fontFamily: fonts.body, fontSize: 14.5, marginTop: 6, marginBottom: 20 },
  needsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  needCard: {
    width: '31%',
    flexGrow: 1,
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: 14,
    gap: 8,
  },
  needCardActive: { borderColor: colors.violet, backgroundColor: colors.violetSoft },
  needLabel: { color: colors.subtext, fontFamily: fonts.bodyMedium, fontSize: 12.5, lineHeight: 16 },
  needCheck: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.violet,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fieldLabel: {
    color: colors.subtext,
    fontFamily: fonts.bodySemi,
    fontSize: 13,
    marginBottom: 8,
    marginTop: 6,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: colors.text,
    fontFamily: fonts.body,
    fontSize: 15,
    marginBottom: 6,
  },
  textArea: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: colors.text,
    fontFamily: fonts.body,
    fontSize: 15,
    minHeight: 130,
    textAlignVertical: 'top',
    marginBottom: 14,
  },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 18 },
  reviewCard: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: 6,
  },
  reviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomColor: colors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 16,
  },
  reviewLabel: { color: colors.muted, fontFamily: fonts.body, fontSize: 13.5 },
  reviewValue: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 13.5,
    textAlign: 'right',
    flexShrink: 1,
  },
  reviewNote: {
    color: colors.subtext,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 16,
    backgroundColor: colors.cyanSoft,
    borderRadius: radius.md,
    padding: 14,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.bg,
    borderTopColor: colors.border,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 12,
  },
  successIcon: {
    width: 92,
    height: 92,
    borderRadius: 46,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  successTitle: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 28,
    textAlign: 'center',
    marginTop: 24,
  },
  successText: {
    color: colors.subtext,
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 23,
    textAlign: 'center',
    marginTop: 10,
    maxWidth: 420,
  },
});
