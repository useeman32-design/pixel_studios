import React from 'react';
import { StyleSheet, View } from 'react-native';

import { BusinessType, CardTemplate } from '../data/cardTemplates';
import LandingPage from './LandingPage';

/** Rendered width of the full-size landing page before scaling — matches
 *  the phone-width preview modal so thumbnails look exactly like the preview. */
const PAGE_W = 420;
/** Thumbnail width in the template picker. */
export const PREVIEW_W = 264;
export const PREVIEW_H = 430;
const SCALE = PREVIEW_W / PAGE_W;

/**
 * True-to-life template thumbnail: renders the actual landing page scaled
 * down, so what you see in the picker is exactly what you get.
 */
export default function LandingPreview({
  template,
  businessType,
  name,
  business,
  profileUri,
  logoUri,
}: {
  template: CardTemplate;
  businessType: BusinessType;
  name: string;
  business: string;
  profileUri?: string | null;
  logoUri?: string | null;
}) {
  return (
    <View style={styles.frame}>
      <View style={styles.page}>
        <LandingPage
          template={template}
          businessType={businessType}
          name={name}
          business={business}
          profileUri={profileUri}
          logoUri={logoUri}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    width: PREVIEW_W,
    height: PREVIEW_H,
    borderRadius: 20,
    overflow: 'hidden',
  },
  page: {
    width: PAGE_W,
    transform: [{ scale: SCALE }],
    transformOrigin: 'top left',
  },
});
