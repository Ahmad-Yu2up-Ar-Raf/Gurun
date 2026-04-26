import React from 'react';

import { Stack } from 'expo-router';
import { SCREEN_OPTIONS } from '@/components/ui/core/layout/nav';

export default function HomeLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" />
      {/* Tambahkan screen lain di sini jika ada nested routes */}
    </Stack>
  );
}
