import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useMemo, useRef, useState } from 'react';
import { Dimensions, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Container, FadeIn } from '../../components/ui';
import { fonts, Palette, radius, sp, useTheme } from '../../constants/theme';
import { ExplorePost, explorePosts } from '../../data/explore';

const filters = ['All', 'Print', 'Design', 'Smart Cards', 'Digital Menu', 'Packaging', 'Mobile & Web'];

export default function ExploreScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const [filter, setFilter] = useState('All');
  const [openPost, setOpenPost] = useState<ExplorePost | null>(null);
  const [page, setPage] = useState(0);
  const pager = useRef<ScrollView>(null);

  const posts = useMemo(
    () => (filter === 'All' ? explorePosts : explorePosts.filter((p) => p.category === filter)),
    [filter],
  );

  const order = (post: ExplorePost) => {
    setOpenPost(null);
    if (post.offerLink) {
      router.push(post.offerLink as any);
    } else {
      router.push('/chat');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 150 }}
        showsVerticalScrollIndicator={false}>
        <Container style={{ marginTop: insets.top + sp.x4 }}>
          <FadeIn>
            <Text style={styles.title}>Explore</Text>
            <Text style={styles.subtitle}>Real work from the studio — tap anything to view and order it.</Text>
          </FadeIn>

          {/* Filters */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginHorizontal: -24, marginTop: sp.x3 }}
            contentContainerStyle={{ paddingHorizontal: 24, gap: 8 }}>
            {filters.map((f) => {
              const active = filter === f;
              return (
                <Pressable
                  key={f}
                  onPress={() => setFilter(f)}
                  style={[styles.filterChip, { backgroundColor: active ? colors.lime : colors.surface, borderColor: active ? colors.lime : colors.hairline }]}>
                  <Text style={[styles.filterText, { color: active ? colors.onLime : colors.subtext }]}>{f}</Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Feed */}
          <View style={{ gap: sp.x3, marginTop: sp.x4 }}>
            {posts.map((post, i) => (
              <FadeIn key={post.id} delay={i * 60}>
                <Pressable
                  onPress={() => {
                    setPage(0);
                    setOpenPost(post);
                  }}
                  style={({ pressed }) => [styles.post, { backgroundColor: colors.surface, borderColor: colors.hairline }, pressed && { opacity: 0.9 }]}>
                  <View style={styles.postMediaWrap}>
                    <Image source={post.media[0]} style={styles.postMedia} contentFit="cover" />
                    {post.type === 'video' && (
                      <View style={styles.playBadge}>
                        <Ionicons name="play" size={20} color="#0C0C0F" />
                      </View>
                    )}
                    {post.media.length > 1 && (
                      <View style={styles.countBadge}>
                        <Ionicons name="images-outline" size={11} color="#FFFFFF" />
                        <Text style={styles.countText}>{post.media.length}</Text>
                      </View>
                    )}
                    <View style={[styles.catBadge, { backgroundColor: 'rgba(10,10,12,0.55)' }]}>
                      <Text style={styles.catText}>{post.category}</Text>
                    </View>
                  </View>
                  <View style={styles.postBody}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.postTitle} numberOfLines={1}>{post.title}</Text>
                      <Text style={styles.postCaption} numberOfLines={2}>{post.caption}</Text>
                    </View>
                    <View style={[styles.orderPill, { backgroundColor: colors.lime }]}>
                      <Text style={[styles.orderPillText, { color: colors.onLime }]}>Order</Text>
                      <Ionicons name="arrow-forward" size={13} color={colors.onLime} />
                    </View>
                  </View>
                </Pressable>
              </FadeIn>
            ))}
            {posts.length === 0 && (
              <Text style={[styles.empty, { color: colors.muted }]}>Nothing here yet — new drops coming soon.</Text>
            )}
          </View>
        </Container>
      </ScrollView>

      {/* Post viewer */}
      <Modal visible={!!openPost} transparent animationType="slide" onRequestClose={() => setOpenPost(null)}>
        <View style={[styles.viewerBackdrop, { backgroundColor: 'rgba(5,5,7,0.75)' }]}>
          <View style={[styles.viewer, { backgroundColor: colors.bg, borderColor: colors.hairlineStrong }]}>
            {openPost && (
              <>
                <View style={styles.viewerHead}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.viewerTitle, { color: colors.text }]}>{openPost.title}</Text>
                    <Text style={[styles.viewerCat, { color: colors.muted }]}>{openPost.category} · Pixel Studios</Text>
                  </View>
                  <Pressable onPress={() => setOpenPost(null)} hitSlop={8} style={[styles.viewerClose, { backgroundColor: colors.surface2 }]}>
                    <Ionicons name="close" size={20} color={colors.text} />
                  </Pressable>
                </View>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, gap: 10 }}>
                  {openPost.media.length <= 2 && openPost.type === 'photo' ? (
                    /* One or two photos — show them stacked. */
                    openPost.media.map((m, i) => (
                      <View key={i} style={{ borderRadius: 18, overflow: 'hidden' }}>
                        <Image source={m} style={{ width: '100%', height: 250 }} contentFit="cover" />
                      </View>
                    ))
                  ) : (
                    /* More than two items or a video — swipe through them. */
                    <View>
                      <ScrollView
                        ref={pager}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onMomentumScrollEnd={(e) =>
                          setPage(Math.round(e.nativeEvent.contentOffset.x / Math.max(Dimensions.get('window').width - 64, 1)))
                        }
                        style={{ borderRadius: 18, overflow: 'hidden' }}>
                        {openPost.media.map((m, i) => (
                          <View key={i} style={{ width: Math.min(Dimensions.get('window').width - 64, 448), height: 270, borderRadius: 18, overflow: 'hidden' }}>
                            <Image source={m} style={{ width: '100%', height: '100%' }} contentFit="cover" />
                            {openPost.type === 'video' && (
                              <View style={styles.playBadge}>
                                <Ionicons name="play" size={26} color="#0C0C0F" />
                              </View>
                            )}
                          </View>
                        ))}
                      </ScrollView>
                      {/* dot indicator */}
                      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 10 }}>
                        {openPost.media.map((_, i) => (
                          <View
                            key={i}
                            style={{
                              width: page === i ? 18 : 7,
                              height: 7,
                              borderRadius: 4,
                              backgroundColor: page === i ? colors.lime : colors.hairlineStrong,
                            }}
                          />
                        ))}
                      </View>
                      {openPost.media.length > 1 && (
                        <Text style={[styles.swipeHint, { color: colors.muted }]}>
                          {openPost.type === 'video' ? 'Video frames — swipe through · playback arrives with the studio backend' : 'Swipe to view more'}
                        </Text>
                      )}
                    </View>
                  )}
                  <Text style={[styles.viewerCaption, { color: colors.subtext }]}>{openPost.caption}</Text>
                </ScrollView>
                <View style={[styles.viewerFoot, { borderColor: colors.hairline }]}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.productLabel, { color: colors.muted }]}>Order this</Text>
                    <Text style={[styles.productName, { color: colors.text }]}>
                      {openPost.product}
                      {openPost.priceFrom ? ` · from ₦${openPost.priceFrom.toLocaleString('en-NG')}` : ''}
                    </Text>
                  </View>
                  <Pressable onPress={() => order(openPost)} style={[styles.viewerOrderBtn, { backgroundColor: colors.lime }]}>
                    <Ionicons name="bag-outline" size={17} color={colors.onLime} />
                    <Text style={[styles.viewerOrderText, { color: colors.onLime }]}>Order</Text>
                  </Pressable>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

function useStyles(colors: Palette) {
  return useMemo(
    () =>
      StyleSheet.create({
        title: { fontFamily: fonts.semi, fontSize: 36, letterSpacing: -1.1, color: colors.text },
        subtitle: { fontFamily: fonts.regular, fontSize: 16, color: colors.subtext, marginTop: sp.x1 },
        filterChip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 999, borderWidth: 1 },
        filterText: { fontFamily: fonts.semi, fontSize: 13.5 },
        post: { borderRadius: radius.xl, borderWidth: 1, overflow: 'hidden' },
        postMediaWrap: { height: 220 },
        postMedia: { width: '100%', height: '100%' },
        playBadge: {
          position: 'absolute',
          top: '50%',
          left: '50%',
          marginTop: -26,
          marginLeft: -26,
          width: 52,
          height: 52,
          borderRadius: 26,
          backgroundColor: '#BFF549',
          alignItems: 'center',
          justifyContent: 'center',
        },
        countBadge: {
          position: 'absolute',
          top: 12,
          right: 12,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 4,
          backgroundColor: 'rgba(10,10,12,0.55)',
          borderRadius: 999,
          paddingHorizontal: 9,
          paddingVertical: 5,
        },
        countText: { fontFamily: fonts.semi, fontSize: 10.5, color: '#FFFFFF' },
        catBadge: { position: 'absolute', bottom: 12, left: 12, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5 },
        catText: { fontFamily: fonts.semi, fontSize: 10.5, color: '#FFFFFF', letterSpacing: 0.6 },
        postBody: { flexDirection: 'row', alignItems: 'center', gap: sp.x2_, padding: 14 },
        postTitle: { fontFamily: fonts.semi, fontSize: 16.5, letterSpacing: -0.2, color: colors.text },
        postCaption: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 18, color: colors.subtext, marginTop: 3 },
        orderPill: { flexDirection: 'row', alignItems: 'center', gap: 5, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 10 },
        orderPillText: { fontFamily: fonts.bold, fontSize: 13 },
        empty: { fontFamily: fonts.regular, fontSize: 14, textAlign: 'center', marginTop: 40 },
        viewerBackdrop: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
        viewer: { width: '100%', maxWidth: 480, maxHeight: '94%', borderRadius: 24, borderWidth: StyleSheet.hairlineWidth, overflow: 'hidden' },
        viewerHead: { flexDirection: 'row', alignItems: 'center', gap: sp.x2_, paddingHorizontal: 20, paddingTop: 18, paddingBottom: 10 },
        viewerTitle: { fontFamily: fonts.semi, fontSize: 18, letterSpacing: -0.3 },
        viewerCat: { fontFamily: fonts.regular, fontSize: 12.5, marginTop: 2 },
        viewerClose: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
        viewerCaption: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 21 },
        swipeHint: { fontFamily: fonts.regular, fontSize: 11.5, textAlign: 'center', marginTop: 6 },
        viewerFoot: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: sp.x2_,
          paddingHorizontal: 20,
          paddingVertical: 14,
          borderTopWidth: StyleSheet.hairlineWidth,
        },
        productLabel: { fontFamily: fonts.regular, fontSize: 12 },
        productName: { fontFamily: fonts.semi, fontSize: 15, marginTop: 1 },
        viewerOrderBtn: { flexDirection: 'row', alignItems: 'center', gap: 7, borderRadius: 13, paddingHorizontal: 20, paddingVertical: 13 },
        viewerOrderText: { fontFamily: fonts.bold, fontSize: 14.5 },
      }),
    [colors],
  );
}
