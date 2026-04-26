/**
 * ✅ SCROLL ANIMATION IN NAV — BEST PRACTICE (SIMPLE & REUSABLE)
 * 
 * Pattern:
 * 1. Call useScrollAnimation hook in block component
 * 2. Pass scrollAnimatedPosition to SCREEN_OPTIONS
 * 3. Attach scrollHandler to LegendList onScroll
 * 4. Done! Header animates automatically based on scroll position
 * 
 * NO Provider wrapper needed — just use the hook directly!
 */

// ─────────────────────────────────────────────────────────────────────────────
// 📚 IMPLEMENTATION GUIDE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * FILE 1: components/ui/core/block/surah-block.tsx
 * 
 * ✅ Use useScrollAnimation hook directly (no Provider wrapper)
 */

import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { SCREEN_OPTIONS } from '../layout/nav';

export default function SurahBlock({ id, nameSurah }: Props) {
  // ... other hooks

  // ✅ Single line — setup scroll animation
  // Customize trigger point (80px = header fade-in saat scroll 80px)
  const { scrollAnimatedPosition, scrollHandler } = useScrollAnimation({
    showTriggerPoint: 80,
    hideTriggerPoint: 0,
  });

  // ✅ Pass scrollAnimatedPosition to header
  return (
    <>
      <Stack.Screen
        options={SCREEN_OPTIONS({
          title: data.namaLatin,
          scrollAnimatedPosition,     // ← Pass here
          scrollTriggerPoint: 80,      // ← Match with hook trigger point
        })}
      />

      {/* ✅ Attach scrollHandler to LegendList */}
      <LegendList
        data={data.ayat}
        renderItem={...}
        onScroll={scrollHandler}         // ← PENTING! Attach here
        scrollEventThrottle={16}         // ← 60fps
        ListHeaderComponent={...}
      />
    </>
  );
}

/**
 * FILE 2: components/ui/core/layout/nav.tsx
 * 
 * Already setup correctly — accepts scrollAnimatedPosition as prop
 * Automatically animates title based on scroll position
 */

// No changes needed! Nav component is already reusable.
// It reads scrollAnimatedPosition prop dan handle animation internally.

/**
 * FILE 3: app/(drawer)/(tabs)/quran/[id].tsx
 * 
 * No wrapper needed — just render SurahBlock
 */

export default function Page() {
  const params = useLocalSearchParams<{ id?: string; name?: string }>();
  const nomor = params?.id ? Number(params.id) : NaN;
  const nameSurah = params?.name ?? 'Surah';

  if (!Number.isFinite(nomor)) {
    return <ErrorView />;
  }

  // ✅ No Provider wrapper — just render component
  // SurahBlock handles everything internally
  return <SurahBlock id={nomor} nameSurah={nameSurah} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// 🎯 CUSTOMIZATION — How to adjust trigger points
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Default behavior (header fade-in saat scroll 80px):
 * 
 * const { scrollAnimatedPosition, scrollHandler } = useScrollAnimation({
 *   showTriggerPoint: 80,
 *   hideTriggerPoint: 0,
 * });
 */

/**
 * Untuk trigger lebih tinggi (header fade-in saat scroll 150px):
 * 
 * const { scrollAnimatedPosition, scrollHandler } = useScrollAnimation({
 *   showTriggerPoint: 150,  // ← Ubah di sini
 *   hideTriggerPoint: 0,
 * });
 * 
 * ⚠️ PENTING: Match dengan scrollTriggerPoint di SCREEN_OPTIONS
 * 
 * <Stack.Screen options={SCREEN_OPTIONS({
 *   scrollAnimatedPosition,
 *   scrollTriggerPoint: 150,  // ← Harus sama dengan showTriggerPoint
 * })} />
 */

// ─────────────────────────────────────────────────────────────────────────────
// ✅ CHECKLIST
// ─────────────────────────────────────────────────────────────────────────────

/**
 * ✅ 1. Call useScrollAnimation hook dengan trigger points
 * ✅ 2. Pass scrollAnimatedPosition ke SCREEN_OPTIONS
 * ✅ 3. Ensure scrollTriggerPoint matches hook's showTriggerPoint
 * ✅ 4. Attach scrollHandler ke scrollable component (onScroll={scrollHandler})
 * ✅ 5. Set scrollEventThrottle={16} untuk 60fps
 * ✅ 6. ❌ NO Provider wrapper needed!
 */

// ─────────────────────────────────────────────────────────────────────────────
// 🚀 PERFORMANCE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Otomatis optimized:
 * 
 * ✅ useSharedValue — zero re-renders
 * ✅ UI thread only — smooth 60fps
 * ✅ Reanimated 2+ — native performance
 * ✅ Interpolate clamped — no jank
 * ✅ Simple API — easy to understand
 */

// ─────────────────────────────────────────────────────────────────────────────
// 🔄 REUSABLE PATTERN FOR OTHER SCREENS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Untuk implement scroll animation di screen lain, ikuti 3 langkah:
 * 
 * STEP 1: Di block/detail component
 * const { scrollAnimatedPosition, scrollHandler } = useScrollAnimation({
 *   showTriggerPoint: 80,
 *   hideTriggerPoint: 0,
 * });
 * 
 * STEP 2: Pass ke SCREEN_OPTIONS
 * <Stack.Screen options={SCREEN_OPTIONS({
 *   title: 'Your Title',
 *   scrollAnimatedPosition,
 *   scrollTriggerPoint: 80,
 * })} />
 * 
 * STEP 3: Attach ke scrollable
 * <LegendList onScroll={scrollHandler} scrollEventThrottle={16} />
 * 
 * Beres! Header otomatis animate saat scroll!
 */

// ─────────────────────────────────────────────────────────────────────────────
// ❌ DONT'S
// ─────────────────────────────────────────────────────────────────────────────

/**
 * ❌ DON'T wrap dengan ScrollAnimationProvider (not needed)
 * ❌ DON'T forget to attach scrollHandler to onScroll
 * ❌ DON'T mismatch scrollTriggerPoint with showTriggerPoint
 * ❌ DON'T skip scrollEventThrottle={16}
 * ❌ DON'T call useScrollAnimation multiple times in same component
 */

export {};
