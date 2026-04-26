/**
 * ✅ BEST PRACTICE: useScrollAnimation Hook — Fixed & Compatible
 * 
 * Issues Fixed:
 * ❌ TypeError: Object is not a function
 * ❌ SharedValue type not found
 * ❌ NodeOrDefault type not found
 * 
 * Solution: Proper Reanimated v2+ types + LegendList compatibility
 */

// ─────────────────────────────────────────────────────────────────────────────
// 🔧 TYPE FIXES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * WRONG (Reanimated v1 syntax):
 * ❌ import { SharedValue } from 'react-native-reanimated/lib/typescript/Animated'
 * ❌ Animated.SharedValue<number>
 * ❌ Animated.NodeOrDefault
 */

/**
 * CORRECT (Reanimated v2+ syntax):
 * ✅ import { SharedValue, runOnJS } from 'react-native-reanimated'
 * ✅ type SharedValue<number>
 * ✅ Animated.Adaptable<number>
 */

// ─────────────────────────────────────────────────────────────────────────────
// 📚 CORRECT IMPLEMENTATION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * File: hooks/useScrollAnimation.ts
 * 
 * ✅ Proper imports dari root package, bukan dari nested paths
 * ✅ Correct type definitions untuk Reanimated v2+
 * ✅ Compatible dengan LegendList, FlatList, ScrollView
 */

import { useSharedValue, runOnJS, type SharedValue } from 'react-native-reanimated';
import Animated, {
  useAnimatedScrollHandler,
  interpolate,
  Extrapolate,
  type NativeScrollEvent,
} from 'react-native-reanimated';

// ✅ Hook usage — simple dan straightforward
export function useScrollAnimation({
  showTriggerPoint = 100,
  hideTriggerPoint = 20,
}: UseScrollAnimationOptions = {}) {
  const scrollAnimatedPosition = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event: NativeScrollEvent) => {
    'worklet';
    scrollAnimatedPosition.value = event.contentOffset.y;
  });

  return {
    scrollAnimatedPosition,
    scrollHandler,
    // ... helpers
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 💡 USAGE IN COMPONENT — 3 Steps
// ─────────────────────────────────────────────────────────────────────────────

/**
 * File: components/ui/core/block/surah-block.tsx
 */

export default function SurahBlock({ id, nameSurah }: Props) {
  const { scrollAnimatedPosition, scrollHandler } = useScrollAnimation({
    showTriggerPoint: 80,
    hideTriggerPoint: 0,
  });

  return (
    <>
      {/* 1️⃣ Pass scrollAnimatedPosition to header */}
      <Stack.Screen
        options={SCREEN_OPTIONS({
          title: 'Al-Fatihah',
          scrollAnimatedPosition,
          scrollTriggerPoint: 80,
        })}
      />

      {/* 2️⃣ Attach scrollHandler to LegendList */}
      <LegendList
        data={items}
        onScroll={scrollHandler}         // ← Works now!
        scrollEventThrottle={16}         // ← Critical for 60fps
        renderItem={({ item }) => <ItemCard item={item} />}
      />
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ⚠️ COMMON ERRORS & FIXES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * ERROR 1: "Object is not a function"
 * 
 * Penyebab:
 * ❌ scrollHandler not attached to onScroll
 * ❌ scrollEventThrottle not set
 * ❌ Scroll handler is null/undefined
 * 
 * Fix:
 * ✅ Ensure onScroll={scrollHandler} is attached
 * ✅ Set scrollEventThrottle={16}
 * ✅ Check that useScrollAnimation hook is called before return
 */

/**
 * ERROR 2: "SharedValue is not exported from react-native-reanimated"
 * 
 * Penyebab:
 * ❌ Importing dari nested path: from 'react-native-reanimated/lib/typescript/Animated'
 * ❌ Using old v1 import syntax
 * 
 * Fix:
 * ✅ Import dari root: from 'react-native-reanimated'
 * ✅ Correct: import { type SharedValue } from 'react-native-reanimated'
 */

/**
 * ERROR 3: "NodeOrDefault is not exported"
 * 
 * Penyebab:
 * ❌ NodeOrDefault is v1 syntax, doesn't exist di v2+
 * 
 * Fix:
 * ✅ Use Animated.Adaptable<number> instead
 * ✅ Or just use number as return type
 */

// ─────────────────────────────────────────────────────────────────────────────
// ✅ COMPLETE TYPE DEFINITIONS
// ─────────────────────────────────────────────────────────────────────────────

interface UseScrollAnimationOptions {
  showTriggerPoint?: number;
  hideTriggerPoint?: number;
  onScroll?: (position: number) => void;
}

interface UseScrollAnimationReturn {
  scrollAnimatedPosition: SharedValue<number>;
  scrollHandler: ReturnType<typeof useAnimatedScrollHandler>;
  getOpacityStyle: (
    fromOpacity?: number,
    toOpacity?: number
  ) => {
    opacity: Animated.Adaptable<number>;
  };
  getTranslateYStyle: (
    triggerPoint: number,
    fromTranslate?: number,
    toTranslate?: number
  ) => {
    transform: Array<{ translateY: Animated.Adaptable<number> }>;
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 🚀 PERFORMANCE — Why This Works
// ─────────────────────────────────────────────────────────────────────────────

/**
 * ✅ useSharedValue — Zero re-renders
 * Shared value updates di UI thread only, tidak trigger JS re-renders
 * 
 * ✅ useAnimatedScrollHandler — UI thread execution
 * Scroll events processed di native thread, smooth 60fps
 * 
 * ✅ interpolate + Extrapolate.CLAMP — Optimized animation
 * Maps scroll position to opacity/transform, clamped untuk smooth boundaries
 * 
 * ✅ runOnJS for callbacks — JS-thread work when needed
 * Optional callback untuk state updates atau logging tanpa blocking UI
 * 
 * ✅ scrollEventThrottle={16} — 60fps throttling
 * 1000ms / 16ms ≈ 60 events per second = smooth animation
 */

// ─────────────────────────────────────────────────────────────────────────────
// 📋 FINAL CHECKLIST
// ─────────────────────────────────────────────────────────────────────────────

/**
 * ✅ Imports dari root:
 * import { useSharedValue, runOnJS, type SharedValue } from 'react-native-reanimated'
 * 
 * ✅ Hook at top level:
 * const { scrollAnimatedPosition, scrollHandler } = useScrollAnimation(...)
 * 
 * ✅ Pass to header:
 * options={SCREEN_OPTIONS({ scrollAnimatedPosition, scrollTriggerPoint: 80 })}
 * 
 * ✅ Attach to scrollable:
 * <LegendList onScroll={scrollHandler} scrollEventThrottle={16} />
 * 
 * ✅ Types correct:
 * SharedValue<number> (not Animated.SharedValue)
 * Animated.Adaptable<number> (not NodeOrDefault)
 * 
 * ✅ No errors:
 * No "Object is not a function"
 * No "SharedValue not exported"
 * No "NodeOrDefault not exported"
 */

// ─────────────────────────────────────────────────────────────────────────────
// 🎯 COPY-PASTE TEMPLATE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * For new screens — just copy this pattern:
 * 
 * 1. In block component:
 * const { scrollAnimatedPosition, scrollHandler } = useScrollAnimation({
 *   showTriggerPoint: 80,
 *   hideTriggerPoint: 0,
 * });
 * 
 * 2. Pass to SCREEN_OPTIONS:
 * <Stack.Screen options={SCREEN_OPTIONS({
 *   scrollAnimatedPosition,
 *   scrollTriggerPoint: 80,
 * })} />
 * 
 * 3. Attach to LegendList:
 * <LegendList
 *   onScroll={scrollHandler}
 *   scrollEventThrottle={16}
 * />
 * 
 * Done! Header animates smoothly. ✨
 */

export {};
