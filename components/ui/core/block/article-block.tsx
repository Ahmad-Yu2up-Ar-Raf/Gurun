// components/ui/core/block/article-block.tsx

import React, { useState, useCallback } from 'react';
import { RefreshControl, View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { LegendList } from '@legendapp/list';

import { Text } from '../../fragments/shadcn-ui/text';
import { SCREEN_OPTIONS } from '@/components/ui/core/layout/nav';
import { ArticleListQueryOptions } from '@/lib/server/article/article-server-queris';
import { ArticleCard } from '../../fragments/custom-ui/card/article-card';
import LoadingIndicator from '../loading-indicator';
import FiltersCarousel, {
  FilterOption,
} from '@/components/ui/fragments/custom-ui/carousel/filter-carousel';
import { Category } from '@/type/article-type';

// ─── Filter options untuk fitur Article ──────────────────────────────────────
// Definisi di luar komponen → tidak re-create setiap render
const ARTICLE_FILTER_OPTIONS: FilterOption<Category>[] = [
  { label: 'Semua', value: 'all' },
  { label: 'Dunia', value: Category.Dunia },
  { label: 'Filantropi', value: Category.FilantropiKhazanah },
  { label: 'Islam Nusantara', value: Category.IslamNusantara },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function ArticleBlock() {
  // State filter kategori — [] berarti semua kategori tampil
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);

  // Query otomatis re-run saat selectedCategories berubah (queryKey berubah)
  const { data, isLoading, isError, refetch, isRefetching } = useQuery(
    ArticleListQueryOptions({
      categories: selectedCategories,
    })
  );

  // Stable callback agar FiltersCarousel tidak re-render tanpa perlu
  const handleFilterChange = useCallback((selected: Category[]) => {
    setSelectedCategories(selected);
  }, []);

  // ─── States ───────────────────────────────────────────────────────────────

  if (isLoading) {
    return <LoadingIndicator loadingText="Memuat artikel..." />;
  }

  if (isError) {
    return (
      <View style={styles.center}>
        <Text className="mb-4 text-center text-muted-foreground">Gagal memuat data artikel</Text>
        <Text className="font-poppins_semibold text-primary" onPress={() => refetch()}>
          Coba lagi
        </Text>
      </View>
    );
  }

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <>
      <Stack.Screen
        options={SCREEN_OPTIONS({
          title: 'Artikel',
          children: (
            <FiltersCarousel<Category>
              options={ARTICLE_FILTER_OPTIONS}
              selectedValues={selectedCategories}
              onChange={handleFilterChange}
              multiSelect
            />
          ),
        })}
      />

      <LegendList
        data={data ?? []}
        renderItem={({ item }) => <ArticleCard article={item} />}
        keyExtractor={(item) => `article-${item.guid}`} // guid lebih unique dari title
        numColumns={1}
        onEndReachedThreshold={1.5}
        contentContainerStyle={{ paddingTop: 10, paddingBottom: 100 }}
        className="px-5"
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
        maintainVisibleContentPosition
        recycleItems
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text className="text-center font-poppins_medium text-muted-foreground">
              {selectedCategories.length > 0
                ? 'Tidak ada artikel untuk kategori yang dipilih'
                : 'Tidak ada artikel'}
            </Text>
          </View>
        }
      />
    </>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 120,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
});
