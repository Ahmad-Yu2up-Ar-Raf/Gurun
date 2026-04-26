import React from 'react';
import { ActivityIndicator, RefreshControl, View, StyleSheet } from 'react-native';
import { Text } from '../../fragments/shadcn-ui/text';
import { surahListQueryOptions } from '@/lib/server/surah/surah-server-queris';
import { useQuery } from '@tanstack/react-query';

import QuranHeader from '../../fragments/custom-ui/header/quran-header';

import { LegendList } from '@legendapp/list';
import { SurahCard } from '../../fragments/custom-ui/card/surah-card';
import LoadingIndicator from '../loading-indicator';

export default function QuranBlock() {
  const { data, isLoading, isError, refetch, isRefetching } = useQuery(surahListQueryOptions());

  
  if (isLoading) {
    return <LoadingIndicator />;
  }
 
  if (isError) {
    return (
      <View style={styles.center}>
        <Text className="mb-4 text-center text-muted-foreground">Gagal memuat data surah</Text>
        <Text className="font-poppins_semibold text-primary" onPress={() => refetch()}>
          Coba lagi
        </Text>
      </View>
    );
  }

  return (
    <>
      <LegendList
        data={data ?? []}
        renderItem={({ item }) => <SurahCard sura={item} />}
        keyExtractor={(item) => `surah-${item.nomor}`}
        numColumns={1}
        onEndReachedThreshold={1.5}
        ListHeaderComponent={QuranHeader}
        contentContainerStyle={{ paddingTop: 30, paddingBottom: 100 }}
        className="px-5"
        // ✅ Pull to refresh
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
        maintainVisibleContentPosition
        recycleItems
        showsVerticalScrollIndicator={false}
      />
    </>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 120,
  },
  skeletonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
  },
  skeletonTextGroup: {
    flex: 1,
    gap: 4,
  },
  skeletonBox: {
    backgroundColor: 'hsl(30, 50%, 93%)',
    opacity: 0.7,
  },
});
