import { View, ImageBackground } from 'react-native';
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/fragments/shadcn-ui/text';
import { Button } from '@/components/ui/fragments/shadcn-ui/button';

export default function welcome() {
  return (
    <SafeAreaView edges={['bottom', 'left', 'right']} className="flex-1">
      {/* Background Image */}
      <ImageBackground
        source={{
          uri: 'https://images.pexels.com/photos/3183172/pexels-photo-3183172.jpeg',
        }}
        resizeMode="cover"
        className="relative flex-1 items-center justify-center p-5">
        {/* Gradient Overlay */}
        <LinearGradient
          colors={[
            'rgba(0,0,0,0)', // top fully transparent
            'rgba(0,0,0,0.4)', // middle slightly dark
            'rgba(0,0,0,0.8)', // bottom darker
          ]}
          locations={[0, 0.5, 1]}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
          }}
        />
        <View className="absolute left-4 top-[60px] flex-row items-center gap-7">
          <Text className="text-center font-cinzel_semibold text-2xl tracking-tighter text-white">
            Saraya
          </Text>
        </View>
        {/* Title and Subtitle */}

        <View className="mb-0 h-full w-full justify-end gap-0 text-left">
          <Text
            variant="h1"
            className="m-0 border-0 pb-2 text-left font-medium tracking-tighter text-white">
            Lanjutkan Perjalanan Keuanganmu dengan Saraya
          </Text>
          <Text variant="p" className="m-0 line-clamp-2 text-base leading-6 text-muted-foreground">
            Kuasai Keuangan, Raih Hadiah, Berkembang Lebih Cepat!
          </Text>
        </View>
        <Button></Button>
        {/* Buttons */}
      </ImageBackground>
    </SafeAreaView>
  );
}
