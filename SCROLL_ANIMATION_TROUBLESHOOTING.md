/**
 * 🔧 TROUBLESHOOTING GUIDE — Scroll Animation Issues
 */

// ─────────────────────────────────────────────────────────────────────────────
// ❌ ERROR: "Object is not a function"
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Problem:
 * When scrolling, you get: ERROR [TypeError: Object is not a function]
 * 
 * Causes:
 * 1. scrollHandler not attached to onScroll prop
 * 2. scrollEventThrottle not set
 * 3. Hook called after conditional return (wrong hook placement)
 * 4. scrollHandler is undefined
 * 
 * Solution:
 * 
 * ✅ Step 1: Ensure hook called at top level
 * export default function SurahBlock() {
 *   // ← Hooks MUST be here, before any returns
 *   const { scrollHandler } = useScrollAnimation(...);
 *   
 *   if (isLoading) return <Loading />; // ← OK, after hook
 * }
 * 
 * ✅ Step 2: Ensure handler attached + throttle set
 * <LegendList
 *   onScroll={scrollHandler}           // ← CRITICAL
 *   scrollEventThrottle={16}           // ← CRITICAL
 *   // ... other props
 * />
 * 
 * ✅ Step 3: Verify useScrollAnimation is imported
 * import { useScrollAnimation } from '@/hooks/useScrollAnimation';
 * 
 * ✅ Step 4: Check console for other errors
 * Sometimes this error masks the real issue — check console output
 */

// ─────────────────────────────────────────────────────────────────────────────
// ❌ ERROR: "SharedValue is not exported"
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Problem:
 * "Namespace has no exported member 'SharedValue'"
 * 
 * Cause:
 * ❌ Wrong import: from 'react-native-reanimated/lib/typescript/Animated'
 * ❌ Old v1 syntax being used
 * 
 * Solution:
 * 
 * ✅ CORRECT import in useScrollAnimation.ts:
 * import { useSharedValue, type SharedValue } from 'react-native-reanimated';
 * 
 * ✅ NOT:
 * ❌ import { SharedValue } from 'react-native-reanimated/lib/typescript/Animated'
 * ❌ Animated.SharedValue<number>
 * 
 * ✅ Type usage:
 * scrollAnimatedPosition: SharedValue<number>
 */

// ─────────────────────────────────────────────────────────────────────────────
// ❌ ERROR: "NodeOrDefault is not exported"
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Problem:
 * "Namespace has no exported member 'NodeOrDefault'"
 * 
 * Cause:
 * ❌ NodeOrDefault is Reanimated v1 only, removed in v2+
 * 
 * Solution:
 * 
 * ✅ Use Animated.Adaptable<number> instead:
 * opacity: Animated.Adaptable<number>;
 * 
 * ✅ NOT:
 * ❌ opacity: Animated.NodeOrDefault;
 * 
 * ✅ Full correct type:
 * getOpacityStyle: () => ({
 *   opacity: Animated.Adaptable<number>;
 * });
 */

// ─────────────────────────────────────────────────────────────────────────────
// ❌ ERROR: "Cannot read property 'value' of undefined"
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Problem:
 * Cannot access scrollAnimatedPosition.value — it's undefined
 * 
 * Cause:
 * ❌ scrollAnimatedPosition not being passed to SCREEN_OPTIONS
 * ❌ scrollAnimatedPosition is null when nav tries to read it
 * 
 * Solution:
 * 
 * ✅ Always pass scrollAnimatedPosition to header:
 * <Stack.Screen options={SCREEN_OPTIONS({
 *   title: 'Your Title',
 *   scrollAnimatedPosition,           // ← PASS HERE
 *   scrollTriggerPoint: 80,
 * })} />
 * 
 * ✅ In nav.tsx, handle null case:
 * const animatedTitleStyle = useAnimatedStyle(() => {
 *   if (!scrollAnimatedPosition) {
 *     return { opacity: 1 };           // ← Fallback
 *   }
 *   // ... rest of animation
 * });
 */

// ─────────────────────────────────────────────────────────────────────────────
// ❌ ERROR: "Header animation not working / title not animating"
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Problem:
 * Scroll animation works (no errors) but header title doesn't fade in/out
 * 
 * Causes:
 * 1. scrollTriggerPoint mismatches showTriggerPoint
 * 2. Scroll not being triggered (handler not attached)
 * 3. List not scrollable (content too short)
 * 
 * Solution:
 * 
 * ✅ Step 1: Match trigger points
 * const { scrollAnimatedPosition, scrollHandler } = useScrollAnimation({
 *   showTriggerPoint: 80,              // ← e.g., 80px
 * });
 * 
 * <Stack.Screen options={SCREEN_OPTIONS({
 *   scrollTriggerPoint: 80,            // ← MUST match!
 * })} />
 * 
 * ✅ Step 2: Verify scrollHandler attached
 * console.log('scrollHandler:', scrollHandler);  // Should not be null
 * 
 * <LegendList
 *   onScroll={scrollHandler}
 *   scrollEventThrottle={16}
 * />
 * 
 * ✅ Step 3: Verify list is scrollable
 * Check that content height > container height
 * If list is too short, it won't scroll
 */

// ─────────────────────────────────────────────────────────────────────────────
// ❌ ERROR: "Navigation header shows wrong component"
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Problem:
 * Header is showing but scroll animation header not rendering
 * Or showing default header instead of custom
 * 
 * Cause:
 * SCREEN_OPTIONS not being called in Stack.Screen
 * 
 * Solution:
 * 
 * ✅ Ensure SCREEN_OPTIONS is called correctly:
 * <Stack.Screen
 *   options={SCREEN_OPTIONS({
 *     title: 'Title',
 *     scrollAnimatedPosition,
 *     scrollTriggerPoint: 80,
 *   })}
 * />
 * 
 * ✅ NOT:
 * ❌ options={{ header: SCREEN_OPTIONS }} (wrong!)
 * ❌ Not calling SCREEN_OPTIONS at all
 */

// ─────────────────────────────────────────────────────────────────────────────
// 🔍 DEBUG CHECKLIST
// ─────────────────────────────────────────────────────────────────────────────

/**
 * When something doesn't work, verify:
 * 
 * ✅ useScrollAnimation hook called at top level
 *    - Before any conditional returns
 *    - All hooks before components
 * 
 * ✅ Correct imports
 *    - from 'react-native-reanimated' (root package)
 *    - NOT from nested paths
 * 
 * ✅ Handler attached to onScroll
 *    - <LegendList onScroll={scrollHandler} />
 *    - scrollEventThrottle={16} is set
 * 
 * ✅ scrollAnimatedPosition passed to SCREEN_OPTIONS
 *    - SCREEN_OPTIONS({ scrollAnimatedPosition, ... })
 *    - scrollTriggerPoint matches showTriggerPoint
 * 
 * ✅ Types correct
 *    - SharedValue<number> (not Animated.SharedValue)
 *    - Animated.Adaptable<number> (not NodeOrDefault)
 * 
 * ✅ No console errors
 *    - Open React Native debugger
 *    - Check for red error messages
 *    - Check for yellow warnings
 * 
 * ✅ List is actually scrollable
 *    - Content height > container height
 *    - If content too short, animation won't trigger
 */

// ─────────────────────────────────────────────────────────────────────────────
// ✅ MINIMAL WORKING EXAMPLE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Copy this if everything fails:
 */

import React from 'react';
import { View } from 'react-native';
import { LegendList } from '@legendapp/list';
import { Stack } from 'expo-router';
import { SCREEN_OPTIONS } from '../layout/nav';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export function MinimalWorkingExample() {
  // ✅ Hook at top
  const { scrollAnimatedPosition, scrollHandler } = useScrollAnimation({
    showTriggerPoint: 80,
    hideTriggerPoint: 0,
  });

  // ✅ Sample data
  const items = Array.from({ length: 50 }, (_, i) => ({ id: i, title: `Item ${i}` }));

  return (
    <>
      {/* ✅ Pass to header */}
      <Stack.Screen
        options={SCREEN_OPTIONS({
          title: 'Test Screen',
          scrollAnimatedPosition,
          scrollTriggerPoint: 80,
        })}
      />

      {/* ✅ Attach handler to list */}
      <LegendList
        data={items}
        renderItem={({ item }) => (
          <View style={{ padding: 20, borderBottomWidth: 1 }}>
            <Text>{item.title}</Text>
          </View>
        )}
        keyExtractor={(item) => String(item.id)}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      />
    </>
  );
}

/**
 * If this works, your setup is correct.
 * If this still doesn't work, check:
 * 1. Reanimated version (should be 2.x or 3.x)
 * 2. Metro bundler cache (npx react-native start --reset-cache)
 * 3. Build cache (rm -rf node_modules && yarn install)
 */

export {};
