import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { fonts, radius, sp, useTheme } from '../constants/theme';

/**
 * Searchable bottom-sheet dropdown. Used for State, LGA and rank selection.
 */
export default function SelectSheet({
  visible,
  title,
  options,
  value,
  onSelect,
  onClose,
}: {
  visible: boolean;
  title: string;
  options: string[];
  value?: string;
  onSelect: (v: string) => void;
  onClose: () => void;
}) {
  const { colors } = useTheme();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.toLowerCase().includes(q));
  }, [options, query]);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={[styles.backdrop, { backgroundColor: 'rgba(5,5,7,0.6)' }]} onPress={onClose}>
        <Pressable
          onPress={() => {}}
          style={[styles.sheet, { backgroundColor: colors.bg, borderColor: colors.hairlineStrong }]}>
          <View style={[styles.handle, { backgroundColor: colors.surface2 }]} />
          <View style={styles.head}>
            <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
            <Pressable onPress={onClose} hitSlop={8} style={[styles.close, { backgroundColor: colors.surface2 }]}>
              <Ionicons name="close" size={18} color={colors.text} />
            </Pressable>
          </View>
          <View style={styles.searchRow}>
            <Ionicons name="search-outline" size={17} color={colors.muted} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search…"
              placeholderTextColor={colors.muted}
              style={[styles.searchInput, { color: colors.text }]}
            />
          </View>
          <ScrollView style={{ maxHeight: 380 }} contentContainerStyle={{ paddingBottom: 24 }} keyboardShouldPersistTaps="handled">
            {filtered.map((o) => {
              const active = o === value;
              return (
                <Pressable
                  key={o}
                  onPress={() => {
                    onSelect(o);
                    setQuery('');
                    onClose();
                  }}
                  style={[styles.option, { borderBottomColor: colors.hairline }]}>
                  <Text style={[styles.optionText, { color: active ? (colors.isDark ? colors.lime : '#5E8A0D') : colors.text }, active && { fontFamily: fonts.semi }]}>
                    {o}
                  </Text>
                  {active && <Ionicons name="checkmark" size={16} color={colors.isDark ? colors.lime : '#5E8A0D'} />}
                </Pressable>
              );
            })}
            {filtered.length === 0 && (
              <Text style={[styles.empty, { color: colors.muted }]}>No matches found</Text>
            )}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: 'flex-end' },
  sheet: {
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  handle: { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginTop: 10, marginBottom: 6 },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8 },
  title: { fontFamily: fonts.semi, fontSize: 18, letterSpacing: -0.3 },
  close: { width: 34, height: 34, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(128,128,128,0.25)',
    borderRadius: radius.md,
    paddingHorizontal: 14,
    marginBottom: 6,
  },
  searchInput: { flex: 1, paddingVertical: 13, fontFamily: fonts.regular, fontSize: 15.5 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  optionText: { fontFamily: fonts.regular, fontSize: 15.5 },
  empty: { fontFamily: fonts.regular, fontSize: 14, textAlign: 'center', marginTop: 20 },
});
