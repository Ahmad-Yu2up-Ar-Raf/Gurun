// components/ui/core/layout/wrapper.tsx
//
// CHANGELOG:
//   + scrollViewStyle — terima Animated.StyleProp untuk keyboard-aware padding
//     dibutuhkan oleh chat-block yang harus animasi paddingBottom ikut keyboard
//   + contentContainerStyle — terima non-animated inline style tambahan

import { cn } from '@/lib/utils';
import Animated, {
  type AnimatedRef,
  type AnimatedScrollViewProps,
  type AnimatedStyle,
} from 'react-native-reanimated';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAvoidingView, type StyleProp, type ViewStyle, Platform } from 'react-native';

type WrapperProps = {
  children: React.ReactNode;
  className?: string;
  scrollRef?: AnimatedRef<Animated.ScrollView>;
  onScroll?: AnimatedScrollViewProps['onScroll'];
  containerClassName?: string;
  /** Default: ['bottom'] — header sudah handle top insets sendiri */
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
  /**
   * Animated style untuk Animated.ScrollView itu sendiri (bukan contentContainer)
   * Dipakai oleh chat-block yang harus animasi paddingBottom ikut keyboard
   */
  scrollViewStyle?: AnimatedStyle<StyleProp<ViewStyle>>;
  /**
   * Non-animated inline style tambahan untuk contentContainer
   */
  contentContainerStyle?: StyleProp<ViewStyle>;
  /**
   * ✅ NEW: Animated scroll handler untuk scroll trigger animations
   * Prefer menggunakan ini daripada `onScroll` untuk performance
   * Runs di UI thread, smooth 60fps
   */
  animatedScrollHandler?: AnimatedScrollViewProps['onScroll'];
};

export function Wrapper({
  children,
  scrollRef,
  onScroll,
  className,
  containerClassName,
  edges = ['bottom', 'right', 'left', 'top'],
  scrollViewStyle,
  contentContainerStyle,
  animatedScrollHandler,
}: WrapperProps) {
  const insets = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top + 60 : 0}>
      <SafeAreaView edges={edges} className={cn('flex flex-1 px-10', containerClassName)}>
        <Animated.ScrollView
          ref={scrollRef}
          onScroll={animatedScrollHandler ?? onScroll}
          scrollEventThrottle={16}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          contentContainerClassName={cn('flex-col pt-0  bg-background gap-3 relative', className)}
          contentContainerStyle={contentContainerStyle}
          showsVerticalScrollIndicator={false}
          // ✅ animated style untuk ScrollView container (bukan contentContainer)
          // Dipakai saat parent butuh animasi height/padding mengikuti keyboard
          style={scrollViewStyle}>
          {children}
        </Animated.ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
