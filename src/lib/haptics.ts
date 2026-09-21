import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

/** Light selection tick — taps, chips, toggles, tab switches. No-op on web. */
export function hapticSelect() {
  if (Platform.OS === 'web') return;
  Haptics.selectionAsync().catch(() => {});
}

/** Soft impact — primary buttons, orders. No-op on web. */
export function hapticTap() {
  if (Platform.OS === 'web') return;
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
}

/** Success buzz — order confirmed. No-op on web. */
export function hapticSuccess() {
  if (Platform.OS === 'web') return;
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
}
