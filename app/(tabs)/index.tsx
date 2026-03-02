import HomeBlock from '@/components/ui/core/block/home-block';
import { SCREEN_OPTIONS_HOME } from '@/components/ui/core/layout/header/home-header';

import { Link, Stack } from 'expo-router';

import * as React from 'react';
 

export default function Screen() {
  return (
    <>
      <Stack.Screen options={SCREEN_OPTIONS_HOME} />

      <HomeBlock />
    </>
  );
}
