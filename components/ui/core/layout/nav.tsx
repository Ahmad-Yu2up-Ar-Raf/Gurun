import React from 'react';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import { THEME } from '@/lib/theme';
import { Text } from '@/components/ui/fragments/shadcn-ui/text';
import { Search, type LucideIcon } from 'lucide-react-native';
import { Button } from '../../fragments/shadcn-ui/button';
 
import { MenuSheet } from './menu-sheet';

import { Icon } from '../../fragments/shadcn-ui/icon';

import { router } from 'expo-router';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../fragments/shadcn-ui/dropdown-menu';
import { cn } from '@/lib/utils';
import Animated, { useAnimatedStyle, type SharedValue } from 'react-native-reanimated';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ScreenOptionsParams {
  title?: string;
  transparent?: boolean;
  leftIcon?: LucideIcon;
  leftAction?: () => void;
  rightIcon?: LucideIcon;
  id?: number;
  RigthComponent?: React.ReactNode | undefined;
  rightAction?: () => void;
  rigthIconClassName?: string;
  children?: React.ReactNode;
  surahSetelahnya?: { id: number; namaLatin: string } | null;
  surahSebelumnya?: { id: number; namaLatin: string } | null;
  isFullPlaying?: boolean;
  /**
   * ✅ NEW: Shared animated value untuk scroll position
   * Trigger animasi title berdasarkan scroll height
   * Dari useScrollAnimation hook
   */
  scrollAnimatedPosition?: SharedValue<number>;
  /** ✅ NEW: Custom scroll trigger point untuk show title (default: 100px) */
  scrollTriggerPoint?: number;
}

// ─── HeaderComponent ──────────────────────────────────────────────────────────
// ✅ Proper React component — semua hooks di sini, dipanggil via JSX
// React dapat track lifecycle-nya dengan benar.

interface HeaderComponentProps extends ScreenOptionsParams {}

function HeaderComponent({
  title,
  transparent = true,
  RigthComponent,
  leftIcon: LeftIcon,
  leftAction,
  children,
  rightIcon: RightIcon,
  rightAction,
  rigthIconClassName,
  id,
  scrollAnimatedPosition,
  scrollTriggerPoint = 100,
}: HeaderComponentProps) {
  // ✅ Hook aman di sini karena ini adalah proper React component
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const currentTheme = colorScheme ?? 'light';

  const handleLeave = () => {
    router.back();
  };
 
  const bgColor = transparent ? 'transparent' : THEME[currentTheme].background;

  const foregroundColor = THEME[currentTheme].foreground;

  // ✅ Animated style untuk title — smooth scroll trigger
  // Interpolate antara 0 (hidden) dan 100 (visible)
  const animatedTitleStyle = useAnimatedStyle(() => {
    if (!scrollAnimatedPosition) {
      return { opacity: title ? 1 : 0 };
    }

    // Interpolate scroll position ke opacity
    // Range: 0 (hide) sampai scrollTriggerPoint (fully visible)
    const progress = Math.min(scrollAnimatedPosition.value / scrollTriggerPoint, 1);
    const clampedProgress = Math.max(0, progress); // Clamp antara 0-1

    return {
      opacity: clampedProgress,
      transform: [
        {
          // Slide dari bawah (translateY 10) ke normal (0)
          translateY: (1 - clampedProgress) * 10,
        },
      ],
    };
  }, [scrollAnimatedPosition, scrollTriggerPoint, title]);

  return (
    <>
      <View
        style={{ paddingTop: insets.top + 7, backgroundColor: bgColor }}
        className="flex-row items-center justify-between px-4 pb-3">
        {/* Left action */}
        <View className="w-10 items-start">
          {LeftIcon ? (
            <Button
              variant={'ghost'}
              onPress={leftAction ?? handleLeave}
              size="icon"
              className="size-12 rounded-full">
              <Icon as={LeftIcon} className="size-6" />
            </Button>
          ) : (
            <MenuSheet />
          )}
        </View>

        {/* Title with scroll animation */}
        {title || scrollAnimatedPosition ? (
          <Animated.View style={animatedTitleStyle}>
            <Text
              variant="h4"
              className="line-clamp-1 text-center font-poppins_medium text-xl tracking-tighter"
              numberOfLines={1}>
              {title}
            </Text>
          </Animated.View>
        ) : (
          <View className="items-center justify-center gap-7 text-center">
            {/* <Text
              variant={'small'}
              className="font-poppins_medium text-xs tracking-tighter text-muted-foreground/60">
              Location
            </Text> */}
            <View className="w-fit flex-row items-center gap-1.5">
              <View className="size-12 scale-[.70]">
                <Text
                  variant="h4"
                  className="line-clamp-1 text-center font-poppins_medium text-xl tracking-tighter"
                  numberOfLines={1}>
                  Gurun
                </Text>
              </View>

              <Text
                variant="h4"
                className="text-center font-poppins_semibold text-base tracking-tighter">
                FogyNotion
              </Text>
            </View>
          </View>
        )}

        {/* Right action */}
        <View className="items-end">
          {RigthComponent ? (
            RigthComponent
          ) : RightIcon ? (
            <Button
              variant={'ghost'}
              onPress={rightAction ?? handleLeave}
              size="icon"
              className={cn(`size-10 rounded-full`, rigthIconClassName)}>
              <Icon as={RightIcon} className="size-5" />
            </Button>
          ) : (
            <Button
              onPress={() => {
                router.push('/quran/search');
              }}
              variant="ghost"
              size="icon"
              className={cn('size-10', rigthIconClassName)}>
              <Icon as={Search} className="size-5" />
            </Button>
          )}
        </View>
      </View>

      {children}
    </>
  );
}
interface HeaderComponentProps extends ScreenOptionsParams {}

// ─── SCREEN_OPTIONS ───────────────────────────────────────────────────────────
// ✅ Arrow function di `header:` hanya thin wrapper → return JSX
// Hooks TIDAK dipanggil di sini — semua ada di HeaderComponent di atas

export const SCREEN_OPTIONS = ({
  title,
  transparent = true,
  leftIcon,
  leftAction,
  rightIcon,
  RigthComponent,
  rightAction,
  children,
  scrollAnimatedPosition,
  scrollTriggerPoint,
}: ScreenOptionsParams) => ({
  headerShown: true,

  header: () => (
    <HeaderComponent
      title={title}
      transparent={transparent}
      leftIcon={leftIcon}
      leftAction={leftAction}
      rightIcon={rightIcon}
      RigthComponent={RigthComponent}
      children={children}
      rightAction={rightAction}
      scrollAnimatedPosition={scrollAnimatedPosition}
      scrollTriggerPoint={scrollTriggerPoint}
    />
  ),
});
