import { Onboarding, useOnboarding } from '@/components/ui/fragments/shadcn-ui/onboarding';

import { Redirect } from 'expo-router';

export const OnboardingPresets = {
  welcome: [
    {
      id: 'welcome',
      title: 'Selamat Datang Di Saraya!',
      description: 'Mari kita mulai untuk mempersiapkan konten pilihan sesuai dengan kebutuhan.',
    },
    {
      id: 'personalization',
      title: 'Pelajari Keuanganmu Lebih Dalam',
      description:
        'Kami akan menyesuaikan konten berdasarkan minat dan kebutuhan kamu untuk pengalaman yang lebih relevan.',
      image: 'https://images.pexels.com/photos/9572476/pexels-photo-9572476.jpeg',
    },
    {
      id: 'rewards',
      title: 'Kumpulkan Poin, Dapatkan Hadiah',
      description:
        'Setiap interaksi dengan konten keuangan kami akan memberikan poin yang bisa kamu tukarkan dengan hadiah menarik!',
      image: 'https://images.pexels.com/photos/3759657/pexels-photo-3759657.jpeg',
    },
    {
      id: 'finish',
      title: 'Selamat! Kamu Siap!',
      description: 'Kamu siap untuk memulai perjalanan keuangan yang lebih baik bersama Saraya.',
      image: 'https://images.pexels.com/photos/7163374/pexels-photo-7163374.jpeg',
    },
  ],
};

export default function OnboardingBlock() {
  const { hasCompletedOnboarding, completeOnboarding, skipOnboarding } = useOnboarding();

  if (hasCompletedOnboarding) {
    return <Redirect href={'/(auth)/welcome'} />;
  }

  return (
    <>
      <Onboarding
        steps={OnboardingPresets.welcome}
        onComplete={completeOnboarding}
        onSkip={skipOnboarding}
        showSkip={true}
        showProgress={true}
        swipeEnabled={true}
        primaryButtonText="Get Started"
        skipButtonText="Skip"
        nextButtonText="Next"
        backButtonText="Back"
      />
      {/* <View className="absolute z-10 h-full w-full bg-card" /> */}
    </>
  );
}
