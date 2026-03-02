import { View, useWindowDimensions } from 'react-native';
import React from 'react';
import { Wrapper } from '../layout/wrapper';
import { StyleSheet } from 'react-native';
import Svg, { Defs, RadialGradient, Stop, Rect } from 'react-native-svg';
import { Text } from '../../fragments/shadcn-ui/text';

const HERO_HEIGHT = 360; // ✅ Fixed height, bukan h-full

export default function HomeBlock() {
  return (
    <Wrapper>
      {/* Hero Section */}
      <View
        style={{ height: HERO_HEIGHT, position: 'relative', overflow: 'hidden' }}
        className="items-center justify-center">
        <BackgroundGradient />
        <Text className="text-center font-poppins_bold uppercase text-secondary" variant={'h1'}>
          18 : 38
        </Text>
      </View>
    </Wrapper>
  );
}

const BackgroundGradient = () => {
  const { width } = useWindowDimensions(); // ✅ ambil lebar layar realtime

  return (
    <View style={StyleSheet.absoluteFill}>
      <Svg
        height="100%"
        width="100%"
        viewBox={`0 0 ${width} ${HERO_HEIGHT}`} // ✅ viewBox eksplisit
        preserveAspectRatio="none"
        style={StyleSheet.absoluteFill}>
        <Defs>
          <RadialGradient
            id="radialGradient"
            gradientUnits="userSpaceOnUse" // ✅ GANTI ke userSpaceOnUse (pakai pixel, bukan %)
            cx={width / 2} // ✅ tengah layar dalam pixel
            cy={HERO_HEIGHT * 0.77} // ✅ sedikit ke bawah dari tengah
            r={width * 0.9} // ✅ radius dalam pixel — cukup besar cover semua
          >
            {/* Pusat: warna primary penuh */}
            <Stop offset="0" stopColor="hsl(37, 100%, 59%)" stopOpacity={1} />
            {/* Tengah: mulai fade */}
            <Stop offset="0.4" stopColor="hsl(37, 100%, 60%)" stopOpacity={0.7} />
            {/* Pinggir: mulai transparent */}
            <Stop offset="0.75" stopColor="hsl(37, 100%, 80%)" stopOpacity={0.2} />
            {/* Ujung: full transparent */}
            <Stop offset="1" stopColor="hsl( 26, 54%, 97%)" stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Rect width={width} height={HERO_HEIGHT} fill="url(#radialGradient)" />
      </Svg>
    </View>
  );
};
