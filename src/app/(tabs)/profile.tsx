import { useRouter } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Container, FadeIn, RowItem } from '../../components/ui';
import { colors, fonts, radius, sp } from '../../constants/theme';

const avatarImage = require('../../../assets/images/avatar.jpg');

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{ paddingBottom: sp.x8 }}
      showsVerticalScrollIndicator={false}>
      <Container style={{ marginTop: insets.top + sp.x4 }}>
        <FadeIn>
          <View style={styles.head}>
            <Image source={avatarImage} style={styles.avatar} />
            <View>
              <Text style={styles.name}>Amina Bello</Text>
              <Text style={styles.meta}>amina@aureliahomes.ng · 0803 000 0000</Text>
            </View>
          </View>
        </FadeIn>

        <FadeIn delay={100}>
          <View style={styles.menu}>
            <RowItem icon="receipt-outline" label="My Orders" onPress={() => router.push('/orders')} />
            <RowItem icon="folder-open-outline" label="My Projects" onPress={() => router.push('/start')} />
            <RowItem icon="bookmark-outline" label="Saved Designs" onPress={() => router.push('/portfolio')} />
            <RowItem icon="card-outline" label="Digital Profile" onPress={() => router.push('/nfc-profile')} />
            <RowItem icon="wallet-outline" label="Payment Methods" onPress={() => router.push('/chat')} />
            <RowItem icon="location-outline" label="Addresses" onPress={() => router.push('/chat')} />
            <RowItem icon="notifications-outline" label="Notifications" onPress={() => router.push('/chat')} />
            <RowItem icon="help-buoy-outline" label="Help & Support" onPress={() => router.push('/chat')} />
            <RowItem icon="settings-outline" label="Settings" isLast onPress={() => router.push('/chat')} />
          </View>
        </FadeIn>

        <FadeIn delay={160}>
          <Text style={styles.version}>Pixel Studios · v1.0.0</Text>
        </FadeIn>
      </Container>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  head: { flexDirection: 'row', alignItems: 'center', gap: sp.x3 },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
  },
  name: { fontFamily: fonts.semi, fontSize: 24, letterSpacing: -0.4, color: colors.text },
  meta: { fontFamily: fonts.regular, fontSize: 14, color: colors.muted, marginTop: 3 },
  menu: { marginTop: sp.x5 },
  version: {
    fontFamily: fonts.regular,
    fontSize: 12.5,
    color: colors.muted,
    textAlign: 'center',
    marginTop: sp.x5,
  },
});
