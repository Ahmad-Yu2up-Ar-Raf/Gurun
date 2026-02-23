import { Button } from './button';
import { Text } from './text';
import { cn } from '@/lib/utils';

import React, { useRef, useState } from 'react';
import { Dimensions, ImageBackground, ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { THEME } from '@/lib/theme';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import LogoApp from '../svg/logo-app';
const { width: screenWidth } = Dimensions.get('window');

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  image?: string;
  icon?: React.ReactNode;
  backgroundColor?: string;
}

export interface OnboardingProps {
  steps: OnboardingStep[];
  onComplete: () => void;
  onSkip?: () => void;
  showSkip?: boolean;
  showProgress?: boolean;
  swipeEnabled?: boolean;
  primaryButtonText?: string;
  skipButtonText?: string;
  nextButtonText?: string;
  backButtonText?: string;
  style?: ViewStyle;
  children?: React.ReactNode;
}

// Enhanced Onboarding Step Component for complex layouts
interface OnboardingStepContentProps {
  step: OnboardingStep;
  isActive: boolean;
  children?: React.ReactNode;
}

export function Onboarding({
  steps,
  onComplete,
  onSkip,
  showSkip = true,
  showProgress = true,
  swipeEnabled = true,
  primaryButtonText = 'Get Started',
  skipButtonText = 'Skip',
  nextButtonText = 'Next',
  backButtonText = 'Back',
  style,
  children,
}: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const translateX = useSharedValue(0);
  const backgroundColor = THEME.light.card;
  const primaryColor = THEME.light.primary;
  const mutedColor = THEME.light.mutedForeground;

  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      scrollViewRef.current?.scrollTo({
        x: nextStep * screenWidth,
        animated: true,
      });
    }
  };

  const handleBack = () => {
    if (!isFirstStep) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      scrollViewRef.current?.scrollTo({
        x: prevStep * screenWidth,
        animated: true,
      });
    }
  };

  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    } else {
      onComplete();
    }
  };

  // Modern gesture handling with Gesture API
  const panGesture = Gesture.Pan()
    .enabled(swipeEnabled)
    .onUpdate((event) => {
      translateX.value = event.translationX;
    })
    .onEnd((event) => {
      const { translationX, velocityX } = event;
      const shouldSwipe = Math.abs(translationX) > screenWidth * 0.3 || Math.abs(velocityX) > 500;

      if (shouldSwipe) {
        if (translationX > 0 && !isFirstStep) {
          // Swipe right - go back
          runOnJS(handleBack)();
        } else if (translationX < 0 && !isLastStep) {
          // Swipe left - go next
          runOnJS(handleNext)();
        }
      }

      translateX.value = withSpring(0);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const renderProgressDots = () => {
    if (!showProgress) return null;

    return (
      <>
        <View style={styles.progressContainer} className="relative z-20">
          {steps.map((_, index) => (
            <View
              key={index}
              style={[
                styles.progressDot,
                {
                  backgroundColor: index === currentStep ? primaryColor : '#9c9c9c',
                  opacity: index === currentStep ? 1 : 0.3,
                  width: index === currentStep ? 30 : 8,
                },
              ]}
            />
          ))}
        </View>
      </>
    );
  };

  const renderStep = (step: OnboardingStep, index: number) => {
    const isActive = index === currentStep;

    return (
      <Animated.View
        key={step.id}
        style={[styles.stepContainer, { opacity: isActive ? 1 : 0.8 }]}
        className={'flex h-full flex-col'}>
        <ImageBackground
          source={{
            uri: step.image || 'https://images.pexels.com/photos/3205568/pexels-photo-3205568.jpeg',
          }}
          resizeMode="cover"
          className="flex-1 items-center justify-center px-5"
          style={{
            paddingBottom: insets.bottom > 0 ? insets.bottom + 80 : 12,
          }}>
          <LinearGradient
            colors={[
              'rgba(0,0,0,0.0)', // top fully transparent
              'rgba(0,0,0,0.4)', // middle slightly dark
              'rgba(0,0,0,0.9)', // bottom darker
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

          <View className="mb-0 h-full w-full justify-end gap-2 text-left">
            <Text variant="h1" className="m-0 border-0 pb-2 text-left tracking-tighter text-white">
              {step.title}
            </Text>
            <Text
              variant="p"
              className="m-0 line-clamp-2 text-base leading-6 text-muted-foreground">
              {step.description}
            </Text>
          </View>
        </ImageBackground>
      </Animated.View>
    );
  };
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView
      edges={['bottom', 'left', 'right']}
      className="relative"
      style={[styles.container, style]}>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.container, animatedStyle]}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEnabled={swipeEnabled}
            onMomentumScrollEnd={(event) => {
              const newStep = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
              setCurrentStep(newStep);
            }}>
            {steps.map((step, index) => renderStep(step, index))}
          </ScrollView>
        </Animated.View>
      </GestureDetector>

      {/* Progress Dots */}

      {/* Skip Button */}
      {showSkip && !isLastStep && (
        <View style={styles.skipContainer}>
          <Button
            variant="ghost"
            size={'sm'}
            className="rounded-full px-4 bg-black/50 dark:bg-accent/50 dark:text-white"
            onPress={handleSkip}>
            <Text className="text-sm text-white">{skipButtonText}</Text>
          </Button>
        </View>
      )}
      <View className="absolute left-4 top-[60px] flex-row items-center gap-7">
       
        <Text className="text-center font-cinzel_semibold text-2xl tracking-tighter text-white">
          Saraya
        </Text>
      </View>
      {/* Navigation Buttons */}
      <View
        className="absolute left-0 right-0 px-5 pb-4"
        style={{
          bottom: insets.bottom > 0 ? insets.bottom : 12,
        }}>
        {renderProgressDots()}
        <Button variant="default" size={'lg'} className="w-full" onPress={handleNext}>
          <Text className="text-lg font-bold">
            {isLastStep ? primaryButtonText : nextButtonText}
          </Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  stepContainer: {
    width: screenWidth,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    maxWidth: 800,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

    minHeight: 700,
  },

  customContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 25,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  skipContainer: {
    position: 'absolute',
    top: 60,
    right: 10,
    zIndex: 1,
  },
  buttonContainer: {
    width: '100%',

    flexDirection: 'row',
    paddingHorizontal: 24,

    gap: 12,
  },
  fullWidthButton: {
    flex: 1,
  },
});

// Onboarding Hook for managing state
export function useOnboarding() {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [currentOnboardingStep, setCurrentOnboardingStep] = useState(0);

  const completeOnboarding = async () => {
    try {
      // In a real app, you'd save this to AsyncStorage or similar
      setHasCompletedOnboarding(true);
      console.log('Onboarding completed and saved');
    } catch (error) {
      console.error('Failed to save onboarding completion:', error);
    }
  };

  const resetOnboarding = () => {
    setHasCompletedOnboarding(false);
    setCurrentOnboardingStep(0);
  };

  const skipOnboarding = async () => {
    await completeOnboarding();
  };

  return {
    hasCompletedOnboarding,
    currentOnboardingStep,
    setCurrentOnboardingStep,
    completeOnboarding,
    resetOnboarding,
    skipOnboarding,
  };
}
