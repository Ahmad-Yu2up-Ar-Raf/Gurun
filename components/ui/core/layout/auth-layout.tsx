import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/fragments/shadcn-ui/card';
import { Link } from 'expo-router';
import { SocialConnections } from '../feature/auth/social-connections';
import { Separator } from '../../fragments/shadcn-ui/separator';
import { Text } from '../../fragments/shadcn-ui/text';
import { View } from 'react-native';
import LogoApp from '../../fragments/svg/logo-app';
import { Button } from '../../fragments/shadcn-ui/button';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedKeyboard,
  useAnimatedStyle,
  KeyboardState,
} from 'react-native-reanimated';

type AuthLayoutProps = {
  children?: React.ReactNode;
  title?: string;
  description?: string;
  quote?: string;
  loading?: boolean;
  className?: string;
  numberOfIterations?: number;
  formType?: 'login' | 'register' | undefined;
  signInGoogleButton?: boolean;
  onPress: () => void;
  textButton?: string;
};

const AuthLayout = ({
  formType,
  numberOfIterations,
  className,
  loading = false,
  signInGoogleButton = true,
  title = `Welcome Back!`,
  quote = `Your ideas are not just talk — make them happen.`,
  description = `The journey is about to begin`,
  onPress,
  textButton = 'Masuk',
  ...props
}: AuthLayoutProps) => {
  const insets = useSafeAreaInsets();

  // ✅ useAnimatedKeyboard: hook reanimated yang track tinggi keyboard secara real-time
  // Jauh lebih smooth dibanding Keyboard.addListener karena berjalan di UI thread langsung
  const keyboard = useAnimatedKeyboard();

  // Offset saat keyboard TIDAK aktif → pakai safe area inset agar tidak mepet bawah
  const bottomWhenClosed = insets.bottom > 0 ? insets.bottom : 12;
  // Offset saat keyboard AKTIF → cukup padding kecil (8px) karena safe area
  // sudah "tertelan" oleh keyboard — tanpa ini terjadi double-spacing yang terlalu lebar
  const bottomWhenOpen = 8;

  const animatedButtonStyle = useAnimatedStyle(() => {
    const isKeyboardOpen = keyboard.height.value > 0;
    return {
      bottom: isKeyboardOpen
        ? keyboard.height.value + bottomWhenOpen // keyboard aktif: tipis saja
        : bottomWhenClosed, // keyboard tutup: pakai safe area
    };
  });

  const formTypeLabel = formType == 'register' ? 'Login' : 'Register';
  const formTypeLink = formType == 'register' ? '/(auth)/sign-in' : '/(auth)/sign-up';

  return (
    <SafeAreaView
      edges={['bottom', 'top', 'left', 'right']}
      className="h-full content-start items-start justify-start bg-card p-7 sm:flex-1">
      <Card className="relative m-auto flex h-full w-full max-w-sm content-start justify-start gap-5 border-0 bg-transparent px-0 shadow-none sm:border-border">
        <CardHeader className="relative mb-1 flex w-full flex-col content-start items-center justify-start gap-6 p-0">
          <View className="size-fit scale-150">
            <LogoApp className="relative m-auto size-full overflow-visible" />
          </View>
          <View>
            <CardTitle className="mb-0.5 text-center font-cinzel_bold text-2xl">{title}</CardTitle>
            <CardDescription className="text-center text-base text-muted-foreground sm:text-left">
              {description}
            </CardDescription>
          </View>
        </CardHeader>
        598682
        <CardContent className="mb-0 gap-6 p-0">
          <View className="gap-2.5">{props.children}</View>
        </CardContent>
        {signInGoogleButton && (
          <CardFooter className="relative mt-0 flex w-full flex-col gap-5 overflow-hidden p-0">
            <View className="flex-row items-center">
              <Separator className="flex-1" />
              <Text className="px-4 text-sm text-muted-foreground">atau lanjutkan dengan</Text>
              <Separator className="flex-1" />
            </View>
            <SocialConnections />
            {formType && (
              <Text className="mt-2 text-start text-sm text-muted-foreground">
                {formType == 'register' ? ` alredy have an account? ` : 'don`t have an account? '}
                <Link href={formTypeLink} className="text-primary underline underline-offset-4">
                  {formTypeLabel}
                </Link>
              </Text>
            )}
          </CardFooter>
        )}
      </Card>

      {/* ✅ Animated.View menggantikan View biasa agar bisa menerima animatedButtonStyle */}
      <Animated.View className="absolute left-0 right-0 px-5" style={animatedButtonStyle}>
        <Button variant="default" size={'lg'} onPress={onPress}>
          <Text className="font-cinzel_black text-lg text-primary-foreground">{textButton}</Text>
        </Button>
      </Animated.View>
    </SafeAreaView>
  );
};

export default AuthLayout;
