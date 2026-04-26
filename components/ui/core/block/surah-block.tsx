// components/ui/core/block/surah-block.tsx
// ✅ BEST PRACTICE: Self-contained scroll animation
// Simple hook-based approach, no Provider wrapper needed
import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { Text } from '../../fragments/shadcn-ui/text';
import { surahDetailQueryOptions } from '@/lib/server/surah/surah-server-queris';
import { useQuery } from '@tanstack/react-query';
import { LegendList } from '@legendapp/list';
import { AyatCard } from '../../fragments/custom-ui/card/ayat-card';
import { SurahDetailCard } from '../../fragments/custom-ui/card/detail-surah-card';
import { ChevronLeft, PauseCircleIcon, PlayCircleIcon } from 'lucide-react-native';
import { SCREEN_OPTIONS } from '../layout/nav';
import { router, Stack } from 'expo-router';
import { useGlobalAudio } from '@/components/provider/AudioProvider';
import { useLastRead } from '@/components/provider/LastReadProvider';
import LoadingIndicator from '../loading-indicator';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

type Props = {
  id: number;
  nameSurah: string;
};

export default function SurahBlock({ id, nameSurah }: Props) {
  // ✅ ALL HOOKS AT THE TOP — no exceptions
  const query = useQuery(surahDetailQueryOptions(id));
  const { setLastRead } = useLastRead();
  const { play, stop, currentId, isPlaying } = useGlobalAudio();
  
  // ✅ Simple hook untuk scroll animation — no Provider needed
  // Trigger at 80px untuk header title fade-in
  const { scrollAnimatedPosition, scrollHandler } = useScrollAnimation({
    showTriggerPoint: 80,
    hideTriggerPoint: 0,
  });
  
  // ─── Derived values (tidak perlu hooks) ───
  const { data, isLoading, isError, error } = query;
  const fullAudioId = `surah-full-${id}`;
  const fullAudioUri = data?.audioFull?.['01'] ?? data?.audioFull?.['02'] ?? null;
  const isFullActive = currentId === fullAudioId;
  const isFullPlaying = isFullActive && isPlaying;

  // ─── Handlers ───
  const handleFullPlay = async () => {
    if (!fullAudioUri) return;
    await play(fullAudioId, fullAudioUri);
    await setLastRead({
      surahNomor: id,
      surahName: data?.namaLatin ?? nameSurah,
      ayat: null,
    });
  };

  const handleLeave = async () => {
    await stop();
    router.push('/(drawer)/(tabs)/quran');
  };

  if (isLoading) {
    return <LoadingIndicator loadingText="Memuat data surah..." />;
  }

  if (isError || !data) {
    return (
      <>
        <Stack.Screen
          options={SCREEN_OPTIONS({
            title: nameSurah,
            rightAction: handleFullPlay,
            leftAction: handleLeave,
            id: id,
            leftIcon: ChevronLeft,
          })}
        />
        <View style={styles.center}>
          <Text style={{ color: 'red' }}>{String(error?.message ?? 'Tidak bisa load data')}</Text>
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen
        options={SCREEN_OPTIONS({
          title: data.namaLatin ?? nameSurah,
          id: id,
          leftAction: handleLeave,
          leftIcon: ChevronLeft,
          rightAction: handleFullPlay,
          isFullPlaying: isFullPlaying,
          surahSetelahnya: {
            namaLatin: data.suratSelanjutnya.namaLatin,
            id: data.suratSelanjutnya.nomor,
          },
          scrollAnimatedPosition,
          scrollTriggerPoint: 80,
          surahSebelumnya: {
            namaLatin: data.suratSebelumnya.namaLatin,
            id: data.suratSebelumnya.nomor,
          },
        })}
      />
      <LegendList
        data={data.ayat ?? []}
        renderItem={({ item }) => (
          <AyatCard surahNomor={data.nomor} surahNama={data.namaLatin} ayat={item} />
        )}
        keyExtractor={(item) => `ayat-${item.nomorAyat}`}
        numColumns={1}
        onEndReachedThreshold={1.5}
        // ✅ ATTACH SCROLL HANDLER — Reanimated event handler for smooth animation
        // Compatible with LegendList, FlatList, ScrollView, any scrollable component
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        ListHeaderComponent={
          <SurahDetailCard
            kategori={data.tempatTurun}
            namaLatin={data.namaLatin}
            arti={data.arti}
            jumlahAyat={data.jumlahAyat}
          />
        }
        contentContainerStyle={{ paddingTop: 20, gap: 10, paddingBottom: 100 }}
        className="px-5"
        maintainVisibleContentPosition
        recycleItems
        showsVerticalScrollIndicator={false}
      />
    </>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
