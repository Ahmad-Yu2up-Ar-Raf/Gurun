/**
 * QUICK REFERENCE — Scroll Animation System
 * 
 * ⚡ TL;DR — 3 langkah implementasi untuk setiap screen
 */

// ─────────────────────────────────────────────────────────────────────────────
// 🎯 3 LANGKAH IMPLEMENTASI
// ─────────────────────────────────────────────────────────────────────────────

/**
 * LANGKAH 1: Wrap screen dengan provider
 * Lokasi: app/(drawer)/(tabs)/YOUR_SCREEN/[id].tsx
 */
import { ScrollAnimationProvider } from '@/components/provider/ScrollAnimationProvider';

export default function YourScreen() {
  return (
    <ScrollAnimationProvider 
      showTriggerPoint={80}      // ← Header fade-in saat scroll 80px
      hideTriggerPoint={0}       // ← Header hilang saat scroll ke top
    >
      <YourDetailComponent id={5} />
    </ScrollAnimationProvider>
  );
}

/**
 * LANGKAH 2: Get scroll context di component
 * Lokasi: components/ui/core/block/your-detail.tsx
 */
import { useScrollAnimationContext } from '@/components/provider/ScrollAnimationProvider';

export default function YourDetailComponent({ id }: Props) {
  // ✅ Cuma 1 line — get scroll animation dari context
  const { scrollAnimatedPosition, scrollHandler } = useScrollAnimationContext();

  return (
    <>
      {/* Pass animated value ke header */}
      <Stack.Screen
        options={SCREEN_OPTIONS({
          title: 'Your Title',
          scrollAnimatedPosition,
          scrollTriggerPoint: 80,
        })}
      />

      {/* Attach handler ke scrollable component */}
      <LegendList
        data={items}
        renderItem={...}
        onScroll={scrollHandler}          // ← PENTING!
        scrollEventThrottle={16}
      />
    </>
  );
}

/**
 * LANGKAH 3: Done! Header otomatis animate saat scroll
 */

// ─────────────────────────────────────────────────────────────────────────────
// 🔧 CUSTOMIZATION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Ubah trigger point:
 * 
 * <ScrollAnimationProvider showTriggerPoint={120}>
 *   // Header title fade-in saat scroll 120px (default: 80px)
 * </ScrollAnimationProvider>
 */

/**
 * Gunakan dengan any scrollable:
 * 
 * ScrollView:
 * <Animated.ScrollView onScroll={scrollHandler} scrollEventThrottle={16}>
 * 
 * FlatList:
 * <Animated.FlatList onScroll={scrollHandler} scrollEventThrottle={16} />
 * 
 * LegendList:
 * <LegendList onScroll={scrollHandler} scrollEventThrottle={16} />
 */

// ─────────────────────────────────────────────────────────────────────────────
// ✅ CHECKLIST
// ─────────────────────────────────────────────────────────────────────────────

/**
 * ✅ Provider wrapper: <ScrollAnimationProvider>
 * ✅ Get context: useScrollAnimationContext()
 * ✅ Pass animated value: scrollAnimatedPosition
 * ✅ Attach handler: onScroll={scrollHandler}
 * ✅ Set throttle: scrollEventThrottle={16}
 * ✅ Header config: SCREEN_OPTIONS({ scrollAnimatedPosition })
 */

// ─────────────────────────────────────────────────────────────────────────────
// 🚫 COMMON MISTAKES (DON'T DO THIS)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * ❌ Forget onScroll handler:
 * <LegendList data={items} /> // ← Handler missing!
 * 
 * ✅ Correct:
 * <LegendList data={items} onScroll={scrollHandler} />
 */

/**
 * ❌ Forget provider wrapper:
 * return <Component />; // ← Provider missing!
 * 
 * ✅ Correct:
 * return (
 *   <ScrollAnimationProvider>
 *     <Component />
 *   </ScrollAnimationProvider>
 * );
 */

/**
 * ❌ Call hook outside provider:
 * useScrollAnimationContext(); // Error!
 * 
 * ✅ Correct:
 * // Hook hanya bisa dipanggil di dalam <ScrollAnimationProvider>
 */

// ─────────────────────────────────────────────────────────────────────────────
// 📊 PERFORMANCE (AUTOMATIC)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Otomatis optimized:
 * 
 * ✅ Shared values — zero re-renders
 * ✅ UI thread only — smooth 60fps
 * ✅ Reanimated 2+ — native performance
 * ✅ Interpolation clamped — no jank
 * ✅ No prop drilling — clean code
 */

// ─────────────────────────────────────────────────────────────────────────────
// 📚 WHEN TO USE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Use scroll animation untuk:
 * 
 * ✅ Header titles (fade-in saat scroll)
 * ✅ Floating buttons (appear/hide)
 * ✅ Background parallax
 * ✅ Bottom sheets animations
 * ✅ Any scroll-based triggers
 * 
 * Jangan gunakan untuk:
 * ❌ State changes (use onScroll dengan runOnJS)
 * ❌ Navigasi (use scroll detection logic)
 * ❌ Data loading (use onEndReached)
 */

export {};
