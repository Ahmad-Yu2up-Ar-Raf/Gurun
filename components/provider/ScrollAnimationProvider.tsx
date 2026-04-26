/**
 * ScrollAnimationProvider
 *
 * Provides scroll animation state globally to screen.
 * Allows any scrollable component to contribute scroll position
 * without tight coupling.
 *
 * ✅ BENEFITS:
 * - Header automatically reads scroll position
 * - Works with any scrollable (ScrollView, FlatList, LegendList, etc.)
 * - No props drilling needed
 * - Smooth 60fps animations on UI thread
 */

import React, { createContext, useContext, ReactNode } from 'react';
import { useSharedValue } from 'react-native-reanimated';
import Animated, {
  useAnimatedScrollHandler,
  interpolate,
  Extrapolate,
  type SharedValue,
} from 'react-native-reanimated';

interface ScrollAnimationContextType {
  /** Shared animated value untuk scroll position di screen ini */
  scrollAnimatedPosition: SharedValue<number>;

  /** Handler untuk attach ke scrollable component */
  scrollHandler: ReturnType<typeof useAnimatedScrollHandler>;

  /** Helper untuk create opacity animation */
  createOpacityStyle: (
    hideTrigger?: number,
    showTrigger?: number,
    fromOpacity?: number,
    toOpacity?: number
  ) => { opacity: Animated.NodeOrDefault };

  /** Helper untuk create translateY animation */
  createTranslateYStyle: (
    showTrigger?: number,
    fromTranslate?: number,
    toTranslate?: number
  ) => { transform: Array<{ translateY: Animated.NodeOrDefault }> };
}

const ScrollAnimationContext = createContext<ScrollAnimationContextType | null>(null);

interface ScrollAnimationProviderProps {
  children: ReactNode;
  hideTriggerPoint?: number;
  showTriggerPoint?: number;
}

/**
 * Provider untuk wrap screen yang butuh scroll animations
 * 
 * @example
 * export default function SurahScreen() {
 *   return (
 *     <ScrollAnimationProvider showTriggerPoint={80}>
 *       <SurahBlock id={5} />
 *     </ScrollAnimationProvider>
 *   );
 * }
 */
export function ScrollAnimationProvider({
  children,
  hideTriggerPoint = 0,
  showTriggerPoint = 100,
}: ScrollAnimationProviderProps) {
  // ✅ Single shared value untuk tracking scroll — tidak cause re-render
  const scrollAnimatedPosition = useSharedValue(0);

  // ✅ Animated scroll handler — runs on UI thread only
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollAnimatedPosition.value = event.contentOffset.y;
    },
  });

  // ✅ Helper: Opacity interpolation
  const createOpacityStyle = (
    hideTrigger = hideTriggerPoint,
    showTrigger = showTriggerPoint,
    fromOpacity = 0,
    toOpacity = 1
  ) => ({
    opacity: interpolate(
      scrollAnimatedPosition.value,
      [hideTrigger, showTrigger],
      [fromOpacity, toOpacity],
      Extrapolate.CLAMP
    ),
  });

  // ✅ Helper: TranslateY interpolation
  const createTranslateYStyle = (
    showTrigger = showTriggerPoint,
    fromTranslate = 20,
    toTranslate = 0
  ) => ({
    transform: [
      {
        translateY: interpolate(
          scrollAnimatedPosition.value,
          [0, showTrigger],
          [fromTranslate, toTranslate],
          Extrapolate.CLAMP
        ),
      },
    ],
  });

  const value: ScrollAnimationContextType = {
    scrollAnimatedPosition,
    scrollHandler,
    createOpacityStyle,
    createTranslateYStyle,
  };

  return (
    <ScrollAnimationContext.Provider value={value}>
      {children}
    </ScrollAnimationContext.Provider>
  );
}

/**
 * Hook untuk akses scroll animation state di child components
 *
 * @example
 * function SurahBlock() {
 *   const { scrollAnimatedPosition, scrollHandler } = useScrollAnimationContext();
 *   
 *   return (
 *     <>
 *       <Stack.Screen options={SCREEN_OPTIONS({ scrollAnimatedPosition })} />
 *       <LegendList onScroll={scrollHandler} ... />
 *     </>
 *   );
 * }
 */
export function useScrollAnimationContext() {
  const context = useContext(ScrollAnimationContext);
  if (!context) {
    throw new Error(
      '❌ useScrollAnimationContext must be used within ScrollAnimationProvider\n' +
      'Wrap your screen with: <ScrollAnimationProvider>...</ScrollAnimationProvider>'
    );
  }
  return context;
}
