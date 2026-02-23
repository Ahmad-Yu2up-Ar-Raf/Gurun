import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/fragments/shadcn-ui/card';

import { ScrollView, View } from 'react-native';
import LogoApp from '../../fragments/svg/logo-app';
import { Button } from '../../fragments/shadcn-ui/button';
import { Text } from '../../fragments/shadcn-ui/text';
import ReactangleSVG from '../../fragments/svg/reactangle';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { cn } from '@/lib/utils';

type WelcomeBlockProps = {
  children?: React.ReactNode;
  title?: string;
  description?: string;

  className?: string;

  formType?: 'login' | 'register' | undefined;
};
const WelcomeBlock = ({
  className,

  title = `Saraya`,

  description = `Kuasai Keuangan, Raih Hadiah, Berkembang Lebih Cepat!`,
  ...props
}: WelcomeBlockProps) => {
  const insets = useSafeAreaInsets();
  return (
    <>
      <SafeAreaView
        edges={['bottom', 'left', 'right']} 
        className="relative h-full items-center justify-center">
        <View
          className={cn('absolute -right-4 h-fit w-full scale-[1.12]')}
          style={{
            top: insets.top > 0 ? insets.top - 80 : 12,
          }}>
          <ReactangleSVG className="relative size-full" />
        </View>
        <Card className="m-auto flex h-full w-full max-w-sm content-center justify-center gap-8 border-0 bg-transparent p-2 shadow-none sm:border-border">
          <CardHeader className="relative flex w-full flex-col content-center items-center justify-center gap-8 p-0">
            <View
              className="size-fit scale-[1.9]"
              style={{
                elevation: 100, // For Android shadow
              }}>
              <LogoApp
                className="relative m-auto size-full overflow-visible shadow-lg shadow-black drop-shadow-sm"
                style={{
                  elevation: 100, // For Android shadow
                }}
              />
            </View>

            <CardTitle className="text-center font-cinzel_semibold text-5xl">{title}</CardTitle>
          </CardHeader>
          <CardContent className="w-full">
            <CardDescription className="text-center text-lg leading-relaxed tracking-widest text-muted-foreground">
              {description}
            </CardDescription>
          </CardContent>

          {/* <CardFooter className="relative mb-0 flex w-full flex-col gap-7 overflow-hidden p-0">
          <Button className="w-full">
            <Text>Mulai Sekarang</Text>
          </Button>
        </CardFooter> */}
        </Card>
        <View
          className="absolute left-0 right-0 px-5 pb-4"
          style={{
            bottom: insets.bottom > 0 ? insets.bottom + 4 : 12,
          }}>
          <Button onPress={() => router.push('/(auth)/sign-in')} variant="default" size={'lg'}>
            <Text className="font-cinzel_black text-lg text-primary-foreground">Mulai</Text>
          </Button>
        </View>
      </SafeAreaView>
    </>
  );
};

export default WelcomeBlock;
