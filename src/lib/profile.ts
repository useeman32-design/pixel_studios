import AsyncStorage from '@react-native-async-storage/async-storage';

/** The signed-in customer's profile — persisted on device (ps_profile). */
export type StoredProfile = {
  name: string;
  email: string;
  phone: string;
  about: string;
  instagram: string;
  x: string;
  facebook: string;
  linkedin: string;
  website: string;
};

const PROFILE_KEY = 'ps_profile';

export const DEFAULT_PROFILE: StoredProfile = {
  name: 'Amina Bello',
  email: 'amina@aureliahomes.ng',
  phone: '0803 000 0000',
  about: '',
  instagram: '',
  x: '',
  facebook: '',
  linkedin: '',
  website: '',
};

export async function loadProfile(): Promise<StoredProfile> {
  try {
    const raw = await AsyncStorage.getItem(PROFILE_KEY);
    if (raw) return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
  } catch {
    /* first launch */
  }
  return DEFAULT_PROFILE;
}

export async function saveProfile(profile: StoredProfile) {
  try {
    await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch {
    /* storage unavailable */
  }
}

/** Derive the premium card username from the display name. */
export function profileUsername(profile: StoredProfile): string {
  return (
    profile.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '')
      .slice(0, 16) || 'you'
  );
}
