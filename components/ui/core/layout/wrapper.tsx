// components/provider/wrapper.tsx
// ✅ FIXED: Accept scrollHandler dari parent untuk paralax
// Gunakan Animated.ScrollView dengan onScroll handler

import { cn } from '@/lib/utils';
import Animated, { AnimatedRef, AnimatedScrollViewProps } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

type WrapperProps = {
  children: React.ReactNode;
  className?: string;
  scrollRef?: AnimatedRef<Animated.ScrollView>;
  // ✅ onScroll dari useAnimatedScrollHandler — ini yang fix masalah scrollOffset
  onScroll?: AnimatedScrollViewProps['onScroll'];
  containerClassName?: string;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
};

export function Wrapper({
  children,
  scrollRef,
  onScroll,
  className,
  containerClassName,
  edges = ['top', 'bottom'],
}: WrapperProps) {
  return (
    <SafeAreaView edges={edges} className={cn('flex-1', containerClassName)}>
      <Animated.ScrollView
        ref={scrollRef}
        onScroll={onScroll}
        // ✅ scrollEventThrottle wajib ada agar onScroll terpanggil di native
        scrollEventThrottle={16}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        contentContainerClassName={cn('flex-col   bg-white gap-3 relative', className)}
        showsVerticalScrollIndicator={false}>
        {children}
      </Animated.ScrollView>
    </SafeAreaView>
  );
}
