// app/surah/[id].tsx
// ✅ Simple and clean: no Provider wrapper needed
import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import SurahBlock from '@/components/ui/core/block/surah-block';
import { ChevronLeft, MoreHorizontal, PlayCircleIcon } from 'lucide-react-native';
import { SCREEN_OPTIONS } from '@/components/ui/core/layout/nav';

export default function Page() {
  const params = useLocalSearchParams<{ id?: string; name?: string }>();
  const nomor = params?.id ? Number(params.id) : NaN;
  const nameSurah = params?.name ?? 'Surah';

  // ✅ Invalid nomor guard — tapi header tetap pakai nameSurah dari params
  if (!Number.isFinite(nomor)) {
    return (
      <>
        <Stack.Screen
          options={SCREEN_OPTIONS({
            title: nameSurah, // ✅ pakai name dari params, bukan hardcode
            transparent: false,
            leftIcon: ChevronLeft,
            rightIcon: MoreHorizontal,
          })}
        />
        <View style={styles.center}>
          <ActivityIndicator size="large" />
        </View>
      </>
    );
  }

  /*
    ✅ SurahBlock handles scroll animation internally
    useScrollAnimation hook tracks scroll position automatically
    Pass scrollAnimatedPosition to SCREEN_OPTIONS, attach handler to LegendList
    
    No Provider wrapper needed — simple and reusable pattern!
  */
  return <SurahBlock id={nomor} nameSurah={nameSurah} />;
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
