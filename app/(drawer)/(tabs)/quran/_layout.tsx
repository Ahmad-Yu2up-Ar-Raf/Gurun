import React from 'react';

import { router, Stack } from 'expo-router';
import { SCREEN_OPTIONS } from '@/components/ui/core/layout/nav';
import { ChevronLeft, MoreHorizontal } from 'lucide-react-native';

export default function HomeLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={SCREEN_OPTIONS({ title: 'Quran', transparent: false })} />

      {/* Tambahkan screen lain di sini jika ada nested routes */}
    </Stack>
  );
}
