/**
 * useScrollAnimation Hook
 *
 * Tracks scroll position and provides animated values for triggering animations
 * optimized for performance using Reanimated
 * 
 * ✅ Compatible with: FlatList, ScrollView, LegendList, any scrollable component
 *
 * @example
 * const { scrollAnimatedPosition, scrollHandler } = useScrollAnimation({
 *   showTriggerPoint: 100, // Show animation starts at 100px scroll
 *   hideTriggerPoint: 20,  // Hide animation starts at 20px scroll
 * });
 *
 * // Use in LegendList
 * <LegendList onScroll={scrollHandler} scrollEventThrottle={16}>
 *   {children}
 * </LegendList>
 *
 * // Use animated value in style
 * const animatedStyle = useAnimatedStyle(() => ({
 *   opacity: interpolate(scrollAnimatedPosition.value, [0, 50], [0, 1], Extrapolate.CLAMP),
 * }));
 */

import { useSharedValue, runOnJS, type SharedValue } from 'react-native-reanimated';
import Animated, {
  useAnimatedScrollHandler,
  interpolate,
  Extrapolate,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native-reanimated';
import { NativeScrollEvent as RNNativeScrollEvent } from 'react-native';

interface UseScrollAnimationOptions {
  /** Scroll Y position where animation starts to show (in pixels) */
  showTriggerPoint?: number;
  /** Scroll Y position where animation starts to hide (in pixels) */
  hideTriggerPoint?: number;
  /** Callback when scroll position changes */
  onScroll?: (position: number) => void;
}

interface UseScrollAnimationReturn {
  /** Shared animated value tracking scroll Y position */
  scrollAnimatedPosition: SharedValue<number>;

  /** Pre-configured scroll event handler for Animated.ScrollView */
  scrollHandler: ReturnType<typeof useAnimatedScrollHandler>;

  /** Helper function to create opacity interpolation */
  getOpacityStyle: (
    fromOpacity?: number,
    toOpacity?: number
  ) => {
    opacity: Animated.Adaptable<number>;
  };

  /** Helper function to create translateY interpolation */
  getTranslateYStyle: (
    triggerPoint: number,
    fromTranslate?: number,
    toTranslate?: number
  ) => {
    transform: Array<{ translateY: Animated.Adaptable<number> }>;
  };
}

export function useScrollAnimation({
  showTriggerPoint = 100,
  hideTriggerPoint = 20,
  onScroll,
}: UseScrollAnimationOptions = {}): UseScrollAnimationReturn {
  // ✅ Shared value untuk tracking scroll position
  // Single source of truth — updateable dari animated handler
  const scrollAnimatedPosition = useSharedValue(0);

  // ✅ Animated scroll handler — compatible dengan semua scrollable components
  // Runs on UI thread untuk smooth 60fps animation
  const scrollHandler = useAnimatedScrollHandler((event: NativeScrollEvent) => {
    'worklet';
    scrollAnimatedPosition.value = event.contentOffset.y;

    // ✅ Optional callback untuk non-animated logic
    if (onScroll) {
      runOnJS(onScroll)(event.contentOffset.y);
    }
  });

  // ✅ Helper: Opacity interpolation
  // Maps scroll position to opacity value
  const getOpacityStyle = (fromOpacity = 0, toOpacity = 1) => ({
    opacity: interpolate(
      scrollAnimatedPosition.value,
      [hideTriggerPoint, showTriggerPoint],
      [fromOpacity, toOpacity],
      Extrapolate.CLAMP
    ),
  });

  // ✅ Helper: TranslateY interpolation dengan custom trigger point
  // Animasi title slide-up dari bottom-to-top
  const getTranslateYStyle = (
    triggerPoint: number = showTriggerPoint,
    fromTranslate: number = 20,
    toTranslate: number = 0
  ) => ({
    transform: [
      {
        translateY: interpolate(
          scrollAnimatedPosition.value,
          [0, triggerPoint],
          [fromTranslate, toTranslate],
          Extrapolate.CLAMP
        ),
      },
    ],
  });

  return {
    scrollAnimatedPosition,
    scrollHandler,
    getOpacityStyle,
    getTranslateYStyle,
  };
}

/**
 * BEST PRACTICES EXPLAINED:
 *
 * 1. **Shared Values** — `useSharedValue(0)` tidak cause re-render
 *    Perubahan nilai hanya di UI thread, bukan JS thread
 *    Jauh lebih efisien daripada state update
 *
 * 2. **Animated Scroll Handler** — `useAnimatedScrollHandler`
 *    Runs on UI thread (tidak perlu transform ke JS thread)
 *    Update shared value tanpa blocking JavaScript
 *    scrollEventThrottle di parent (ScrollView) untuk throttling
 *
 * 3. **Interpolation** — `interpolate(..., Extrapolate.CLAMP)`
 *    Map scroll position ke opacity/transform range
 *    CLAMP menutup stretch value di luar range (optimal)
 *
 * 4. **Helper Functions** — Reusable, consistent interpolation logic
 *    DRY principle — tidak duplicate interpolation code
 *    Flexible: bisa customize range per use case
 *
 * 5. **Performance**:
 *    ✅ Zero re-renders (shared values)
 *    ✅ Runs on UI thread (smooth 60fps)
 *    ✅ Minimal JS overhead
 *    ✅ Work seamless dengan Animated components
 *
 * 6. **ScrollView Config**:
 *    • scrollEventThrottle={16} — 60fps (1000/16 ≈ 60)
 *    • keyboardDismissMode="interactive" — better UX
 *    • keyboardShouldPersistTaps="handled" — input accessibility
 */
