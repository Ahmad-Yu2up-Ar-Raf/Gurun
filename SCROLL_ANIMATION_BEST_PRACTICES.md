/**
 * SCROLL ANIMATION SYSTEM — BEST PRACTICES GUIDE
 * 
 * Optimized untuk React Native + Expo Router
 * Bekerja dengan any scrollable component: ScrollView, FlatList, LegendList, dll
 * 
 * ✅ KEUNGGULAN:
 * - Zero re-renders (uses Reanimated shared values)
 * - Smooth 60fps animations (runs on UI thread only)
 * - Works with any scrollable component
 * - No prop drilling, uses Context API
 * - Easy trigger point customization
 * - Composable dengan animations lain
 */

// ─────────────────────────────────────────────────────────────────────────────
// 📚 ARCHITECTURE OVERVIEW
// ─────────────────────────────────────────────────────────────────────────────

/**
 * 1. ScrollAnimationProvider (Context Provider)
 *    - Manages scroll position state
 *    - Provides scrollHandler + scrollAnimatedPosition to children
 *    - Can be customized dengan trigger points
 * 
 * 2. useScrollAnimationContext (Hook)
 *    - Access scroll state di child components
 *    - Returns: scrollHandler, scrollAnimatedPosition, helpers
 * 
 * 3. SCREEN_OPTIONS (Header Configuration)
 *    - Accepts scrollAnimatedPosition
 *    - Automatically animates title based on scroll
 *    - Smooth slide-in/fade-in transitions
 * 
 * 4. Scrollable Component (ScrollView, FlatList, LegendList)
 *    - Attach scrollHandler ke onScroll prop
 *    - Scroll position otomatis tracked di UI thread
 */

// ─────────────────────────────────────────────────────────────────────────────
// 🎯 BASIC USAGE PATTERN
// ─────────────────────────────────────────────────────────────────────────────

/**
 * STEP 1: Wrap screen route dengan ScrollAnimationProvider
 * 
 * File: app/(drawer)/(tabs)/quran/[id].tsx
 */
import { ScrollAnimationProvider } from '@/components/provider/ScrollAnimationProvider';

export default function SurahScreen() {
  return (
    // ✅ Provider setup scroll animation untuk semua children
    // showTriggerPoint={80} = header title fade-in saat scroll 80px
    // hideTriggerPoint={0} = title hilang saat scroll ke top
    <ScrollAnimationProvider showTriggerPoint={80} hideTriggerPoint={0}>
      <SurahBlock id={5} nameSurah="Al-Fatihah" />
    </ScrollAnimationProvider>
  );
}

/**
 * STEP 2: Di dalam component, akses context dan attach handler
 * 
 * File: components/ui/core/block/surah-block.tsx
 */
import { useScrollAnimationContext } from '@/components/provider/ScrollAnimationProvider';

export default function SurahBlock({ id, nameSurah }: Props) {
  // ✅ Get scroll animation dari context
  // Tidak perlu manual hook setup, context handle semuanya
  const { scrollAnimatedPosition, scrollHandler } = useScrollAnimationContext();

  return (
    <>
      {/* ✅ Pass scrollAnimatedPosition ke header */}
      <Stack.Screen
        options={SCREEN_OPTIONS({
          title: nameSurah,
          scrollAnimatedPosition,
          scrollTriggerPoint: 80, // Bisa override dari provider jika perlu
        })}
      />

      {/* ✅ Attach scrollHandler ke LegendList */}
      <LegendList
        data={items}
        renderItem={({ item }) => <ItemCard item={item} />}
        onScroll={scrollHandler} // ← PENTING! Attach handler di sini
        scrollEventThrottle={16}
        // ... rest of props
      />
    </>
  );
}

/**
 * STEP 3: Header automatically animates based on scroll!
 * 
 * File: components/ui/core/layout/nav.tsx
 * (Already implemented — no changes needed)
 */

// ─────────────────────────────────────────────────────────────────────────────
// 🔧 ADVANCED PATTERNS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Pattern 1: Multiple animations pada satu screen
 * Gunakan helper functions dari context
 */
export function AdvancedAnimationExample() {
  const { scrollAnimatedPosition, createOpacityStyle, createTranslateYStyle } =
    useScrollAnimationContext();

  // Custom opacity untuk floating button
  const floatingButtonStyle = createOpacityStyle(
    50, // hideTriggerPoint
    200, // showTriggerPoint
    0, // fromOpacity
    1 // toOpacity
  );

  // Custom translate untuk subtitle
  const subtitleStyle = createTranslateYStyle(
    100, // showTrigger
    30, // fromTranslate (start 30px below)
    0 // toTranslate (end at normal position)
  );

  return (
    <>
      <Stack.Screen options={SCREEN_OPTIONS({ scrollAnimatedPosition })} />
      <ScrollView onScroll={scrollHandler} scrollEventThrottle={16}>
        <Animated.View style={floatingButtonStyle}>
          <FloatingActionButton />
        </Animated.View>

        <Animated.View style={subtitleStyle}>
          <Text>Subtitle dengan smooth slide animation</Text>
        </Animated.View>

        {/* Content */}
      </ScrollView>
    </>
  );
}

/**
 * Pattern 2: Reusable hook untuk custom animations
 * Ekstrak logic ke hook untuk reusability
 */
function useHeaderFadeAnimation(showTrigger = 80, hideTrigger = 0) {
  const { scrollAnimatedPosition } = useScrollAnimationContext();

  return useAnimatedStyle(() => {
    const progress = Math.min(scrollAnimatedPosition.value / showTrigger, 1);
    const clampedProgress = Math.max(0, progress);

    return {
      opacity: clampedProgress,
      transform: [{ translateY: (1 - clampedProgress) * 10 }],
    };
  });
}

// Usage:
export function CustomHeaderAnimation() {
  const headerStyle = useHeaderFadeAnimation(80);

  return (
    <Animated.View style={headerStyle}>
      <Text>Header dengan custom animation</Text>
    </Animated.View>
  );
}

/**
 * Pattern 3: Conditional animations based on scroll position
 * Gunakan shared value untuk conditional rendering
 */
export function ConditionalAnimationExample() {
  const { scrollAnimatedPosition } = useScrollAnimationContext();

  // Shared value bisa dibaca di worklet untuk high-frequency updates
  const isScrolledDown = useDerivedValue(() => {
    return scrollAnimatedPosition.value > 100;
  });

  // Animate ke visible/hidden berdasarkan kondisi
  const animatedStyle = useAnimatedStyle(() => {
    const shouldShow = isScrolledDown.value;
    return {
      opacity: shouldShow ? 1 : 0,
      pointerEvents: shouldShow ? 'auto' : 'none',
    };
  });

  return (
    <Animated.View style={animatedStyle}>
      <Text>Tampil saat scroll lebih dari 100px</Text>
    </Animated.View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 📋 CHECKLIST: Implementing Scroll Animation
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Untuk menggunakan scroll animation di screen baru:
 * 
 * ✅ 1. Di route file (e.g. app/screen/[id].tsx):
 *       - Import ScrollAnimationProvider
 *       - Wrap component dengan provider
 *       - Set showTriggerPoint + hideTriggerPoint
 * 
 * ✅ 2. Di block/detail component (e.g. components/ui/core/block/...tsx):
 *       - Import useScrollAnimationContext
 *       - Call hook di top level
 *       - Pass scrollAnimatedPosition ke SCREEN_OPTIONS
 *       - Attach scrollHandler ke scrollable component (onScroll prop)
 * 
 * ✅ 3. Di layout/nav component:
 *       - Already implemented
 *       - Just ensure scrollTriggerPoint matches provider setting
 * 
 * ✅ 4. Test:
 *       - Scroll list slowly
 *       - Header title harus fade-in smooth
 *       - Tidak ada jank/lag
 *       - 60fps animations
 */

// ─────────────────────────────────────────────────────────────────────────────
// ⚠️ COMMON PITFALLS & SOLUTIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * ❌ PITFALL 1: Forget to attach scrollHandler ke scrollable
 * 
 * WRONG:
 * <LegendList data={items} renderItem={...} />
 * 
 * ✅ CORRECT:
 * <LegendList 
 *   data={items} 
 *   renderItem={...}
 *   onScroll={scrollHandler}  // ← PENTING!
 *   scrollEventThrottle={16}
 * />
 */

/**
 * ❌ PITFALL 2: Forget ScrollAnimationProvider wrapper
 * 
 * WRONG:
 * export default function Screen() {
 *   return <Component />;
 * }
 * 
 * ✅ CORRECT:
 * export default function Screen() {
 *   return (
 *     <ScrollAnimationProvider showTriggerPoint={80}>
 *       <Component />
 *     </ScrollAnimationProvider>
 *   );
 * }
 */

/**
 * ❌ PITFALL 3: Call useScrollAnimationContext outside provider
 * 
 * Error akan throw:
 * "useScrollAnimationContext must be used within ScrollAnimationProvider"
 * 
 * Pastikan component yang pake hook ada di dalam <ScrollAnimationProvider>
 */

/**
 * ❌ PITFALL 4: scrollEventThrottle tidak diset
 * 
 * Default di React Native bisa terlalu lambat (120ms interval)
 * Selalu set ke 16 untuk 60fps (16ms per frame)
 * 
 * <LegendList ... scrollEventThrottle={16} />
 */

/**
 * ❌ PITFALL 5: Multiple scrollable components di satu screen
 * 
 * Setiap scrollable harus attach handler ke shared scrollAnimatedPosition
 * Tidak bisa punya 2 nested ScrollView dengan masing-masing scroll tracking
 * 
 * Solusi:
 * - Pake hanya 1 scrollable utama (LegendList, FlatList, dll)
 * - Atau pake separate providers untuk setiap scroll zone jika perlu
 */

// ─────────────────────────────────────────────────────────────────────────────
// 🚀 PERFORMANCE TIPS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * 1. Use Reanimated Shared Values — tidak trigger re-render
 *    ✅ scroll position updates di UI thread only
 *    ✅ zero JS thread overhead
 * 
 * 2. Use Animated.ScrollView atau attach handler ke native list
 *    ✅ LegendList supports native scroll handlers
 *    ✅ FlatList/ScrollView works dengan Reanimated handlers
 * 
 * 3. Always set scrollEventThrottle={16} untuk 60fps
 *    ✅ 1000ms / 16ms ≈ 60 events per second
 *    ✅ Smooth animations tanpa jitter
 * 
 * 4. Use interpolate() dengan Extrapolate.CLAMP
 *    ✅ Prevent excessive values outside range
 *    ✅ Smooth clamping di boundaries
 * 
 * 5. Memoize animated styles jika perlu
 *    ✅ Avoid recreating interpolations setiap render
 *    ✅ Use useAnimatedStyle untuk memoization
 * 
 * 6. Avoid calling JS functions di animated handlers
 *    ✅ runOnJS() untuk JS side effects
 *    ✅ Tapi keep it minimal untuk performance
 */

// ─────────────────────────────────────────────────────────────────────────────
// 📊 REAL WORLD EXAMPLE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * File: app/(drawer)/(tabs)/article/[id].tsx
 * 
 * Complete implementation untuk artikel screen dengan smooth header animation
 */

/*
import React from 'react';
import { Stack, useLocalSearchParams } from 'expo-router';
import ArticleDetail from '@/components/ui/core/block/article-detail';
import { ScrollAnimationProvider } from '@/components/provider/ScrollAnimationProvider';

export default function ArticleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <ScrollAnimationProvider showTriggerPoint={120} hideTriggerPoint={0}>
      <ArticleDetail id={parseInt(id)} />
    </ScrollAnimationProvider>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

// File: components/ui/core/block/article-detail.tsx

import { useScrollAnimationContext } from '@/components/provider/ScrollAnimationProvider';
import { SCREEN_OPTIONS } from '../layout/nav';
import { LegendList } from '@legendapp/list';

export default function ArticleDetail({ id }: { id: number }) {
  const { scrollAnimatedPosition, scrollHandler } = useScrollAnimationContext();
  const { data } = useQuery(articleQueryOptions(id));

  return (
    <>
      <Stack.Screen
        options={SCREEN_OPTIONS({
          title: data?.title,
          scrollAnimatedPosition,
          scrollTriggerPoint: 120,
        })}
      />

      <LegendList
        data={data?.paragraphs ?? []}
        renderItem={({ item }) => <Paragraph text={item} />}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        ListHeaderComponent={<ArticleHeader data={data} />}
      />
    </>
  );
}
*/

export {};
